import { d as createLucideIcon, j as jsxRuntimeExports, L as Layout, u as useNavigate, m as motion, n as ShoppingBag, F as Flame, b as useProducts, B as Button, c as Skeleton, r as reactExports, o as useHotDeals, p as Sparkles, q as Link, C as ChevronRight, s as useCategories, D as DEFAULT_FILTER } from "./index-BofEUEVK.js";
import { P as ProductCard } from "./ProductCard-FZ47kx5o.js";
import { E as ExternalLink } from "./star-qDrkQOkP.js";
import { Z as Zap } from "./zap-Bb7GOUaR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
const FEATURE_BADGES = [
  { icon: TrendingUp, label: "Trending Daily", color: "text-accent" },
  { icon: Shield, label: "Verified Deals", color: "text-secondary" },
  { icon: Truck, label: "Fast Delivery", color: "text-accent" }
];
const STATS = [
  { value: "50+", label: "Products Compared", emoji: "🔍" },
  { value: "7 Stores", label: "Amazon, Flipkart & More", emoji: "🏪" },
  { value: "60%", label: "Save up to 60%", emoji: "💰" }
];
const DEAL_BADGES = [
  { text: "Amazon Deal 🔥", hue: "65" },
  { text: "Flipkart Exclusive ⚡", hue: "260" },
  { text: "Today Only 💥", hue: "25" },
  { text: "Limited Stock ⏰", hue: "38" },
  { text: "Best Seller 🏆", hue: "140" },
  { text: "Flash Sale 🎯", hue: "25" },
  { text: "Top Rated ⭐", hue: "65" },
  { text: "Gen Z Pick 😎", hue: "260" }
];
const PUNCHY_LINES = [
  { emoji: "🔥", text: "Compare All Platforms Instantly" },
  { emoji: "⚡", text: "Prices Updated Daily" },
  { emoji: "💯", text: "100% Verified Affiliate Links" },
  { emoji: "🎯", text: "Best Deal Highlighted for You" }
];
const PLATFORM_BADGES = [
  { name: "Amazon", emoji: "🛒", hue: "65" },
  { name: "Flipkart", emoji: "📦", hue: "260" },
  { name: "Myntra", emoji: "👗", hue: "355" },
  { name: "Meesho", emoji: "🛍️", hue: "320" },
  { name: "Prepkart", emoji: "📱", hue: "200" },
  { name: "JioMart", emoji: "🟢", hue: "145" },
  { name: "Instamart", emoji: "⚡", hue: "45" }
];
const BROWSED_CATEGORIES_KEY = "browsed_categories";
const MAX_BROWSED = 10;
function trackCategoryVisit(categoryId) {
  try {
    const raw = sessionStorage.getItem(BROWSED_CATEGORIES_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const idStr = categoryId.toString();
    const updated = [idStr, ...existing.filter((id) => id !== idStr)].slice(
      0,
      MAX_BROWSED
    );
    sessionStorage.setItem(BROWSED_CATEGORIES_KEY, JSON.stringify(updated));
  } catch {
  }
}
function getBrowsedCategoryIds() {
  try {
    const raw = sessionStorage.getItem(BROWSED_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function getBestPlatformLink(product) {
  const links = product.platformLinks ?? [];
  if (links.length === 0) return null;
  return links.reduce((a, b) => a.price <= b.price ? a : b);
}
function getLowestPlatformPrice(product) {
  const links = product.platformLinks ?? [];
  if (links.length === 0) return null;
  return Math.min(...links.map((pl) => pl.price));
}
function MarqueeBadges() {
  const doubled = [...DEAL_BADGES, ...DEAL_BADGES];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden w-full", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-2 w-max",
      style: { animation: "marquee-scroll 12s linear infinite" },
      children: doubled.map(({ text, hue }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full border",
          style: {
            background: `oklch(0.95 0.08 ${hue} / 0.25)`,
            borderColor: "oklch(0.98 0 0 / 0.35)",
            color: "oklch(0.98 0 0)",
            boxShadow: "0 0 8px oklch(0.98 0 0 / 0.15)"
          },
          children: text
        },
        `badge-${i}-${hue}`
      ))
    }
  ) });
}
function HeroRightColumn() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "hidden md:flex flex-col gap-5 justify-center items-center min-w-0 flex-1 rounded-2xl px-6 py-8",
      style: {
        background: "linear-gradient(135deg, oklch(0.62 0.22 38), oklch(0.52 0.20 25), oklch(0.42 0.18 38))",
        boxShadow: "0 0 40px oklch(0.65 0.22 38 / 0.5), 0 0 80px oklch(0.55 0.20 25 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.15)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 w-full max-w-xs", children: STATS.map(({ value, label, emoji }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.3 + i * 0.15, duration: 0.5 },
            className: "flex items-center gap-4 rounded-2xl px-5 py-3 border",
            style: {
              background: "oklch(1 0 0 / 0.12)",
              borderColor: "oklch(1 0 0 / 0.25)",
              boxShadow: "0 4px 20px oklch(0 0 0 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.15)",
              backdropFilter: "blur(8px)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-2xl leading-none text-white",
                    style: { textShadow: "0 0 14px oklch(1 0 0 / 0.4)" },
                    children: value
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/80 mt-0.5 font-medium", children: label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto flex h-2 w-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-white" })
              ] })
            ]
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.7, duration: 0.4 },
            className: "w-full max-w-xs flex flex-col gap-1.5",
            children: PUNCHY_LINES.map(({ emoji, text }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.75 + i * 0.1 },
                className: "flex items-center gap-2 text-white/90",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold tracking-wide text-white", children: text })
                ]
              },
              text
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 1.1, duration: 0.5 },
            className: "w-full max-w-xs",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarqueeBadges, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.5, duration: 0.6, type: "spring" },
            className: "relative w-28 h-48 rounded-3xl border-2",
            style: {
              borderColor: "oklch(1 0 0 / 0.4)",
              background: "linear-gradient(160deg, oklch(0.35 0.12 38 / 0.8), oklch(0.25 0.10 25 / 0.9), oklch(0.18 0.04 0 / 0.95))",
              boxShadow: "0 0 30px oklch(0.8 0.18 38 / 0.4), 0 0 60px oklch(0.6 0.16 25 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.2)"
            },
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full",
                  style: { background: "oklch(1 0 0 / 0.3)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-3 top-7 rounded-2xl flex flex-col gap-1.5 overflow-hidden", children: [
                [38, 25, 0].map((hue) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-lg h-10 w-full",
                    style: {
                      background: `linear-gradient(90deg, oklch(0.55 0.18 ${hue} / 0.7), oklch(0.40 0.12 ${hue} / 0.4))`,
                      boxShadow: `0 0 8px oklch(0.75 0.18 ${hue} / 0.4)`
                    }
                  },
                  hue
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-full h-6 w-3/4 mx-auto mt-1",
                    style: {
                      background: "oklch(1 0 0 / 0.85)",
                      boxShadow: "0 0 10px oklch(1 0 0 / 0.5)"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full",
                  style: { background: "oklch(1 0 0 / 0.4)" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 1.3, duration: 0.5 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/products",
                search: {
                  q: void 0,
                  sort: void 0,
                  minPrice: void 0,
                  maxPrice: void 0
                },
                className: "group flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all duration-300 text-white hover:bg-white hover:text-orange-600",
                style: {
                  borderColor: "oklch(1 0 0 / 0.7)",
                  background: "oklch(1 0 0 / 0.12)",
                  boxShadow: "0 0 16px oklch(1 0 0 / 0.2)"
                },
                "data-ocid": "hero-explore-more",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Explore More" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ArrowRight,
                    {
                      size: 15,
                      className: "transition-transform duration-300 group-hover:translate-x-1"
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
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
function PlatformTrustRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4, duration: 0.4 },
      className: "flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide",
      "aria-label": "Supported platforms",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary-foreground/60 text-xs font-medium whitespace-nowrap flex-shrink-0", children: "Available on:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: PLATFORM_BADGES.map(({ name, emoji, hue }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap flex-shrink-0",
            style: {
              background: `oklch(0.98 0.06 ${hue} / 0.18)`,
              borderColor: `oklch(0.80 0.12 ${hue} / 0.35)`,
              color: "oklch(0.96 0 0)"
            },
            "data-ocid": `platform-badge-${name.toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: emoji }),
              name
            ]
          },
          name
        )) })
      ]
    }
  );
}
function HeroSection() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground mb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 opacity-30",
        style: {
          backgroundImage: `url('/assets/generated/hero-deals-banner.dim_1200x600.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-stretch px-6 pt-10 md:pt-16 md:px-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full", children: "🔍 Price Comparison" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "hero-text text-secondary-foreground mb-3", children: [
              "Compare Prices,",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Find The Best Deal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-secondary-foreground/80 text-base mb-4 max-w-md", children: "Compare prices across Amazon, Flipkart, Myntra & more — always find the lowest price before you buy." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => navigate(NAV_TO_PRODUCTS),
                  className: "hero-cta-primary group flex items-center gap-2 font-display font-bold text-base text-white rounded-full transition-all duration-300 active:scale-95",
                  style: {
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, oklch(0.72 0.18 55), oklch(0.55 0.22 30))",
                    boxShadow: "0 0 20px oklch(0.65 0.22 38 / 0.6), 0 4px 16px oklch(0 0 0 / 0.3)",
                    animation: "hero-pulse 2.5s ease-in-out infinite"
                  },
                  "data-ocid": "hero-cta-shop",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 18, className: "flex-shrink-0" }),
                    "Compare Deals Now",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ArrowRight,
                      {
                        size: 16,
                        className: "transition-transform duration-300 group-hover:translate-x-0.5"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-orange-600 transition-all duration-300 active:scale-95",
                  onClick: () => navigate({
                    to: "/categories/$categorySlug",
                    params: { categorySlug: "trending" }
                  }),
                  "data-ocid": "hero-cta-trending",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Flame,
                      {
                        size: 16,
                        className: "text-red-400 group-hover:text-red-500 flex-shrink-0"
                      }
                    ),
                    "Trending Now"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformTrustRow, {})
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeroRightColumn, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 flex flex-wrap gap-3 px-6 md:px-12 py-6", children: FEATURE_BADGES.map(({ icon: Icon, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1.5 bg-card/20 backdrop-blur-sm px-3 py-1.5 rounded-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, className: color }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary-foreground text-xs font-medium", children: label })
        ]
      },
      label
    )) })
  ] });
}
function HotDealCard({ product, idx }) {
  const navigate = useNavigate();
  const bestLink = getBestPlatformLink(product);
  const lowestPrice = getLowestPlatformPrice(product);
  const displayPrice = lowestPrice ?? product.price;
  const displayOriginal = (bestLink == null ? void 0 : bestLink.originalPrice) ?? product.originalPrice;
  const discountPct = (bestLink == null ? void 0 : bestLink.discountPercent) ?? Number(product.discountPercent);
  const buyLink = (bestLink == null ? void 0 : bestLink.affiliateLink) ?? product.affiliateLink;
  const handleGrabDeal = (e) => {
    e.stopPropagation();
    if (buyLink) {
      window.open(buyLink, "_blank", "noopener,noreferrer");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.article,
    {
      initial: { opacity: 0, x: 24 },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: true },
      transition: { delay: idx * 0.07, duration: 0.35 },
      className: "flex-shrink-0 w-52 snap-center bg-card rounded-xl border border-border overflow-hidden flex flex-col hover:border-accent/40 hover:shadow-elevated transition-all duration-300 group",
      "data-ocid": `hot-deal-card-${product.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "relative aspect-square overflow-hidden bg-muted w-full cursor-pointer",
            onClick: () => navigate({
              to: "/products/$productId",
              params: { productId: product.id.toString() }
            }),
            "aria-label": `View ${product.title}`,
            children: [
              product.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: product.imageUrl,
                  alt: product.title,
                  loading: "lazy",
                  referrerPolicy: "no-referrer",
                  className: "w-full h-full object-cover transition-opacity duration-500"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-full flex items-center justify-center",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.18 0.06 38 / 0.8), oklch(0.22 0.08 25 / 0.9))"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-3xl font-display font-black",
                      style: { color: "oklch(0.75 0.18 38)" },
                      children: product.title.slice(0, 2).toUpperCase()
                    }
                  )
                }
              ),
              discountPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hot-deal-badge", children: [
                discountPct,
                "% OFF"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 p-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm line-clamp-2 leading-snug", children: product.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 flex-wrap mt-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-display font-bold text-base",
                style: { color: "oklch(0.72 0.16 38)" },
                children: [
                  "₹",
                  displayPrice.toLocaleString("en-IN")
                ]
              }
            ),
            displayOriginal > displayPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground line-through", children: [
              "₹",
              displayOriginal.toLocaleString("en-IN")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleGrabDeal,
              className: "w-full mt-1 h-9 text-sm font-bold rounded-full transition-all duration-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5 buy-now-btn",
              "data-ocid": `hot-deal-grab-${product.id}`,
              "aria-label": `Grab deal for ${product.title}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13, className: "flex-shrink-0" }),
                "Grab Deal"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function HotDealsSection() {
  const navigate = useNavigate();
  const carouselRef = reactExports.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = reactExports.useState(false);
  const [canScrollRight, setCanScrollRight] = reactExports.useState(false);
  const { data: hotDeals = [], isLoading } = useHotDeals(6);
  const checkScrollability = reactExports.useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);
  reactExports.useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    const ro = new ResizeObserver(checkScrollability);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScrollability);
      ro.disconnect();
    };
  }, [checkScrollability]);
  const scrollBy = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -(el.clientWidth * 0.75) : el.clientWidth * 0.75,
      behavior: "smooth"
    });
  };
  if (!isLoading && hotDeals.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", "data-ocid": "hot-deals-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl flex items-center gap-2", children: "Hot Deals 🔥" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Top discounts right now — before they run out" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => scrollBy("left"),
              disabled: !canScrollLeft,
              "aria-label": "Scroll hot deals left",
              className: "p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200",
              "data-ocid": "hot-deals-scroll-left",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => scrollBy("right"),
              disabled: !canScrollRight,
              "aria-label": "Scroll hot deals right",
              className: "p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200",
              "data-ocid": "hot-deals-scroll-right",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => navigate(NAV_TO_PRODUCTS),
            className: "text-accent hover:text-accent/80 font-medium",
            "data-ocid": "hot-deals-see-all",
            children: [
              "See All",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14, className: "ml-1" })
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-hidden pb-4", children: Array.from({ length: 6 }, (_, i) => `sk-hot-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-shrink-0 w-52 rounded-xl overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-full" })
          ] })
        ]
      },
      id
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: carouselRef,
        className: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory",
        style: { scrollBehavior: "smooth", scrollbarWidth: "none" },
        "data-ocid": "hot-deals-carousel",
        children: hotDeals.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          HotDealCard,
          {
            product,
            idx
          },
          product.id.toString()
        ))
      }
    )
  ] });
}
function TrendingProducts() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts({
    ...DEFAULT_FILTER,
    sortBy: "popular"
  });
  const trending = products.filter((p) => p.isTrending).slice(0, 8);
  const shown = trending.length > 0 ? trending : products.slice(0, 8);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 20, className: "text-red-500 fill-red-500" }),
          "Trending Now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Most popular deals today" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => navigate(NAV_TO_PRODUCTS),
          className: "text-accent hover:text-accent/80 font-medium",
          "data-ocid": "trending-see-all",
          children: [
            "See All",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14, className: "ml-1" })
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 8 }, (_, i) => `sk-trend-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-full" })
      ] })
    ] }, id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: shown.map((product, idx) => {
      const lowestPrice = getLowestPlatformPrice(product);
      const bestLink = getBestPlatformLink(product);
      const hasPlatforms = (product.platformLinks ?? []).length > 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: idx * 0.05, duration: 0.4 },
          className: "relative",
          children: [
            hasPlatforms && lowestPrice !== null && bestLink && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none",
                "aria-label": `Best deal: ${bestLink.platform} ₹${lowestPrice.toLocaleString("en-IN")}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap",
                    style: {
                      background: "oklch(0.20 0.04 60 / 0.85)",
                      color: "oklch(0.82 0.14 75)",
                      backdropFilter: "blur(4px)",
                      boxShadow: "0 0 8px oklch(0.75 0.16 65 / 0.3)"
                    },
                    children: [
                      "⭐ Best: ",
                      bestLink.platform,
                      " ₹",
                      lowestPrice.toLocaleString("en-IN")
                    ]
                  }
                )
              }
            ),
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
            )
          ]
        },
        product.id.toString()
      );
    }) })
  ] });
}
function CategoryHighlights() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const cats = categories.length > 0 ? categories.slice(0, 4) : [
    {
      id: BigInt(1),
      name: "Gadgets",
      slug: "gadgets",
      iconName: "gadgets"
    },
    {
      id: BigInt(2),
      name: "Fashion",
      slug: "fashion",
      iconName: "fashion"
    },
    {
      id: BigInt(3),
      name: "Accessories",
      slug: "accessories",
      iconName: "accessories"
    },
    {
      id: BigInt(4),
      name: "Trending",
      slug: "trending",
      iconName: "trending"
    }
  ];
  const icons = {
    gadgets: "📱",
    fashion: "👗",
    accessories: "💍",
    trending: "🔥"
  };
  const colors = [
    "bg-accent/10 border-accent/20",
    "bg-secondary/10 border-secondary/20",
    "bg-primary/10 border-primary/20",
    "bg-accent/15 border-accent/30"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-4", children: "Shop by Category" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: cats.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.button,
      {
        type: "button",
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { delay: i * 0.08 },
        onClick: () => navigate({
          to: "/categories/$categorySlug",
          params: { categorySlug: cat.slug }
        }),
        className: `${colors[i % colors.length]} border rounded-xl p-4 text-center hover:shadow-elevated transition-all duration-300 group hover:border-accent/50`,
        style: {
          transition: "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.2s ease"
        },
        "data-ocid": `category-highlight-${cat.slug}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-2 group-hover:scale-110 transition-smooth", children: icons[cat.slug] ?? "🛍️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground", children: cat.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-0.5", children: [
            "Shop Now",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ArrowRight,
              {
                size: 11,
                className: "transition-transform duration-300 group-hover:translate-x-1"
              }
            )
          ] })
        ]
      },
      cat.id.toString()
    )) })
  ] });
}
function FlashDeals() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts({
    ...DEFAULT_FILTER,
    sortBy: "discount"
  });
  const deals = products.filter((p) => Number(p.discountPercent) >= 20).slice(0, 4);
  if (!isLoading && deals.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10 bg-muted/30 rounded-2xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20, className: "text-accent fill-accent" }),
          "Flash Deals"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Biggest discounts — limited time" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "text-accent font-medium",
          onClick: () => navigate(NAV_TO_PRODUCTS),
          "data-ocid": "flash-see-all",
          children: [
            "View All ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14, className: "ml-1" })
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Array.from({ length: 4 }, (_, i) => `sk-flash-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-xl" }, id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: deals.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, x: -10 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { delay: idx * 0.08 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductCard,
          {
            product,
            onClick: () => navigate({
              to: "/products/$productId",
              params: { productId: product.id.toString() }
            }),
            className: "h-full"
          }
        )
      },
      product.id.toString()
    )) })
  ] });
}
function useRecommendedProducts(allProducts) {
  return reactExports.useMemo(() => {
    const browsedIds = getBrowsedCategoryIds();
    let recommended = [];
    if (browsedIds.length > 0) {
      const browsedSet = new Set(browsedIds);
      const fromBrowsed = allProducts.filter(
        (p) => browsedSet.has(p.categoryId.toString())
      );
      if (fromBrowsed.length >= 4) {
        recommended = fromBrowsed;
      } else {
        const extras = allProducts.filter(
          (p) => !browsedSet.has(p.categoryId.toString()) && p.isTrending
        );
        recommended = [...fromBrowsed, ...extras];
      }
    }
    if (recommended.length === 0) {
      recommended = allProducts.filter((p) => p.isTrending);
      if (recommended.length === 0) {
        recommended = allProducts;
      }
    }
    return recommended.slice(0, 12);
  }, [allProducts]);
}
function RecommendationsCarousel() {
  const navigate = useNavigate();
  const carouselRef = reactExports.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = reactExports.useState(false);
  const [canScrollRight, setCanScrollRight] = reactExports.useState(false);
  const { data: products = [], isLoading } = useProducts({
    ...DEFAULT_FILTER,
    sortBy: "popular"
  });
  const recommended = useRecommendedProducts(products);
  const browsedIds = getBrowsedCategoryIds();
  const isPersonalized = browsedIds.length > 0;
  const checkScrollability = reactExports.useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);
  reactExports.useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    const ro = new ResizeObserver(checkScrollability);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScrollability);
      ro.disconnect();
    };
  }, [checkScrollability]);
  const scrollBy = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth"
    });
  };
  if (!isLoading && recommended.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", "data-ocid": "recommendations-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 20, className: "text-accent" }),
          "Just For You"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isPersonalized ? "Based on your recent browsing" : "Trending picks you'll love" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => scrollBy("left"),
              disabled: !canScrollLeft,
              "aria-label": "Scroll recommendations left",
              className: "p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200",
              "data-ocid": "rec-scroll-left",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => scrollBy("right"),
              disabled: !canScrollRight,
              "aria-label": "Scroll recommendations right",
              className: "p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200",
              "data-ocid": "rec-scroll-right",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/products",
            search: {
              q: void 0,
              sort: void 0,
              minPrice: void 0,
              maxPrice: void 0
            },
            className: "flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium transition-colors duration-200",
            "data-ocid": "rec-view-all",
            children: [
              "View All Deals",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-hidden pb-4", children: Array.from({ length: 5 }, (_, i) => `sk-rec-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-shrink-0 w-56 rounded-xl overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-full rounded-full" })
          ] })
        ]
      },
      id
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: carouselRef,
        className: "recommendation-carousel",
        style: { scrollbarWidth: "none" },
        "data-ocid": "recommendations-carousel",
        children: recommended.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: idx * 0.06, duration: 0.35 },
            className: "recommendation-card flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProductCard,
                {
                  product,
                  onClick: () => navigate({
                    to: "/products/$productId",
                    params: { productId: product.id.toString() }
                  }),
                  className: "h-full"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/products/$productId",
                  params: { productId: product.id.toString() },
                  className: "mt-2 flex items-center justify-center gap-1.5 w-full text-xs font-semibold py-2 px-3 rounded-full border border-accent/40 text-accent hover:bg-accent/10 transition-all duration-200",
                  "data-ocid": `rec-compare-${product.id}`,
                  "aria-label": `Compare prices for ${product.title}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11, className: "flex-shrink-0" }),
                    "Compare Prices ↗"
                  ]
                }
              )
            ]
          },
          product.id.toString()
        ))
      }
    )
  ] });
}
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingProducts, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HotDealsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RecommendationsCarousel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryHighlights, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FlashDeals, {})
  ] });
}
const HomePage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HomePage,
  trackCategoryVisit
}, Symbol.toStringTag, { value: "Module" }));
export {
  ArrowLeft as A,
  HomePage$1 as H,
  trackCategoryVisit as t
};
