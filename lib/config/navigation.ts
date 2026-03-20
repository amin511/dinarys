/**
 * Navigation Configuration
 * Define all navigation menus, links, and structure
 */

export interface NavItem {
    label: string
    href: string
    external?: boolean
    children?: NavItem[]
}

export const navigationConfig = {
    // Main navigation (desktop header)
    mainNav: [
        {
            label: "Accueil",
            href: "/",
        },
        {
            label: "Boutique",
            href: "/products",
        },
        {
            label: "À Propos",
            href: "/a-propos",
        },
    ] as NavItem[],

    // Footer navigation sections
    footerNav: {
        shop: {
            title: "Boutique",
            links: [
                { label: "Tous les Produits", href: "/products" },
                { label: "Nouveautés", href: "/#products" },
            ],
        },
        about: {
            title: "Nour Confection",
            links: [
                { label: "Qui sommes-nous", href: "/a-propos" },
                { label: "Notre savoir-faire", href: "/a-propos#savoir-faire" },
            ],
        },
        support: {
            title: "Contact",
            links: [
                { label: "Instagram", href: "https://www.instagram.com/nour.confection/", external: true },
                { label: "Facebook", href: "https://www.facebook.com/p/Nour-confection-100076232980561/", external: true },
                { label: "TikTok", href: "https://www.tiktok.com/@nour.confection", external: true },
                { label: "Appelez-nous", href: "tel:+213799533910" },
                { label: "Localisation", href: "https://maps.app.goo.gl/WMA2iAvKLS5z2caC7", external: true },
            ],
        },
    },

    // Announcement bar content
    announcement: {
        enabled: true,
        text: "Livraison partout en Algérie",
        link: null as string | null,
    },

    // Category ordering for menus
    categoryOrder: [
        "mariees",
        "bebes",
        "accessoires",
    ],

    // Categories to exclude from navigation
    excludedCategories: [
        "uncategorized",
        "non-classe",
    ],
} as const

export type NavigationConfig = typeof navigationConfig
