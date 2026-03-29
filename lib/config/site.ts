/**
 * Site Configuration
 * Central configuration for all site-wide settings
 * Easy to customize when switching brands/clients
 */

export const siteConfig = {
    // Brand Information
    name: "NOUR CONFECTION",
    tagline: "Élégance & Tradition",
    description: "Nour Confection propose des créations élégantes pour mariées et bébés, inspirées du patrimoine algérien et réalisées avec un savoir-faire artisanal pour sublimer les moments les plus précieux.",

    // URLs
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://nourconfection.com",

    // Logo & Branding
    logo: {
        src: "/logo.png",
        alt: "NOUR CONFECTION",
        width: 120,
        height: 60,
    },
    favicon: "/logo.png",

    // Contact Information
    contact: {
        email: "nour.t.confection@gmail.com",
        phone: "+2137995339100",
        phoneDisplay: "+2137995339100",
        address: "rue Ammara Youcef Blida 00009",
        mapUrl: "https://maps.app.goo.gl/WMA2iAvKLS5z2caC7",
    },

    // Social Media
    social: {
        instagram: {
            url: "https://www.instagram.com/nour.confection/",
            handle: "@nour.confection",
        },
        facebook: {
            url: "https://www.facebook.com/p/Nour-confection-100076232980561/",
            handle: "Nour confection",
        },
        twitter: {
            url: "",
            handle: "",
        },
        tiktok: {
            url: "https://www.tiktok.com/@nour.confection",
            handle: "@nour.confection",
        },
        whatsapp: {
            url: "https://wa.me/213799533910",
            phone: "+213799533910",
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
        titleTemplate: "%s | NOUR CONFECTION",
        defaultTitle: "NOUR CONFECTION - Élégance & Tradition",
        openGraph: {
            type: "website",
            locale: "fr_DZ",
            siteName: "NOUR CONFECTION",
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

    // Video Section
    video: {
        url: "https://mediumturquoise-seal-882397.hostingersite.com/wp-content/uploads/2026/03/snaptik_7409755669982760198_v3.mp4",
        poster: "/hero.jpeg",
    },

    // Copyright
    copyright: {
        year: new Date().getFullYear(),
        text: "Tous droits réservés.",
    },
} as const

export type SiteConfig = typeof siteConfig
export type CheckoutMode = "form" | "cart" | "both"
export type AddToCartRedirect = "cart" | "checkout" | "stay"
