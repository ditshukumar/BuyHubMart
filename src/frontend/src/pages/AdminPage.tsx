import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddProduct,
  useCategories,
  useDeleteProduct,
  useFetchProductMetadata,
  useGetPlatformLinks,
  useIsAdmin,
  useProducts,
  useUpdateProduct,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { DEFAULT_FILTER } from "@/types";
import type { FilterState, PlatformLink } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ImageOff,
  Link2,
  LogIn,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";

// ─── Platform URL auto-detect helper ─────────────────────────────────────────

const PLATFORM_URL_PATTERNS: { pattern: RegExp; platform: string }[] = [
  { pattern: /amazon\.(in|com)/i, platform: "Amazon" },
  { pattern: /flipkart\.com/i, platform: "Flipkart" },
  { pattern: /myntra\.com/i, platform: "Myntra" },
  { pattern: /meesho\.com/i, platform: "Meesho" },
  { pattern: /jiomart\.com/i, platform: "JioMart" },
  { pattern: /swiggy\.com\/instamart|instamart/i, platform: "Instamart" },
  { pattern: /prepkart\.com/i, platform: "Prepkart" },
];

function detectPlatformFromUrl(url: string): string {
  for (const { pattern, platform } of PLATFORM_URL_PATTERNS) {
    if (pattern.test(url)) return platform;
  }
  return "Other";
}

const PLATFORMS = [
  "Amazon",
  "Flipkart",
  "Myntra",
  "Meesho",
  "JioMart",
  "Instamart",
  "Prepkart",
  "Other",
] as const;

// ─── Login prompt (branded) ───────────────────────────────────────────────────

function LoginPrompt() {
  const { login } = useInternetIdentity();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      data-ocid="admin-login-prompt"
    >
      <div
        className="w-full max-w-md rounded-2xl border p-8 shadow-xl"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.14 0.04 20 / 0.95), oklch(0.12 0.03 30 / 0.98))",
          borderColor: "oklch(0.5 0.18 30 / 0.4)",
          boxShadow:
            "0 0 40px oklch(0.55 0.2 30 / 0.15), 0 4px 24px oklch(0 0 0 / 0.4)",
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 38), oklch(0.45 0.2 20))",
              boxShadow: "0 0 24px oklch(0.55 0.22 38 / 0.4)",
            }}
          >
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1
            className="font-display font-black text-2xl tracking-tight"
            style={{ color: "oklch(0.9 0.06 38)" }}
          >
            BuyHub<span style={{ color: "oklch(0.6 0.22 38)" }}>Mart</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: "oklch(0.6 0.06 38)" }}>
            Admin Dashboard
          </p>
        </div>

        <div
          className="w-full h-px mb-6"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.5 0.18 30 / 0.4), transparent)",
          }}
        />

        <h2 className="font-display font-bold text-lg text-foreground mb-2">
          Secure Admin Access
        </h2>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Login with Internet Identity to access your product management
          dashboard. Only authorized admins can enter.
        </p>

        <Button
          className="w-full rounded-xl h-12 text-base font-semibold gap-2 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.22 38), oklch(0.48 0.2 20))",
            boxShadow: "0 4px 16px oklch(0.55 0.22 38 / 0.35)",
          }}
          onClick={handleLogin}
          disabled={isLoggingIn}
          data-ocid="admin-login"
        >
          {isLoggingIn ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Login with Internet Identity
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          🔒 Secure &amp; private — only the site owner can access this area
        </p>
      </div>
    </motion.div>
  );
}

// ─── Not admin ───────────────────────────────────────────────────────────────

function NotAdminView() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center px-4"
      data-ocid="admin-not-admin"
    >
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="font-display font-bold text-xl mb-2">Access Denied</h2>
      <p className="text-muted-foreground mb-2 max-w-sm text-sm">
        You don&apos;t have admin permissions for this site.
      </p>
      <p className="text-muted-foreground mb-6 max-w-sm text-xs">
        If you are the site owner, please go to <strong>/admin/login</strong>{" "}
        and log in with the same Internet Identity you used when you first set
        up admin access.
      </p>
      <Button
        variant="outline"
        onClick={() => navigate({ to: "/" })}
        className="rounded-full"
      >
        Go to Home
      </Button>
    </div>
  );
}

// ─── Connecting spinner ───────────────────────────────────────────────────────

function ConnectingView({
  message = "Connecting to dashboard...",
}: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      data-ocid="admin-connecting"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.22 38 / 0.15), oklch(0.48 0.2 20 / 0.1))",
          border: "2px solid oklch(0.55 0.22 38 / 0.3)",
        }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{
            borderColor:
              "oklch(0.55 0.22 38 / 0.3) oklch(0.55 0.22 38) oklch(0.55 0.22 38) oklch(0.55 0.22 38)",
          }}
        />
      </div>
      <p className="font-semibold text-foreground mb-1">{message}</p>
      <p className="text-sm text-muted-foreground">
        This may take a few seconds on first load.
      </p>
    </div>
  );
}

// ─── Error view ───────────────────────────────────────────────────────────────

function ErrorView({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      data-ocid="admin-error"
    >
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-destructive" />
      </div>
      <h2 className="font-display font-bold text-xl mb-2">
        Dashboard could not load
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        Could not connect to the backend. Please check your connection and try
        again.
      </p>
      <Button
        className="rounded-full"
        onClick={onRetry ?? (() => window.location.reload())}
        data-ocid="admin-retry"
      >
        <RefreshCw size={16} className="mr-2" />
        Refresh and Retry
      </Button>
    </div>
  );
}

// ─── Product form types ───────────────────────────────────────────────────────

interface ProductFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  affiliateLink: string;
  affiliateSource: string;
  categoryId: string;
  tags: string;
  isTrending: boolean;
}

const EMPTY_FORM: ProductFormData = {
  title: "",
  description: "",
  imageUrl: "",
  price: "",
  originalPrice: "",
  discountPercent: "",
  affiliateLink: "",
  affiliateSource: "Amazon",
  categoryId: "",
  tags: "",
  isTrending: false,
};

// ─── Platform link form entry ─────────────────────────────────────────────────

interface PlatformEntry {
  id: string; // local key for React
  platform: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  affiliateLink: string;
}

function emptyPlatformEntry(): PlatformEntry {
  return {
    id: crypto.randomUUID(),
    platform: "Amazon",
    price: "",
    originalPrice: "",
    discountPercent: "",
    affiliateLink: "",
  };
}

function platformEntryFromLink(link: PlatformLink): PlatformEntry {
  return {
    id: crypto.randomUUID(),
    platform: link.platform,
    price: String(link.price),
    originalPrice: String(link.originalPrice),
    discountPercent: String(Number(link.discountPercent)),
    affiliateLink: link.affiliateLink,
  };
}

function platformEntryToLink(entry: PlatformEntry): PlatformLink {
  return {
    platform: entry.platform,
    price: Number.parseFloat(entry.price) || 0,
    originalPrice: Number.parseFloat(entry.originalPrice) || 0,
    discountPercent: BigInt(Number.parseInt(entry.discountPercent) || 0),
    affiliateLink: entry.affiliateLink,
    clickCount: 0n,
  };
}

function validatePlatformEntries(entries: PlatformEntry[]): string | null {
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (!e.affiliateLink || !e.price) {
      return `Platform entry ${i + 1}: Affiliate link and price are required.`;
    }
    if (
      !e.affiliateLink.startsWith("http://") &&
      !e.affiliateLink.startsWith("https://")
    ) {
      return `Platform entry ${i + 1}: Link must start with http:// or https://`;
    }
    if (Number.isNaN(Number.parseFloat(e.price))) {
      return `Platform entry ${i + 1}: Price must be a number.`;
    }
  }
  return null;
}

// ─── Affiliate Platforms Section ──────────────────────────────────────────────

function AffiliatePlatformsSection({
  entries,
  onChange,
  idPrefix,
}: {
  entries: PlatformEntry[];
  onChange: (entries: PlatformEntry[]) => void;
  idPrefix: string;
}) {
  const addEntry = () => onChange([...entries, emptyPlatformEntry()]);

  const removeEntry = (id: string) =>
    onChange(entries.filter((e) => e.id !== id));

  const updateEntry = (id: string, patch: Partial<PlatformEntry>) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const handleLinkChange = (id: string, url: string) => {
    const detected = url ? detectPlatformFromUrl(url) : undefined;
    updateEntry(id, {
      affiliateLink: url,
      ...(detected ? { platform: detected } : {}),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 size={15} className="text-accent" />
          <span className="text-xs font-semibold text-foreground">
            Affiliate Platforms
          </span>
          <span className="text-xs text-muted-foreground">
            ({entries.length})
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs rounded-full gap-1"
          onClick={addEntry}
          data-ocid={`${idPrefix}-add-platform`}
        >
          <Plus size={12} />
          Add Platform
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-1">
          No platform entries yet. Click "Add Platform" to add one.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="rounded-xl border border-border bg-muted/30 p-3 flex flex-col gap-2.5 relative"
              data-ocid={`${idPrefix}-platform-entry-${idx}`}
            >
              {/* Header row: platform select + remove */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label
                    htmlFor={`${idPrefix}-plat-${entry.id}`}
                    className="text-xs font-semibold"
                  >
                    Platform
                  </Label>
                  <select
                    id={`${idPrefix}-plat-${entry.id}`}
                    value={entry.platform}
                    onChange={(e) =>
                      updateEntry(entry.id, { platform: e.target.value })
                    }
                    className="mt-1 w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    data-ocid={`${idPrefix}-platform-select-${idx}`}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="mt-5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Remove platform entry"
                  data-ocid={`${idPrefix}-remove-platform-${idx}`}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Affiliate link */}
              <div>
                <Label
                  htmlFor={`${idPrefix}-link-${entry.id}`}
                  className="text-xs font-semibold"
                >
                  Affiliate Link
                </Label>
                <Input
                  id={`${idPrefix}-link-${entry.id}`}
                  type="url"
                  placeholder="https://amazon.in/..."
                  value={entry.affiliateLink}
                  onChange={(e) => handleLinkChange(entry.id, e.target.value)}
                  className="mt-1 h-8 text-xs font-mono"
                  data-ocid={`${idPrefix}-platform-link-${idx}`}
                />
                {entry.affiliateLink && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ✨ Platform auto-detected:{" "}
                    <strong className="text-accent">
                      {detectPlatformFromUrl(entry.affiliateLink)}
                    </strong>
                  </p>
                )}
              </div>

              {/* Price grid */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label
                    htmlFor={`${idPrefix}-price-${entry.id}`}
                    className="text-xs font-semibold"
                  >
                    Price (₹)
                  </Label>
                  <Input
                    id={`${idPrefix}-price-${entry.id}`}
                    type="number"
                    placeholder="999"
                    value={entry.price}
                    onChange={(e) =>
                      updateEntry(entry.id, { price: e.target.value })
                    }
                    className="mt-1 h-8 text-xs"
                    data-ocid={`${idPrefix}-platform-price-${idx}`}
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`${idPrefix}-origprice-${entry.id}`}
                    className="text-xs font-semibold"
                  >
                    Orig. (₹)
                  </Label>
                  <Input
                    id={`${idPrefix}-origprice-${entry.id}`}
                    type="number"
                    placeholder="1499"
                    value={entry.originalPrice}
                    onChange={(e) =>
                      updateEntry(entry.id, { originalPrice: e.target.value })
                    }
                    className="mt-1 h-8 text-xs"
                    data-ocid={`${idPrefix}-platform-origprice-${idx}`}
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`${idPrefix}-disc-${entry.id}`}
                    className="text-xs font-semibold"
                  >
                    Disc. %
                  </Label>
                  <Input
                    id={`${idPrefix}-disc-${entry.id}`}
                    type="number"
                    placeholder="33"
                    value={entry.discountPercent}
                    onChange={(e) =>
                      updateEntry(entry.id, {
                        discountPercent: e.target.value,
                      })
                    }
                    className="mt-1 h-8 text-xs"
                    data-ocid={`${idPrefix}-platform-disc-${idx}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared form field helper ─────────────────────────────────────────────────

function FormField({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  ocid,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  ocid?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
        required={required}
        data-ocid={ocid}
      />
    </div>
  );
}

function SourceSelect({
  id,
  value,
  onChange,
  ocid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  ocid?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold">
        Source
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
        data-ocid={ocid}
      >
        <option>Amazon</option>
        <option>Flipkart</option>
        <option>Meesho</option>
        <option>Myntra</option>
        <option>JioMart</option>
        <option>Instamart</option>
        <option>Prepkart</option>
        <option>Other</option>
      </select>
    </div>
  );
}

// ─── Image URL field with live preview ───────────────────────────────────────

function ImageUrlField({
  id,
  value,
  onChange,
  ocid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  ocid?: string;
}) {
  const [previewError, setPreviewError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const handleChange = (v: string) => {
    setPreviewError(false);
    setPreviewLoaded(false);
    onChange(v);
  };

  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold">
        Product Image URL
      </Label>
      <Input
        id={id}
        type="text"
        placeholder="https://i.imgur.com/example.jpg"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="mt-1 font-mono text-xs"
        data-ocid={ocid}
      />
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        💡 Paste a <strong>direct image link</strong> ending in .jpg, .png, or
        .webp. Links from Google Images or product pages may not work — use{" "}
        <span className="text-accent font-medium">imgur.com</span> or{" "}
        <span className="text-accent font-medium">postimg.cc</span> for reliable
        hosting.
      </p>
      {value && (
        <div className="mt-2">
          {!previewError ? (
            <div className="relative rounded-lg overflow-hidden border border-border w-24 h-24 bg-muted flex items-center justify-center">
              <img
                src={value}
                alt="Preview"
                referrerPolicy="no-referrer"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-200",
                  previewLoaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setPreviewLoaded(true)}
                onError={() => setPreviewError(true)}
              />
              {!previewLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2">
              <ImageOff
                size={16}
                className="text-destructive flex-shrink-0 mt-0.5"
              />
              <p className="text-xs text-destructive leading-snug">
                Image cannot be loaded. Try a direct image URL ending in .jpg,
                .png, or .webp — or upload to imgur.com first.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Divider with label ───────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground font-medium px-1">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ─── Quick Add from Link component ───────────────────────────────────────────

interface QuickAddFromLinkProps {
  onAutofill: (data: {
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    originalPrice: string;
    discountPercent: string;
    detectedPlatform: string;
    pastedUrl: string;
  }) => void;
  idPrefix: string;
}

function QuickAddFromLink({ onAutofill, idPrefix }: QuickAddFromLinkProps) {
  const [expanded, setExpanded] = useState(false);
  const [url, setUrl] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const fetchMeta = useFetchProductMetadata();

  const handleFetch = async () => {
    if (!url.trim()) return;
    setFetchError(null);
    setFetchSuccess(false);
    try {
      const meta = await fetchMeta.mutateAsync(url.trim());
      onAutofill({
        title: meta.title,
        description: meta.description,
        imageUrl: meta.imageUrl,
        price: meta.price > 0 ? String(meta.price) : "",
        originalPrice: meta.originalPrice > 0 ? String(meta.originalPrice) : "",
        discountPercent:
          meta.discountPercent > 0
            ? String(Math.round(meta.discountPercent))
            : "",
        detectedPlatform: meta.detectedPlatform,
        pastedUrl: url.trim(),
      });
      setUrl("");
      setFetchSuccess(true);
      setTimeout(() => setFetchSuccess(false), 3000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      let hindiMsg: string;
      if (errMsg.includes("redirect_limit") || errMsg.includes("redirect")) {
        hindiMsg =
          "Link ke andar bahut zyada redirects hain. Flipkart/Amazon ke product page ka direct link try karo.";
      } else if (errMsg.includes("blocked")) {
        hindiMsg =
          "Yeh website automated requests block kar rahi hai. Product ka direct page link try karo.";
      } else if (errMsg.includes("no_content")) {
        hindiMsg =
          "Product details nahi mili. Dusra link try karo ya manually fill karo.";
      } else {
        hindiMsg =
          "Is link se details nahi mil sake. Direct product page ka link try karo ya manually fill karo.";
      }
      setFetchError(hindiMsg);
    }
  };

  return (
    <div
      className="rounded-xl border-2 border-dashed overflow-hidden"
      style={{ borderColor: "oklch(0.55 0.22 38 / 0.45)" }}
      data-ocid={`${idPrefix}-quick-add-section`}
    >
      {/* Header / toggle */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors"
        style={{
          background: expanded
            ? "oklch(0.2 0.06 38 / 0.35)"
            : "oklch(0.18 0.05 38 / 0.2)",
        }}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        data-ocid={`${idPrefix}-quick-add-toggle`}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={15} style={{ color: "oklch(0.65 0.22 38)" }} />
          <span
            className="text-sm font-semibold"
            style={{ color: "oklch(0.85 0.16 38)" }}
          >
            Quick Add from Link
          </span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: "oklch(0.55 0.22 38 / 0.25)",
              color: "oklch(0.78 0.2 38)",
              border: "1px solid oklch(0.55 0.22 38 / 0.4)",
            }}
          >
            Auto-fill
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color: "oklch(0.65 0.22 38)" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "oklch(0.65 0.22 38)" }} />
        )}
      </button>

      {/* Body */}
      {expanded && (
        <div
          className="px-3.5 pb-3.5 pt-3 flex flex-col gap-2.5"
          style={{ background: "oklch(0.15 0.04 38 / 0.15)" }}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kisi bhi e-commerce product ka link paste karo — title, price,
            description aur image automatically fill ho jayenge.
          </p>

          <div className="flex gap-2 items-center">
            <Input
              type="url"
              placeholder="Amazon, Flipkart, Myntra ya kisi bhi e-commerce ka product link paste karo..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setFetchError(null);
              }}
              className="flex-1 text-xs font-mono h-9"
              style={{ fontSize: "11px" }}
              disabled={fetchMeta.isPending}
              data-ocid={`${idPrefix}-quick-add-url`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFetch();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              className="h-9 px-3 gap-1.5 flex-shrink-0 font-semibold rounded-lg"
              style={{
                background: fetchSuccess
                  ? "oklch(0.5 0.16 145)"
                  : "linear-gradient(135deg, oklch(0.55 0.22 38), oklch(0.48 0.2 20))",
                boxShadow: "0 2px 8px oklch(0.55 0.22 38 / 0.3)",
                color: "white",
              }}
              onClick={handleFetch}
              disabled={fetchMeta.isPending || !url.trim() || fetchSuccess}
              data-ocid={`${idPrefix}-quick-add-fetch`}
            >
              {fetchMeta.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs">Fetching...</span>
                </>
              ) : fetchSuccess ? (
                <>
                  <CheckCircle2 size={14} />
                  <span className="text-xs">Done!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span className="text-xs">Fetch Details</span>
                </>
              )}
            </Button>
          </div>

          {/* Error message */}
          {fetchError && (
            <div
              className="flex items-start gap-2 rounded-lg px-3 py-2"
              style={{
                background: "oklch(0.45 0.2 25 / 0.15)",
                border: "1px solid oklch(0.5 0.2 25 / 0.35)",
              }}
              role="alert"
              data-ocid={`${idPrefix}-quick-add-error`}
            >
              <AlertCircle
                size={14}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "oklch(0.68 0.2 25)" }}
              />
              <p
                className="text-xs leading-snug"
                style={{ color: "oklch(0.75 0.16 25)" }}
              >
                {fetchError}
              </p>
            </div>
          )}

          {/* Success hint */}
          {fetchSuccess && (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                background: "oklch(0.45 0.16 145 / 0.15)",
                border: "1px solid oklch(0.5 0.16 145 / 0.35)",
              }}
            >
              <CheckCircle2
                size={14}
                className="flex-shrink-0"
                style={{ color: "oklch(0.68 0.18 145)" }}
              />
              <p className="text-xs" style={{ color: "oklch(0.72 0.14 145)" }}>
                Details auto-filled! Verify karo aur save karo.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Add product dialog ───────────────────────────────────────────────────────

function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [platformEntries, setPlatformEntries] = useState<PlatformEntry[]>([]);
  const [platformError, setPlatformError] = useState<string | null>(null);
  const { data: categories = [] } = useCategories();
  const addProduct = useAddProduct();

  const set = (key: keyof ProductFormData) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const handleAutofill = ({
    title,
    description,
    imageUrl,
    price,
    originalPrice,
    discountPercent,
    detectedPlatform,
    pastedUrl,
  }: {
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    originalPrice: string;
    discountPercent: string;
    detectedPlatform: string;
    pastedUrl: string;
  }) => {
    setForm((p) => ({
      ...p,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(imageUrl ? { imageUrl } : {}),
      ...(price ? { price } : {}),
      ...(originalPrice ? { originalPrice } : {}),
      ...(discountPercent ? { discountPercent } : {}),
    }));
    // If platform detected and no platform entries yet, add one pre-filled
    if (detectedPlatform && platformEntries.length === 0) {
      setPlatformEntries([
        {
          id: crypto.randomUUID(),
          platform: detectedPlatform,
          price,
          originalPrice,
          discountPercent,
          affiliateLink: pastedUrl,
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePlatformEntries(platformEntries);
    if (err) {
      setPlatformError(err);
      return;
    }
    setPlatformError(null);
    await addProduct.mutateAsync({
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      price: Number.parseFloat(form.price),
      originalPrice: Number.parseFloat(form.originalPrice),
      discountPercent: BigInt(Number.parseInt(form.discountPercent) || 0),
      affiliateLink: form.affiliateLink,
      affiliateSource: form.affiliateSource,
      categoryId: BigInt(Number.parseInt(form.categoryId) || 1),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isTrending: form.isTrending,
      platformLinks: platformEntries.map(platformEntryToLink),
    });
    setOpen(false);
    setForm(EMPTY_FORM);
    setPlatformEntries([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="btn-primary rounded-full"
          data-ocid="admin-add-product"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">
            Add New Product
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-2">
          {/* Quick Add from Link */}
          <QuickAddFromLink onAutofill={handleAutofill} idPrefix="add" />

          <SectionDivider label="Product Details" />

          <FormField
            id="title"
            label="Product Title"
            placeholder="Wireless Earbuds Pro"
            value={form.title}
            onChange={set("title")}
            required
            ocid="admin-field-title"
          />
          <FormField
            id="description"
            label="Description"
            placeholder="Short description..."
            value={form.description}
            onChange={set("description")}
            ocid="admin-field-description"
          />

          {/* Image URL + preview */}
          <ImageUrlField
            id="imageUrl"
            value={form.imageUrl}
            onChange={set("imageUrl")}
            ocid="admin-field-imageUrl"
          />

          <SectionDivider label="Primary Listing" />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="price"
              label="Price (₹)"
              type="number"
              placeholder="999"
              value={form.price}
              onChange={set("price")}
              required
              ocid="admin-field-price"
            />
            <FormField
              id="originalPrice"
              label="Original Price (₹)"
              type="number"
              placeholder="1999"
              value={form.originalPrice}
              onChange={set("originalPrice")}
              ocid="admin-field-originalPrice"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="discountPercent"
              label="Discount %"
              type="number"
              placeholder="50"
              value={form.discountPercent}
              onChange={set("discountPercent")}
              ocid="admin-field-discountPercent"
            />
            <SourceSelect
              id="affiliateSource"
              value={form.affiliateSource}
              onChange={set("affiliateSource")}
              ocid="admin-field-affiliateSource"
            />
          </div>
          <FormField
            id="affiliateLink"
            label="Primary Affiliate Link"
            type="url"
            placeholder="https://amazon.in/..."
            value={form.affiliateLink}
            onChange={set("affiliateLink")}
            required
            ocid="admin-field-affiliateLink"
          />
          <p className="text-xs text-muted-foreground -mt-1">
            ✨ Platform badge will be auto-detected from the link
          </p>

          <SectionDivider label="Price Comparison Platforms" />

          {/* Affiliate Platforms */}
          <AffiliatePlatformsSection
            entries={platformEntries}
            onChange={setPlatformEntries}
            idPrefix="add"
          />
          {platformError && (
            <p className="text-xs text-destructive -mt-1" role="alert">
              ⚠️ {platformError}
            </p>
          )}

          <SectionDivider label="Categorization" />

          {/* Category */}
          <div>
            <Label htmlFor="categoryId" className="text-xs font-semibold">
              Category
            </Label>
            <select
              id="categoryId"
              value={form.categoryId}
              onChange={(e) => set("categoryId")(e.target.value)}
              className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              data-ocid="admin-field-categoryId"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id.toString()} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <FormField
            id="tags"
            label="Tags (comma-separated)"
            placeholder="gadgets, wireless, trending"
            value={form.tags}
            onChange={set("tags")}
            ocid="admin-field-tags"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTrending"
              checked={form.isTrending}
              onChange={(e) =>
                setForm((p) => ({ ...p, isTrending: e.target.checked }))
              }
              className="accent-accent w-4 h-4"
              data-ocid="admin-field-isTrending"
            />
            <Label htmlFor="isTrending" className="text-sm cursor-pointer">
              Mark as Trending 🔥
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary rounded-full"
              disabled={addProduct.isPending}
              data-ocid="admin-submit-product"
            >
              {addProduct.isPending ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Click Analytics Section ──────────────────────────────────────────────────

const PLATFORM_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  Amazon: { bg: "oklch(0.55 0.18 55 / 0.18)", text: "oklch(0.75 0.18 55)" },
  Flipkart: { bg: "oklch(0.45 0.18 260 / 0.18)", text: "oklch(0.65 0.18 260)" },
  Myntra: { bg: "oklch(0.5 0.2 340 / 0.18)", text: "oklch(0.72 0.2 340)" },
  Meesho: { bg: "oklch(0.5 0.18 310 / 0.18)", text: "oklch(0.72 0.18 310)" },
  JioMart: { bg: "oklch(0.5 0.2 25 / 0.18)", text: "oklch(0.72 0.2 25)" },
  Instamart: { bg: "oklch(0.55 0.2 145 / 0.18)", text: "oklch(0.72 0.2 145)" },
  Prepkart: { bg: "oklch(0.5 0.18 195 / 0.18)", text: "oklch(0.72 0.18 195)" },
  Other: { bg: "oklch(0.35 0.02 265 / 0.35)", text: "oklch(0.62 0.02 265)" },
};

function ClickAnalyticsSection({
  productId,
  hasPlatformLinks,
}: { productId: bigint; hasPlatformLinks: boolean }) {
  const { data: links = [], isLoading } = useGetPlatformLinks(productId);

  if (!hasPlatformLinks) {
    return (
      <p
        className="text-xs italic py-1"
        style={{ color: "oklch(0.55 0.02 270)" }}
      >
        Single platform — no comparison analytics
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div
          className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
          style={{
            borderColor:
              "oklch(0.55 0.22 38 / 0.3) oklch(0.55 0.22 38) oklch(0.55 0.22 38) oklch(0.55 0.22 38)",
          }}
        />
        <span className="text-xs" style={{ color: "oklch(0.55 0.02 270)" }}>
          Loading analytics...
        </span>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <p
        className="text-xs italic py-1"
        style={{ color: "oklch(0.55 0.02 270)" }}
      >
        No platform data available yet.
      </p>
    );
  }

  const maxClicks = Math.max(...links.map((l) => Number(l.clickCount)));
  const sorted = [...links].sort(
    (a, b) => Number(b.clickCount) - Number(a.clickCount),
  );

  return (
    <table
      className="w-full text-xs border-collapse"
      data-ocid={`analytics-table-${productId}`}
    >
      <thead>
        <tr style={{ borderBottom: "1px solid oklch(0.28 0.02 265 / 0.6)" }}>
          <th
            className="text-left py-1.5 pr-2 font-semibold"
            style={{ color: "oklch(0.55 0.02 270)" }}
          >
            Platform
          </th>
          <th
            className="text-right py-1.5 px-2 font-semibold"
            style={{ color: "oklch(0.55 0.02 270)" }}
          >
            Clicks
          </th>
          <th
            className="text-right py-1.5 pl-2 font-semibold"
            style={{ color: "oklch(0.55 0.02 270)" }}
          >
            Performance
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((link) => {
          const colors =
            PLATFORM_BADGE_COLORS[link.platform] ?? PLATFORM_BADGE_COLORS.Other;
          const clicks = Number(link.clickCount);
          const isTop = clicks > 0 && clicks === maxClicks;
          return (
            <tr
              key={link.platform}
              style={{ borderBottom: "1px solid oklch(0.25 0.02 265 / 0.4)" }}
            >
              {/* Platform */}
              <td className="py-2 pr-2">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  {link.platform}
                </span>
              </td>
              {/* Clicks */}
              <td
                className="py-2 px-2 text-right font-mono font-semibold"
                style={{ color: "oklch(0.82 0.02 270)" }}
              >
                {clicks.toLocaleString("en-IN")}
              </td>
              {/* Performance */}
              <td className="py-2 pl-2 text-right">
                {isTop ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "oklch(0.55 0.18 80 / 0.2)",
                      color: "oklch(0.78 0.18 80)",
                    }}
                  >
                    ★ Top
                  </span>
                ) : clicks === 0 ? (
                  <span
                    style={{ color: "oklch(0.45 0.02 270)" }}
                    className="italic"
                  >
                    No clicks yet
                  </span>
                ) : (
                  <span style={{ color: "oklch(0.6 0.02 270)" }}>{clicks}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Product row ──────────────────────────────────────────────────────────────

type ProductItem = {
  id: bigint;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  discountPercent: bigint;
  isTrending: boolean;
  affiliateSource: string;
  affiliateLink: string;
  categoryId: bigint;
  tags: string[];
  platformLinks: PlatformLink[];
};

function ProductRow({ product }: { product: ProductItem }) {
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories = [] } = useCategories();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [platformError, setPlatformError] = useState<string | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    title: product.title,
    description: product.description,
    imageUrl: product.imageUrl,
    price: String(product.price),
    originalPrice: String(product.originalPrice),
    discountPercent: String(Number(product.discountPercent)),
    affiliateLink: product.affiliateLink,
    affiliateSource: product.affiliateSource,
    categoryId: String(Number(product.categoryId)),
    tags: product.tags.join(", "),
    isTrending: product.isTrending,
  });

  // Pre-fill platform entries from existing product data
  const [platformEntries, setPlatformEntries] = useState<PlatformEntry[]>(() =>
    (product.platformLinks ?? []).map(platformEntryFromLink),
  );

  const set = (key: keyof ProductFormData) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  // Sync platform entries when dialog opens (product data may have changed)
  useEffect(() => {
    if (editOpen) {
      setPlatformEntries(
        (product.platformLinks ?? []).map(platformEntryFromLink),
      );
    }
  }, [editOpen, product.platformLinks]);

  const handleEditAutofill = ({
    title,
    description,
    imageUrl,
    price,
    originalPrice,
    discountPercent,
    detectedPlatform,
    pastedUrl,
  }: {
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    originalPrice: string;
    discountPercent: string;
    detectedPlatform: string;
    pastedUrl: string;
  }) => {
    setForm((p) => ({
      ...p,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(imageUrl ? { imageUrl } : {}),
      ...(price ? { price } : {}),
      ...(originalPrice ? { originalPrice } : {}),
      ...(discountPercent ? { discountPercent } : {}),
    }));
    if (detectedPlatform && platformEntries.length === 0) {
      setPlatformEntries([
        {
          id: crypto.randomUUID(),
          platform: detectedPlatform,
          price,
          originalPrice,
          discountPercent,
          affiliateLink: pastedUrl,
        },
      ]);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePlatformEntries(platformEntries);
    if (err) {
      setPlatformError(err);
      return;
    }
    setPlatformError(null);
    await updateProduct.mutateAsync({
      id: product.id,
      input: {
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
        price: Number.parseFloat(form.price),
        originalPrice: Number.parseFloat(form.originalPrice),
        discountPercent: BigInt(Number.parseInt(form.discountPercent) || 0),
        affiliateLink: form.affiliateLink,
        affiliateSource: form.affiliateSource,
        categoryId: BigInt(Number.parseInt(form.categoryId) || 1),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isTrending: form.isTrending,
        platformLinks: platformEntries.map(platformEntryToLink),
      },
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditOpen(false);
    }, 800);
  };

  const handleDelete = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    deleteProduct.mutate(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
      data-ocid={`admin-product-row-${product.id}`}
    >
      {/* Product info row */}
      <div className="flex items-center gap-3 p-3">
        {product.imageUrl ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center border border-border">
            <Package size={20} className="text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight line-clamp-2">
            {product.title}
          </p>
          <div className="flex flex-wrap items-center gap-1 mt-1">
            <span
              className="text-xs font-bold"
              style={{ color: "oklch(0.55 0.22 38)" }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {Number(product.discountPercent) > 0 && (
              <Badge className="badge-discount text-xs px-1.5 py-0">
                {Number(product.discountPercent)}% OFF
              </Badge>
            )}
            {product.isTrending && (
              <Badge className="bg-accent/15 text-accent text-xs px-1.5 py-0">
                🔥
              </Badge>
            )}
            <Badge variant="outline" className="capitalize text-xs px-1.5 py-0">
              {product.affiliateSource}
            </Badge>
            {product.platformLinks && product.platformLinks.length > 0 && (
              <Badge
                className="text-xs px-1.5 py-0"
                style={{
                  background: "oklch(0.55 0.18 260 / 0.15)",
                  color: "oklch(0.55 0.18 260)",
                  border: "1px solid oklch(0.55 0.18 260 / 0.3)",
                }}
              >
                {product.platformLinks.length} platform
                {product.platformLinks.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex border-t border-border"
        style={{ borderColor: "oklch(0.3 0.04 30 / 0.4)" }}
      >
        {/* EDIT button */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
              style={{
                background: "oklch(0.22 0.06 240 / 0.15)",
                color: "oklch(0.65 0.15 240)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.28 0.08 240 / 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.22 0.06 240 / 0.15)";
              }}
              aria-label={`Edit ${product.title}`}
              data-ocid={`admin-edit-${product.id}`}
            >
              <Pencil size={15} />
              <span>Edit</span>
            </button>
          </DialogTrigger>

          {/* Edit dialog */}
          <DialogContent
            className="w-[95vw] max-w-lg rounded-2xl"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-base">
                ✏️ Edit Product
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleEditSubmit}
              className="flex flex-col gap-3 pb-2"
            >
              {/* Quick Add from Link */}
              <QuickAddFromLink
                onAutofill={handleEditAutofill}
                idPrefix={`edit-${product.id}`}
              />

              <SectionDivider label="Product Details" />

              <FormField
                id="edit-title"
                label="Product Title"
                value={form.title}
                onChange={set("title")}
                ocid="admin-edit-field-title"
              />
              <FormField
                id="edit-description"
                label="Description"
                value={form.description}
                onChange={set("description")}
                ocid="admin-edit-field-description"
              />

              {/* Image URL + preview */}
              <ImageUrlField
                id="edit-imageUrl"
                value={form.imageUrl}
                onChange={set("imageUrl")}
                ocid="admin-edit-field-imageUrl"
              />

              <SectionDivider label="Primary Listing" />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  id="edit-price"
                  label="Price (₹)"
                  type="number"
                  placeholder="999"
                  value={form.price}
                  onChange={set("price")}
                  ocid="admin-edit-field-price"
                />
                <FormField
                  id="edit-originalPrice"
                  label="Original Price (₹)"
                  type="number"
                  placeholder="1999"
                  value={form.originalPrice}
                  onChange={set("originalPrice")}
                  ocid="admin-edit-field-originalPrice"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  id="edit-discountPercent"
                  label="Discount %"
                  type="number"
                  placeholder="50"
                  value={form.discountPercent}
                  onChange={set("discountPercent")}
                  ocid="admin-edit-field-discountPercent"
                />
                <SourceSelect
                  id="edit-affiliateSource"
                  value={form.affiliateSource}
                  onChange={set("affiliateSource")}
                  ocid="admin-edit-field-affiliateSource"
                />
              </div>
              <FormField
                id="edit-affiliateLink"
                label="Primary Affiliate Link"
                type="url"
                placeholder="https://amazon.in/..."
                value={form.affiliateLink}
                onChange={set("affiliateLink")}
                ocid="admin-edit-field-affiliateLink"
              />
              <p className="text-xs text-muted-foreground -mt-1">
                ✨ Platform badge auto-detected from link
              </p>

              <SectionDivider label="Price Comparison Platforms" />

              {/* Affiliate Platforms */}
              <AffiliatePlatformsSection
                entries={platformEntries}
                onChange={setPlatformEntries}
                idPrefix={`edit-${product.id}`}
              />
              {platformError && (
                <p className="text-xs text-destructive -mt-1" role="alert">
                  ⚠️ {platformError}
                </p>
              )}

              <SectionDivider label="Categorization" />

              {/* Category */}
              <div>
                <Label
                  htmlFor="edit-categoryId"
                  className="text-xs font-semibold"
                >
                  Category
                </Label>
                <select
                  id="edit-categoryId"
                  value={form.categoryId}
                  onChange={(e) => set("categoryId")(e.target.value)}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  data-ocid="admin-edit-field-categoryId"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id.toString()} value={c.id.toString()}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                id="edit-tags"
                label="Tags (comma-separated)"
                placeholder="gadgets, wireless, trending"
                value={form.tags}
                onChange={set("tags")}
                ocid="admin-edit-field-tags"
              />

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="edit-isTrending"
                  checked={form.isTrending}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isTrending: e.target.checked }))
                  }
                  className="accent-accent w-4 h-4"
                  data-ocid="admin-edit-field-isTrending"
                />
                <Label
                  htmlFor="edit-isTrending"
                  className="text-sm cursor-pointer"
                >
                  Mark as Trending 🔥
                </Label>
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-11"
                  onClick={() => setEditOpen(false)}
                  disabled={updateProduct.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-11 font-bold gap-2"
                  style={{
                    background: saved
                      ? "oklch(0.5 0.16 145)"
                      : "linear-gradient(135deg, oklch(0.55 0.22 38), oklch(0.48 0.2 20))",
                    boxShadow: "0 4px 14px oklch(0.55 0.22 38 / 0.35)",
                  }}
                  disabled={updateProduct.isPending || saved}
                  data-ocid={`admin-submit-edit-${product.id}`}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 size={16} />
                      Saved!
                    </>
                  ) : updateProduct.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Divider */}
        <div
          className="w-px"
          style={{ background: "oklch(0.3 0.04 30 / 0.4)" }}
        />

        {/* DELETE button */}
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors"
          style={{
            background: deleteConfirm
              ? "oklch(0.45 0.2 25 / 0.25)"
              : "oklch(0.22 0.06 25 / 0.12)",
            color: deleteConfirm ? "oklch(0.7 0.22 25)" : "oklch(0.6 0.18 25)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.45 0.2 25 / 0.22)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              deleteConfirm
                ? "oklch(0.45 0.2 25 / 0.25)"
                : "oklch(0.22 0.06 25 / 0.12)";
          }}
          onClick={handleDelete}
          disabled={deleteProduct.isPending}
          aria-label={`Delete ${product.title}`}
          data-ocid={`admin-delete-${product.id}`}
        >
          {deleteProduct.isPending ? (
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          <span>{deleteConfirm ? "Tap again to confirm" : "Delete"}</span>
        </button>
      </div>

      {/* Analytics toggle */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors"
        style={{
          borderTop: "1px solid oklch(0.28 0.02 265 / 0.5)",
          background: analyticsOpen
            ? "oklch(0.2 0.04 38 / 0.25)"
            : "oklch(0.18 0.02 265 / 0.15)",
          color: analyticsOpen ? "oklch(0.72 0.16 38)" : "oklch(0.55 0.02 270)",
        }}
        onClick={() => setAnalyticsOpen((v) => !v)}
        aria-expanded={analyticsOpen}
        data-ocid={`admin-analytics-toggle-${product.id}`}
      >
        <span className="flex items-center gap-1.5">
          <BarChart2 size={13} />
          View Analytics
        </span>
        <ChevronDown
          size={13}
          className="transition-transform duration-200"
          style={{
            transform: analyticsOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {analyticsOpen && (
        <div
          className="px-3 pb-3 pt-2"
          style={{
            background: "oklch(0.15 0.02 265 / 0.6)",
            borderTop: "1px solid oklch(0.25 0.02 265 / 0.4)",
          }}
          data-ocid={`admin-analytics-section-${product.id}`}
        >
          <ClickAnalyticsSection
            productId={product.id}
            hasPlatformLinks={
              !!(product.platformLinks && product.platformLinks.length > 0)
            }
          />
        </div>
      )}
    </motion.div>
  );
}

// ─── Admin dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const [filterState] = useState<FilterState>(DEFAULT_FILTER);
  const { data: products = [], isLoading: productsLoading } =
    useProducts(filterState);
  const { data: categories = [] } = useCategories();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Package, label: "Total Products", value: products.length },
          { icon: Tag, label: "Categories", value: categories.length },
          {
            icon: Package,
            label: "Trending",
            value: products.filter((p) => p.isTrending).length,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-4 text-center"
          >
            <Icon size={20} className="text-accent mx-auto mb-1" />
            <p className="font-display font-bold text-2xl">
              {productsLoading ? "—" : value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Admin customization tip */}
      <div
        className="mb-5 rounded-xl border px-4 py-3 flex gap-3 items-start"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.2 0.06 38 / 0.35), oklch(0.18 0.04 50 / 0.2))",
          borderColor: "oklch(0.55 0.18 38 / 0.5)",
          boxShadow: "0 0 16px oklch(0.6 0.2 38 / 0.12)",
        }}
        data-ocid="admin-customize-tip"
      >
        <span className="text-xl flex-shrink-0 mt-0.5">✏️</span>
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.85 0.16 38)" }}
          >
            Apna koi bhi product customize karo!
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Kapde ka <strong>size (S/M/L/XL)</strong>, color, price, image,
            description — sab admin se change hota hai. Product ka{" "}
            <span className="text-accent font-medium">✏️ edit</span> karo aur
            save karo — <em>turant site pe update ho jayega.</em>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>EN:</strong> Customize any product — size, color, price,
            image, description — all editable from admin. Edit &amp; save →
            updates instantly on site.
          </p>
        </div>
      </div>

      {/* Header row with Add Product */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg">
          Products{" "}
          {!productsLoading && products.length > 0 && (
            <span className="text-muted-foreground font-normal text-sm ml-1">
              ({products.length})
            </span>
          )}
        </h2>
        <AddProductDialog />
      </div>

      {productsLoading ? (
        <div className="space-y-3" data-ocid="admin-products-loading">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading products...
            </span>
          </div>
          {Array.from({ length: 4 }, (_, i) => `sk-admin-${i}`).map((id) => (
            <Skeleton key={id} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-16 bg-muted/30 rounded-xl border border-dashed border-border"
          data-ocid="admin-empty"
        >
          <Package size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-medium mb-1">No products yet</p>
          <p className="text-sm text-muted-foreground mb-5">
            Add your first product to get started.
          </p>
          <AddProductDialog />
        </div>
      ) : (
        <div className="space-y-3" data-ocid="admin-products-list">
          {products.map((p) => (
            <ProductRow key={p.id.toString()} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin page root ──────────────────────────────────────────────────────────

const ACTOR_TIMEOUT_MS = 12_000;
const SESSION_VERIFIED_KEY = "buyhubmart_admin_verified";

export default function AdminPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const actorReady = !!actor && !actorFetching;

  const {
    data: isAdmin,
    isLoading: isAdminLoading,
    isFetching: isAdminFetching,
    fetchStatus,
  } = useIsAdmin();

  const sessionVerified = sessionStorage.getItem(SESSION_VERIFIED_KEY) === "1";
  const actorEverReady = useRef(false);
  if (actorReady) actorEverReady.current = true;

  const [actorTimedOut, setActorTimedOut] = useState(false);
  useEffect(() => {
    if (actorReady) {
      setActorTimedOut(false);
      return;
    }
    if (!identity) return;
    const t = setTimeout(() => setActorTimedOut(true), ACTOR_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [actorReady, identity]);

  const renderContent = () => {
    if (!identity) {
      if (loginStatus === "initializing") {
        return <ConnectingView message="Checking login status..." />;
      }
      return <LoginPrompt />;
    }

    if (!actorReady) {
      if (actorTimedOut) {
        return <ErrorView onRetry={() => window.location.reload()} />;
      }
      return <ConnectingView message="Loading admin dashboard..." />;
    }

    if (isAdminLoading || (isAdminFetching && fetchStatus !== "idle")) {
      if (sessionVerified) {
        return <AdminDashboard />;
      }
      return (
        <div className="max-w-3xl mx-auto" data-ocid="admin-checking-perms">
          <div className="flex items-center gap-3 mb-6 p-4 bg-card rounded-xl border border-border">
            <div className="w-5 h-5 border-2 border-accent/40 border-t-accent rounded-full animate-spin flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Checking permissions...
            </p>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => `perm-sk-${i}`).map((id) => (
              <Skeleton key={id} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      );
    }

    if (isAdmin) {
      return <AdminDashboard />;
    }

    if (sessionVerified) {
      return <AdminDashboard />;
    }

    return <NotAdminView />;
  };

  return (
    <Layout showCategoryNav={false}>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage products and categories
        </p>
      </div>
      {renderContent()}
    </Layout>
  );
}
