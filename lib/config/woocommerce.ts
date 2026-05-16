/**
 * WooCommerce Configuration
 * All settings related to WooCommerce/WordPress integration
 *
 */

export const wooConfig = {
    // API Configuration (uses env variables)
    api: {
        storeUrl: process.env.WOOCOMMERCE_STORE_URL!,
        consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
        consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
        version: "wc/v3",
    },

    // Product settings
    products: {
        perPage: 8,
        defaultOrderBy: "modified" as const,
        defaultOrder: "desc" as const,
        placeholderImage: "/placeholder.svg?height=600&width=600",
    },

    // Category settings
    categories: {
        perPage: 100,
        hideEmpty: false, // Show categories even if empty
    },

    // Order settings
    orders: {
        paymentMethod: "cod", // Cash on delivery
        paymentMethodTitle: "Cash on Delivery",
        defaultCountry: "DZ",
        shippingMethod: "flat_rate",
        shippingTitle: "Livraison",
    },

    // Stock status translations
    stockStatus: {
        instock: "En stock",
        outofstock: "Épuisé",
        onbackorder: "Sur commande",
    },

    // Attribute mappings
    attributes: {
        size: ["size", "taille"],
        color: ["color", "couleur"],
    },
} as const

/**
 * Helper function to get WooCommerce API credentials
 */
export function getWooCredentials() {
    const { storeUrl, consumerKey, consumerSecret } = wooConfig.api

    if (!storeUrl || !consumerKey || !consumerSecret) {
        throw new Error("WooCommerce credentials not configured. Please check your .env.local file.")
    }

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    const cleanUrl = storeUrl.replace(/\/$/, "")

    return {
        storeUrl: cleanUrl,
        credentials,
        authHeader: `Basic ${credentials}`,
    }
}

/**
 * Build WooCommerce API URL
 */
export function buildApiUrl(endpoint: string, params?: Record<string, string | number>) {
    const { storeUrl } = getWooCredentials()
    const url = new URL(`${storeUrl}/wp-json/${wooConfig.api.version}/${endpoint}`)

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(key, String(value))
            }
        })
    }

    return url.toString()
}

export type WooConfig = typeof wooConfig
