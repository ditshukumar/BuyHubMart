import { d as createLucideIcon, e as useParams, u as useNavigate, f as useRecordClick, g as useProduct, h as useRelatedProducts, i as useGetPlatformLinks, r as reactExports, j as jsxRuntimeExports, L as Layout, c as Skeleton, B as Button, m as motion, F as Flame, k as Badge, l as useRecordPlatformClick } from "./index-BofEUEVK.js";
import { P as ProductCard } from "./ProductCard-FZ47kx5o.js";
import { t as trackCategoryVisit, A as ArrowLeft } from "./HomePage-TJ7NU2Pz.js";
import { S as Star, E as ExternalLink } from "./star-qDrkQOkP.js";
import "./zap-Bb7GOUaR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
const NAV_TO_PRODUCTS = {
  to: "/products",
  search: {
    q: void 0,
    sort: void 0,
    minPrice: void 0,
    maxPrice: void 0
  }
};
const PLATFORM_CLASS = {
  amazon: "source-badge-amazon",
  flipkart: "source-badge-flipkart",
  meesho: "source-badge-meesho",
  myntra: "source-badge-myntra",
  jiomart: "source-badge-jiomart",
  instamart: "source-badge-instamart",
  prepkart: "source-badge-prepkart"
};
function platformBadgeClass(platform) {
  return PLATFORM_CLASS[platform.toLowerCase()] ?? "";
}
function calcDealScore(discountPercent) {
  return Math.min(5, Math.round(discountPercent / 40 * 5 * 10) / 10);
}
function StarRating({ score }) {
  const filled = Math.round(score);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", "aria-label": `${score} out of 5`, children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      size: 13,
      className: n <= filled ? "text-accent fill-accent" : "text-muted-foreground fill-transparent"
    },
    n
  )) });
}
function PlatformCard({
  link,
  isBest,
  highestPrice,
  onBuyNow
}) {
  const discount = Number(link.discountPercent);
  const savings = highestPrice - link.price;
  const score = calcDealScore(discount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl p-4 bg-card border border-border transition-smooth ${isBest ? "best-deal-highlight" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-bold px-2 py-1 rounded-full ${platformBadgeClass(link.platform)}`,
                children: link.platform
              }
            ),
            isBest && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 deal-score-badge text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 11 }),
              "Best Deal"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { score })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "price-current", children: [
            "₹",
            link.price.toLocaleString("en-IN")
          ] }),
          link.originalPrice > link.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "price-original", children: [
            "₹",
            link.originalPrice.toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-discount text-xs", children: [
            discount,
            "% OFF"
          ] }),
          savings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "savings-badge", children: [
            "Save ₹",
            savings.toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "w-full buy-now-btn rounded-full h-10 text-sm font-bold",
            onClick: () => onBuyNow(link),
            "data-ocid": `platform-buy-${link.platform.toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14, className: "mr-1.5" }),
              "Buy on ",
              link.platform
            ]
          }
        )
      ]
    }
  );
}
function PriceComparisonTable({
  productId,
  links
}) {
  const recordPlatformClick = useRecordPlatformClick();
  const sorted = [...links].sort((a, b) => a.price - b.price);
  const bestLink = sorted[0];
  const highestPrice = Math.max(...links.map((l) => l.price));
  const handleBuyNow = (link) => {
    recordPlatformClick.mutate({ productId, platform: link.platform });
    window.open(link.affiliateLink, "_blank", "noopener,noreferrer");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.4 },
      className: "mb-12",
      "aria-label": "Price comparison table",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "Compare Prices — Find The Best Deal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
            "Available on ",
            links.length,
            " platform",
            links.length !== 1 ? "s" : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-xl overflow-hidden border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "comparison-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Platform" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Original" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Discount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "You Save" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Deal Score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((link) => {
            const isBest = link.platform === bestLink.platform;
            const discount = Number(link.discountPercent);
            const savings = highestPrice - link.price;
            const score = calcDealScore(discount);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: isBest ? "best-deal-highlight" : "",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs font-bold px-2 py-1 rounded-full ${platformBadgeClass(link.platform)}`,
                        children: link.platform
                      }
                    ),
                    isBest && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "deal-score-badge flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 10 }),
                      "Best Deal"
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "price-current", children: [
                    "₹",
                    link.price.toLocaleString("en-IN")
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: link.originalPrice > link.price ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "price-original", children: [
                    "₹",
                    link.originalPrice.toLocaleString("en-IN")
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: discount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-discount", children: [
                    discount,
                    "%"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: savings > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "savings-badge", children: [
                    "₹",
                    savings.toLocaleString("en-IN")
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { score }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "buy-now-btn rounded-full text-xs px-4 h-8 whitespace-nowrap",
                      onClick: () => handleBuyNow(link),
                      "data-ocid": `platform-buy-${link.platform.toLowerCase()}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12, className: "mr-1" }),
                        "Buy Now"
                      ]
                    }
                  ) })
                ]
              },
              link.platform
            );
          }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:hidden", children: sorted.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          PlatformCard,
          {
            link,
            isBest: link.platform === bestLink.platform,
            highestPrice,
            onBuyNow: handleBuyNow
          },
          link.platform
        )) })
      ]
    }
  );
}
function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const navigate = useNavigate();
  const recordClick = useRecordClick();
  const id = BigInt(productId);
  const { data: product, isLoading } = useProduct(id);
  const { data: related = [] } = useRelatedProducts(id, 6);
  const { data: platformLinks = [] } = useGetPlatformLinks(id);
  const hasComparison = platformLinks.length >= 2;
  reactExports.useEffect(() => {
    if ((product == null ? void 0 : product.categoryId) !== void 0) {
      trackCategoryVisit(product.categoryId);
    }
  }, [product == null ? void 0 : product.categoryId]);
  const handleBuyNow = () => {
    if (!product) return;
    recordClick.mutate(product.id);
    window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
  };
  const handleShare = async () => {
    if (!product) return;
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showCategoryNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 mb-6 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-full" })
        ] })
      ] })
    ] }) });
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showCategoryNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "😕" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-2", children: "Product not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "This product may have been removed or the link is incorrect." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "btn-primary rounded-full",
          onClick: () => navigate(NAV_TO_PRODUCTS),
          children: "Browse All Products"
        }
      )
    ] }) });
  }
  const discount = Number(product.discountPercent);
  const savings = product.originalPrice - product.price;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showCategoryNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate(NAV_TO_PRODUCTS),
        className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors",
        "data-ocid": "product-back",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
          "Back to Products"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.4 },
          className: "relative",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-2xl overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: product.imageUrl,
                alt: product.title,
                className: "w-full h-full object-cover",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ) }),
            discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 badge-discount text-sm px-3 py-1", children: [
              discount,
              "% OFF"
            ] }),
            product.isTrending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 14 }),
              "Trending"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.4, delay: 0.1 },
          className: "flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize text-xs", children: product.affiliateSource }),
              product.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: tag }, tag))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground mb-3 leading-tight", children: product.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 leading-relaxed", children: product.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-3xl text-foreground", children: [
                  "₹",
                  product.price.toLocaleString("en-IN")
                ] }),
                product.originalPrice > product.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg text-muted-foreground line-through", children: [
                  "₹",
                  product.originalPrice.toLocaleString("en-IN")
                ] })
              ] }),
              savings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-accent font-semibold", children: [
                "You save ₹",
                savings.toLocaleString("en-IN"),
                " (",
                discount,
                "% off)"
              ] }),
              Number(product.clickCount) > 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, className: "text-accent fill-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  Number(product.clickCount).toLocaleString(),
                  " people bought this"
                ] })
              ] })
            ] }),
            !hasComparison && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "flex-1 btn-primary h-12 text-base rounded-full",
                  onClick: handleBuyNow,
                  "data-ocid": "product-buy-now",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 18, className: "mr-2" }),
                    "Buy on ",
                    product.affiliateSource
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "h-12 w-12 rounded-full",
                  onClick: handleShare,
                  "aria-label": "Share product",
                  "data-ocid": "product-share",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 18 })
                }
              )
            ] }),
            hasComparison && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "self-start rounded-full",
                onClick: handleShare,
                "aria-label": "Share product",
                "data-ocid": "product-share",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 15, className: "mr-1.5" }),
                  "Share"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3 text-center", children: "* Affiliate link — we may earn a commission at no extra cost to you" })
          ]
        }
      )
    ] }),
    hasComparison && /* @__PURE__ */ jsxRuntimeExports.jsx(PriceComparisonTable, { productId: product.id, links: platformLinks }),
    related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-4", children: "You might also like" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: related.map((rp, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: idx * 0.06 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductCard,
            {
              product: rp,
              onClick: () => navigate({
                to: "/products/$productId",
                params: { productId: rp.id.toString() }
              }),
              className: "h-full"
            }
          )
        },
        rp.id.toString()
      )) })
    ] })
  ] }) });
}
export {
  ProductDetailPage as default
};
