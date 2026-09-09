
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
            label: "الرئيسية",
            href: "/",
        },
        {
            label: "المتجر",
            href: "/products",
        },
        {
            label: "من نحن",
            href: "/a-propos",
        },
    ] as NavItem[],

    // Footer navigation sections
    footerNav: {
        shop: {
            title: "المتجر",
            links: [
                {
                    label: "جميع المنتجات",
                    href: "/products",
                },
                {
                    label: "أحدث المنتجات",
                    href: "/#products",
                },
            ],
        },

        about: {
            title: "الملكة",
            links: [
                {
                    label: "من نحن",
                    href: "/a-propos",
                },
                {
                    label: "اللباس الشرعي",
                    href: "/products",
                },
            ],
        },

        support: {
            title: "تواصل معنا",
            links: [
                {
                    label: "Instagram",
                    href: "https://www.instagram.com/al.malika.gn/",
                    external: true,
                },
                {
                    label: "Facebook",
                    href: "https://www.facebook.com/people/%D8%AD%D8%AC%D8%A7%D8%A8-%D8%B4%D8%B1%D8%B9%D9%8A-Al-Malika-Gn/100067391006608/",
                    external: true,
                },
                {
                    label: "TikTok",
                    href: "https://www.tiktok.com/@al.malika.gn",
                    external: true,
                },
            ],
        },
    },

    // Announcement bar content
    announcement: {
        enabled: true,
        text: "🚚 توصيل إلى جميع أنحاء الجزائر",
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

