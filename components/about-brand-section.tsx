"use client"

import { useTranslations } from "next-intl"

export default function AboutBrandSection() {
  const t = useTranslations("about")

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Gold Badge */}
        <span
          className="inline-block  text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-6 "
          style={{ background: "#B8943C" }}
        >
          {t("storyBadge")}
        </span>

        {/* Heading */}
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium text-[#1a1a1a] leading-tight mb-6 text-start">
          {t("storyTitle")}
        </h2>

        {/* Description */}
        <p className="text-[#4A4A4A] leading-relaxed text-base md:text-lg mb-8 text-start">
          {t("storyPara1")}
        </p>

        {/* Flag + tagline */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">🇩🇿</span>
          <span className="text-sm font-semibold tracking-wider text-[#4A4A4A] uppercase">
            {t("madeIn")}
          </span>
        </div>

        {/* LIRE PLUS button */}
        <a
          href="/a-propos"
          className="inline-block border-2 text-[#1a1a1a] text-sm font-semibold tracking-widest uppercase px-8 py-3 transition-all duration-300"
          style={{
            borderColor: "#B8943C",
          }}
        >
          {t("heroBadge")}
        </a>
      </div>
    </section>
  )
}

