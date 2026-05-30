# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Create `.env.local` with:

```
WOOCOMMERCE_STORE_URL=https://your-store.hostingersite.com
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
NEXT_PUBLIC_SITE_URL=https://dinarys.dz
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
```

## Architecture

This is a **Next.js App Router** e-commerce storefront (Dinarys Cosmetics — Made in Algeria) that acts as a frontend for a WooCommerce/WordPress backend. All product and order data flows through WooCommerce's REST API.

### Data Flow

- **Products**: Fetched server-side at `app/api/products/route.ts` and `app/api/categories/route.ts` (ISR, revalidate 300s). Rendered via `ProductsSectionServer` (server component) with `Suspense`.
- **Orders**: Created via `POST /api/orders` which transforms the checkout form data into WooCommerce order format (COD only, DZ only).
- **Shipping**: Calculated client-side from static rates in `lib/config/shipping.ts` keyed by wilaya name. The `ShippingPreloader` component warms this data on initial load.
- **Webhooks**: `app/api/webhooks/woocommerce/route.ts` handles WooCommerce webhook events.

### Configuration System

All site-level settings live in `lib/config/` and are re-exported from `lib/config/index.ts`:

| File | Purpose |
|------|---------|
| `site.ts` | Brand name, URLs, currency (DZD), feature flags, checkout mode |
| `woocommerce.ts` | WooCommerce API credentials helpers, product/order settings |
| `shipping.ts` | Static wilaya shipping rates (domicile / stopdesk), delivery methods |
| `hero.ts` | Hero slides, images, overlay, auto-rotate settings |
| `navigation.ts` | Main nav, footer nav, announcement bar |
| `colors.ts` | Color name → hex mapping for product color swatches |
| `country/` | Algeria wilaya + commune lists for checkout address fields |

To change shipping prices: edit `shippingRates` in `lib/config/shipping.ts`.  
To change hero images/text: edit `heroConfig.slides` in `lib/config/hero.ts`.  
To change site name/branding: edit `siteConfig` in `lib/config/site.ts`.

### Checkout Modes

`siteConfig.checkoutMode` controls the checkout experience:
- `"form"` — single-page form only (on product page)
- `"cart"` — cart + separate checkout page
- `"both"` — both flows available

### Key Components

- `components/checkout-form.tsx` — multi-step cart checkout (wilaya/commune selectors, shipping method)
- `components/product-checkout-form.tsx` — quick buy form on product detail page
- `components/products-section-server.tsx` — server component that fetches & renders homepage products
- `components/hero-section.tsx` — auto-rotating hero banner, reads `heroConfig`
- `components/language-switcher.tsx` — floating locale toggle (FR ↔ AR), rendered in locale layout

### Multilanguage System (next-intl)

The app supports **French (fr)** and **Arabic (ar)** via `next-intl` v4.

**Routing:** All pages live under `app/[locale]/`. The middleware (`proxy.ts`) rewrites `/` → `/fr` by default. Locale-aware `Link`, `useRouter`, `usePathname` are exported from `@/i18n/navigation` — always import from there, not from `next/navigation`.

**Translation files:** `messages/fr.json` and `messages/ar.json`. Namespaces: `common`, `header`, `footer`, `hero`, `products`, `checkout`, `aboutPage`, `thankYou`.

**Client vs Server components:**
- Client components (`"use client"`) → `useTranslations("namespace")` from `next-intl`
- Server components → `getTranslations("namespace")` from `next-intl/server`
- Never call `getTranslations` inside a component that is imported by a client component tree

**Adding a new translation key:**
1. Add the key to both `messages/fr.json` and `messages/ar.json`
2. Use `t("key")` in the component; use `t.raw("key")` for arrays

### Fonts & Styling

**Font system (scalable, 2-layer):**

| CSS Variable | FR value | AR value (via `[dir="rtl"]`) |
|---|---|---|
| `--font-primary` | Montserrat | Almarai |
| `--font-heading` | Cinzel | Almarai |
| `--font-sans` | Montserrat | Almarai |
| `--font-playfair` | Cinzel | Almarai |
| `--font-cormorant` | Montserrat | Almarai |

All overrides are in `app/globals.css` under `[dir="rtl"]`. The `<body>` uses `font-family: var(--font-primary)`. Components using Tailwind utilities like `font-playfair` or `font-sans` automatically get Almarai in RTL because those CSS variables are overridden.

**Adding a 3rd language:**
1. `app/[locale]/layout.tsx` — import the font and append `${newFont.variable}` to `<html>` className
2. `app/globals.css` — add a `[lang="xx"]` or `[dir="..."]` block overriding the semantic variables

**CSS:** Tailwind CSS v4 + shadcn/ui (`components/ui/`)  
**Theme:** light-only (dark mode disabled via `siteConfig.features.darkMode = false`)

### TypeScript

`next.config.mjs` sets `ignoreBuildErrors: true` — TypeScript errors do not block builds.

**Known gotcha:** `siteConfig` uses `as const`, so feature flags have literal types (e.g. `true`). Comparing them with `!== false` triggers TS2367. Cast via `(siteConfig.features as Record<string, boolean>).flagName` when needed.
