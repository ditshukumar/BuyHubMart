import { e as useParams, u as useNavigate, s as useCategories, r as reactExports, D as DEFAULT_FILTER, b as useProducts, j as jsxRuntimeExports, L as Layout, t as CATEGORY_ICONS, c as Skeleton, m as motion } from "./index-BofEUEVK.js";
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
const NAV_TO_PRODUCTS = {
  to: "/products",
  search: {
    q: void 0,
    sort: void 0,
    minPrice: void 0,
    maxPrice: void 0
  }
};
function CategoryPage() {
  const { categorySlug } = useParams({ from: "/categories/$categorySlug" });
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const isAll = categorySlug === "all";
  const category = isAll ? null : categories.find((c) => c.slug === categorySlug);
  const [filter, setFilter] = reactExports.useState({
    ...DEFAULT_FILTER,
    categoryId: isAll ? void 0 : category == null ? void 0 : category.id
  });
  const currentCatId = isAll ? void 0 : category == null ? void 0 : category.id;
  const effectiveFilter = { ...filter, categoryId: currentCatId };
  const { data: products = [], isLoading } = useProducts(effectiveFilter);
  const icon = CATEGORY_ICONS[categorySlug] ?? "🛍️";
  const title = isAll ? "All Products" : (category == null ? void 0 : category.name) ?? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  reactExports.useEffect(() => {
    if (!isAll && (category == null ? void 0 : category.id) !== void 0) {
      trackBrowsedCategory(category.id);
    }
  }, [isAll, category == null ? void 0 : category.id]);
  const handleFilterChange = (updates) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };
  const handleReset = () => {
    setFilter({ ...DEFAULT_FILTER, categoryId: currentCatId });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: title }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          products.length,
          " products available"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterSidebar,
      {
        filter: effectiveFilter,
        onFilterChange: handleFilterChange,
        onReset: handleReset
      }
    ) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 8 }, (_, i) => `sk-cat-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden", children: [
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
        "data-ocid": "category-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl mb-2", children: [
            "No products in ",
            title,
            " yet"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Check back soon — new deals are added daily!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate(NAV_TO_PRODUCTS),
              className: "btn-primary rounded-full px-6 py-2",
              children: "Browse All Products"
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
          transition: { delay: idx % 8 * 0.05, duration: 0.35 },
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
  CategoryPage as default
};
