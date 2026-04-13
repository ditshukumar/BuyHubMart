import { useProductCountByCategory } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/types";
import type { Category } from "@/types";
import { useRef } from "react";

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId?: bigint;
  onSelect: (categoryId?: bigint) => void;
  className?: string;
}

const ALL_CATEGORY = {
  id: BigInt(0),
  name: "All",
  slug: "all",
  iconName: "all",
};

// Per-tab count pill — each tab fetches its own count independently
function CategoryCountPill({
  categoryId,
  isActive = false,
}: {
  categoryId: number | null;
  isActive?: boolean;
}) {
  const { data: count, isLoading } = useProductCountByCategory(categoryId);

  if (isLoading || count === undefined) return null;

  const num = Number(count);
  if (num === 0) return null;

  return (
    <span
      className="category-count-pill"
      style={
        isActive
          ? { background: "rgba(255,255,255,0.20)", color: "#fff" }
          : undefined
      }
      aria-label={`${num} products`}
    >
      {num > 99 ? "99+" : num}
    </span>
  );
}

export function CategoryNav({
  categories,
  activeCategoryId,
  onSelect,
  className,
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabs = [ALL_CATEGORY, ...categories];

  // Total count for "All" tab — sum of all category counts
  // We pass null to get total; useProductCountByCategory(null) returns 0 so we
  // compute total from individual counts. Instead, use categoryId=0 as a signal
  // for "all products". The hook uses getProductCountByCategory(0) which the
  // backend interprets as total count (BigInt(0) = all categories).
  const totalCountQuery = useProductCountByCategory(0);
  const totalCount =
    totalCountQuery.data !== undefined ? Number(totalCountQuery.data) : null;

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mb-1",
        className,
      )}
      role="tablist"
      aria-label="Product categories"
      data-ocid="category-nav"
    >
      {tabs.map((cat) => {
        const isAll = cat.id === BigInt(0);
        const isActive = isAll
          ? activeCategoryId === undefined
          : activeCategoryId === cat.id;
        const icon = CATEGORY_ICONS[cat.slug] ?? "🛍️";

        return (
          <button
            type="button"
            key={cat.id.toString()}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(isAll ? undefined : cat.id)}
            className={cn(
              "relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
              isActive
                ? "font-bold shadow-md ring-2 ring-accent/30"
                : "bg-card text-muted-foreground hover:bg-accent/10 hover:text-foreground hover:border-accent/40 border border-border",
            )}
            style={
              isActive
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.62 0.22 38), oklch(0.52 0.20 25))",
                    color: "oklch(0.98 0 0)",
                    boxShadow:
                      "0 2px 12px oklch(0.62 0.22 38 / 0.45), 0 0 0 2px oklch(0.62 0.22 38 / 0.2)",
                  }
                : undefined
            }
            data-ocid={`category-tab-${cat.slug}`}
          >
            <span aria-hidden="true">{icon}</span>
            <span>{cat.name}</span>

            {/* Count pill — "All" uses total, others use per-category count */}
            {isAll ? (
              totalCount !== null && totalCount > 0 ? (
                <span
                  className="category-count-pill"
                  style={
                    isActive
                      ? { background: "rgba(255,255,255,0.20)", color: "#fff" }
                      : undefined
                  }
                  aria-label={`${totalCount} products`}
                >
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              ) : null
            ) : (
              <CategoryCountPill
                categoryId={Number(cat.id)}
                isActive={isActive}
              />
            )}

            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex h-1 w-4">
                <span
                  className="relative inline-flex rounded-full w-4 h-1"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.62 0.22 38), oklch(0.52 0.20 25))",
                  }}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
