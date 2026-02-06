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
            label: "Produits",
            href: "/products",
        },
    ] as NavItem[],

    // Footer navigation sections
    footerNav: {
        shop: {
            title: "Shop",
            links: [
                { label: "Tous les Produits", href: "/products" },
                { label: "Nouveautés", href: "/#products" },
            ],
        },
        support: {
            title: "Support",
            links: [
                { label: "Contactez-nous", href: "https://www.instagram.com/neyla_collection_/", external: true },
                { label: "Appelez-nous", href: "tel:+213770499357" },
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
    // Categories will be sorted in this order
    categoryOrder: [
        "collection",
        "caftans",
        "ensembles-abayas",
        "accessoires",
    ],

    // Categories to exclude from navigation
    excludedCategories: [
        "uncategorized",
        "non-classe",
    ],
} as const

export type NavigationConfig = typeof navigationConfig
