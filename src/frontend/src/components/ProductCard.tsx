import { Button } from "@/components/ui/button";
import { useRecordClick, useRecordPlatformClick } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { PlatformLink, Product } from "@/types";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Flame, Layers, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

const SOURCE_COLORS: Record<string, string> = {
  amazon: "source-badge-amazon",
  flipkart: "source-badge-flipkart",
  meesho: "source-badge-meesho",
  myntra: "source-badge-myntra",
  jiomart: "source-badge-jiomart",
  instamart: "source-badge-instamart",
  prepkart: "source-badge-prepkart",
};

export function detectPlatformFromUrl(url: string, fallback: string): string {
  if (!url) return fallback || "Shop Now";
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (hostname.includes("amazon")) return "Amazon";
    if (hostname.includes("flipkart")) return "Flipkart";
    if (hostname.includes("meesho")) return "Meesho";
    if (hostname.includes("myntra")) return "Myntra";
    if (hostname.includes("jiomart")) return "JioMart";
    if (hostname.includes("swiggy") || hostname.includes("instamart"))
      return "Instamart";
    if (hostname.includes("prepkart")) return "Prepkart";
  } catch {
    // invalid URL — fall through to fallback
  }
  return fallback || "Shop Now";
}

export function ProductImageFallback({
  title,
  hasUrl,
}: {
  title: string;
  hasUrl: boolean;
}) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.06 38 / 0.8), oklch(0.22 0.08 25 / 0.9))",
      }}
    >
      <span
        className="text-3xl font-display font-black tracking-wide"
        style={{ color: "oklch(0.75 0.18 38)" }}
      >
        {initials || "🛍"}
      </span>
      {hasUrl && (
        <span className="text-xs text-white/40 px-2 text-center leading-tight">
          Image unavailable
        </span>
      )}
    </div>
  );
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const recordClick = useRecordClick();
  const recordPlatformClick = useRecordPlatformClick();

  // Normalise platformLinks — legacy products may not have this field
  const platformLinks: PlatformLink[] = product.platformLinks ?? [];
  const hasMultiplePlatforms = platformLinks.length >= 2;

  // Lowest price across platform links (if available), otherwise fall back to product.price
  const lowestPlatformPrice = hasMultiplePlatforms
    ? Math.min(...platformLinks.map((pl) => pl.price))
    : null;

  // Best-platform link (lowest price) for the primary CTA
  const bestPlatformLink = hasMultiplePlatforms
    ? platformLinks.reduce((a, b) => (a.price <= b.price ? a : b))
    : null;

  const displayPrice = lowestPlatformPrice ?? product.price;
  const displayOriginalPrice = hasMultiplePlatforms
    ? (bestPlatformLink?.originalPrice ?? product.originalPrice)
    : product.originalPrice;

  const discount = hasMultiplePlatforms
    ? (bestPlatformLink?.discountPercent ?? Number(product.discountPercent))
    : Number(product.discountPercent);

  const savings =
    displayOriginalPrice > displayPrice
      ? displayOriginalPrice - displayPrice
      : 0;

  // Single-platform fallback (original logic)
  const detectedPlatform = hasMultiplePlatforms
    ? detectPlatformFromUrl(
        bestPlatformLink?.affiliateLink ?? "",
        bestPlatformLink?.platform ?? "",
      )
    : detectPlatformFromUrl(product.affiliateLink, product.affiliateSource);

  const sourceKey = detectedPlatform.toLowerCase().replace(/\s+/g, "");
  const sourceBadgeClass =
    SOURCE_COLORS[sourceKey] ?? "bg-muted text-muted-foreground";

  // Best deal badge — show best platform name + price (only for multi-platform)
  const bestDealPlatformName = bestPlatformLink
    ? detectPlatformFromUrl(
        bestPlatformLink.affiliateLink,
        bestPlatformLink.platform,
      )
    : null;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasMultiplePlatforms && bestPlatformLink) {
      recordPlatformClick.mutate({
        productId: product.id,
        platform: bestPlatformLink.platform,
      });
      window.open(
        bestPlatformLink.affiliateLink,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (!product.affiliateLink) {
      toast.error("Link not available", {
        description: "This product does not have a buy link yet.",
        duration: 4000,
      });
      return;
    }

    recordClick.mutate(product.id);
    window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn(
        "group bg-card rounded-xl border border-border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-elevated hover:border-accent/40",
        hasMultiplePlatforms ? "min-h-[480px]" : "min-h-[420px]",
        className,
      )}
      data-ocid={`product-card-${product.id}`}
    >
      {/* Image zone — clickable to detail */}
      <button
        type="button"
        onClick={onClick}
        className="relative aspect-square overflow-hidden bg-muted text-left w-full cursor-pointer"
        aria-label={`View details for ${product.title}`}
      >
        {!imgError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              imgLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        ) : (
          <ProductImageFallback
            title={product.title}
            hasUrl={!!product.imageUrl}
          />
        )}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Badges — top-left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge-discount" aria-label={`${discount}% off`}>
              {discount}% OFF
            </span>
          )}
          {product.isTrending && (
            <span className="flex items-center gap-0.5 bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold">
              <Flame size={10} />
              Hot
            </span>
          )}
        </div>

        {/* Top-right: multi-platform count badge OR single platform badge */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {hasMultiplePlatforms ? (
            <span
              className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold"
              title={`Available on ${platformLinks.length} platforms`}
            >
              <Layers size={10} />
              {platformLinks.length} platforms
            </span>
          ) : (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-bold",
                sourceBadgeClass,
              )}
            >
              {detectedPlatform}
            </span>
          )}
        </div>

        {/* Glossy hover overlay — shimmer/light effect only, no rotation */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* Content zone */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <button type="button" onClick={onClick} className="text-left">
          <h3
            className="product-title text-sm leading-snug hover:text-accent transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>
        </button>

        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-auto flex-wrap">
          <span className="font-display font-bold text-lg text-foreground">
            {hasMultiplePlatforms ? "From " : ""}₹
            {displayPrice.toLocaleString("en-IN")}
          </span>
          {displayOriginalPrice > displayPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{displayOriginalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {savings > 0 && (
            <span
              className="text-xs font-semibold ml-auto"
              style={{ color: "oklch(0.72 0.16 145)" }}
            >
              Save ₹{savings.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Best Deal badge — only for multi-platform products */}
        {hasMultiplePlatforms && bestPlatformLink && bestDealPlatformName && (
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit"
            style={{
              background: "oklch(0.20 0.05 60 / 0.75)",
              border: "1px solid oklch(0.70 0.18 60 / 0.30)",
            }}
            data-ocid={`best-deal-badge-${product.id}`}
          >
            <Trophy
              size={11}
              style={{ color: "oklch(0.82 0.16 65)", flexShrink: 0 }}
            />
            <span
              className="text-xs font-semibold leading-none"
              style={{ color: "oklch(0.88 0.14 62)" }}
            >
              Best:{" "}
              <span style={{ color: "oklch(0.82 0.18 55)" }}>
                {bestDealPlatformName}
              </span>{" "}
              ₹{bestPlatformLink.price.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Extra platforms hint */}
        {hasMultiplePlatforms && platformLinks.length > 1 && (
          <p
            className="text-xs text-muted-foreground"
            data-ocid={`platform-hint-${product.id}`}
          >
            +{platformLinks.length - 1} more platform
            {platformLinks.length - 1 > 1 ? "s" : ""} available
          </p>
        )}

        {/* Popularity */}
        {Number(product.clickCount) > 10 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={12} className="text-accent fill-accent" />
            <span>
              {Number(product.clickCount).toLocaleString()} bought this
            </span>
          </div>
        )}

        {/* CTA — prominent Buy Now button */}
        <Button
          onClick={handleBuyNow}
          className="w-full mt-1 h-10 text-base font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 buy-now-btn"
          data-ocid={`buy-now-${product.id}`}
          aria-label={`Buy ${product.title} on ${detectedPlatform}`}
        >
          <ExternalLink size={15} className="mr-1.5 flex-shrink-0" />
          Buy on {detectedPlatform} →
        </Button>

        {/* Compare Prices CTA — only shown for multi-platform products */}
        {hasMultiplePlatforms && (
          <Link
            to="/products/$productId"
            params={{ productId: product.id.toString() }}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-8 text-xs font-semibold rounded-full border transition-all duration-200 hover:bg-accent/10 hover:border-accent/60 hover:text-accent active:scale-95 flex items-center justify-center gap-1 border-primary/30 text-primary/70"
            data-ocid={`compare-prices-${product.id}`}
            aria-label={`Compare prices for ${product.title}`}
          >
            Compare Prices ↗
          </Link>
        )}
      </div>
    </article>
  );
}
