import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Types "../types/products";
import Common "../types/common";
import ProductsLib "../lib/products";

mixin (
  products : Map.Map<Common.ProductId, Types.Product>,
  categories : List.List<Types.Category>,
  nextProductId : { var value : Nat },
  nextCategoryId : { var value : Nat },
  adminPrincipal : { var value : Principal },
) {

  // ── Public read operations ──────────────────────────────────────────

  public query func getProducts(filter : Types.ProductFilter) : async [Types.Product] {
    ProductsLib.listProducts(products, categories, filter)
  };

  public query func getProduct(id : Common.ProductId) : async ?Types.Product {
    ProductsLib.getProduct(products, id)
  };

  public query func getRelatedProducts(productId : Common.ProductId, limit : Nat) : async [Types.Product] {
    ProductsLib.getRelatedProducts(products, productId, limit)
  };

  public query func getCategories() : async [Types.Category] {
    ProductsLib.getCategories(categories)
  };

  // Returns all PlatformLinks for a given product. Empty array if product has none.
  public query func getPlatformLinks(productId : Common.ProductId) : async [Types.PlatformLink] {
    ProductsLib.getPlatformLinks(products, productId)
  };

  // ── Public write operations ─────────────────────────────────────────

  public shared func recordClick(productId : Common.ProductId) : async () {
    ignore ProductsLib.recordClick(products, productId)
  };

  // Increments clickCount on the matching PlatformLink entry for the given platform.
  public shared func recordPlatformClick(productId : Common.ProductId, platform : Text) : async () {
    ignore ProductsLib.recordPlatformClick(products, productId, platform)
  };

  // ── Admin login with email + password ──────────────────────────────────

  // Returns true only for the hardcoded admin credentials.
  // Frontend manages the session client-side after this check passes.
  public func adminLogin(email : Text, password : Text) : async Bool {
    email == "ditshukumar@gmail.com" and password == "ditshu 776@"
  };

  // ── Admin operations ────────────────────────────────────────────────

  // Internal helper — true if caller is admin (stored principal or controller).
  // Uses update semantics to guarantee fresh state is read.
  func checkIsAdmin(caller : Principal) : Bool {
    // Controllers always have admin access regardless of stored principal
    if (caller.isController()) return true;
    // Anonymous callers are never admin
    if (caller.isAnonymous()) return false;
    // Check stored principal — must be set and must match
    let storedAdmin = adminPrincipal.value;
    not storedAdmin.isAnonymous() and caller == storedAdmin
  };

  // Returns true if caller is the stored admin principal OR a canister controller.
  // Declared as an update (not query) to guarantee it reads the latest committed state.
  public shared ({ caller }) func isAdmin() : async Bool {
    checkIsAdmin(caller)
  };

  // First caller claims the admin role (first-come-first-serve).
  // Returns true if caller is now admin (either just claimed or was already admin).
  // Anonymous callers are rejected.
  public shared ({ caller }) func claimAdmin() : async Bool {
    if (caller.isAnonymous()) {
      return false
    };
    // Controllers are always admin — no need to claim
    if (caller.isController()) {
      return true
    };
    let storedAdmin = adminPrincipal.value;
    if (storedAdmin.isAnonymous()) {
      // No admin claimed yet — this caller becomes the permanent admin
      adminPrincipal.value := caller;
      return true
    };
    // Admin already claimed — idempotent for the same principal, false for others
    caller == storedAdmin
  };

  public shared ({ caller }) func addProduct(input : Types.ProductInput) : async Types.Product {
    if (not checkIsAdmin(caller)) {
      Runtime.trap("Unauthorized: admin only")
    };
    ProductsLib.addProduct(products, nextProductId, input)
  };

  public shared ({ caller }) func updateProduct(id : Common.ProductId, input : Types.ProductInput) : async ?Types.Product {
    if (not checkIsAdmin(caller)) {
      Runtime.trap("Unauthorized: admin only")
    };
    ProductsLib.updateProduct(products, id, input)
  };

  public shared ({ caller }) func deleteProduct(id : Common.ProductId) : async Bool {
    if (not checkIsAdmin(caller)) {
      Runtime.trap("Unauthorized: admin only")
    };
    ProductsLib.deleteProduct(products, id)
  };

  public shared ({ caller }) func addCategory(name : Text, slug : Text, iconName : Text) : async Types.Category {
    if (not checkIsAdmin(caller)) {
      Runtime.trap("Unauthorized: admin only")
    };
    ProductsLib.addCategory(categories, nextCategoryId, name, slug, iconName)
  };

  public shared ({ caller }) func updateCategory(id : Common.CategoryId, name : Text, slug : Text, iconName : Text) : async ?Types.Category {
    if (not checkIsAdmin(caller)) {
      Runtime.trap("Unauthorized: admin only")
    };
    ProductsLib.updateCategory(categories, id, name, slug, iconName)
  };

  // ── Discovery helpers ───────────────────────────────────────────────

  // Returns the number of products in the given category.
  public query func getProductCountByCategory(categoryId : Common.CategoryId) : async Nat {
    ProductsLib.getProductCountByCategory(products, categoryId)
  };

  // Returns up to `limit` products ordered by highest discountPercent (or max platform discount) descending.
  public query func getHotDeals(limit : Nat) : async [Types.Product] {
    ProductsLib.getHotDeals(products, limit)
  };

  // ── Product metadata fetch via HTTP outcall ─────────────────────────

  // Detects the e-commerce platform from a URL string.
  // Scans the FULL URL string (including query parameters) for platform substrings.
  // Checks multiple affiliate/short-link patterns in addition to direct domains.
  func detectPlatform(url : Text) : Text {
    let lower = url.toLower();
    // Flipkart — check before Amazon to avoid false positives with fkrt.it/dl.flipkart.com
    // fktr.in is Flipkart's affiliate short link domain; dl.flipkart.com is the tracker hop.
    // Also handles affiliate params like ?url=https://www.flipkart.com/...
    if (
      lower.contains(#text "flipkart.com") or
      lower.contains(#text "fkrt.it") or
      lower.contains(#text "fktr.in") or
      lower.contains(#text "dl.flipkart") or
      lower.contains(#text "affiliate.flipkart") or
      lower.contains(#text "clnk.in")
    ) { return "flipkart" };
    // Amazon — amzn.to/amzn.in are short links; also catch tag= affiliate params
    if (
      lower.contains(#text "amazon.in") or
      lower.contains(#text "amazon.com") or
      lower.contains(#text "amzn.to") or
      lower.contains(#text "amzn.in")
    ) { return "amazon" };
    // Myntra
    if (lower.contains(#text "myntra.com")) { return "myntra" };
    // Meesho
    if (lower.contains(#text "meesho.com")) { return "meesho" };
    // JioMart
    if (lower.contains(#text "jiomart.com")) { return "jiomart" };
    // Instamart / Swiggy
    if (lower.contains(#text "instamart") or lower.contains(#text "swiggy")) {
      return "instamart"
    };
    // Prepkart
    if (lower.contains(#text "prepkart.com")) { return "prepkart" };
    ""
  };

  // Extracts the origin (scheme://host) from a URL.
  // Handles URLs like https://www.amazon.in/s?k=phone → https://www.amazon.in
  func extractOrigin(url : Text) : Text {
    let withoutScheme : Text = if (url.startsWith(#text "https://")) {
      url.trimStart(#text "https://")
    } else if (url.startsWith(#text "http://")) {
      url.trimStart(#text "http://")
    } else {
      url
    };

    let scheme = "https://";

    let host = switch (withoutScheme.split(#text "/").next()) {
      case null withoutScheme;
      case (?h) h;
    };

    scheme # host
  };

  // Resolves a potentially-relative redirect location against the current URL.
  // Absolute URLs (http/https) are returned normalized; relative paths are
  // prefixed with the current page's origin.
  func resolveUrl(location : Text, currentUrl : Text) : Text {
    let trimmed = location.trim(#char ' ');
    if (trimmed.startsWith(#text "https://") or trimmed.startsWith(#text "http://")) {
      // Absolute — just normalize scheme
      if (trimmed.startsWith(#text "http://")) {
        "https://" # trimmed.trimStart(#text "http://")
      } else {
        trimmed
      }
    } else if (trimmed.startsWith(#text "/")) {
      // Root-relative — prepend origin
      extractOrigin(currentUrl) # trimmed
    } else if (trimmed == "") {
      currentUrl
    } else {
      // Treat anything else as absolute (handles protocol-relative "//" or unusual forms)
      "https://" # trimmed.trimStart(#text "//")
    }
  };

  // Extracts the content attribute of a meta tag matching property or name.
  func extractMeta(html : Text, propName : Text) : Text {
    let propKey = "property=\"" # propName # "\"";
    let nameKey = "name=\"" # propName # "\"";
    let contentKey = "content=\"";

    func findAfterKey(src : Text, key : Text) : Text {
      let iter = src.split(#text key);
      ignore iter.next(); // discard text before key
      switch (iter.next()) {
        case null "";
        case (?after) {
          // Take at most the next 300 chars (one tag) to find content=
          let window = if (after.size() > 300) {
            after.split(#text ">").next()
          } else {
            ?after
          };
          switch (window) {
            case null "";
            case (?w) {
              let ci = w.split(#text contentKey);
              ignore ci.next();
              switch (ci.next()) {
                case null "";
                case (?afterContent) {
                  switch (afterContent.split(#text "\"").next()) {
                    case null "";
                    case (?val) val;
                  }
                };
              }
            };
          }
        };
      }
    };

    let v1 = findAfterKey(html, propKey);
    if (v1 != "") { return v1 };
    findAfterKey(html, nameKey)
  };

  // Extracts the text content of the <title> tag, stripping common site name suffixes.
  func extractTitle(html : Text) : Text {
    let ps = html.split(#text "<title");
    ignore ps.next();
    switch (ps.next()) {
      case null "";
      case (?after) {
        let ps2 = after.split(#text ">");
        ignore ps2.next();
        switch (ps2.next()) {
          case null "";
          case (?content) {
            let raw = switch (content.split(#text "<").next()) {
              case null "";
              case (?t) t;
            };
            // Strip common site-name suffixes: " | Foo", " - Foo", " : Foo"
            let stripped1 = switch (raw.split(#text " | ").next()) {
              case null raw;
              case (?t) t;
            };
            let stripped2 = switch (stripped1.split(#text " - ").next()) {
              case null stripped1;
              case (?t) t;
            };
            switch (stripped2.split(#text " : ").next()) {
              case null stripped2;
              case (?t) t;
            }
          };
        }
      };
    }
  };

  // Cleans whitespace: trims edges and collapses newlines/tabs to a single space.
  func cleanText(raw : Text) : Text {
    let step1 = raw.replace(#text "\n", " ").replace(#text "\r", " ").replace(#text "\t", " ");
    step1.trim(#char ' ')
  };

  // Helper used by multiple extraction functions: splits on key and returns the
  // text before the first occurrence of delim in the segment after the key.
  func extractAfterKey(src : Text, key : Text, delim : Text) : ?Text {
    let iter = src.split(#text key);
    ignore iter.next();
    switch (iter.next()) {
      case null null;
      case (?after) after.split(#text delim).next();
    }
  };

  // Parses a price string (with ₹, commas, "Rs.") to Float. Returns null if unparseable.
  func parseAmount(raw : Text) : ?Float {
    let clean = raw
      .replace(#text ",", "")
      .replace(#text "₹", "")
      .replace(#text "Rs.", "")
      .replace(#text "Rs", "")
      .replace(#text " ", "")
      .replace(#text "\n", "")
      .replace(#text "\r", "")
      .replace(#text "\t", "")
      .trim(#char ' ');
    // Remove trailing non-numeric characters (e.g. leftover quotes or slashes)
    let trimmed = switch (clean.split(#text "/").next()) {
      case null clean;
      case (?t) t;
    };
    switch (Nat.fromText(trimmed)) {
      case (?n) ?(n.toFloat());
      case null {
        // Try decimal — take integer part before '.'
        switch (trimmed.split(#text ".").next()) {
          case null null;
          case (?intPart) {
            switch (Nat.fromText(intPart)) {
              case null null;
              case (?n) ?(n.toFloat());
            }
          };
        }
      };
    }
  };

  // Tries to extract a price from HTML using multiple strategies in priority order.
  // Returns 0.0 if nothing found.
  func extractPrice(html : Text) : Float {

    // Strategy 1: og:price:amount meta tag
    let ogPrice = extractMeta(html, "og:price:amount");
    if (ogPrice != "") {
      switch (parseAmount(ogPrice)) {
        case (?f) if (f > 0.0) { return f };
        case null {};
      }
    };

    // Strategy 2: itemprop="price" content="..."
    switch (extractAfterKey(html, "itemprop=\"price\" content=\"", "\"")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 3: itemprop="price" (alternate order: content before itemprop)
    switch (extractAfterKey(html, "content=\"", "\"")) {
      case (?raw) {
        // Only use if it looks numeric (no letters except . and ,)
        let clean = raw.replace(#text ",", "").replace(#text ".", "").trim(#char ' ');
        switch (Nat.fromText(clean)) {
          case (?_) {
            switch (parseAmount(raw)) {
              case (?f) if (f > 100.0) { return f }; // price likely > 100 INR
              case _ {};
            }
          };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 4: JSON-LD "price":"..." (quoted string value)
    switch (extractAfterKey(html, "\"price\":\"", "\"")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 5: JSON-LD "price": number (unquoted)
    switch (extractAfterKey(html, "\"price\":", ",")) {
      case (?raw) {
        let trimmed = raw.replace(#text " ", "").replace(#text "\n", "").replace(#text "\"", "");
        switch (parseAmount(trimmed)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 6: JSON-LD "lowPrice"
    switch (extractAfterKey(html, "\"lowPrice\":\"", "\"")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 6b: Flipkart "finalPrice" embedded JSON (e.g. "finalPrice":1299)
    switch (extractAfterKey(html, "\"finalPrice\":", ",")) {
      case (?raw) {
        let trimmed = raw.replace(#text " ", "").replace(#text "\n", "").replace(#text "\"", "");
        switch (parseAmount(trimmed)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 6c: Flipkart "finalPrice":"..." (quoted)
    switch (extractAfterKey(html, "\"finalPrice\":\"", "\"")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 6d: data-price attribute
    switch (extractAfterKey(html, "data-price=\"", "\"")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 6e: og:price meta tag (alternate format)
    let ogPriceAlt = extractMeta(html, "product:price:amount");
    if (ogPriceAlt != "") {
      switch (parseAmount(ogPriceAlt)) {
        case (?f) if (f > 0.0) { return f };
        case null {};
      }
    };

    // Strategy 7: Amazon a-price-whole class
    switch (extractAfterKey(html, "a-price-whole\">", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 8: Amazon a-offscreen (screen-reader price text e.g. "₹1,299.00")
    switch (extractAfterKey(html, "class=\"a-offscreen\">", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 9: Amazon priceblock_ourprice
    switch (extractAfterKey(html, "id=\"priceblock_ourprice\">", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 10: Amazon priceblock_dealprice
    switch (extractAfterKey(html, "id=\"priceblock_dealprice\">", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 11: Flipkart Nx9bqj class (with ₹ inline)
    switch (extractAfterKey(html, "class=\"Nx9bqj\">₹", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 12: Flipkart Nx9bqj class (₹ may appear after ">")
    switch (extractAfterKey(html, "class=\"Nx9bqj\">", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 13: Flipkart _30jeq3 class
    switch (extractAfterKey(html, "class=\"_30jeq3\">₹", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 14: Myntra pdp-price
    switch (extractAfterKey(html, "class=\"pdp-price\">", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 15: Meesho — any span near "Rs." pattern
    switch (extractAfterKey(html, "Rs.", "<")) {
      case (?raw) {
        switch (parseAmount("Rs." # raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 16: Any ₹ symbol followed by digits in the body
    switch (extractAfterKey(html, "₹", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    0.0
  };

  // Extracts the original/MRP price from HTML (before discount).
  // Returns 0.0 if nothing found.
  func extractOriginalPrice(html : Text) : Float {

    // Strategy 1: og:price:regular_price meta
    let ogRegular = extractMeta(html, "og:price:regular_price");
    if (ogRegular != "") {
      switch (parseAmount(ogRegular)) {
        case (?f) if (f > 0.0) { return f };
        case null {};
      }
    };

    // Strategy 2: JSON-LD "highPrice"
    switch (extractAfterKey(html, "\"highPrice\":\"", "\"")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 3: MRP pattern — "MRP ₹X"
    switch (extractAfterKey(html, "MRP ₹", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 4: MRP: ₹X pattern
    switch (extractAfterKey(html, "MRP: ₹", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 5: <s> strikethrough with ₹ (crossed-out MRP on many Indian sites)
    switch (extractAfterKey(html, "<s>₹", "</s>")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 6: <del> strikethrough with ₹
    switch (extractAfterKey(html, "<del>₹", "</del>")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 7: Amazon a-text-price (struck-through MRP on Amazon)
    switch (extractAfterKey(html, "class=\"a-text-price\"", "₹")) {
      case (?after) {
        switch (extractAfterKey(after, "₹", "<")) {
          case (?raw) {
            switch (parseAmount(raw)) {
              case (?f) if (f > 0.0) { return f };
              case null {};
            }
          };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 8: Flipkart _3I9_wc / UkUFwK (MRP classes)
    switch (extractAfterKey(html, "class=\"_3I9_wc\">₹", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    switch (extractAfterKey(html, "class=\"UkUFwK\">₹", "<")) {
      case (?raw) {
        switch (parseAmount(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    0.0
  };

  // Extracts discount percentage from HTML.
  // Returns 0.0 if nothing found.
  func extractDiscount(html : Text) : Float {
    func parseNat(raw : Text) : ?Float {
      let clean = raw.replace(#text "%", "").replace(#text " ", "").replace(#text "\n", "").trim(#char ' ');
      switch (Nat.fromText(clean)) {
        case (?n) ?(n.toFloat());
        case null null;
      }
    };

    // Strategy 1: "X% off" text pattern (most universal)
    // Look for "% off" and walk back to find the number
    switch (extractAfterKey(html, "% off", " ")) {
      // This gives text AFTER "% off", not useful — try the reverse pattern instead
      case _ {};
    };

    // Pattern: number immediately before "% off"
    // We split on "% off" and look at the tail of the preceding segment
    let discIter = html.split(#text "% off");
    switch (discIter.next()) {
      case null {};
      case (?before) {
        // Walk backward through `before` to find trailing digits
        // Strategy: take chars from the end that are digits or comma
        let chars = before.toArray();
        var i = chars.size();
        // Skip trailing spaces
        while (i > 0 and chars[i - 1] == ' ') { i -= 1 };
        let endIdx = i;
        // Collect digit characters going backward
        while (i > 0 and (
          (chars[i - 1] >= '0' and chars[i - 1] <= '9')
        )) { i -= 1 };
        if (i < endIdx) {
          // Build the digit string from i..endIdx
          var numText = "";
          var j = i;
          while (j < endIdx) {
            numText := numText # Text.fromChar(chars[j]);
            j += 1;
          };
          switch (parseNat(numText)) {
            case (?f) if (f > 0.0 and f <= 99.0) { return f };
            case _ {};
          }
        }
      };
    };

    // Strategy 2: "X% discount" pattern (same approach)
    let discIter2 = html.split(#text "% discount");
    switch (discIter2.next()) {
      case null {};
      case (?before) {
        let chars = before.toArray();
        var i = chars.size();
        while (i > 0 and chars[i - 1] == ' ') { i -= 1 };
        let endIdx = i;
        while (i > 0 and (chars[i - 1] >= '0' and chars[i - 1] <= '9')) { i -= 1 };
        if (i < endIdx) {
          var numText = "";
          var j = i;
          while (j < endIdx) {
            numText := numText # Text.fromChar(chars[j]);
            j += 1;
          };
          switch (parseNat(numText)) {
            case (?f) if (f > 0.0 and f <= 99.0) { return f };
            case _ {};
          }
        }
      };
    };

    // Strategy 3: Amazon savingsPercentage class
    switch (extractAfterKey(html, "class=\"savingsPercentage\">-", "%")) {
      case (?raw) {
        switch (parseNat(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 4: Flipkart VGWI6T class
    switch (extractAfterKey(html, "class=\"VGWI6T\">", "%")) {
      case (?raw) {
        switch (parseNat(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    // Strategy 5: Flipkart _3Ay6Sb class
    switch (extractAfterKey(html, "class=\"_3Ay6Sb\">", "%")) {
      case (?raw) {
        switch (parseNat(raw)) {
          case (?f) if (f > 0.0) { return f };
          case null {};
        }
      };
      case null {};
    };

    0.0
  };

  // Extracts an image URL from HTML. Tries platform-specific patterns then og/twitter.
  func extractImage(html : Text, ogImage : Text) : Text {

    // Amazon: id="landingImage" with data-old-hires (high-res) or src
    switch (extractAfterKey(html, "id=\"landingImage\"", ">")) {
      case (?tagAttrs) {
        switch (extractAfterKey(tagAttrs, "data-old-hires=\"", "\"")) {
          case (?imgUrl) if (imgUrl != "") { return imgUrl };
          case _ {};
        };
        switch (extractAfterKey(tagAttrs, "src=\"", "\"")) {
          case (?imgUrl) if (imgUrl != "") { return imgUrl };
          case _ {};
        };
      };
      case null {};
    };

    // Amazon: class="a-dynamic-image" with src
    switch (extractAfterKey(html, "class=\"a-dynamic-image\"", "src=\"")) {
      case (?after) {
        switch (after.split(#text "\"").next()) {
          case (?imgUrl) if (imgUrl != "") { return imgUrl };
          case _ {};
        }
      };
      case null {};
    };

    // Flipkart q6DClP class image
    switch (extractAfterKey(html, "class=\"q6DClP\"", "src=\"")) {
      case (?after) {
        switch (after.split(#text "\"").next()) {
          case (?imgUrl) if (imgUrl != "") { return imgUrl };
          case _ {};
        }
      };
      case null {};
    };

    // Flipkart _396cs4 class image
    switch (extractAfterKey(html, "class=\"_396cs4\"", "src=\"")) {
      case (?after) {
        switch (after.split(#text "\"").next()) {
          case (?imgUrl) if (imgUrl != "") { return imgUrl };
          case _ {};
        }
      };
      case null {};
    };

    // Flipkart _2r_T1I class image
    switch (extractAfterKey(html, "class=\"_2r_T1I\"", "src=\"")) {
      case (?after) {
        switch (after.split(#text "\"").next()) {
          case (?imgUrl) if (imgUrl != "") { return imgUrl };
          case _ {};
        }
      };
      case null {};
    };

    // Myntra: itemprop="image"
    switch (extractAfterKey(html, "itemprop=\"image\" src=\"", "\"")) {
      case (?imgUrl) if (imgUrl != "") { return imgUrl };
      case _ {};
    };

    // Generic: itemprop="image" content= (schema.org)
    switch (extractAfterKey(html, "itemprop=\"image\"", "content=\"")) {
      case (?after) {
        switch (after.split(#text "\"").next()) {
          case (?imgUrl) if (imgUrl != "" and imgUrl.startsWith(#text "http")) { return imgUrl };
          case _ {};
        }
      };
      case null {};
    };

    // JSON-LD "image": "..." (schema.org product image in script tag)
    switch (extractAfterKey(html, "\"image\":\"", "\"")) {
      case (?imgUrl) if (imgUrl.startsWith(#text "http")) { return imgUrl };
      case _ {};
    };

    // JSON-LD "image": [...] — take first array element
    switch (extractAfterKey(html, "\"image\":[\"", "\"")) {
      case (?imgUrl) if (imgUrl.startsWith(#text "http")) { return imgUrl };
      case _ {};
    };

    // Flipkart: look for rukminim CDN image URLs (common product image CDN)
    switch (extractAfterKey(html, "https://rukminim", "\"")) {
      case (?suffix) {
        let imgUrl = "https://rukminim" # suffix;
        if (imgUrl.startsWith(#text "http")) { return imgUrl };
      };
      case null {};
    };

    // Fall back to og:image / twitter:image already extracted
    ogImage
  };

  // Extracts the value of a response header by name (case-insensitive).
  func getHeader(headers : [{ name : Text; value : Text }], headerName : Text) : ?Text {
    let lowerName = headerName.toLower();
    for (h in headers.vals()) {
      if (h.name.toLower() == lowerName) {
        return ?h.value
      }
    };
    null
  };

  // Normalizes a URL: upgrades http:// to https://.
  func normalizeUrl(rawUrl : Text) : Text {
    if (rawUrl.startsWith(#text "http://")) {
      "https://" # rawUrl.trimStart(#text "http://")
    } else {
      rawUrl
    }
  };

  // Fetches product metadata (title, description, image, price) from a URL via HTTP outcall.
  // Follows up to 30 redirect hops (3xx + HTML meta-refresh + JS/form redirects) to fully
  // resolve Indian affiliate/commission link chains (fktr.in, dl.flipkart.com, clnk.in, etc.).
  // Returns Err with a structured reason code if the request fails.
  public shared func fetchProductMetadata(url : Text) : async { #Ok : Types.ProductMetadata; #Err : Text } {
    let ic = actor "aaaaa-aa" : actor {
      http_request : shared ({
        url : Text;
        max_response_bytes : ?Nat64;
        method : { #get; #head; #post };
        headers : [{ name : Text; value : Text }];
        body : ?Blob;
        transform : ?{
          function : shared query ({ response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
          context : Blob;
        };
        is_replicated : ?Bool;
      }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
    };

    // Mobile Chrome User-Agent — fktr.in affiliate links are more permissive with
    // mobile UAs and this avoids some bot-detection on Indian trackers.
    let requestHeaders = [
      {
        name = "User-Agent";
        value = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
      },
      { name = "Accept"; value = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8" },
      { name = "Accept-Language"; value = "en-IN,en;q=0.9,hi;q=0.8" },
      { name = "Accept-Encoding"; value = "identity" },
      { name = "Connection"; value = "keep-alive" },
      { name = "Upgrade-Insecure-Requests"; value = "1" },
      { name = "Sec-Fetch-Dest"; value = "document" },
      { name = "Sec-Fetch-Mode"; value = "navigate" },
      { name = "Sec-Fetch-Site"; value = "none" },
      { name = "Sec-Fetch-User"; value = "?1" },
      { name = "Cache-Control"; value = "max-age=0" },
      { name = "DNT"; value = "1" },
    ];

    // Same headers but with a Referer to retry on 403/429 (mimics clicking from Google).
    let retryHeaders = [
      {
        name = "User-Agent";
        value = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
      },
      { name = "Accept"; value = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8" },
      { name = "Accept-Language"; value = "en-IN,en;q=0.9,hi;q=0.8" },
      { name = "Accept-Encoding"; value = "identity" },
      { name = "Connection"; value = "keep-alive" },
      { name = "Upgrade-Insecure-Requests"; value = "1" },
      { name = "Sec-Fetch-Dest"; value = "document" },
      { name = "Sec-Fetch-Mode"; value = "navigate" },
      { name = "Sec-Fetch-Site"; value = "cross-site" },
      { name = "Sec-Fetch-User"; value = "?1" },
      { name = "Cache-Control"; value = "max-age=0" },
      { name = "DNT"; value = "1" },
      { name = "Referer"; value = "https://www.google.com/" },
    ];

    // Scans HTML for meta-refresh or JavaScript redirect URL.
    // Returns the redirect URL if found, otherwise null.
    // Handles ALL quote styles and capitalisation variants used by Indian affiliate pages,
    // including fktr.in form-submit, top/parent.location, and URL-scan fallback.
    func extractHtmlRedirect(html : Text) : ?Text {
      let lowerHtml = html.toLower();

      // Helper: extract URL after a literal key, stopping at first quote, >, or whitespace.
      func extractUrlAfter(src : Text, key : Text) : ?Text {
        let iter = src.split(#text key);
        ignore iter.next();
        switch (iter.next()) {
          case null null;
          case (?after) {
            let stripped = if (after.startsWith(#text "\"")) {
              after.trimStart(#text "\"")
            } else if (after.startsWith(#text "'")) {
              after.trimStart(#text "'")
            } else {
              after
            };
            let url1 = switch (stripped.split(#text "\"").next()) {
              case null stripped;
              case (?u) u;
            };
            let url2 = switch (url1.split(#text "'").next()) {
              case null url1;
              case (?u) u;
            };
            let url3 = switch (url2.split(#text ">").next()) {
              case null url2;
              case (?u) u;
            };
            let cleaned = url3.trim(#char ' ');
            if (cleaned != "" and (cleaned.startsWith(#text "http") or cleaned.startsWith(#text "/"))) {
              ?cleaned
            } else {
              null
            }
          };
        }
      };

      // Helper: extract URL from JS assignment pattern like `key = "url"` or `key="url"`.
      func extractJsAssignment(src : Text, key : Text) : ?Text {
        let iter = src.split(#text key);
        ignore iter.next();
        switch (iter.next()) {
          case null null;
          case (?after) {
            // Skip optional whitespace and '='
            let qi = after.split(#text "\"");
            ignore qi.next();
            switch (qi.next()) {
              case (?u) if (u.startsWith(#text "http") or u.startsWith(#text "/")) { ?u } else null;
              case _ {
                // Try single-quote variant
                let qi2 = after.split(#text "'");
                ignore qi2.next();
                switch (qi2.next()) {
                  case (?u) if (u.startsWith(#text "http") or u.startsWith(#text "/")) { ?u } else null;
                  case _ null;
                }
              };
            }
          };
        }
      };

      // ── Pattern 1: <meta http-equiv="refresh" content="..."> ──────────
      if (lowerHtml.contains(#text "http-equiv=\"refresh\"") or lowerHtml.contains(#text "http-equiv=refresh")) {
        func extractMetaRefreshUrl(src : Text) : ?Text {
          let iter = src.split(#text "url=");
          ignore iter.next();
          switch (iter.next()) {
            case null null;
            case (?urlPart) {
              let stripped = if (urlPart.startsWith(#text "\"")) {
                urlPart.trimStart(#text "\"")
              } else if (urlPart.startsWith(#text "'")) {
                urlPart.trimStart(#text "'")
              } else {
                urlPart
              };
              let url1 = switch (stripped.split(#text "\"").next()) {
                case null stripped;
                case (?u) u;
              };
              let url2 = switch (url1.split(#text "'").next()) {
                case null url1;
                case (?u) u;
              };
              let url3 = switch (url2.split(#text ">").next()) {
                case null url2;
                case (?u) u;
              };
              let cleaned = url3.trim(#char ' ');
              if (cleaned != "" and (cleaned.startsWith(#text "http") or cleaned.startsWith(#text "/"))) {
                ?cleaned
              } else {
                null
              }
            };
          }
        };
        switch (extractMetaRefreshUrl(html)) {
          case (?u) { return ?u };
          case null {
            let upperReplaced = html.replace(#text "URL=", "url=");
            switch (extractMetaRefreshUrl(upperReplaced)) {
              case (?u) { return ?u };
              case null {};
            }
          };
        }
      };

      // ── Pattern 2: window.location.href = "..." ────────────────────────
      switch (extractJsAssignment(html, "window.location.href")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 3: window.location = "..." (without .href) ────────────
      switch (extractJsAssignment(html, "window.location =")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 4: window.location.replace("...") ─────────────────────
      switch (extractUrlAfter(html, "window.location.replace(")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 5: location.replace("...") (without window. prefix) ───
      switch (extractUrlAfter(html, "location.replace(")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 6: window.location.assign("...") ──────────────────────
      switch (extractUrlAfter(html, "window.location.assign(")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 7: document.location.href = "..." ─────────────────────
      switch (extractJsAssignment(html, "document.location.href")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 8: document.location = "..." ──────────────────────────
      switch (extractJsAssignment(html, "document.location =")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 9: location.href = "..." (without window. prefix) ─────
      switch (extractJsAssignment(html, "location.href =")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 10: setTimeout URL extraction ─────────────────────────
      let iter10 = html.split(#text "setTimeout");
      ignore iter10.next();
      switch (iter10.next()) {
        case (?after) {
          let qi = after.split(#text "\"");
          ignore qi.next();
          switch (qi.next()) {
            case (?u) if (u.startsWith(#text "http") or u.startsWith(#text "/")) { return ?u };
            case _ {};
          }
        };
        case null {};
      };

      // ── Pattern 11: top.location.href = "..." ─────────────────────────
      switch (extractJsAssignment(html, "top.location.href")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 12: parent.location.href = "..." ──────────────────────
      switch (extractJsAssignment(html, "parent.location.href")) {
        case (?u) { return ?u };
        case null {};
      };

      // ── Pattern 13: <form action="https://www.flipkart.com/..." ────────
      // fktr.in often uses a hidden form with document.forms[0].submit()
      // We scan for action= attribute containing a known e-commerce domain.
      let formPatterns = ["action=\"https://www.flipkart", "action=\"https://flipkart", "action=\"https://www.amazon", "action=\"https://amazon", "action=\"https://www.myntra", "action=\"https://www.meesho", "action=\"https://www.jiomart"];
      for (pat in formPatterns.vals()) {
        switch (extractUrlAfter(html, pat)) {
          case (?suffix) {
            // Reconstruct full URL: pat contained up to the domain start, suffix is the rest
            // The key already includes `action="https://www.DOMAIN` so we take that prefix
            let prefix = pat.trimStart(#text "action=\"");
            let fullUrl = prefix # suffix;
            if (fullUrl.startsWith(#text "http")) { return ?fullUrl };
          };
          case null {};
        }
      };

      // ── Pattern 14: document.forms[0].submit() — extract action separately ──
      // If the page calls forms[0].submit(), extract the action= from the form tag.
      if (lowerHtml.contains(#text "document.forms[0].submit") or lowerHtml.contains(#text "document.forms[1].submit")) {
        switch (extractAfterKey(html, "action=\"", "\"")) {
          case (?actionUrl) if (actionUrl.startsWith(#text "http")) { return ?actionUrl };
          case _ {};
        }
      };

      // ── Pattern 15: Any action= attribute URL (general form auto-submit) ─
      if (lowerHtml.contains(#text ".submit()")) {
        switch (extractAfterKey(html, "action=\"", "\"")) {
          case (?actionUrl) if (actionUrl.startsWith(#text "http")) { return ?actionUrl };
          case _ {};
        }
      };

      // ── Pattern 16: URL scan fallback — find first Flipkart/Amazon/etc product URL ──
      // Scans entire HTML for any URL containing a known e-commerce domain + product path.
      // This catches fktr.in pages that embed the destination URL as a JS string value.
      let productDomains = ["flipkart.com", "amazon.in", "amazon.com", "myntra.com", "meesho.com", "jiomart.com"];
      let productPathMarkers = ["/p/", "pid=", "/dp/", "?dp="];
      // We look for `https://www.DOMAIN` or `https://DOMAIN` patterns in the HTML.
      for (domain in productDomains.vals()) {
        let searchKey = "https://www." # domain;
        let iter = html.split(#text searchKey);
        ignore iter.next();
        switch (iter.next()) {
          case (?afterDomain) {
            // Take up to 500 chars to find the end of this URL
            let candidate = searchKey # (if (afterDomain.size() > 500) {
              // Grab first 500 chars — the URL should end well before that
              switch (afterDomain.split(#text "\"").next()) {
                case null afterDomain;
                case (?u) u;
              }
            } else {
              switch (afterDomain.split(#text "\"").next()) {
                case null afterDomain;
                case (?u) u;
              }
            });
            // Check if this URL looks like a product page
            var isProduct = false;
            for (marker in productPathMarkers.vals()) {
              if (candidate.contains(#text marker)) { isProduct := true };
            };
            if (isProduct) { return ?candidate };
          };
          case null {};
        };
        // Also try without www.
        let searchKey2 = "https://" # domain;
        let iter2 = html.split(#text searchKey2);
        ignore iter2.next();
        switch (iter2.next()) {
          case (?afterDomain) {
            let candidate = searchKey2 # (switch (afterDomain.split(#text "\"").next()) {
              case null afterDomain;
              case (?u) u;
            });
            var isProduct = false;
            for (marker in productPathMarkers.vals()) {
              if (candidate.contains(#text marker)) { isProduct := true };
            };
            if (isProduct) { return ?candidate };
          };
          case null {};
        };
      };

      null
    };

    // Normalize the starting URL (http → https).
    var currentUrl = normalizeUrl(url);
    // Track the original URL for platform detection fallback.
    let originalUrl = url;
    // Allow up to 30 redirect hops — Indian affiliate chains (fktr.in → dl.flipkart.com →
    // affiliate.flipkart.com → clnk.in → flipkart.com) can easily be 10-20+ hops.
    var hopsLeft : Nat = 30;
    // Track whether we already retried this URL with Referer header on 403/429
    var retriedBlocked : Bool = false;

    try {
      label redirectLoop loop {
        if (hopsLeft == 0) {
          return #Err("redirect_limit_30")
        };
        hopsLeft -= 1;

        let response = await ic.http_request({
          url = currentUrl;
          max_response_bytes = ?(800_000 : Nat64);
          method = #get;
          headers = if (retriedBlocked) { retryHeaders } else { requestHeaders };
          body = null;
          transform = null;
          is_replicated = ?false;
        });

        let status = response.status;

        // Status 0 = IC network error or empty response — treat as transient, skip hop.
        if (status == 0) {
          return #Err("fetch_failed")
        };

        // Bot detection / rate limiting: retry once with Referer header.
        // Only give up (return blocked) if we have already retried.
        if (status == 403 or status == 429) {
          if (retriedBlocked) {
            // Check if response body has a redirect we can follow before giving up
            let bodyText = switch (response.body.decodeUtf8()) {
              case null "";
              case (?h) h;
            };
            if (bodyText != "" and hopsLeft > 0) {
              switch (extractHtmlRedirect(bodyText)) {
                case (?redirectUrl) {
                  retriedBlocked := false;
                  currentUrl := resolveUrl(redirectUrl, currentUrl);
                  continue redirectLoop;
                };
                case null {};
              }
            };
            return #Err("blocked")
          } else {
            retriedBlocked := true;
            // Don't advance currentUrl — retry same URL with retryHeaders
            continue redirectLoop;
          }
        };

        // Reset retry flag for any successful hop
        retriedBlocked := false;

        // Follow 3xx redirects via Location header.
        if (status == 301 or status == 302 or status == 303 or status == 307 or status == 308) {
          switch (getHeader(response.headers, "location")) {
            case null {
              // No Location header — check body for HTML redirect before giving up
              let bodyText = switch (response.body.decodeUtf8()) {
                case null "";
                case (?h) h;
              };
              if (bodyText != "" and hopsLeft > 0) {
                switch (extractHtmlRedirect(bodyText)) {
                  case (?redirectUrl) {
                    currentUrl := resolveUrl(redirectUrl, currentUrl);
                    continue redirectLoop;
                  };
                  case null {};
                }
              };
              return #Err("fetch_failed")
            };
            case (?location) {
              currentUrl := resolveUrl(location, currentUrl);
              continue redirectLoop;
            };
          }
        };

        // Non-redirect, non-success response (and not 403/429 already handled above).
        if (status < 200 or status >= 300) {
          return #Err("fetch_failed")
        };

        // Success (2xx) — decode body.
        let html = switch (response.body.decodeUtf8()) {
          case null { return #Err("no_content") };
          case (?h) h;
        };

        // ALWAYS check for HTML-embedded redirects on EVERY 200 response,
        // regardless of body size. fktr.in and dl.flipkart.com serve HTTP 200
        // with small JS/meta-refresh pages — this is intentional, not an error.
        if (hopsLeft > 0) {
          switch (extractHtmlRedirect(html)) {
            case (?redirectUrl) {
              currentUrl := resolveUrl(redirectUrl, currentUrl);
              continue redirectLoop;
            };
            case null {};
          }
        };

        // ── Extract title ───────────────────────────────────────────
        var title = extractMeta(html, "og:title");
        if (title == "") { title := extractMeta(html, "twitter:title") };
        if (title == "") {
          // itemprop="name" (schema.org product name)
          title := switch (extractAfterKey(html, "itemprop=\"name\">", "<")) {
            case null "";
            case (?t) t;
          };
        };
        if (title == "") { title := extractTitle(html) };
        title := cleanText(title);

        // ── Extract description ─────────────────────────────────────
        var description = extractMeta(html, "og:description");
        if (description == "") { description := extractMeta(html, "description") };
        if (description == "") { description := extractMeta(html, "twitter:description") };
        if (description == "") {
          description := switch (extractAfterKey(html, "itemprop=\"description\" content=\"", "\"")) {
            case null "";
            case (?d) d;
          };
        };
        description := cleanText(description);

        // ── Extract image ───────────────────────────────────────────
        var ogImage = extractMeta(html, "og:image");
        if (ogImage == "") { ogImage := extractMeta(html, "twitter:image") };
        let imageUrl = extractImage(html, ogImage);

        // ── Extract price and original price ────────────────────────
        let price = extractPrice(html);
        var originalPrice = extractOriginalPrice(html);
        // If no original price found, fall back to sale price
        if (originalPrice == 0.0) { originalPrice := price };

        // ── Extract discount ─────────────────────────────────────────
        var discountPercent = extractDiscount(html);
        // If no explicit discount found but both prices are known, calculate it
        if (discountPercent == 0.0 and originalPrice > 0.0 and price > 0.0 and originalPrice > price) {
          let saved = originalPrice - price;
          discountPercent := (saved / originalPrice) * 100.0;
        };

        // ── Platform detection ───────────────────────────────────────
        let platformFromFinal = detectPlatform(currentUrl);
        let platform = if (platformFromFinal != "") {
          platformFromFinal
        } else {
          detectPlatform(originalUrl)
        };

        if (title == "" and description == "" and imageUrl == "") {
          return #Err("no_content")
        };

        return #Ok({
          title;
          description;
          imageUrl;
          price;
          originalPrice;
          discountPercent;
          detectedPlatform = platform;
        })
      };

      // Should be unreachable, but satisfy the type-checker.
      #Err("fetch_failed")
    } catch (_) {
      #Err("fetch_failed")
    }
  };
};
