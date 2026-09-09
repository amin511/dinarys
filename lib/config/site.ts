
/**
 * Site Configuration
 * Central configuration for all site-wide settings
 */

export const siteConfig = {
    // Brand Information
    name: "الملكة",
    tagline: "متجر كل مسلمة",
    description:
        "الملكة للباس الشرعي، متجر لكل مسلمة تبحث عن الأناقة والستر.",

    // URLs
    url: process.env.NEXT_PUBLIC_SITE_URL || "",

    // Logo & Branding
    logo: {
        src: "/images/malikalogo.png",
        alt: "الملكة - Al Malika",
        width: 120,
        height: 60,
    },
    favicon: "/malikalogo.png",

    // Contact Information
    contact: {
        email: "",
        phone: "",
        phoneDisplay: "",
        address: "الجزائر",
        mapUrl: "",
    },

    // Social Media
    social: {
        instagram: {
            // Replace this with the Instagram PROFILE URL when available
            url: "",
            handle: "@al.malika.gn",
        },

        facebook: {
            url: "https://www.facebook.com/people/%D8%AD%D8%AC%D8%A7%D8%A8-%D8%B4%D8%B1%D8%B9%D9%8A-Al-Malika-Gn/100067391006608/?mibextid=wwXIfr&rdid=tfDv3fpavgxItHle&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1PTzzT5y95%2F%3Fmibextid%3DwwXIfr",
            handle: "حجاب شرعي Al Malika Gn",
        },

        twitter: {
            url: "",
            handle: "",
        },

        tiktok: {
            url: "https://www.tiktok.com/@al.malika.gn?_r=1&_t=ZS-91vzT1Fm183",
            handle: "@al.malika.gn",
        },

        whatsapp: {
            url: "",
            phone: "",
        },
    },

    // Locale & Currency
    locale: "ar-DZ",

    currency: {
        code: "DZD",
        symbol: "د.ج",
        position: "before" as const,
    },

    country: "DZ",

    // SEO
    seo: {
        titleTemplate: "%s | الملكة",
        defaultTitle: "الملكة — متجر كل مسلمة",

        openGraph: {
            type: "website",
            locale: "ar_DZ",
            siteName: "الملكة",
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
        text: "جميع الحقوق محفوظة.",
    },
} as const

export type SiteConfig = typeof siteConfig
export type CheckoutMode = "form" | "cart" | "both"
export type AddToCartRedirect = "cart" | "checkout" | "stay"

