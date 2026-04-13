import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/products";
import Common "../types/common";

module {

  // ── Category helpers ──────────────────────────────────────────────────

  public func getCategories(
    categories : List.List<Types.Category>,
  ) : [Types.Category] {
    categories.toArray()
  };

  public func addCategory(
    categories : List.List<Types.Category>,
    nextId : { var value : Nat },
    name : Text,
    slug : Text,
    iconName : Text,
  ) : Types.Category {
    let cat : Types.Category = {
      id = nextId.value;
      name;
      slug;
      iconName;
    };
    nextId.value += 1;
    categories.add(cat);
    cat
  };

  public func updateCategory(
    categories : List.List<Types.Category>,
    id : Common.CategoryId,
    name : Text,
    slug : Text,
    iconName : Text,
  ) : ?Types.Category {
    var updated : ?Types.Category = null;
    categories.mapInPlace(func(cat : Types.Category) : Types.Category {
      if (cat.id == id) {
        let newCat = { cat with name; slug; iconName };
        updated := ?newCat;
        newCat
      } else { cat }
    });
    updated
  };

  // ── Product helpers ───────────────────────────────────────────────────

  public func getProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    id : Common.ProductId,
  ) : ?Types.Product {
    products.get(id)
  };

  // Compute search relevance score for a product given a lowercase query.
  // title prefix match = 10, title contains = 7, description contains = 2.
  // Category-name scoring is deferred to listProducts where categories are available.
  func searchScore(p : Types.Product, lowerQ : Text) : Nat {
    let lowerTitle = p.title.toLower();
    let lowerDesc  = p.description.toLower();
    if (lowerTitle.startsWith(#text lowerQ)) { 10 }
    else if (lowerTitle.contains(#text lowerQ)) { 7 }
    else if (lowerDesc.contains(#text lowerQ)) { 2 }
    else { 0 }
  };

  public func listProducts(
    products : Map.Map<Common.ProductId, Types.Product>,
    categories : List.List<Types.Category>,
    filter : Types.ProductFilter,
  ) : [Types.Product] {
    let allProducts = products.values().toArray();

    // Build a scored/filtered list
    type Scored = { score : Nat; product : Types.Product };

    let scoredFiltered : [Scored] = switch (filter.searchQuery) {
      case null {
        // No search — apply category/price filters, score = 0 (unused)
        allProducts.filterMap<Types.Product, Scored>(func(p) {
          let catMatch = switch (filter.categoryId) {
            case null true;
            case (?cid) p.categoryId == cid;
          };
          let minMatch = switch (filter.minPrice) {
            case null true;
            case (?mn) p.price >= mn;
          };
          let maxMatch = switch (filter.maxPrice) {
            case null true;
            case (?mx) p.price <= mx;
          };
          if (catMatch and minMatch and maxMatch) { ?{ score = 0; product = p } }
          else { null }
        })
      };
      case (?q) {
        let lowerQ = q.toLower();
        allProducts.filterMap<Types.Product, Scored>(func(p) {
          // Category filter
          let catMatch = switch (filter.categoryId) {
            case null true;
            case (?cid) p.categoryId == cid;
          };
          // Price filters
          let minMatch = switch (filter.minPrice) {
            case null true;
            case (?mn) p.price >= mn;
          };
          let maxMatch = switch (filter.maxPrice) {
            case null true;
            case (?mx) p.price <= mx;
          };
          if (not (catMatch and minMatch and maxMatch)) { return null };

          // Compute score with category-name bonus
          var score = searchScore(p, lowerQ);
          // Category name match = 4 points
          if (score == 0) {
            // check if category name matches — find category for this product
            switch (categories.find(func(c : Types.Category) : Bool { c.id == p.categoryId })) {
              case (?cat) {
                if (cat.name.toLower().contains(#text lowerQ)) { score := 4 }
              };
              case null {};
            }
          } else {
            // Title already matched; still check category for additional signal
            switch (categories.find(func(c : Types.Category) : Bool { c.id == p.categoryId })) {
              case (?cat) {
                if (cat.name.toLower().contains(#text lowerQ)) { score += 4 }
              };
              case null {};
            }
          };

          if (score > 0) { ?{ score; product = p } }
          else { null }
        })
      };
    };

    // Sort by score desc (search mode) then by sortBy tiebreaker
    let compareProducts = func(a : Scored, b : Scored) : Order.Order {
      // Score descending (higher score first)
      if (a.score > b.score) { return #less };
      if (a.score < b.score) { return #greater };
      // Tiebreaker: sortBy
      let pa = a.product;
      let pb = b.product;
      switch (filter.sortBy) {
        case "trending" {
          if (pa.isTrending and not pb.isTrending) { #less }
          else if (not pa.isTrending and pb.isTrending) { #greater }
          else if (pa.clickCount > pb.clickCount) { #less }
          else if (pa.clickCount < pb.clickCount) { #greater }
          else { #equal }
        };
        case "price_asc" {
          if (pa.price < pb.price) { #less }
          else if (pa.price > pb.price) { #greater }
          else { #equal }
        };
        case "price_desc" {
          if (pa.price > pb.price) { #less }
          else if (pa.price < pb.price) { #greater }
          else { #equal }
        };
        // "newest" and default
        case _ {
          if (pa.createdAt > pb.createdAt) { #less }
          else if (pa.createdAt < pb.createdAt) { #greater }
          else { #equal }
        };
      }
    };

    scoredFiltered.sort(compareProducts).map<Scored, Types.Product>(func(s) { s.product })
  };

  // Count products in a given category.
  public func getProductCountByCategory(
    products : Map.Map<Common.ProductId, Types.Product>,
    categoryId : Common.CategoryId,
  ) : Nat {
    products.values().filter(func(p : Types.Product) : Bool {
      p.categoryId == categoryId
    }).size()
  };

  // Return top `limit` products by discountPercent descending.
  // For products with platformLinks, use the maximum discountPercent across all links.
  public func getHotDeals(
    products : Map.Map<Common.ProductId, Types.Product>,
    limit : Nat,
  ) : [Types.Product] {
    let effectiveDiscount = func(p : Types.Product) : Nat {
      if (p.platformLinks.size() == 0) { p.discountPercent }
      else {
        p.platformLinks.foldLeft<Types.PlatformLink, Nat>(0, func(acc, link) {
          if (link.discountPercent > acc) { link.discountPercent } else { acc }
        })
      }
    };

    let sorted = products.values().toArray().sort(
      func(a : Types.Product, b : Types.Product) : Order.Order {
        let da = effectiveDiscount(a);
        let db = effectiveDiscount(b);
        if (da > db) { #less }
        else if (da < db) { #greater }
        else { #equal }
      }
    );
    sorted.values().take(limit).toArray()
  };

  public func getRelatedProducts(
    products : Map.Map<Common.ProductId, Types.Product>,
    productId : Common.ProductId,
    limit : Nat,
  ) : [Types.Product] {
    let targetCategoryId = switch (products.get(productId)) {
      case null { return [] };
      case (?p) p.categoryId;
    };

    // Collect all same-category products (excluding target)
    let sameCat = products.values()
      .filter(func(p : Types.Product) : Bool {
        p.id != productId and p.categoryId == targetCategoryId
      })
      .toArray();

    // Sort: products with 2+ platform links come first, then by clickCount desc
    let sorted = sameCat.sort(func(a : Types.Product, b : Types.Product) : Order.Order {
      let aRich = a.platformLinks.size() >= 2;
      let bRich = b.platformLinks.size() >= 2;
      if (aRich and not bRich) { #less }
      else if (not aRich and bRich) { #greater }
      else if (a.clickCount > b.clickCount) { #less }
      else if (a.clickCount < b.clickCount) { #greater }
      else { #equal }
    });

    sorted.values().take(limit).toArray()
  };

  public func addProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    nextId : { var value : Nat },
    input : Types.ProductInput,
  ) : Types.Product {
    if (input.affiliateLink == "") {
      Runtime.trap("affiliateLink cannot be empty")
    };
    let now = Time.now();
    let product : Types.Product = {
      id = nextId.value;
      title = input.title;
      description = input.description;
      imageUrl = input.imageUrl;
      price = input.price;
      originalPrice = input.originalPrice;
      discountPercent = input.discountPercent;
      affiliateLink = input.affiliateLink;
      affiliateSource = input.affiliateSource;
      categoryId = input.categoryId;
      tags = input.tags;
      isTrending = input.isTrending;
      clickCount = 0;
      createdAt = now;
      updatedAt = now;
      platformLinks = input.platformLinks;
    };
    nextId.value += 1;
    products.add(product.id, product);
    product
  };

  public func updateProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    id : Common.ProductId,
    input : Types.ProductInput,
  ) : ?Types.Product {
    if (input.affiliateLink == "") {
      Runtime.trap("affiliateLink cannot be empty")
    };
    switch (products.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Product = {
          existing with
          title = input.title;
          description = input.description;
          imageUrl = input.imageUrl;
          price = input.price;
          originalPrice = input.originalPrice;
          discountPercent = input.discountPercent;
          affiliateLink = input.affiliateLink;
          affiliateSource = input.affiliateSource;
          categoryId = input.categoryId;
          tags = input.tags;
          isTrending = input.isTrending;
          platformLinks = input.platformLinks;
          updatedAt = Time.now();
        };
        products.add(id, updated);
        ?updated
      };
    }
  };

  public func deleteProduct(
    products : Map.Map<Common.ProductId, Types.Product>,
    id : Common.ProductId,
  ) : Bool {
    switch (products.get(id)) {
      case null false;
      case (?_) {
        products.remove(id);
        true
      };
    }
  };

  public func recordClick(
    products : Map.Map<Common.ProductId, Types.Product>,
    id : Common.ProductId,
  ) : Bool {
    switch (products.get(id)) {
      case null false;
      case (?p) {
        let updated = { p with clickCount = p.clickCount + 1 };
        products.add(id, updated);
        true
      };
    }
  };

  // ── Platform link helpers ─────────────────────────────────────────────

  public func getPlatformLinks(
    products : Map.Map<Common.ProductId, Types.Product>,
    productId : Common.ProductId,
  ) : [Types.PlatformLink] {
    switch (products.get(productId)) {
      case null [];
      case (?p) p.platformLinks;
    }
  };

  public func recordPlatformClick(
    products : Map.Map<Common.ProductId, Types.Product>,
    productId : Common.ProductId,
    platform : Text,
  ) : Bool {
    switch (products.get(productId)) {
      case null false;
      case (?p) {
        let updatedLinks = p.platformLinks.map(
          func(link) {
            if (link.platform == platform) {
              { link with clickCount = link.clickCount + 1 }
            } else { link }
          }
        );
        let updated = { p with platformLinks = updatedLinks };
        products.add(productId, updated);
        true
      };
    }
  };

  // ── Seed helpers ──────────────────────────────────────────────────────

  public func seedData(
    products : Map.Map<Common.ProductId, Types.Product>,
    categories : List.List<Types.Category>,
    nextProductId : { var value : Nat },
    nextCategoryId : { var value : Nat },
  ) {
    // Only seed if empty
    if (not categories.isEmpty()) { return };

    // Add 5 categories: All=1, Gadgets=2, Fashion=3, Accessories=4, Trending=5
    ignore addCategory(categories, nextCategoryId, "All", "all", "grid");
    ignore addCategory(categories, nextCategoryId, "Gadgets", "gadgets", "cpu");
    ignore addCategory(categories, nextCategoryId, "Fashion", "fashion", "shirt");
    ignore addCategory(categories, nextCategoryId, "Accessories", "accessories", "watch");
    ignore addCategory(categories, nextCategoryId, "Trending", "trending", "trending-up");

    let now = Time.now();
    let baseTime = now - 10_000_000_000_000;

    type SeedRow = (Text, Text, Text, Float, Float, Nat, Text, Text, Nat, [Text], Bool);

    let sampleProducts : [SeedRow] = [
      (
        "boAt Airdopes 141 Bluetooth Earbuds",
        "True wireless earbuds with 42H total playback, ENx tech for clear calls, and IPX4 water resistance.",
        "https://picsum.photos/seed/earbuds/400/400",
        1299.0, 2990.0, 57,
        "https://www.amazon.in/dp/B09N3FMHVG?tag=youraffid-21",
        "amazon", 2, ["earbuds", "wireless", "audio"], true
      ),
      (
        "Mi Smart Band 7 Fitness Tracker",
        "1.62\" AMOLED display, 110+ workout modes, SpO2 and heart rate monitoring, 14-day battery life.",
        "https://picsum.photos/seed/smartband/400/400",
        3499.0, 4999.0, 30,
        "https://www.flipkart.com/mi-smart-band-7/p/itm?affid=youraffid",
        "flipkart", 4, ["fitness", "smartband", "health"], true
      ),
      (
        "Fastrack Trendies Analog Watch",
        "Trendy analog watch for men with stainless steel case, mineral glass dial, and leather strap.",
        "https://picsum.photos/seed/watch/400/400",
        1495.0, 2495.0, 40,
        "https://www.amazon.in/dp/B07TZQF6BC?tag=youraffid-21",
        "amazon", 4, ["watch", "fashion", "men"], false
      ),
      (
        "Noise ColorFit Pro 4 Smartwatch",
        "1.72\" display, Bluetooth calling, SpO2, 100+ sport modes, stress monitor.",
        "https://picsum.photos/seed/smartwatch/400/400",
        3999.0, 7999.0, 50,
        "https://www.flipkart.com/noise-colorfit-pro-4/p/itm?affid=youraffid",
        "flipkart", 2, ["smartwatch", "gadgets", "fitness"], true
      ),
      (
        "Allen Solly Men's Regular Fit Shirt",
        "Premium cotton blend formal shirt, regular fit, available in multiple colors.",
        "https://picsum.photos/seed/shirt/400/400",
        899.0, 1799.0, 50,
        "https://www.amazon.in/dp/B08XYZ1234?tag=youraffid-21",
        "amazon", 3, ["shirt", "formal", "men"], false
      ),
      (
        "Anker PowerCore 10000 Power Bank",
        "10000mAh slim power bank, dual USB-A output, MultiProtect safety features.",
        "https://picsum.photos/seed/powerbank/400/400",
        1799.0, 2499.0, 28,
        "https://www.amazon.in/dp/B07JXZTXGG?tag=youraffid-21",
        "amazon", 2, ["powerbank", "charging", "travel"], true
      ),
      (
        "Wildcraft Nylon Laptop Backpack",
        "30L waterproof backpack with dedicated laptop compartment and ergonomic padded straps.",
        "https://picsum.photos/seed/backpack/400/400",
        999.0, 1999.0, 50,
        "https://www.flipkart.com/wildcraft-backpack/p/itm?affid=youraffid",
        "flipkart", 3, ["backpack", "travel", "college"], false
      ),
      (
        "Redmi Buds 4 Active TWS Earphones",
        "Lightweight TWS earphones with 12.4mm drivers, 28H playtime, and low-latency gaming mode.",
        "https://picsum.photos/seed/redmibuds/400/400",
        1299.0, 1999.0, 35,
        "https://www.amazon.in/dp/B0C1XYJKL?tag=youraffid-21",
        "amazon", 5, ["earphones", "tws", "gaming"], true
      ),
      (
        "ZEBRONICS Zeb-Thunder Wireless Headphone",
        "Over-ear wireless headphone with 40mm drivers, FM/SD support, and 9-hour playtime.",
        "https://picsum.photos/seed/headphone/400/400",
        899.0, 2499.0, 64,
        "https://www.flipkart.com/zebronics-thunder/p/itm?affid=youraffid",
        "flipkart", 5, ["headphone", "wireless", "music"], true
      ),
      (
        "ONLY Women's Solid Hoodie",
        "Trendy women's hoodie in premium fleece fabric, regular fit with kangaroo pocket.",
        "https://picsum.photos/seed/hoodie/400/400",
        799.0, 1999.0, 60,
        "https://www.amazon.in/dp/B09PQ1234?tag=youraffid-21",
        "amazon", 3, ["hoodie", "women", "winter"], true
      ),
    ];

    var idx = 0;
    for ((title, desc, imageUrl, price, origPrice, discount, link, source, catId, tags, trending) in sampleProducts.values()) {
      // Build platform links for the first 5 products (mix of Amazon + Flipkart options)
      let platformLinks : [Types.PlatformLink] = switch (idx) {
        case 0 {
          // boAt Airdopes 141 — Amazon + Flipkart
          [
            { platform = "amazon";   price = 1299.0; originalPrice = 2990.0; discountPercent = 57; affiliateLink = "https://www.amazon.in/dp/B09N3FMHVG?tag=youraffid-21"; clickCount = 0 },
            { platform = "flipkart"; price = 1349.0; originalPrice = 2990.0; discountPercent = 55; affiliateLink = "https://www.flipkart.com/boat-airdopes-141/p/itm?affid=youraffid"; clickCount = 0 },
          ]
        };
        case 1 {
          // Mi Smart Band 7 — Flipkart + Amazon + Meesho
          [
            { platform = "flipkart"; price = 3499.0; originalPrice = 4999.0; discountPercent = 30; affiliateLink = "https://www.flipkart.com/mi-smart-band-7/p/itm?affid=youraffid"; clickCount = 0 },
            { platform = "amazon";   price = 3599.0; originalPrice = 4999.0; discountPercent = 28; affiliateLink = "https://www.amazon.in/dp/B0BNQZ7TMG?tag=youraffid-21"; clickCount = 0 },
            { platform = "meesho";   price = 3299.0; originalPrice = 4999.0; discountPercent = 34; affiliateLink = "https://www.meesho.com/mi-smart-band-7/p/12345"; clickCount = 0 },
          ]
        };
        case 3 {
          // Noise ColorFit Pro 4 — Flipkart + Amazon
          [
            { platform = "flipkart"; price = 3999.0; originalPrice = 7999.0; discountPercent = 50; affiliateLink = "https://www.flipkart.com/noise-colorfit-pro-4/p/itm?affid=youraffid"; clickCount = 0 },
            { platform = "amazon";   price = 4199.0; originalPrice = 7999.0; discountPercent = 47; affiliateLink = "https://www.amazon.in/dp/B0BM4XYZ99?tag=youraffid-21"; clickCount = 0 },
          ]
        };
        case 5 {
          // Anker PowerCore 10000 — Amazon + Flipkart + JioMart
          [
            { platform = "amazon";   price = 1799.0; originalPrice = 2499.0; discountPercent = 28; affiliateLink = "https://www.amazon.in/dp/B07JXZTXGG?tag=youraffid-21"; clickCount = 0 },
            { platform = "flipkart"; price = 1849.0; originalPrice = 2499.0; discountPercent = 26; affiliateLink = "https://www.flipkart.com/anker-powercore-10000/p/itm?affid=youraffid"; clickCount = 0 },
            { platform = "jiomart";  price = 1749.0; originalPrice = 2499.0; discountPercent = 30; affiliateLink = "https://www.jiomart.com/p/anker-powercore-10000/12345"; clickCount = 0 },
          ]
        };
        case 7 {
          // Redmi Buds 4 Active — Amazon + Flipkart + Prepkart
          [
            { platform = "amazon";   price = 1299.0; originalPrice = 1999.0; discountPercent = 35; affiliateLink = "https://www.amazon.in/dp/B0C1XYJKL?tag=youraffid-21"; clickCount = 0 },
            { platform = "flipkart"; price = 1349.0; originalPrice = 1999.0; discountPercent = 32; affiliateLink = "https://www.flipkart.com/redmi-buds-4-active/p/itm?affid=youraffid"; clickCount = 0 },
            { platform = "prepkart"; price = 1279.0; originalPrice = 1999.0; discountPercent = 36; affiliateLink = "https://www.prepkart.com/redmi-buds-4-active"; clickCount = 0 },
          ]
        };
        case 9 {
          // ONLY Women's Solid Hoodie — Amazon + Myntra + Meesho
          [
            { platform = "amazon"; price = 799.0; originalPrice = 1999.0; discountPercent = 60; affiliateLink = "https://www.amazon.in/dp/B09PQ1234?tag=youraffid-21"; clickCount = 0 },
            { platform = "myntra"; price = 849.0; originalPrice = 1999.0; discountPercent = 57; affiliateLink = "https://www.myntra.com/only-hoodie/12345"; clickCount = 0 },
            { platform = "meesho"; price = 749.0; originalPrice = 1999.0; discountPercent = 62; affiliateLink = "https://www.meesho.com/only-hoodie/p/12345"; clickCount = 0 },
          ]
        };
        case _ { [] };
      };

      let product : Types.Product = {
        id = nextProductId.value;
        title;
        description = desc;
        imageUrl;
        price;
        originalPrice = origPrice;
        discountPercent = discount;
        affiliateLink = link;
        affiliateSource = source;
        categoryId = catId;
        tags;
        isTrending = trending;
        clickCount = idx * 12;
        createdAt = baseTime + idx * 1_000_000_000_000;
        updatedAt = baseTime + idx * 1_000_000_000_000;
        platformLinks;
      };
      nextProductId.value += 1;
      products.add(product.id, product);
      idx += 1;
    };
  };
};
