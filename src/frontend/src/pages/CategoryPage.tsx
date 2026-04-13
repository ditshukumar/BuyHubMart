import { FilterSidebar } from "@/components/FilterSidebar";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useProducts } from "@/hooks/useBackend";
import { CATEGORY_ICONS, DEFAULT_FILTER } from "@/types";
import type { FilterState } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
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

const NAV_TO_PRODUCTS = {
  to: "/products" as const,
  search: {
    q: undefined as string | undefined,
    sort: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  },
};

export default function CategoryPage() {
  const { categorySlug } = useParams({ from: "/categories/$categorySlug" });
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();

  const isAll = categorySlug === "all";
  const category = isAll
    ? null
    : categories.find((c) => c.slug === categorySlug);

  const [filter, setFilter] = useState<FilterState>({
    ...DEFAULT_FILTER,
    categoryId: isAll ? undefined : category?.id,
  });

  // Update filter when category changes
  const currentCatId = isAll ? undefined : category?.id;
  const effectiveFilter = { ...filter, categoryId: currentCatId };

  const { data: products = [], isLoading } = useProducts(effectiveFilter);

  const icon = CATEGORY_ICONS[categorySlug] ?? "🛍️";
  const title = isAll
    ? "All Products"
    : (category?.name ??
      categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1));

  // Track this category visit in sessionStorage for recommendations
  useEffect(() => {
    if (!isAll && category?.id !== undefined) {
      trackBrowsedCategory(category.id);
    }
  }, [isAll, category?.id]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setFilter({ ...DEFAULT_FILTER, categoryId: currentCatId });
  };

  return (
    <Layout>
      {/* Category header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{icon}</span>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              {title}
            </h1>
            {!isLoading && (
              <p className="text-sm text-muted-foreground">
                {products.length} products available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex justify-end mb-4">
        <FilterSidebar
          filter={effectiveFilter}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => `sk-cat-${i}`).map((id) => (
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
          data-ocid="category-empty"
        >
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="font-display font-bold text-xl mb-2">
            No products in {title} yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Check back soon — new deals are added daily!
          </p>
          <button
            type="button"
            onClick={() => navigate(NAV_TO_PRODUCTS)}
            className="btn-primary rounded-full px-6 py-2"
          >
            Browse All Products
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
                transition={{ delay: (idx % 8) * 0.05, duration: 0.35 }}
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
