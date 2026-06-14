/**
 * Site Configuration
 * Central configuration for all site-wide settings
 */

export const siteConfig = {
    // Brand Information
    name: "DINARYS",
    tagline: "Une marque premium Made in Algeria",
    description: "Dinarys est une marque cosmétique premium née avec une ambition claire : proposer des produits de haute qualité, modernes et performants, conçus pour répondre aux besoins réels des consommateurs algériens.",

    // URLs
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dinarys.dz",

    // Logo & Branding
    logo: {
        src: "/dinarys-logo.png",
        alt: "DINARYS Cosmetics",
        width: 120,
        height: 60,
    },
    favicon: "/dinarys-logo.png",

    // Contact Information
    contact: {
        email: "dinarys.cosmetics@gmail.com",
        phone: "+213 550 27 65 68",
        phoneDisplay: "+213 550 27 65 68",
        address: "Algérie",
        mapUrl: "",
    },

    // Social Media
    social: {
        instagram: {
            url: "https://www.instagram.com/dinarys_cosmetique?igsh=MXV0MGlyZG41Y3BtZA%3D%3D&utm_source=qr",
            handle: "@__dinarys",
        },
        facebook: {
            url: "https://www.facebook.com/share/1AybrnVW15/",
            handle: "Dinarys Cosmetics",
        },
        twitter: {
            url: "",
            handle: "",
        },
        tiktok: {
            url: "https://www.tiktok.com/@__dinarys?_r=1&_t=ZS-96nfhw28v1I",
            handle: "@dinarys_cosmetics",
        },
        whatsapp: {
            url: "https://wa.me/213550276568",
            phone: "+213 550 27 65 68",
        },
    },

    // Locale & Currency
    locale: "fr-DZ",
    currency: {
        code: "DZD",
        symbol: "DA",
        position: "before" as const,
    },
    country: "DZ",

    // SEO
    seo: {
        titleTemplate: "%s | DINARYS",
        defaultTitle: "DINARYS — Une marque premium Made in Algeria",
        openGraph: {
            type: "website",
            locale: "fr_DZ",
            siteName: "DINARYS",
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
        multiLanguage: true,
    },

    // Analytics & Tracking
    analytics: {
        facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",
    },

    /**
     * Checkout Mode Configuration
     * Options: "form" | "cart" | "both"
     */
    checkoutMode: "both" as "form" | "cart" | "both",

    /**
     * Add to Cart Redirect Configuration
     * Options: "cart" | "checkout" | "stay"
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
