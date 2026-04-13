import Common "common";

module {
  public type AffiliateSource = { #flipkart; #amazon };

  public type Category = {
    id : Common.CategoryId;
    name : Text;
    slug : Text;
    iconName : Text;
  };

  // Per-platform price entry for multi-platform price comparison.
  // clickCount tracks clicks on each platform link independently.
  public type PlatformLink = {
    platform : Text; // e.g. "amazon", "flipkart", "myntra", "meesho", "prepkart", "jiomart", "instamart"
    price : Float;
    originalPrice : Float;
    discountPercent : Nat;
    affiliateLink : Text;
    clickCount : Nat;
  };

  public type Product = {
    id : Common.ProductId;
    title : Text;
    description : Text;
    imageUrl : Text;
    price : Float;
    originalPrice : Float;
    discountPercent : Nat;
    affiliateLink : Text;
    affiliateSource : Text; // "flipkart" or "amazon"
    categoryId : Common.CategoryId;
    tags : [Text];
    isTrending : Bool;
    clickCount : Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
    // Multi-platform comparison links. Empty array means fall back to legacy single affiliateLink/price fields.
    platformLinks : [PlatformLink];
  };

  public type ProductInput = {
    title : Text;
    description : Text;
    imageUrl : Text;
    price : Float;
    originalPrice : Float;
    discountPercent : Nat;
    affiliateLink : Text;
    affiliateSource : Text;
    categoryId : Common.CategoryId;
    tags : [Text];
    isTrending : Bool;
    // Optional multi-platform links. Empty array means single-link mode.
    platformLinks : [PlatformLink];
  };

  public type ProductFilter = {
    categoryId : ?Common.CategoryId;
    searchQuery : ?Text;
    minPrice : ?Float;
    maxPrice : ?Float;
    sortBy : Text; // "trending" | "newest" | "price_asc" | "price_desc"
  };

  // Metadata extracted from a product URL via HTTP outcall.
  public type ProductMetadata = {
    title : Text;
    description : Text;
    imageUrl : Text;
    price : Float;
    originalPrice : Float;
    discountPercent : Float;
    detectedPlatform : Text;
  };
};
