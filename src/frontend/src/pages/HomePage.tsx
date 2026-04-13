import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useHotDeals, useProducts } from "@/hooks/useBackend";
import type { Product } from "@/types";
import { DEFAULT_FILTER } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Flame,
  Shield,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── Constants ────────────────────────────────────────────────────────────────

const FEATURE_BADGES = [
  { icon: TrendingUp, label: "Trending Daily", color: "text-accent" },
  { icon: Shield, label: "Verified Deals", color: "text-secondary" },
  { icon: Truck, label: "Fast Delivery", color: "text-accent" },
];

const STATS = [
  { value: "50+", label: "Products Compared", emoji: "🔍" },
  { value: "7 Stores", label: "Amazon, Flipkart & More", emoji: "🏪" },
  { value: "60%", label: "Save up to 60%", emoji: "💰" },
];

const DEAL_BADGES = [
  { text: "Amazon Deal 🔥", hue: "65" },
  { text: "Flipkart Exclusive ⚡", hue: "260" },
  { text: "Today Only 💥", hue: "25" },
  { text: "Limited Stock ⏰", hue: "38" },
  { text: "Best Seller 🏆", hue: "140" },
  { text: "Flash Sale 🎯", hue: "25" },
  { text: "Top Rated ⭐", hue: "65" },
  { text: "Gen Z Pick 😎", hue: "260" },
];

const PUNCHY_LINES = [
  { emoji: "🔥", text: "Compare All Platforms Instantly" },
  { emoji: "⚡", text: "Prices Updated Daily" },
  { emoji: "💯", text: "100% Verified Affiliate Links" },
  { emoji: "🎯", text: "Best Deal Highlighted for You" },
];

const PLATFORM_BADGES = [
  { name: "Amazon", emoji: "🛒", hue: "65" },
  { name: "Flipkart", emoji: "📦", hue: "260" },
  { name: "Myntra", emoji: "👗", hue: "355" },
  { name: "Meesho", emoji: "🛍️", hue: "320" },
  { name: "Prepkart", emoji: "📱", hue: "200" },
  { name: "JioMart", emoji: "🟢", hue: "145" },
  { name: "Instamart", emoji: "⚡", hue: "45" },
];

const BROWSED_CATEGORIES_KEY = "browsed_categories";
const MAX_BROWSED = 10;

// ── Browsing History Helpers ──────────────────────────────────────────────────

export function trackCategoryVisit(categoryId: bigint) {
  try {
    const raw = sessionStorage.getItem(BROWSED_CATEGORIES_KEY);
    const existing: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const idStr = categoryId.toString();
    const updated = [idStr, ...existing.filter((id) => id !== idStr)].slice(
      0,
      MAX_BROWSED,
    );
    sessionStorage.setItem(BROWSED_CATEGORIES_KEY, JSON.stringify(updated));
  } catch {
    // sessionStorage unavailable — silently ignore
  }
}

function getBrowsedCategoryIds(): string[] {
  try {
    const raw = sessionStorage.getItem(BROWSED_CATEGORIES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBestPlatformLink(product: Product) {
  const links = product.platformLinks ?? [];
  if (links.length === 0) return null;
  return links.reduce((a, b) => (a.price <= b.price ? a : b));
}

function getLowestPlatformPrice(product: Product): number | null {
  const links = product.platformLinks ?? [];
  if (links.length === 0) return null;
  return Math.min(...links.map((pl) => pl.price));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MarqueeBadges() {
  const doubled = [...DEAL_BADGES, ...DEAL_BADGES];
  return (
    <div className="overflow-hidden w-full" aria-hidden="true">
      <div
        className="flex gap-2 w-max"
        style={{ animation: "marquee-scroll 12s linear infinite" }}
      >
        {doubled.map(({ text, hue }, i) => (
          <span
            key={`badge-${i}-${hue}`}
            className="whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full border"
            style={{
              background: `oklch(0.95 0.08 ${hue} / 0.25)`,
              borderColor: "oklch(0.98 0 0 / 0.35)",
              color: "oklch(0.98 0 0)",
              boxShadow: "0 0 8px oklch(0.98 0 0 / 0.15)",
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroRightColumn() {
  return (
    <div
      className="hidden md:flex flex-col gap-5 justify-center items-center min-w-0 flex-1 rounded-2xl px-6 py-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.62 0.22 38), oklch(0.52 0.20 25), oklch(0.42 0.18 38))",
        boxShadow:
          "0 0 40px oklch(0.65 0.22 38 / 0.5), 0 0 80px oklch(0.55 0.20 25 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.15)",
      }}
    >
      {/* Glowing stat cards */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {STATS.map(({ value, label, emoji }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
            className="flex items-center gap-4 rounded-2xl px-5 py-3 border"
            style={{
              background: "oklch(1 0 0 / 0.12)",
              borderColor: "oklch(1 0 0 / 0.25)",
              boxShadow:
                "0 4px 20px oklch(0 0 0 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="text-2xl">{emoji}</span>
            <div>
              <p
                className="font-display font-black text-2xl leading-none text-white"
                style={{ textShadow: "0 0 14px oklch(1 0 0 / 0.4)" }}
              >
                {value}
              </p>
              <p className="text-xs text-white/80 mt-0.5 font-medium">
                {label}
              </p>
            </div>
            <span className="ml-auto flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white/60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          </motion.div>
        ))}
      </div>

      {/* Punchy tagline lines */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="w-full max-w-xs flex flex-col gap-1.5"
      >
        {PUNCHY_LINES.map(({ emoji, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 + i * 0.1 }}
            className="flex items-center gap-2 text-white/90"
          >
            <span className="text-base leading-none">{emoji}</span>
            <span className="text-sm font-semibold tracking-wide text-white">
              {text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Marquee deal badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="w-full max-w-xs"
      >
        <MarqueeBadges />
      </motion.div>

      {/* Decorative phone mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
        className="relative w-28 h-48 rounded-3xl border-2"
        style={{
          borderColor: "oklch(1 0 0 / 0.4)",
          background:
            "linear-gradient(160deg, oklch(0.35 0.12 38 / 0.8), oklch(0.25 0.10 25 / 0.9), oklch(0.18 0.04 0 / 0.95))",
          boxShadow:
            "0 0 30px oklch(0.8 0.18 38 / 0.4), 0 0 60px oklch(0.6 0.16 25 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.2)",
        }}
        aria-hidden="true"
      >
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full"
          style={{ background: "oklch(1 0 0 / 0.3)" }}
        />
        <div className="absolute inset-3 top-7 rounded-2xl flex flex-col gap-1.5 overflow-hidden">
          {[38, 25, 0].map((hue) => (
            <div
              key={hue}
              className="rounded-lg h-10 w-full"
              style={{
                background: `linear-gradient(90deg, oklch(0.55 0.18 ${hue} / 0.7), oklch(0.40 0.12 ${hue} / 0.4))`,
                boxShadow: `0 0 8px oklch(0.75 0.18 ${hue} / 0.4)`,
              }}
            />
          ))}
          <div
            className="rounded-full h-6 w-3/4 mx-auto mt-1"
            style={{
              background: "oklch(1 0 0 / 0.85)",
              boxShadow: "0 0 10px oklch(1 0 0 / 0.5)",
            }}
          />
        </div>
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full"
          style={{ background: "oklch(1 0 0 / 0.4)" }}
        />
      </motion.div>

      {/* Explore More CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <Link
          to="/products"
          search={{
            q: undefined,
            sort: undefined,
            minPrice: undefined,
            maxPrice: undefined,
          }}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all duration-300 text-white hover:bg-white hover:text-orange-600"
          style={{
            borderColor: "oklch(1 0 0 / 0.7)",
            background: "oklch(1 0 0 / 0.12)",
            boxShadow: "0 0 16px oklch(1 0 0 / 0.2)",
          }}
          data-ocid="hero-explore-more"
        >
          <span>Explore More</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </motion.div>
    </div>
  );
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

function PlatformTrustRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide"
      aria-label="Supported platforms"
    >
      <span className="text-secondary-foreground/60 text-xs font-medium whitespace-nowrap flex-shrink-0">
        Available on:
      </span>
      <div className="flex gap-2 flex-wrap">
        {PLATFORM_BADGES.map(({ name, emoji, hue }) => (
          <span
            key={name}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap flex-shrink-0"
            style={{
              background: `oklch(0.98 0.06 ${hue} / 0.18)`,
              borderColor: `oklch(0.80 0.12 ${hue} / 0.35)`,
              color: "oklch(0.96 0 0)",
            }}
            data-ocid={`platform-badge-${name.toLowerCase()}`}
          >
            <span>{emoji}</span>
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground mb-8">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/assets/generated/hero-deals-banner.dim_1200x600.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Two-column layout */}
      <div className="relative z-10 flex items-stretch px-6 pt-10 md:pt-16 md:px-12 gap-8">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                🔍 Price Comparison
              </span>
            </div>
            <h1 className="hero-text text-secondary-foreground mb-3">
              Compare Prices,
              <br />
              <span className="text-accent">Find The Best Deal</span>
            </h1>
            <p className="text-secondary-foreground/80 text-base mb-4 max-w-md">
              Compare prices across Amazon, Flipkart, Myntra & more — always
              find the lowest price before you buy.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Primary Hero CTA */}
              <button
                type="button"
                onClick={() => navigate(NAV_TO_PRODUCTS)}
                className="hero-cta-primary group flex items-center gap-2 font-display font-bold text-base text-white rounded-full transition-all duration-300 active:scale-95"
                style={{
                  padding: "14px 28px",
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.18 55), oklch(0.55 0.22 30))",
                  boxShadow:
                    "0 0 20px oklch(0.65 0.22 38 / 0.6), 0 4px 16px oklch(0 0 0 / 0.3)",
                  animation: "hero-pulse 2.5s ease-in-out infinite",
                }}
                data-ocid="hero-cta-shop"
              >
                <ShoppingBag size={18} className="flex-shrink-0" />
                Compare Deals Now
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-orange-600 transition-all duration-300 active:scale-95"
                onClick={() =>
                  navigate({
                    to: "/categories/$categorySlug",
                    params: { categorySlug: "trending" },
                  })
                }
                data-ocid="hero-cta-trending"
              >
                <Flame
                  size={16}
                  className="text-red-400 group-hover:text-red-500 flex-shrink-0"
                />
                Trending Now
              </button>
            </div>

            {/* Platform trust badges row */}
            <PlatformTrustRow />
          </motion.div>
        </div>
        {/* Right column */}
        <HeroRightColumn />
      </div>
      {/* Feature badges */}
      <div className="relative z-10 flex flex-wrap gap-3 px-6 md:px-12 py-6">
        {FEATURE_BADGES.map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 bg-card/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
          >
            <Icon size={14} className={color} />
            <span className="text-secondary-foreground text-xs font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Hot Deals Carousel ────────────────────────────────────────────────────────

function HotDealCard({ product, idx }: { product: Product; idx: number }) {
  const navigate = useNavigate();
  const bestLink = getBestPlatformLink(product);
  const lowestPrice = getLowestPlatformPrice(product);
  const displayPrice = lowestPrice ?? product.price;
  const displayOriginal = bestLink?.originalPrice ?? product.originalPrice;
  const discountPct =
    bestLink?.discountPercent ?? Number(product.discountPercent);
  const buyLink = bestLink?.affiliateLink ?? product.affiliateLink;

  const handleGrabDeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buyLink) {
      window.open(buyLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.07, duration: 0.35 }}
      className="flex-shrink-0 w-52 snap-center bg-card rounded-xl border border-border overflow-hidden flex flex-col hover:border-accent/40 hover:shadow-elevated transition-all duration-300 group"
      data-ocid={`hot-deal-card-${product.id}`}
    >
      {/* Image */}
      <button
        type="button"
        className="relative aspect-square overflow-hidden bg-muted w-full cursor-pointer"
        onClick={() =>
          navigate({
            to: "/products/$productId",
            params: { productId: product.id.toString() },
          })
        }
        aria-label={`View ${product.title}`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.06 38 / 0.8), oklch(0.22 0.08 25 / 0.9))",
            }}
          >
            <span
              className="text-3xl font-display font-black"
              style={{ color: "oklch(0.75 0.18 38)" }}
            >
              {product.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Hot deal badge — top-left */}
        {discountPct > 0 && (
          <div className="absolute top-2 left-2">
            <span className="hot-deal-badge">{discountPct}% OFF</span>
          </div>
        )}

        {/* Glossy hover shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3 className="font-display font-bold text-sm line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 flex-wrap mt-auto">
          <span
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.72 0.16 38)" }}
          >
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          {displayOriginal > displayPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{displayOriginal.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Grab Deal CTA */}
        <button
          type="button"
          onClick={handleGrabDeal}
          className="w-full mt-1 h-9 text-sm font-bold rounded-full transition-all duration-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5 buy-now-btn"
          data-ocid={`hot-deal-grab-${product.id}`}
          aria-label={`Grab deal for ${product.title}`}
        >
          <Zap size={13} className="flex-shrink-0" />
          Grab Deal
        </button>
      </div>
    </motion.article>
  );
}

function HotDealsSection() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: hotDeals = [], isLoading } = useHotDeals(6);

  const checkScrollability = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
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

  const scrollBy = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left:
        direction === "left" ? -(el.clientWidth * 0.75) : el.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  // Hide section entirely if no data and not loading
  if (!isLoading && hotDeals.length === 0) return null;

  return (
    <section className="mb-10" data-ocid="hot-deals-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            Hot Deals 🔥
          </h2>
          <p className="text-sm text-muted-foreground">
            Top discounts right now — before they run out
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop nav arrows */}
          <div className="hidden md:flex gap-1">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll hot deals left"
              className="p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200"
              data-ocid="hot-deals-scroll-left"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              aria-label="Scroll hot deals right"
              className="p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200"
              data-ocid="hot-deals-scroll-right"
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(NAV_TO_PRODUCTS)}
            className="text-accent hover:text-accent/80 font-medium"
            data-ocid="hot-deals-see-all"
          >
            See All
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden pb-4">
          {Array.from({ length: 6 }, (_, i) => `sk-hot-${i}`).map((id) => (
            <div
              key={id}
              className="flex-shrink-0 w-52 rounded-xl overflow-hidden"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-9 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
          data-ocid="hot-deals-carousel"
        >
          {hotDeals.map((product, idx) => (
            <HotDealCard
              key={product.id.toString()}
              product={product}
              idx={idx}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Trending Products (with Best Deal badge) ──────────────────────────────────

function TrendingProducts() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts({
    ...DEFAULT_FILTER,
    sortBy: "popular",
  });
  const trending = products.filter((p) => p.isTrending).slice(0, 8);
  const shown = trending.length > 0 ? trending : products.slice(0, 8);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Flame size={20} className="text-red-500 fill-red-500" />
            Trending Now
          </h2>
          <p className="text-sm text-muted-foreground">
            Most popular deals today
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(NAV_TO_PRODUCTS)}
          className="text-accent hover:text-accent/80 font-medium"
          data-ocid="trending-see-all"
        >
          See All
          <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => `sk-trend-${i}`).map((id) => (
            <div key={id} className="rounded-xl overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shown.map((product, idx) => {
            const lowestPrice = getLowestPlatformPrice(product);
            const bestLink = getBestPlatformLink(product);
            const hasPlatforms = (product.platformLinks ?? []).length > 0;

            return (
              <motion.div
                key={product.id.toString()}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="relative"
              >
                {/* Best Deal badge */}
                {hasPlatforms && lowestPrice !== null && bestLink && (
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
                    aria-label={`Best deal: ${bestLink.platform} ₹${lowestPrice.toLocaleString("en-IN")}`}
                  >
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{
                        background: "oklch(0.20 0.04 60 / 0.85)",
                        color: "oklch(0.82 0.14 75)",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 0 8px oklch(0.75 0.16 65 / 0.3)",
                      }}
                    >
                      ⭐ Best: {bestLink.platform} ₹
                      {lowestPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

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
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function CategoryHighlights() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const cats =
    categories.length > 0
      ? categories.slice(0, 4)
      : [
          {
            id: BigInt(1),
            name: "Gadgets",
            slug: "gadgets",
            iconName: "gadgets",
          },
          {
            id: BigInt(2),
            name: "Fashion",
            slug: "fashion",
            iconName: "fashion",
          },
          {
            id: BigInt(3),
            name: "Accessories",
            slug: "accessories",
            iconName: "accessories",
          },
          {
            id: BigInt(4),
            name: "Trending",
            slug: "trending",
            iconName: "trending",
          },
        ];

  const icons: Record<string, string> = {
    gadgets: "📱",
    fashion: "👗",
    accessories: "💍",
    trending: "🔥",
  };
  const colors = [
    "bg-accent/10 border-accent/20",
    "bg-secondary/10 border-secondary/20",
    "bg-primary/10 border-primary/20",
    "bg-accent/15 border-accent/30",
  ];

  return (
    <section className="mb-10">
      <h2 className="font-display font-bold text-xl text-foreground mb-4">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cats.map((cat, i) => (
          <motion.button
            type="button"
            key={cat.id.toString()}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            onClick={() =>
              navigate({
                to: "/categories/$categorySlug",
                params: { categorySlug: cat.slug },
              })
            }
            className={`${colors[i % colors.length]} border rounded-xl p-4 text-center hover:shadow-elevated transition-all duration-300 group hover:border-accent/50`}
            style={{
              transition:
                "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.2s ease",
            }}
            data-ocid={`category-highlight-${cat.slug}`}
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-smooth">
              {icons[cat.slug] ?? "🛍️"}
            </div>
            <p className="font-display font-semibold text-sm text-foreground">
              {cat.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-0.5">
              Shop Now
              <ArrowRight
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function FlashDeals() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts({
    ...DEFAULT_FILTER,
    sortBy: "discount",
  });
  const deals = products
    .filter((p) => Number(p.discountPercent) >= 20)
    .slice(0, 4);

  if (!isLoading && deals.length === 0) return null;

  return (
    <section className="mb-10 bg-muted/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Zap size={20} className="text-accent fill-accent" />
            Flash Deals
          </h2>
          <p className="text-sm text-muted-foreground">
            Biggest discounts — limited time
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-accent font-medium"
          onClick={() => navigate(NAV_TO_PRODUCTS)}
          data-ocid="flash-see-all"
        >
          View All <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => `sk-flash-${i}`).map((id) => (
            <Skeleton key={id} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((product, idx) => (
            <motion.div
              key={product.id.toString()}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
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
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Recommendations Carousel ──────────────────────────────────────────────────

function useRecommendedProducts(allProducts: Product[]): Product[] {
  return useMemo(() => {
    const browsedIds = getBrowsedCategoryIds();

    let recommended: Product[] = [];

    if (browsedIds.length > 0) {
      const browsedSet = new Set(browsedIds);
      const fromBrowsed = allProducts.filter((p) =>
        browsedSet.has(p.categoryId.toString()),
      );
      if (fromBrowsed.length >= 4) {
        recommended = fromBrowsed;
      } else {
        const extras = allProducts.filter(
          (p) => !browsedSet.has(p.categoryId.toString()) && p.isTrending,
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: products = [], isLoading } = useProducts({
    ...DEFAULT_FILTER,
    sortBy: "popular",
  });

  const recommended = useRecommendedProducts(products);
  const browsedIds = getBrowsedCategoryIds();
  const isPersonalized = browsedIds.length > 0;

  const checkScrollability = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
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

  const scrollBy = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!isLoading && recommended.length === 0) return null;

  return (
    <section className="mb-10" data-ocid="recommendations-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            Just For You
          </h2>
          <p className="text-sm text-muted-foreground">
            {isPersonalized
              ? "Based on your recent browsing"
              : "Trending picks you'll love"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop nav arrows */}
          <div className="hidden md:flex gap-1">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll recommendations left"
              className="p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200"
              data-ocid="rec-scroll-left"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              aria-label="Scroll recommendations right"
              className="p-2 rounded-full border border-border bg-card hover:bg-muted/40 disabled:opacity-30 transition-colors duration-200"
              data-ocid="rec-scroll-right"
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <Link
            to="/products"
            search={{
              q: undefined,
              sort: undefined,
              minPrice: undefined,
              maxPrice: undefined,
            }}
            className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium transition-colors duration-200"
            data-ocid="rec-view-all"
          >
            View All Deals
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden pb-4">
          {Array.from({ length: 5 }, (_, i) => `sk-rec-${i}`).map((id) => (
            <div
              key={id}
              className="flex-shrink-0 w-56 rounded-xl overflow-hidden"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full rounded-full" />
                <Skeleton className="h-7 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={carouselRef}
          className="recommendation-carousel"
          style={{ scrollbarWidth: "none" }}
          data-ocid="recommendations-carousel"
        >
          {recommended.map((product, idx) => (
            <motion.div
              key={product.id.toString()}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              className="recommendation-card flex flex-col"
            >
              {/* ProductCard */}
              <div className="flex-1">
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
              </div>

              {/* Compare Prices secondary CTA */}
              <Link
                to="/products/$productId"
                params={{ productId: product.id.toString() }}
                className="mt-2 flex items-center justify-center gap-1.5 w-full text-xs font-semibold py-2 px-3 rounded-full border border-accent/40 text-accent hover:bg-accent/10 transition-all duration-200"
                data-ocid={`rec-compare-${product.id}`}
                aria-label={`Compare prices for ${product.title}`}
              >
                <ExternalLink size={11} className="flex-shrink-0" />
                Compare Prices ↗
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <TrendingProducts />
      <HotDealsSection />
      <RecommendationsCarousel />
      <CategoryHighlights />
      <FlashDeals />
    </Layout>
  );
}
