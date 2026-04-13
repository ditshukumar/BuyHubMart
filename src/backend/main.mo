import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "types/products";
import Common "types/common";
import ProductsApi "mixins/products-api";
import ProductsLib "lib/products";



actor {
  let products = Map.empty<Common.ProductId, Types.Product>();
  let categories = List.empty<Types.Category>();
  let nextProductId = { var value : Nat = 1 };
  let nextCategoryId = { var value : Nat = 1 };
  let adminPrincipal = { var value : Principal = Principal.anonymous() };

  // Seed sample data on first run (idempotent — skips if categories already exist)
  ProductsLib.seedData(products, categories, nextProductId, nextCategoryId);

  include ProductsApi(products, categories, nextProductId, nextCategoryId, adminPrincipal);
};
