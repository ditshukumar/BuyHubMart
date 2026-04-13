import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPlatformLinks,
  useProducts,
  useRecordPlatformClick,
} from "@/hooks/useBackend";
import type { PlatformLink, Product } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ExternalLink, Search, Star, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Platform display helpers ────────────────────────────────────────────────

const PLATFORM_LABELS: Record<string, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  myntra: "Myntra",
  meesho: "Meesho",
  jiomart: "JioMart",
  instamart: "Instamart",
  prepkart: "Prepkart",
};

function getPlatformLabel(platform: string): string {
  return PLATFORM_LABELS[platform.toLowerCase()] ?? platform;
}

function getPlatformBadgeClass(platform: string): string {
  const map: Record<string, string> = {
    amazon: "source-badge-amazon",
    flipkart: "source-badge-flipkart",
    myntra: "source-badge-myntra",
    meesho: "source-badge-meesho",
    jiomart: "source-badge-jiomart",
    instamart: "source-badge-instamart",
    prepkart: "source-badge-prepkart",
  };
  return map[platform.toLowerCase()] ?? "source-badge-amazon";
}

function inferPlatform(link: string): string {
  if (/amazon/i.test(link)) return "amazon";
  if (/flipkart/i.test(link)) return "flipkart";
  if (/myntra/i.test(link)) return "myntra";
  if (/meesho/i.test(link)) return "meesho";
  if (/jiomart/i.test(link)) return "jiomart";
  if (/instamart|swiggy/i.test(link)) return "instamart";
  if (/prepkart/i.test(link)) return "prepkart";
  return "amazon";
}

// ── CompareCard ─────────────────────────────────────────────────────────────

function CompareCard({ product }: { product: Product }) {
  const { data: platformLinks = [], isLoading } = useGetPlatformLinks(
    product.id,
  );
  const recordPlatformClick = useRecordPlatformClick();

  // Build rows: use platformLinks if available, else fallback to product itself
  type RowItem = PlatformLink & { isFallback?: boolean };
  const rows: RowItem[] =
    platformLinks.length > 0
      ? platformLinks.map((pl) => ({ ...pl, isFallback: false }))
      : product.affiliateLink
        ? [
            {
              platform: inferPlatform(product.affiliateLink),
              price: product.price,
              originalPrice: product.originalPrice,
              discountPercent: product.discountPercent,
              affiliateLink: product.affiliateLink,
              clickCount: product.clickCount,
              isFallback: true,
            },
          ]
        : [];

  // Find best (lowest) price row index
  const lowestPriceIdx = rows.reduce<number>((best, row, idx) => {
    const bestPrice = Number(rows[best]?.price ?? Number.POSITIVE_INFINITY);
    const curPrice = Number(row.price);
    return curPrice < bestPrice ? idx : best;
  }, 0);

  // Find best discount row index
  const bestDiscountIdx = rows.reduce<number>((best, row, idx) => {
    const bestDisc = Number(rows[best]?.discountPercent ?? 0);
    const curDisc = Number(row.discountPercent ?? 0);
    return curDisc > bestDisc ? idx : best;
  }, 0);

  const handleBuyNow = (row: RowItem, idx: number) => {
    if (!row.isFallback) {
      recordPlatformClick.mutate({
        productId: product.id,
        platform: row.platform,
      });
    }
    // Small delay so mutation fires before navigation
    setTimeout(() => {
      window.open(row.affiliateLink, "_blank", "noopener,noreferrer");
    }, 80);
    // suppress unused variable warning
    void idx;
  };

  const categoryLabel =
    typeof product.categoryId === "bigint"
      ? String(product.categoryId)
      : String(product.categoryId ?? "");

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden transition-smooth hover:border-accent/30 hover:shadow-lg">
      {/* Product header row */}
      <div className="flex items-start gap-4 p-4 border-b border-border bg-muted/20">
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const fallback = el.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <span
            className="text-2xl font-display font-bold text-muted-foreground"
            style={{ display: product.imageUrl ? "none" : "flex" }}
          >
            {product.title.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="product-title text-foreground line-clamp-2 mb-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {categoryLabel || "Product"}
            </Badge>
            {rows.length > 1 && (
              <span className="text-xs text-muted-foreground">
                {rows.length} platforms
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Platform comparison table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No affiliate links available yet.
          </div>
        ) : (
          <table className="comparison-table w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Platform
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Price
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  MRP
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Discount
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isBest = idx === lowestPriceIdx;
                const isBestDiscount =
                  idx === bestDiscountIdx &&
                  Number(row.discountPercent ?? 0) > 0;
                const platformKey = row.platform.toLowerCase();
                return (
                  <tr
                    key={`${row.platform}-${idx}`}
                    className={isBest ? "compare-table-best" : ""}
                    data-ocid={`compare-row-${platformKey}`}
                  >
                    {/* Platform cell */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getPlatformBadgeClass(row.platform)}`}
                        >
                          {getPlatformLabel(row.platform)}
                        </span>
                        {isBest && (
                          <span className="deal-score-badge text-xs hidden sm:inline-flex">
                            ✦ Best Price
                          </span>
                        )}
                        {isBestDiscount && !isBest && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-500">
                            <Star size={10} fill="currentColor" />
                            Best Discount
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Current price */}
                    <td className="px-4 py-3 text-right">
                      <span className="price-current text-base">
                        ₹{Number(row.price).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Original price */}
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      {row.originalPrice &&
                      Number(row.originalPrice) > Number(row.price) ? (
                        <span className="price-original">
                          ₹{Number(row.originalPrice).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40 text-sm">
                          —
                        </span>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      {row.discountPercent &&
                      Number(row.discountPercent) > 0 ? (
                        <span className="savings-badge">
                          -{Number(row.discountPercent)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40 text-sm">
                          —
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleBuyNow(row, idx)}
                        className="buy-now-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-smooth"
                        data-ocid={`buy-now-${platformKey}-${product.id}`}
                        aria-label={`Buy on ${getPlatformLabel(row.platform)}`}
                      >
                        Buy Now
                        <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Skeleton placeholder ─────────────────────────────────────────────────────

function CompareCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="flex items-start gap-4 p-4 border-b border-border bg-muted/20">
        <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ── Category suggestion pills ────────────────────────────────────────────────

const SUGGESTIONS = [
  { label: "Gadgets", emoji: "📱", query: "smartphone" },
  { label: "Fashion", emoji: "👗", query: "adidas shoes" },
  { label: "Accessories", emoji: "⌚", query: "smartwatch" },
];

// ── Main page ────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const initialQuery = (searchParams as Record<string, string>).q ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync URL → state on mount if ?q= present
  // initialQuery is derived from window.location at render time; stable ref is fine
  const initialQueryRef = useRef(initialQuery);
  useEffect(() => {
    if (initialQueryRef.current) setSearchQuery(initialQueryRef.current);
  }, []);

  const { data: products = [], isLoading } = useProducts({
    searchQuery: searchQuery || undefined,
    sortBy: "popular",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    setSearchQuery(q);
    // Sync query to URL
    const url = new URL(window.location.href);
    if (q) {
      url.searchParams.set("q", q);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
  };

  const handleSuggestion = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.replaceState({}, "", url.toString());
    inputRef.current?.focus();
  };

  const showEmpty = !searchQuery;
  const showNoResults = !!searchQuery && !isLoading && products.length === 0;
  const showResults = !!searchQuery && (isLoading || products.length > 0);

  return (
    <Layout showCategoryNav={false}>
      {/* ── Hero / Search Header ── */}
      <div
        className="rounded-2xl mb-8 px-6 py-10 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.04 265 / 0.9) 0%, oklch(0.14 0.02 265) 50%, oklch(0.22 0.06 38 / 0.4) 100%)",
          border: "1px solid oklch(0.28 0.03 265)",
          boxShadow: "0 0 60px oklch(0.62 0.22 38 / 0.08)",
        }}
        data-ocid="compare-header"
      >
        {/* Decorative glow orb */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "oklch(0.62 0.22 38 / 0.07)",
            filter: "blur(48px)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold"
            style={{
              background: "oklch(0.62 0.22 38 / 0.15)",
              color: "oklch(0.82 0.12 38)",
            }}
          >
            <Zap size={12} />
            AI-Powered Price Comparison
          </div>

          <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight">
            Find the{" "}
            <span style={{ color: "oklch(0.82 0.18 38)" }}>Best Price</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto">
            Search any product to compare prices across{" "}
            <span className="font-semibold text-foreground/80">
              Amazon, Flipkart, Myntra, Meesho
            </span>{" "}
            &amp; more
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 max-w-xl mx-auto"
            data-ocid="compare-search-form"
          >
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-smooth text-sm"
                data-ocid="compare-search-input"
                aria-label="Search products"
              />
            </div>
            <Button
              type="submit"
              className="rounded-full font-bold px-6 py-3 h-auto flex-shrink-0 text-sm"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.22 38), oklch(0.5 0.2 25))",
                color: "oklch(0.98 0 0)",
                boxShadow: "0 0 14px oklch(0.62 0.22 38 / 0.35)",
              }}
              data-ocid="compare-submit-btn"
            >
              Compare Now
            </Button>
          </form>
        </div>
      </div>

      {/* ── Empty state (no query) ── */}
      {showEmpty && (
        <div className="text-center py-16 px-4" data-ocid="compare-empty-state">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ background: "oklch(0.2 0.02 265)" }}
          >
            <Search size={40} className="text-muted-foreground/50" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Ready to compare prices?
          </h2>
          <p className="text-muted-foreground text-sm mb-2 max-w-md mx-auto">
            Enter a product name above to compare prices across platforms.
          </p>
          <p className="text-muted-foreground/60 text-xs mb-8">
            Example: iPhone 15, Boat Earphones, Adidas Shoes
          </p>

          {/* Category suggestion pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleSuggestion(s.query)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-accent/10 transition-smooth"
                data-ocid={`suggest-${s.label.toLowerCase()}`}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {isLoading && searchQuery && (
        <div className="space-y-6" data-ocid="compare-loading">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-48" />
          </div>
          <CompareCardSkeleton />
          <CompareCardSkeleton />
          <CompareCardSkeleton />
        </div>
      )}

      {/* ── No results ── */}
      {showNoResults && (
        <div className="text-center py-16 px-4" data-ocid="compare-no-results">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
            style={{ background: "oklch(0.2 0.02 265)" }}
          >
            <Search size={36} className="text-muted-foreground/40" />
          </div>
          <h2 className="font-display font-bold text-lg text-foreground mb-2">
            No products found for &ldquo;{searchQuery}&rdquo;
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Try a different search term or browse all available products.
          </p>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/products",
                search: {
                  q: undefined,
                  sort: undefined,
                  minPrice: undefined,
                  maxPrice: undefined,
                },
              })
            }
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border border-accent/40 text-accent hover:bg-accent/10 transition-smooth"
            data-ocid="browse-all-link"
          >
            Browse all products →
          </button>
        </div>
      )}

      {/* ── Results grid ── */}
      {showResults && !isLoading && products.length > 0 && (
        <div data-ocid="compare-results">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">
                {products.length} result{products.length !== 1 ? "s" : ""} for{" "}
                <span style={{ color: "oklch(0.82 0.18 38)" }}>
                  &ldquo;{searchQuery}&rdquo;
                </span>
              </h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Tap &ldquo;Buy Now&rdquo; to get the best deal on your preferred
                platform
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setSearchQuery("");
                const url = new URL(window.location.href);
                url.searchParams.delete("q");
                window.history.replaceState({}, "", url.toString());
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted"
              data-ocid="clear-search"
            >
              Clear ✕
            </button>
          </div>

          <div className="space-y-5">
            {products.map((product) => (
              <CompareCard key={product.id.toString()} product={product} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
