/**
 * Centralized Configuration Exports
 * Import all config from this single file
 * 
 * Usage:
 * import { siteConfig, themeConfig, wooConfig } from "@/lib/config"
 */

export { siteConfig, type SiteConfig, type CheckoutMode } from "./site"
export { themeConfig, type ThemeConfig } from "./theme"
export { navigationConfig, type NavigationConfig, type NavItem } from "./navigation"
export { wooConfig, getWooCredentials, buildApiUrl, type WooConfig } from "./woocommerce"
export { heroConfig, type HeroConfig, type HeroSlide } from "./hero"
export {
    shippingRates,
    shippingConfig,
    deliveryMethods,
    defaultShippingRate,
    getShippingPrice,
    getShippingRates,
    hasCustomRates,
    isFreeShipping,
    type DeliveryMethod,
    type ShippingRate,
    type DeliveryMethodInfo,
} from "./shipping"
export { ALGERIA_WILAYAS, ALGERIA_COMMUNES, getCommunesByWilaya, isValidWilaya, isValidCommune, type AlgeriaWilaya } from "./country"
export { colorMap, getColorValue, isKnownColor, extendColorMap, type ColorMap } from "./colors"

/**
 * Price formatting utility using site config
 */
import { siteConfig } from "./site"

export function formatPrice(price: number, locale?: string): string {
    const { code } = siteConfig.currency
    const isArabic = locale === "ar"
    const symbol = isArabic ? "دج" : siteConfig.currency.symbol

    const formatted = price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    // Arabic: symbol goes after the number
    if (isArabic) {
        return `${formatted} ${symbol}`
    }
    return `${symbol} ${formatted}`
}

/**
 * Get full page title using SEO template
 */
export function getPageTitle(title?: string): string {
    if (!title) return siteConfig.seo.defaultTitle
    return siteConfig.seo.titleTemplate.replace("%s", title)
}
