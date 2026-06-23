import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

// Build the allowed remote image hosts. Product images are served by the
// WooCommerce backend, so derive the host from WOOCOMMERCE_STORE_URL (this
// follows the env var if the store ever moves to a custom domain). The
// wildcard fallback covers the current Hostinger host regardless.
const remotePatterns = [{ protocol: "https", hostname: "**.hostingersite.com" }]
if (process.env.WOOCOMMERCE_STORE_URL) {
  try {
    const u = new URL(process.env.WOOCOMMERCE_STORE_URL)
    remotePatterns.push({ protocol: u.protocol.replace(":", ""), hostname: u.hostname })
  } catch {}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
  },
}

export default withNextIntl(nextConfig)
