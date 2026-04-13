import { d as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, X, v as SORT_OPTIONS, w as cn, k as Badge } from "./index-BofEUEVK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1e3 },
  { label: "₹1,000 – ₹5,000", min: 1e3, max: 5e3 },
  { label: "₹5,000 – ₹10,000", min: 5e3, max: 1e4 },
  { label: "Above ₹10,000", min: 1e4, max: void 0 }
];
function activeFilterCount(filter) {
  let count = 0;
  if (filter.minPrice !== void 0 || filter.maxPrice !== void 0) count++;
  if (filter.sortBy !== "popular") count++;
  return count;
}
function FilterSidebar({
  filter,
  onFilterChange,
  onReset,
  className
}) {
  const [open, setOpen] = reactExports.useState(false);
  const count = activeFilterCount(filter);
  const selectedPriceRange = PRICE_RANGES.find(
    (r) => r.min === filter.minPrice && r.max === filter.maxPrice
  );
  const handlePriceRange = (min, max) => {
    if ((selectedPriceRange == null ? void 0 : selectedPriceRange.min) === min && (selectedPriceRange == null ? void 0 : selectedPriceRange.max) === max) {
      onFilterChange({ minPrice: void 0, maxPrice: void 0 });
    } else {
      onFilterChange({ minPrice: min, maxPrice: max });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: () => setOpen(!open),
        className: "flex items-center gap-2 rounded-full",
        "data-ocid": "filter-toggle",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { size: 16 }),
          "Filters",
          count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground", children: count })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-elevated z-50 p-4",
        "data-ocid": "filter-panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm", children: "Filters" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    onReset();
                    setOpen(false);
                  },
                  className: "text-xs text-accent hover:underline",
                  "data-ocid": "filter-reset",
                  children: "Reset all"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setOpen(false),
                  className: "text-muted-foreground hover:text-foreground transition-colors",
                  "aria-label": "Close filters",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Sort By" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onFilterChange({ sortBy: opt.value }),
                className: cn(
                  "text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                  filter.sortBy === opt.value ? "bg-accent/15 text-accent font-semibold" : "hover:bg-muted text-foreground"
                ),
                "data-ocid": `sort-option-${opt.value}`,
                children: opt.label
              },
              opt.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Price Range" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: PRICE_RANGES.map((range) => {
              const isSelected = (selectedPriceRange == null ? void 0 : selectedPriceRange.min) === range.min && (selectedPriceRange == null ? void 0 : selectedPriceRange.max) === range.max;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handlePriceRange(range.min, range.max),
                  className: cn(
                    "text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                    isSelected ? "bg-accent/15 text-accent font-semibold" : "hover:bg-muted text-foreground"
                  ),
                  "data-ocid": `price-range-${range.min}`,
                  children: range.label
                },
                range.label
              );
            }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  FilterSidebar as F
};
