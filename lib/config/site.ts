/**
 * Site Configuration
 * Central configuration for all site-wide settings
 * Easy to customize when switching brands/clients
 */

export const siteConfig = {
    // Brand Information
    name: "NEYLA COLLECTION",
    tagline: "Fashion & Lifestyle",
    description: "Discover elegant fashion and lifestyle collections from NEYLA COLLECTION. New collection 2026 featuring traditional and contemporary designs.",

    // URLs
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://neylacollection.com",

    // Logo & Branding
    logo: {
        src: "/images/neylalogo2.png",
        alt: "NEYLA COLLECTION",
        width: 120,
        height: 60,
    },
    favicon: "/images/neylalogo2.png",

    // Contact Information
    contact: {
        email: "neylacollections@gmail.com",
        phone: "+213557084431",
        phoneDisplay: "0557 08 44 31",
        address: "Algiers, Algeria",
        mapUrl: "",
    },

    // Social Media
    social: {
        instagram: {
            url: "https://www.instagram.com/neyla_collection_/",
            handle: "@neyla_collection_",
        },
        facebook: {
            url: "https://www.facebook.com/p/Neyla-Collection-61570652681294/",
            handle: "Neyla collection",
        },
        twitter: {
            url: "",
            handle: "",
        },
        tiktok: {
            url: "https://www.tiktok.com/@neyla.collection",
            handle: "@neyla.collection",
        },
        whatsapp: {
            url: "https://wa.me/213557084431",
            phone: "+213557084431",
        },
    },

    // Locale & Currency
    locale: "fr-DZ",
    currency: {
        code: "DZD",
        symbol: "DA",
        position: "before" as const, // "before" or "after"
    },
    country: "DZ",

    // SEO
    seo: {
        titleTemplate: "%s | NEYLA COLLECTION",
        defaultTitle: "NEYLA COLLECTION - Fashion & Lifestyle",
        openGraph: {
            type: "website",
            locale: "fr_DZ",
            siteName: "NEYLA COLLECTION",
        },
    },

    // Features toggles
    features: {
        darkMode: false,
        wishlist: false,
        reviews: false,
        search: true,
        cart: true,
        newsletter: false,
        multiLanguage: false,
    },

    // Analytics & Tracking
    analytics: {
        facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",
        // googleAnalyticsId: "", // Ready for future use
    },

    /**
     * Checkout Mode Configuration
     * Defines how users can purchase products
     * 
     * Options:
     * - "form"  : Only inline form on product page (direct order)
     * - "cart"  : Only add to cart button (redirect to cart/checkout)
     * - "both"  : Both options available (form + add to cart button)
     */
    checkoutMode: "both" as "form" | "cart" | "both",

    /**
     * Add to Cart Redirect Configuration
     * Defines where the user is redirected after adding to cart
     * 
     * Options:
     * - "cart"     : Redirect to the cart page (/cart)
     * - "checkout" : Redirect directly to checkout page (/checkout)
     * - "stay"     : Stay on the current page (no redirect)
     */
    addToCartRedirect: "cart" as "cart" | "checkout" | "stay",

    // Copyright
    copyright: {
        year: new Date().getFullYear(),
        text: "Tous droits réservés.",
    },
} as const

export type SiteConfig = typeof siteConfig
export type CheckoutMode = "form" | "cart" | "both"
export type AddToCartRedirect = "cart" | "checkout" | "stay"
