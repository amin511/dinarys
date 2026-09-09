
/**
 * Theme Configuration
 * Visual styling and design tokens
 * Al Malika — الملكة
 */

export const themeConfig = {
    // Color Palette
    colors: {
        // Primary brand color — Al Malika gold
        primary: {
            light: "#D09118",
            dark: "#D09118",
        },

        // Warm neutral tones
        secondary: {
            light: "#F7F3EC",
            dark: "#29251F",
        },

        // Accent color
        accent: {
            light: "#E5B95A",
            dark: "#C58A12",
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
            maxWidth: "80rem",
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
            borderRadius: "full",
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
            width: "14rem",
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

