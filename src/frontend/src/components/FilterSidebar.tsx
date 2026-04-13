import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/types";
import type { FilterState, SortOption } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  filter: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: undefined },
];

function activeFilterCount(filter: FilterState): number {
  let count = 0;
  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) count++;
  if (filter.sortBy !== "popular") count++;
  return count;
}

export function FilterSidebar({
  filter,
  onFilterChange,
  onReset,
  className,
}: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(filter);

  const selectedPriceRange = PRICE_RANGES.find(
    (r) => r.min === filter.minPrice && r.max === filter.maxPrice,
  );

  const handlePriceRange = (min: number, max?: number) => {
    if (selectedPriceRange?.min === min && selectedPriceRange?.max === max) {
      onFilterChange({ minPrice: undefined, maxPrice: undefined });
    } else {
      onFilterChange({ minPrice: min, maxPrice: max });
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full"
        data-ocid="filter-toggle"
      >
        <SlidersHorizontal size={16} />
        Filters
        {count > 0 && (
          <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
            {count}
          </Badge>
        )}
      </Button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-elevated z-50 p-4"
          data-ocid="filter-panel"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm">Filters</h3>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    setOpen(false);
                  }}
                  className="text-xs text-accent hover:underline"
                  data-ocid="filter-reset"
                >
                  Reset all
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Sort By
            </p>
            <div className="flex flex-col gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() =>
                    onFilterChange({ sortBy: opt.value as SortOption })
                  }
                  className={cn(
                    "text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                    filter.sortBy === opt.value
                      ? "bg-accent/15 text-accent font-semibold"
                      : "hover:bg-muted text-foreground",
                  )}
                  data-ocid={`sort-option-${opt.value}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Price Range
            </p>
            <div className="flex flex-col gap-1">
              {PRICE_RANGES.map((range) => {
                const isSelected =
                  selectedPriceRange?.min === range.min &&
                  selectedPriceRange?.max === range.max;
                return (
                  <button
                    type="button"
                    key={range.label}
                    onClick={() => handlePriceRange(range.min, range.max)}
                    className={cn(
                      "text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                      isSelected
                        ? "bg-accent/15 text-accent font-semibold"
                        : "hover:bg-muted text-foreground",
                    )}
                    data-ocid={`price-range-${range.min}`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
