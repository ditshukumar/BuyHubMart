import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: CategoryId;
    name: string;
    slug: string;
    iconName: string;
}
export interface ProductInput {
    categoryId: CategoryId;
    title: string;
    originalPrice: number;
    platformLinks: Array<PlatformLink>;
    tags: Array<string>;
    description: string;
    discountPercent: bigint;
    imageUrl: string;
    affiliateSource: string;
    affiliateLink: string;
    price: number;
    isTrending: boolean;
}
export type Timestamp = bigint;
export interface PlatformLink {
    originalPrice: number;
    discountPercent: bigint;
    platform: string;
    clickCount: bigint;
    affiliateLink: string;
    price: number;
}
export interface ProductMetadata {
    title: string;
    originalPrice: number;
    description: string;
    discountPercent: number;
    imageUrl: string;
    detectedPlatform: string;
    price: number;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export interface Product {
    id: ProductId;
    categoryId: CategoryId;
    title: string;
    originalPrice: number;
    platformLinks: Array<PlatformLink>;
    createdAt: Timestamp;
    tags: Array<string>;
    description: string;
    discountPercent: bigint;
    updatedAt: Timestamp;
    imageUrl: string;
    clickCount: bigint;
    affiliateSource: string;
    affiliateLink: string;
    price: number;
    isTrending: boolean;
}
export interface ProductFilter {
    categoryId?: CategoryId;
    sortBy: string;
    maxPrice?: number;
    minPrice?: number;
    searchQuery?: string;
}
export interface backendInterface {
    addCategory(name: string, slug: string, iconName: string): Promise<Category>;
    addProduct(input: ProductInput): Promise<Product>;
    adminLogin(email: string, password: string): Promise<boolean>;
    claimAdmin(): Promise<boolean>;
    deleteProduct(id: ProductId): Promise<boolean>;
    fetchProductMetadata(url: string): Promise<{
        __kind__: "Ok";
        Ok: ProductMetadata;
    } | {
        __kind__: "Err";
        Err: string;
    }>;
    getCategories(): Promise<Array<Category>>;
    getHotDeals(limit: bigint): Promise<Array<Product>>;
    getPlatformLinks(productId: ProductId): Promise<Array<PlatformLink>>;
    getProduct(id: ProductId): Promise<Product | null>;
    getProductCountByCategory(categoryId: CategoryId): Promise<bigint>;
    getProducts(filter: ProductFilter): Promise<Array<Product>>;
    getRelatedProducts(productId: ProductId, limit: bigint): Promise<Array<Product>>;
    isAdmin(): Promise<boolean>;
    recordClick(productId: ProductId): Promise<void>;
    recordPlatformClick(productId: ProductId, platform: string): Promise<void>;
    updateCategory(id: CategoryId, name: string, slug: string, iconName: string): Promise<Category | null>;
    updateProduct(id: ProductId, input: ProductInput): Promise<Product | null>;
}
