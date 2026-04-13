import { FilterSidebar } from "@/components/FilterSidebar";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useBackend";
import { DEFAULT_FILTER } from "@/types";
import type { FilterState } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

/** Push a categoryId into sessionStorage 'browsed_categories' (deduped, max 10). */
function trackBrowsedCategory(categoryId: bigint | number | undefined) {
  if (categoryId === undefined || categoryId === null) return;
  try {
    const key = "browsed_categories";
    const raw = sessionStorage.getItem(key);
    const existing: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const idStr = categoryId.toString();
    const deduped = [idStr, ...existing.filter((v) => v !== idStr)].slice(
      0,
      10,
    );
    sessionStorage.setItem(key, JSON.stringify(deduped));
  } catch {
    // sessionStorage unavailable — silently skip
  }
}

export default function ProductsPage() {
  const navigate = useNavigate({ from: "/products" });
  const search = useSearch({ from: "/products" });

  const [filter, setFilter] = useState<FilterState>({
    ...DEFAULT_FILTER,
    searchQuery: search.q,
    sortBy: (search.sort as FilterState["sortBy"]) ?? "popular",
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
  });

  // Sync URL search params to filter
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      searchQuery: search.q,
    }));
  }, [search.q]);

  const { data: products = [], isLoading } = useProducts(filter);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    const next = { ...filter, ...updates };
    setFilter(next);
    // Track category browsing when user filters by a category
    if (updates.categoryId !== undefined) {
      trackBrowsedCategory(updates.categoryId);
    }
    navigate({
      search: {
        q: next.searchQuery || undefined,
        sort: next.sortBy !== "popular" ? next.sortBy : undefined,
        minPrice: next.minPrice,
        maxPrice: next.maxPrice,
      },
    });
  };

  const handleReset = () => {
    setFilter(DEFAULT_FILTER);
    navigate({
      search: {
        q: undefined,
        sort: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      },
    });
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            All Products
          </h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {products.length} deals found
              {filter.searchQuery && (
                <>
                  {" "}
                  for &ldquo;
                  <span className="text-accent">{filter.searchQuery}</span>
                  &rdquo;
                </>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchBar
            value={filter.searchQuery ?? ""}
            onSearch={(q) =>
              handleFilterChange({ searchQuery: q || undefined })
            }
            className="flex-1 sm:w-72"
            data-ocid="products-search"
          />
          <FilterSidebar
            filter={filter}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => `sk-prod-${i}`).map((id) => (
            <div key={id} className="rounded-xl overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="products-empty"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            No deals found
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            {filter.searchQuery
              ? `No products match "${filter.searchQuery}". Try a different search.`
              : "No products match your current filters. Try adjusting them."}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="btn-primary rounded-full px-6 py-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, idx) => {
            const platformCount = (product.platformLinks ?? []).length;
            return (
              <motion.div
                key={product.id.toString()}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 12) * 0.04, duration: 0.35 }}
                className="flex flex-col gap-1"
              >
                <ProductCard
                  product={product}
                  onClick={() =>
                    navigate({
                      to: "/products/$productId",
                      params: { productId: product.id.toString() },
                    })
                  }
                  className="h-full"
                />
                {platformCount >= 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/products/$productId",
                        params: { productId: product.id.toString() },
                      })
                    }
                    className="self-start text-xs font-semibold text-accent hover:text-accent/80 transition-colors px-2 py-0.5 rounded-full bg-accent/10 hover:bg-accent/20"
                    data-ocid={`compare-chip-${product.id}`}
                  >
                    Compare {platformCount} platforms →
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
