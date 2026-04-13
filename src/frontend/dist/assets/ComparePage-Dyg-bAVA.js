import { u as useNavigate, a as useSearch, r as reactExports, b as useProducts, j as jsxRuntimeExports, L as Layout, E as Search, B as Button, c as Skeleton, i as useGetPlatformLinks, l as useRecordPlatformClick, k as Badge } from "./index-BofEUEVK.js";
import { Z as Zap } from "./zap-Bb7GOUaR.js";
import { S as Star, E as ExternalLink } from "./star-qDrkQOkP.js";
const PLATFORM_LABELS = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  myntra: "Myntra",
  meesho: "Meesho",
  jiomart: "JioMart",
  instamart: "Instamart",
  prepkart: "Prepkart"
};
function getPlatformLabel(platform) {
  return PLATFORM_LABELS[platform.toLowerCase()] ?? platform;
}
function getPlatformBadgeClass(platform) {
  const map = {
    amazon: "source-badge-amazon",
    flipkart: "source-badge-flipkart",
    myntra: "source-badge-myntra",
    meesho: "source-badge-meesho",
    jiomart: "source-badge-jiomart",
    instamart: "source-badge-instamart",
    prepkart: "source-badge-prepkart"
  };
  return map[platform.toLowerCase()] ?? "source-badge-amazon";
}
function inferPlatform(link) {
  if (/amazon/i.test(link)) return "amazon";
  if (/flipkart/i.test(link)) return "flipkart";
  if (/myntra/i.test(link)) return "myntra";
  if (/meesho/i.test(link)) return "meesho";
  if (/jiomart/i.test(link)) return "jiomart";
  if (/instamart|swiggy/i.test(link)) return "instamart";
  if (/prepkart/i.test(link)) return "prepkart";
  return "amazon";
}
function CompareCard({ product }) {
  const { data: platformLinks = [], isLoading } = useGetPlatformLinks(
    product.id
  );
  const recordPlatformClick = useRecordPlatformClick();
  const rows = platformLinks.length > 0 ? platformLinks.map((pl) => ({ ...pl, isFallback: false })) : product.affiliateLink ? [
    {
      platform: inferPlatform(product.affiliateLink),
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      affiliateLink: product.affiliateLink,
      clickCount: product.clickCount,
      isFallback: true
    }
  ] : [];
  const lowestPriceIdx = rows.reduce((best, row, idx) => {
    var _a;
    const bestPrice = Number(((_a = rows[best]) == null ? void 0 : _a.price) ?? Number.POSITIVE_INFINITY);
    const curPrice = Number(row.price);
    return curPrice < bestPrice ? idx : best;
  }, 0);
  const bestDiscountIdx = rows.reduce((best, row, idx) => {
    var _a;
    const bestDisc = Number(((_a = rows[best]) == null ? void 0 : _a.discountPercent) ?? 0);
    const curDisc = Number(row.discountPercent ?? 0);
    return curDisc > bestDisc ? idx : best;
  }, 0);
  const handleBuyNow = (row, idx) => {
    if (!row.isFallback) {
      recordPlatformClick.mutate({
        productId: product.id,
        platform: row.platform
      });
    }
    setTimeout(() => {
      window.open(row.affiliateLink, "_blank", "noopener,noreferrer");
    }, 80);
  };
  const categoryLabel = typeof product.categoryId === "bigint" ? String(product.categoryId) : String(product.categoryId ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border overflow-hidden transition-smooth hover:border-accent/30 hover:shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4 border-b border-border bg-muted/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center", children: [
        product.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.imageUrl,
            alt: product.title,
            className: "w-full h-full object-cover",
            onError: (e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const fallback = el.nextElementSibling;
              if (fallback) fallback.style.display = "flex";
            }
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-2xl font-display font-bold text-muted-foreground",
            style: { display: product.imageUrl ? "none" : "flex" },
            children: product.title.charAt(0).toUpperCase()
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "product-title text-foreground line-clamp-2 mb-1", children: product.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs px-2 py-0.5", children: categoryLabel || "Product" }),
          rows.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            rows.length,
            " platforms"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }, i)) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-muted-foreground text-sm", children: "No affiliate links available yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "comparison-table w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Platform" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "MRP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Discount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, idx) => {
        const isBest = idx === lowestPriceIdx;
        const isBestDiscount = idx === bestDiscountIdx && Number(row.discountPercent ?? 0) > 0;
        const platformKey = row.platform.toLowerCase();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: isBest ? "compare-table-best" : "",
            "data-ocid": `compare-row-${platformKey}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getPlatformBadgeClass(row.platform)}`,
                    children: getPlatformLabel(row.platform)
                  }
                ),
                isBest && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "deal-score-badge text-xs hidden sm:inline-flex", children: "✦ Best Price" }),
                isBestDiscount && !isBest && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10, fill: "currentColor" }),
                  "Best Discount"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "price-current text-base", children: [
                "₹",
                Number(row.price).toLocaleString("en-IN")
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right hidden sm:table-cell", children: row.originalPrice && Number(row.originalPrice) > Number(row.price) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "price-original", children: [
                "₹",
                Number(row.originalPrice).toLocaleString("en-IN")
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-sm", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right hidden sm:table-cell", children: row.discountPercent && Number(row.discountPercent) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "savings-badge", children: [
                "-",
                Number(row.discountPercent),
                "%"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-sm", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleBuyNow(row),
                  className: "buy-now-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-smooth",
                  "data-ocid": `buy-now-${platformKey}-${product.id}`,
                  "aria-label": `Buy on ${getPlatformLabel(row.platform)}`,
                  children: [
                    "Buy Now",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 })
                  ]
                }
              ) })
            ]
          },
          `${row.platform}-${idx}`
        );
      }) })
    ] }) })
  ] });
}
function CompareCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4 border-b border-border bg-muted/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-20 h-20 rounded-xl flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" })
    ] })
  ] });
}
const SUGGESTIONS = [
  { label: "Gadgets", emoji: "📱", query: "smartphone" },
  { label: "Fashion", emoji: "👗", query: "adidas shoes" },
  { label: "Accessories", emoji: "⌚", query: "smartwatch" }
];
function ComparePage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const initialQuery = searchParams.q ?? "";
  const [inputValue, setInputValue] = reactExports.useState(initialQuery);
  const [searchQuery, setSearchQuery] = reactExports.useState(initialQuery);
  const inputRef = reactExports.useRef(null);
  const initialQueryRef = reactExports.useRef(initialQuery);
  reactExports.useEffect(() => {
    if (initialQueryRef.current) setSearchQuery(initialQueryRef.current);
  }, []);
  const { data: products = [], isLoading } = useProducts({
    searchQuery: searchQuery || void 0,
    sortBy: "popular"
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputValue.trim();
    setSearchQuery(q);
    const url = new URL(window.location.href);
    if (q) {
      url.searchParams.set("q", q);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
  };
  const handleSuggestion = (query) => {
    var _a;
    setInputValue(query);
    setSearchQuery(query);
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.replaceState({}, "", url.toString());
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  };
  const showEmpty = !searchQuery;
  const showNoResults = !!searchQuery && !isLoading && products.length === 0;
  const showResults = !!searchQuery && (isLoading || products.length > 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { showCategoryNav: false, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl mb-8 px-6 py-10 text-center relative overflow-hidden",
        style: {
          background: "linear-gradient(135deg, oklch(0.18 0.04 265 / 0.9) 0%, oklch(0.14 0.02 265) 50%, oklch(0.22 0.06 38 / 0.4) 100%)",
          border: "1px solid oklch(0.28 0.03 265)",
          boxShadow: "0 0 60px oklch(0.62 0.22 38 / 0.08)"
        },
        "data-ocid": "compare-header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none",
              style: {
                background: "oklch(0.62 0.22 38 / 0.07)",
                filter: "blur(48px)"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-2xl mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold",
                style: {
                  background: "oklch(0.62 0.22 38 / 0.15)",
                  color: "oklch(0.82 0.12 38)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12 }),
                  "AI-Powered Price Comparison"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 leading-tight", children: [
              "Find the",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.82 0.18 38)" }, children: "Best Price" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto", children: [
              "Search any product to compare prices across",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground/80", children: "Amazon, Flipkart, Myntra, Meesho" }),
              " ",
              "& more"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: handleSubmit,
                className: "flex gap-2 max-w-xl mx-auto",
                "data-ocid": "compare-search-form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Search,
                      {
                        size: 18,
                        className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: inputRef,
                        type: "text",
                        value: inputValue,
                        onChange: (e) => setInputValue(e.target.value),
                        placeholder: "Search products...",
                        className: "w-full pl-11 pr-4 py-3 rounded-full bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-smooth text-sm",
                        "data-ocid": "compare-search-input",
                        "aria-label": "Search products"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      className: "rounded-full font-bold px-6 py-3 h-auto flex-shrink-0 text-sm",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.62 0.22 38), oklch(0.5 0.2 25))",
                        color: "oklch(0.98 0 0)",
                        boxShadow: "0 0 14px oklch(0.62 0.22 38 / 0.35)"
                      },
                      "data-ocid": "compare-submit-btn",
                      children: "Compare Now"
                    }
                  )
                ]
              }
            )
          ] })
        ]
      }
    ),
    showEmpty && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 px-4", "data-ocid": "compare-empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "inline-flex items-center justify-center w-24 h-24 rounded-full mb-6",
          style: { background: "oklch(0.2 0.02 265)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 40, className: "text-muted-foreground/50" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-2", children: "Ready to compare prices?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-2 max-w-md mx-auto", children: "Enter a product name above to compare prices across platforms." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-xs mb-8", children: "Example: iPhone 15, Boat Earphones, Adidas Shoes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-3 flex-wrap", children: SUGGESTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => handleSuggestion(s.query),
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 hover:bg-accent/10 transition-smooth",
          "data-ocid": `suggest-${s.label.toLowerCase()}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.emoji }),
            s.label
          ]
        },
        s.label
      )) })
    ] }),
    isLoading && searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "compare-loading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CompareCardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CompareCardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CompareCardSkeleton, {})
    ] }),
    showNoResults && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 px-4", "data-ocid": "compare-no-results", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "inline-flex items-center justify-center w-20 h-20 rounded-full mb-5",
          style: { background: "oklch(0.2 0.02 265)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 36, className: "text-muted-foreground/40" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg text-foreground mb-2", children: [
        "No products found for “",
        searchQuery,
        "”"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Try a different search term or browse all available products." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({
            to: "/products",
            search: {
              q: void 0,
              sort: void 0,
              minPrice: void 0,
              maxPrice: void 0
            }
          }),
          className: "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border border-accent/40 text-accent hover:bg-accent/10 transition-smooth",
          "data-ocid": "browse-all-link",
          children: "Browse all products →"
        }
      )
    ] }),
    showResults && !isLoading && products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "compare-results", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg text-foreground", children: [
            products.length,
            " result",
            products.length !== 1 ? "s" : "",
            " for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.82 0.18 38)" }, children: [
              "“",
              searchQuery,
              "”"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: "Tap “Buy Now” to get the best deal on your preferred platform" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setInputValue("");
              setSearchQuery("");
              const url = new URL(window.location.href);
              url.searchParams.delete("q");
              window.history.replaceState({}, "", url.toString());
            },
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted",
            "data-ocid": "clear-search",
            children: "Clear ✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(CompareCard, { product }, product.id.toString())) })
    ] })
  ] });
}
export {
  ComparePage as default
};
