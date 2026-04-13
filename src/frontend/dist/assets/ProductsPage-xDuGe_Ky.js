import { u as useNavigate, a as useSearch, r as reactExports, D as DEFAULT_FILTER, b as useProducts, j as jsxRuntimeExports, L as Layout, S as SearchBar, c as Skeleton, m as motion } from "./index-BofEUEVK.js";
import { F as FilterSidebar } from "./FilterSidebar-C6gT3eUd.js";
import { P as ProductCard } from "./ProductCard-FZ47kx5o.js";
import "./star-qDrkQOkP.js";
function trackBrowsedCategory(categoryId) {
  if (categoryId === void 0 || categoryId === null) return;
  try {
    const key = "browsed_categories";
    const raw = sessionStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : [];
    const idStr = categoryId.toString();
    const deduped = [idStr, ...existing.filter((v) => v !== idStr)].slice(
      0,
      10
    );
    sessionStorage.setItem(key, JSON.stringify(deduped));
  } catch {
  }
}
function ProductsPage() {
  const navigate = useNavigate({ from: "/products" });
  const search = useSearch({ from: "/products" });
  const [filter, setFilter] = reactExports.useState({
    ...DEFAULT_FILTER,
    searchQuery: search.q,
    sortBy: search.sort ?? "popular",
    minPrice: search.minPrice,
    maxPrice: search.maxPrice
  });
  reactExports.useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      searchQuery: search.q
    }));
  }, [search.q]);
  const { data: products = [], isLoading } = useProducts(filter);
  const handleFilterChange = (updates) => {
    const next = { ...filter, ...updates };
    setFilter(next);
    if (updates.categoryId !== void 0) {
      trackBrowsedCategory(updates.categoryId);
    }
    navigate({
      search: {
        q: next.searchQuery || void 0,
        sort: next.sortBy !== "popular" ? next.sortBy : void 0,
        minPrice: next.minPrice,
        maxPrice: next.maxPrice
      }
    });
  };
  const handleReset = () => {
    setFilter(DEFAULT_FILTER);
    navigate({
      search: {
        q: void 0,
        sort: void 0,
        minPrice: void 0,
        maxPrice: void 0
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "All Products" }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          products.length,
          " deals found",
          filter.searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            "for “",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: filter.searchQuery }),
            "”"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchBar,
          {
            value: filter.searchQuery ?? "",
            onSearch: (q) => handleFilterChange({ searchQuery: q || void 0 }),
            className: "flex-1 sm:w-72",
            "data-ocid": "products-search"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FilterSidebar,
          {
            filter,
            onFilterChange: handleFilterChange,
            onReset: handleReset
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 12 }, (_, i) => `sk-prod-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-full" })
      ] })
    ] }, id)) }) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "products-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "🔍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-2", children: "No deals found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 max-w-sm", children: filter.searchQuery ? `No products match "${filter.searchQuery}". Try a different search.` : "No products match your current filters. Try adjusting them." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleReset,
              className: "btn-primary rounded-full px-6 py-2",
              children: "Clear Filters"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: products.map((product, idx) => {
      const platformCount = (product.platformLinks ?? []).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: idx % 12 * 0.04, duration: 0.35 },
          className: "flex flex-col gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProductCard,
              {
                product,
                onClick: () => navigate({
                  to: "/products/$productId",
                  params: { productId: product.id.toString() }
                }),
                className: "h-full"
              }
            ),
            platformCount >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigate({
                  to: "/products/$productId",
                  params: { productId: product.id.toString() }
                }),
                className: "self-start text-xs font-semibold text-accent hover:text-accent/80 transition-colors px-2 py-0.5 rounded-full bg-accent/10 hover:bg-accent/20",
                "data-ocid": `compare-chip-${product.id}`,
                children: [
                  "Compare ",
                  platformCount,
                  " platforms →"
                ]
              }
            )
          ]
        },
        product.id.toString()
      );
    }) })
  ] });
}
export {
  ProductsPage as default
};
