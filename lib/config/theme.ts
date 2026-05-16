/**
 * Theme Configuration
 * Visual styling and design tokens
 * Customize colors, fonts, spacing for different brands
 */

export const themeConfig = {
    // Color Palette (semantic colors)
    colors: {
        // Primary brand colors
        primary: {
            light: "#d6a853",
            dark: "#d6a853",
        },
        // Secondary/accent colors
        secondary: {
            light: "oklch(0.92 0.02 70)",
            dark: "oklch(0.25 0.02 70)",
        },
        // Accent color (calls to action)
        accent: {
            light: "oklch(0.65 0.15 30)",
            dark: "oklch(0.75 0.15 30)",
        },
    },

    // Typography
    fonts: {
        heading: "Cinzel",
        body: "Montserrat",
        mono: "Geist Mono",
    },

    // Border Radius
    radius: {
        none: "0",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
    },

    // Spacing scale
    spacing: {
        section: {
            sm: "2rem",
            md: "4rem",
            lg: "6rem",
        },
        container: {
            maxWidth: "80rem", // 1280px
            padding: "1rem",
        },
    },

    // Transitions
    transitions: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
    },

    // Component-specific styles
    components: {
        button: {
            borderRadius: "full", // "full" | "lg" | "md" | "sm" | "none"
            size: {
                sm: "py-2 px-4 text-sm",
                md: "py-3 px-6 text-base",
                lg: "py-4 px-8 text-lg",
            },
        },
        card: {
            borderRadius: "sm",
            shadow: false,
        },
        input: {
            borderRadius: "sm",
        },
    },

    // Layout
    layout: {
        header: {
            sticky: true,
            height: "4rem",
            showAnnouncement: true,
        },
        footer: {
            columns: 4,
        },
        sidebar: {
            width: "14rem", // 224px
            showOnProductPage: true,
        },
    },

    // Animation settings
    animations: {
        enabled: true,
        fadeInRise: {
            duration: "0.6s",
            delay: "0.1s",
        },
    },
} as const

export type ThemeConfig = typeof themeConfig
