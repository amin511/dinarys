/**
 * Hero Section Configuration
 * Customize hero banners, slides, and CTAs
 */

export interface HeroSlide {
    image: string
    title?: string
    subtitle?: string
    cta?: {
        text: string
        href: string
    }
    overlay?: number // 0-100 opacity percentage
}

export const heroConfig = {
    // Auto-rotate settings
    autoRotate: true,
    rotateInterval: 10000, // milliseconds

    // Slides
    slides: [
        {
            image: "/cover.jpeg",
            title: "Neyla Collection",
            subtitle: "Mode féminine raffinée, robes d'hôtesse et pièces traditionnelles. Des créations élégantes avec tissus de qualité et broderie professionnelle.",
            overlay: 30,
        },
        {
            image: "/cover.jpeg",
            title: "Collection 2026",
            subtitle: "Chaque pièce est confectionnée avec soin pour que chaque femme se sente belle, confiante et unique.",
            overlay: 30,
        },
    ] as HeroSlide[],

    // Hero height
    height: {
        mobile: "70vh",
        desktop: "90vh", // ou "100vh" pour plein écran
    },

    // Image position (CSS object-position value)
    // Options: "center center", "center top", "center bottom", "top", "bottom"
    imagePosition: "center top", // ou "center center", "center bottom"

    // Typography styles
    typography: {
        title: "text-4xl md:text-6xl font-light tracking-tight text-white",
        subtitle: "text-lg md:text-xl text-white/90 mt-4",
    },
} as const

export type HeroConfig = typeof heroConfig
