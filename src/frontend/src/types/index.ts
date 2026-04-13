import type {
  Category,
  PlatformLink,
  Product,
  ProductFilter,
  ProductInput,
} from "../backend.d.ts";

export type { Category, PlatformLink, Product, ProductFilter, ProductInput };

// ProductWithPlatforms and ProductInputWithPlatforms are now identical to
// Product / ProductInput since platformLinks is part of the generated types.
// Keep the aliases so existing import sites don't need changes.
export type ProductWithPlatforms = Product;
export type ProductInputWithPlatforms = ProductInput;

// HotDeal is an alias for Product — used for hot deals / trending queries
export type HotDeal = Product;

// CompareResult bundles a product with all its platform pricing options
export interface CompareResult {
  product: Product;
  platforms: PlatformLink[];
}

export type SortOption =
  | "popular"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "discount";

export interface FilterState {
  categoryId?: bigint;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: SortOption;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "discount", label: "Biggest Discount" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export const DEFAULT_FILTER: FilterState = {
  sortBy: "popular",
};

export const CATEGORY_ICONS: Record<string, string> = {
  gadgets: "📱",
  fashion: "👗",
  accessories: "💍",
  trending: "🔥",
  all: "✨",
  electronics: "💻",
  home: "🏠",
  beauty: "💄",
  sports: "⚽",
  books: "📚",
};
