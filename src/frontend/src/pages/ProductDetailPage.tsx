import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPlatformLinks,
  useProduct,
  useRecordClick,
  useRecordPlatformClick,
  useRelatedProducts,
} from "@/hooks/useBackend";
import type { PlatformLink } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  ExternalLink,
  Flame,
  Share2,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { trackCategoryVisit } from "./HomePage";

const NAV_TO_PRODUCTS = {
  to: "/products" as const,
  search: {
    q: undefined as string | undefined,
    sort: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  },
};

// ─── Platform badge colours ───────────────────────────────────────────────────
const PLATFORM_CLASS: Record<string, string> = {
  amazon: "source-badge-amazon",
  flipkart: "source-badge-flipkart",
  meesho: "source-badge-meesho",
  myntra: "source-badge-myntra",
  jiomart: "source-badge-jiomart",
  instamart: "source-badge-instamart",
  prepkart: "source-badge-prepkart",
};

function platformBadgeClass(platform: string) {
  return PLATFORM_CLASS[platform.toLowerCase()] ?? "";
}

// ─── Deal score: discountPercent / 40 * 5, capped at 5 ───────────────────────
function calcDealScore(discountPercent: number): number {
  return Math.min(5, Math.round((discountPercent / 40) * 5 * 10) / 10);
}

function StarRating({ score }: { score: number }) {
  const filled = Math.round(score);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={13}
          className={
            n <= filled
              ? "text-accent fill-accent"
              : "text-muted-foreground fill-transparent"
          }
        />
      ))}
    </div>
  );
}

// ─── Mobile platform card (stacked layout < 768px) ───────────────────────────
function PlatformCard({
  link,
  isBest,
  highestPrice,
  onBuyNow,
}: {
  link: PlatformLink;
  isBest: boolean;
  highestPrice: number;
  onBuyNow: (link: PlatformLink) => void;
}) {
  const discount = Number(link.discountPercent);
  const savings = highestPrice - link.price;
  const score = calcDealScore(discount);

  return (
    <div
      className={`rounded-xl p-4 bg-card border border-border transition-smooth ${isBest ? "best-deal-highlight" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${platformBadgeClass(link.platform)}`}
          >
            {link.platform}
          </span>
          {isBest && (
            <span className="flex items-center gap-1 deal-score-badge text-xs">
              <Award size={11} />
              Best Deal
            </span>
          )}
        </div>
        <StarRating score={score} />
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="price-current">
          ₹{link.price.toLocaleString("en-IN")}
        </span>
        {link.originalPrice > link.price && (
          <span className="price-original">
            ₹{link.originalPrice.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        {discount > 0 && (
          <span className="badge-discount text-xs">{discount}% OFF</span>
        )}
        {savings > 0 && (
          <span className="savings-badge">
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <Button
        className="w-full buy-now-btn rounded-full h-10 text-sm font-bold"
        onClick={() => onBuyNow(link)}
        data-ocid={`platform-buy-${link.platform.toLowerCase()}`}
      >
        <ExternalLink size={14} className="mr-1.5" />
        Buy on {link.platform}
      </Button>
    </div>
  );
}

// ─── Main comparison table ────────────────────────────────────────────────────
function PriceComparisonTable({
  productId,
  links,
}: {
  productId: bigint;
  links: PlatformLink[];
}) {
  const recordPlatformClick = useRecordPlatformClick();

  const sorted = [...links].sort((a, b) => a.price - b.price);
  const bestLink = sorted[0];
  const highestPrice = Math.max(...links.map((l) => l.price));

  const handleBuyNow = (link: PlatformLink) => {
    recordPlatformClick.mutate({ productId, platform: link.platform });
    window.open(link.affiliateLink, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-12"
      aria-label="Price comparison table"
    >
      {/* Section header */}
      <div className="mb-4">
        <h2 className="font-display font-bold text-xl text-foreground">
          Compare Prices — Find The Best Deal
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Available on {links.length} platform{links.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block rounded-xl overflow-hidden border border-border">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Price</th>
              <th>Original</th>
              <th>Discount</th>
              <th>You Save</th>
              <th>Deal Score</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((link) => {
              const isBest = link.platform === bestLink.platform;
              const discount = Number(link.discountPercent);
              const savings = highestPrice - link.price;
              const score = calcDealScore(discount);

              return (
                <tr
                  key={link.platform}
                  className={isBest ? "best-deal-highlight" : ""}
                >
                  {/* Platform */}
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${platformBadgeClass(link.platform)}`}
                      >
                        {link.platform}
                      </span>
                      {isBest && (
                        <span className="deal-score-badge flex items-center gap-1">
                          <Award size={10} />
                          Best Deal
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Current price */}
                  <td>
                    <span className="price-current">
                      ₹{link.price.toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Original price */}
                  <td>
                    {link.originalPrice > link.price ? (
                      <span className="price-original">
                        ₹{link.originalPrice.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>

                  {/* Discount % */}
                  <td>
                    {discount > 0 ? (
                      <span className="badge-discount">{discount}%</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>

                  {/* Savings vs highest */}
                  <td>
                    {savings > 0 ? (
                      <span className="savings-badge">
                        ₹{savings.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>

                  {/* Deal score */}
                  <td>
                    <StarRating score={score} />
                  </td>

                  {/* Buy Now */}
                  <td>
                    <Button
                      size="sm"
                      className="buy-now-btn rounded-full text-xs px-4 h-8 whitespace-nowrap"
                      onClick={() => handleBuyNow(link)}
                      data-ocid={`platform-buy-${link.platform.toLowerCase()}`}
                    >
                      <ExternalLink size={12} className="mr-1" />
                      Buy Now
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards (< md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {sorted.map((link) => (
          <PlatformCard
            key={link.platform}
            link={link}
            isBest={link.platform === bestLink.platform}
            highestPrice={highestPrice}
            onBuyNow={handleBuyNow}
          />
        ))}
      </div>
    </motion.section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const navigate = useNavigate();
  const recordClick = useRecordClick();

  const id = BigInt(productId);
  const { data: product, isLoading } = useProduct(id);
  const { data: related = [] } = useRelatedProducts(id, 6);
  const { data: platformLinks = [] } = useGetPlatformLinks(id);

  const hasComparison = platformLinks.length >= 2;

  // Track category browsing for "Just For You" recommendations
  useEffect(() => {
    if (product?.categoryId !== undefined) {
      trackCategoryVisit(product.categoryId);
    }
  }, [product?.categoryId]);

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
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <Layout showCategoryNav={false}>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-6 w-24 mb-6 rounded-full" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showCategoryNav={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-display font-bold text-xl mb-2">
            Product not found
          </h2>
          <p className="text-muted-foreground mb-6">
            This product may have been removed or the link is incorrect.
          </p>
          <Button
            className="btn-primary rounded-full"
            onClick={() => navigate(NAV_TO_PRODUCTS)}
          >
            Browse All Products
          </Button>
        </div>
      </Layout>
    );
  }

  const discount = Number(product.discountPercent);
  const savings = product.originalPrice - product.price;

  return (
    <Layout showCategoryNav={false}>
      <div className="max-w-4xl mx-auto">
        {/* Back nav */}
        <button
          type="button"
          onClick={() => navigate(NAV_TO_PRODUCTS)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          data-ocid="product-back"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        {/* Product hero */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            {discount > 0 && (
              <div className="absolute top-4 left-4 badge-discount text-sm px-3 py-1">
                {discount}% OFF
              </div>
            )}
            {product.isTrending && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                <Flame size={14} />
                Trending
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize text-xs">
                {product.affiliateSource}
              </Badge>
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3 leading-tight">
              {product.title}
            </h1>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Pricing block */}
            <div className="bg-muted/40 rounded-xl p-4 mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display font-bold text-3xl text-foreground">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-accent font-semibold">
                  You save ₹{savings.toLocaleString("en-IN")} ({discount}% off)
                </p>
              )}
              {Number(product.clickCount) > 10 && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Star size={14} className="text-accent fill-accent" />
                  <span>
                    {Number(product.clickCount).toLocaleString()} people bought
                    this
                  </span>
                </div>
              )}
            </div>

            {/* Single Buy Now — shown only when no comparison table */}
            {!hasComparison && (
              <div className="flex gap-3">
                <Button
                  className="flex-1 btn-primary h-12 text-base rounded-full"
                  onClick={handleBuyNow}
                  data-ocid="product-buy-now"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Buy on {product.affiliateSource}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={handleShare}
                  aria-label="Share product"
                  data-ocid="product-share"
                >
                  <Share2 size={18} />
                </Button>
              </div>
            )}

            {/* Share when comparison is visible */}
            {hasComparison && (
              <Button
                variant="outline"
                size="sm"
                className="self-start rounded-full"
                onClick={handleShare}
                aria-label="Share product"
                data-ocid="product-share"
              >
                <Share2 size={15} className="mr-1.5" />
                Share
              </Button>
            )}

            <p className="text-xs text-muted-foreground mt-3 text-center">
              * Affiliate link — we may earn a commission at no extra cost to
              you
            </p>
          </motion.div>
        </div>

        {/* Price comparison table (2+ platform links) */}
        {hasComparison && (
          <PriceComparisonTable productId={product.id} links={platformLinks} />
        )}

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-xl mb-4">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((rp, idx) => (
                <motion.div
                  key={rp.id.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <ProductCard
                    product={rp}
                    onClick={() =>
                      navigate({
                        to: "/products/$productId",
                        params: { productId: rp.id.toString() },
                      })
                    }
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
