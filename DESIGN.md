# Design Brief

**Purpose:** AI-powered premium price comparison marketplace optimized for Indian e-commerce. Users compare prices across platforms instantly; admin controls all affiliate revenue. Premium dark aesthetic with warm urgency CTAs and trust-driven comparison UX.

**Tone:** Intelligent, modern, comparison-focused premium — clean interface with side-by-side clarity, best-deal highlighting, and AI-recommended confidence scores.

**Differentiation:** Dark luxury palette (dark bg 0.12, emerald deal highlight 0.65 0.15 145, orange/red accent 0.72 0.16 38) with comparison-specific UI: best-deal glow animation, deal score badges, side-by-side table layout, and recommendation carousel. Instagram-native urgency without aggressive motion.

## Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| Primary (Accent) | 0.55 0.18 42 (Warm Amber) | 0.72 0.16 38 (Bright Orange-Red) | CTA buttons, Buy Now, urgency |
| Secondary | 0.28 0.08 260 (Deep Navy) | 0.22 0.08 260 (Navy) | Navigation, category links |
| Accent (Deal Highlight) | — | 0.65 0.15 145 (Emerald) | Best-deal border glow, deal score badges |
| Background | 0.97 0.01 280 (Cream) | 0.12 0.01 265 (Very Dark Blue) | Page background |
| Card | 0.99 0 0 (Pure White) | 0.16 0.01 265 (Dark Card) | Comparison table, product surfaces |
| Destructive | 0.58 0.24 25 (Warm Red) | 0.68 0.22 25 (Bright Red) | Discount %, savings badge |
| Foreground | 0.18 0.02 270 (Charcoal) | 0.94 0.01 280 (Off-white) | Text, high contrast |

## Typography

| Role | Font | Usage | Scale |
|------|------|-------|-------|
| Display | Space Grotesk | Hero product titles, product card titles, main headings | 2xl–5xl |
| Body | Plus Jakarta Sans | Product descriptions, metadata, body copy | sm–base |
| Mono | JetBrains Mono | Price, tags, technical data | xs–sm |

**Type Scale:** 12px (xs), 14px (sm), 16px (base), 20px (lg), 24px (xl), 30px (2xl), 36px (3xl), 48px (4xl), 60px (5xl).

## Structural Zones

| Zone | Background | Border | Elevation | Notes |
|------|------------|--------|-----------|-------|
| Header | Secondary (Navy) | None | Elevated | Sticky, logo/search/nav |
| Hero | Gradient Accent (Orange→Red) | None | Elevated | "Compare Prices Instantly" tagline, comparison value prop |
| Comparison Table | Card (Dark) | Border (Light/30%) | Card shadow | Full-width, best-deal row has emerald glow, deal score badges |
| Product Grid | Background | None | Flat | Staggered sections with muted/30 backgrounds for rhythm |
| Product Card | Card (Dark) | Border (Light) | Card shadow | Rounded 12px, glossy/shimmer hover only, affiliate source badge |
| Recommendation Carousel | Background | None | Flat | Horizontal scroll snap, auto-scroll animation on pause |
| CTA Button | Accent (Orange-Red) | None | Flat | Rounded full, hover: brightness +10%, pulse animation |
| Footer | Secondary (Navy) | Border-t (Navy 28%) | None | "Ditshu Kumar", affiliate disclosure |

**Rhythm:** 8px base unit. Spacing: 8px, 12px, 16px, 24px, 32px, 48px. Cards: 12px internal padding, 16px between grid items. Section padding: 24px mobile, 32px–48px desktop.

## Component Patterns

- **Comparison Table:** `.comparison-table` with `.comparison-table thead`, `tbody`, `td`. Best-deal row: `.best-deal-highlight` (emerald glow 0.65 0.15 145, animated) or `.compare-table-best` (emerald bg + left border, bold text). Deal score badge: `.deal-score-badge` (emerald tint, high contrast, % confidence display).
- **Hot Deals Carousel:** `.hot-deal-badge` (orange-red bg 0.72 0.16 38, animated pulse 1.5s, scale 1→1.05). Wraps top 6 products by discount %. Badge shows "🔥 XX% OFF".
- **Price Display:** `.price-comparison-row` with `.price-original` (strikethrough, muted), `.price-current` (accent color, bold), `.savings-badge` (red tint, ₹/% amount).
- **Product Card:** Image (3:4), title (2-line clamp), price row (original/current/savings), `.best-deal-highlight` glow badge (emerald, animated), affiliate source badge (platform-specific color), "Buy Now" + "Compare Prices" CTA.
- **Recommendation Carousel:** `.recommendation-carousel` (horizontal scroll snap) containing `.recommendation-card` (flex-shrink-0, w-56). Auto-scrolls on repeat via `animate-carousel-scroll` (30s linear infinite). Label: "Just For You".
- **Category Nav:** Links with icons + `.category-count-pill` (semi-transparent dark bg, emerald text, shows count, e.g., "Gadgets 24").
- **Deal Score Badge:** `.deal-score-badge` (emerald bg/fg, inline-flex, text-xs font-bold, px-3 py-1, rounded-full).
- **Buttons:** Primary CTA (`.btn-primary`) for affiliate links, gradient orange→red, pulse animation on load, hover brightness +10%.
- **Hot Deal Badge:** `.hot-deal-badge` (orange-red, animated pulse 1.5s, scale transform, glow effect, text-xs font-bold).
- **Category Count Pill:** `.category-count-pill` (semi-transparent dark bg, emerald text, text-xs font-semibold, px-2 py-0.5, rounded-full, ml-1).

## Motion & Interactions

| Element | Entry | Hover | Active |
|---------|-------|-------|--------|
| Comparison Table Row | `animate-slide-up` (0.4s) | `bg-muted/20` (subtle highlight) | None |
| Best-Deal Row | `animate-slide-up` + `.best-deal-glow` (2s infinite) | Glow intensifies | None |
| Deal Score Badge | `animate-fade-in` (0.3s) | None | None |
| Hot Deal Badge | `animate-hot-deal-pulse` (1.5s) | Glow + scale 1→1.05 | None |
| Category Count Pill | `animate-fade-in` (0.3s) | None | None |
| Product Card | `animate-slide-up` (0.4s) | Glossy shimmer only (no rotate/zoom) | None |
| CTA Button | `animate-fade-in` (0.3s) | `brightness-110` + pulse glow | `scale-95` (haptic feel) |
| Recommendation Carousel | `animate-fade-in` (0.3s) | Manual scroll or auto `animate-carousel-scroll` | None |
| Page Load | Staggered card animations (wave, 0.4s each) | — | — |

**Transition Default:** `cubic-bezier(0.4, 0, 0.2, 1)` (0.3s) for all state changes.

## Constraints

- **Mobile-first:** Base styles for `sm`, scale to `md:` (768px), `lg:` (1024px). Comparison table horizontal scroll on mobile.
- **Performance:** Lazy-load product images, infinite recommendation carousel. Header fixed, footer sticky.
- **Accessibility:** AA+ contrast (WCAG); min 44px tap targets; semantic HTML; alt text; descriptive link text ("Buy on Amazon" not "Click here"). Comparison table uses `<table>` semantics.
- **SEO:** Meta tags (title, description, keywords); structured data (Product, AggregateOffer); Open Graph for social preview.
- **Dark mode only:** Intentional dark aesthetic throughout. No light mode toggle.

## Signature Detail

**Emerald best-deal glow + orange-red hot-deal pulse + category counts** create premium comparison clarity. Hot deals carousel animates fastest (1.5s pulse with scale 1→1.05) to signal urgency and drive clicks. Best-deal row glows with soft emerald pulse (0.65 0.15 145, 2s), signaling AI-recommended confidence without aggressive motion. Category nav shows product counts (e.g., "Gadgets 24") via `.category-count-pill` (emerald text, semi-transparent bg), enabling users to browse with quantity context. Deal score badges (% confidence) build trust. Side-by-side price table with affiliate source badges enables instant comparison. Orange-red accent buttons drive clicks to partner platforms. Combined with fast table load, glossy-shimmer-only card hover (no rotation/flip/zoom), and compare-prices secondary CTA, this builds premium affiliate marketplace trust while keeping focus on price intelligence, not distraction.

