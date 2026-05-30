"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

const LIFESTYLE_IMAGES = [
  "/generated/lifestyle-shampoo.jpg",
  "/generated/lifestyle-mask.jpg",
  "/generated/lifestyle-spray.jpg",
]
const FALLBACK_IMAGES = ["/generated/prod1.png", "/hero/prod2.jpeg", "/generated/prod3.jpeg"]
const PRODUCT_VOLUMES = ["250ml", "300g", "100ml"]
const PRODUCT_BENEFIT_ICONS = [
  ["💧", "✨"],
  ["💧", "🛡️"],
  ["☀️", "✨"],
]
const ACTIVE_EMOJIS = ["🌼", "🌸", "💊", "🌾", "💎"]

export default function IngredientsSection() {
  const t = useTranslations("ingredients")

  const products = [0, 1, 2].map((i) => ({
    name: t(`product${i + 1}Name`),
    subtitle: t(`product${i + 1}Subtitle`),
    description: t(`product${i + 1}Desc`),
    claim: t(`product${i + 1}Claim`),
    target: t(`product${i + 1}Target`),
    resultFirst: t(`product${i + 1}ResultFirst`),
    resultLong: i === 0 ? t("product1ResultLong") : null,
    howTo: i === 1 ? t("product2HowTo") : null,
    image: LIFESTYLE_IMAGES[i],
    fallback: FALLBACK_IMAGES[i],
    volume: PRODUCT_VOLUMES[i],
    benefits: [0, 1].map((bi) => ({
      icon: PRODUCT_BENEFIT_ICONS[i][bi],
      label: t(`product${i + 1}Benefit${bi + 1}Label`),
      desc: t(`product${i + 1}Benefit${bi + 1}Desc`),
    })),
  }))

  const actives = [0, 1, 2, 3, 4].map((i) => ({
    name: t(`active${i + 1}Name`),
    desc: t(`active${i + 1}Desc`),
    emoji: ACTIVE_EMOJIS[i],
  }))

  return (
    <section id="ingredients" className="bg-white">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <span
          className="inline-block text-white text-xs font-bold uppercase px-5 py-2 rounded-sm mb-6"
          style={{ background: "#B8943C" }}
        >
          {t("badge")}
        </span>
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1a1a1a] mb-4">
          {t("title")}
        </h2>
        <p className="text-[#5A5A5A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* ── Product Sections ── */}
      {products.map((product, i) => {
        const imageLeft = i % 2 === 0
        return (
          <div
            key={i}
            className="relative overflow-hidden"
            style={{ background: i % 2 === 0 ? "#fafaf8" : "#0d0d0d" }}
          >
            <div className={`max-w-7xl mx-auto flex flex-col ${imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"} min-h-[600px]`}>

              {/* ── Image half ── */}
              <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-[600px] overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  fallback={product.fallback}
                  alt={product.name}
                />
                {/* Volume badge */}
                <div
                  className="absolute bottom-6 end-6 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl z-10"
                  style={{ background: "#B8943C" }}
                >
                  {product.volume}
                </div>
                {/* Gradient overlay at bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 h-32 z-[1]"
                  style={{
                    background: i % 2 === 0
                      ? "linear-gradient(to top, #fafaf8, transparent)"
                      : "linear-gradient(to top, #0d0d0d, transparent)",
                  }}
                />
              </div>

              {/* ── Content half ── */}
              <div className={`w-full lg:w-1/2 flex items-center px-6 sm:px-10 lg:px-16 py-14 lg:py-20 ${i % 2 !== 0 ? "text-white" : "text-[#1a1a1a]"}`}>
                <div className="max-w-lg w-full">

                  {/* Target audience pill */}
                  <div
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase px-4 py-1.5 rounded-full mb-6"
                    style={{
                      background: "#D4A84318",
                      color: "#B8943C",
                      border: "1px solid #D4A84340",
                    }}
                  >
                    {product.target}
                  </div>

                  {/* Product name */}
                  <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug mb-4">
                    {product.name}
                  </h2>

                  {/* Subtitle line */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 max-w-[3rem]" style={{ background: "#B8943C" }} />
                    <p className="text-xs font-bold uppercase" style={{ color: "#B8943C" }}>
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className={`text-base leading-relaxed mb-6 ${i % 2 !== 0 ? "text-white/70" : "text-[#4A4A4A]"}`}>
                    {product.description}
                  </p>

                  {/* First-use result */}
                  <div
                    className="flex items-start gap-3 px-4 py-3 rounded-lg mb-3"
                    style={{ background: "#D4A84315", borderLeft: "3px solid #B8943C" }}
                  >
                    <span className="text-lg mt-0.5">✨</span>
                    <p className="text-sm font-semibold" style={{ color: "#B8943C" }}>
                      {product.resultFirst}
                    </p>
                  </div>

                  {/* Long-term result (shampoo only) */}
                  {product.resultLong && (
                    <div
                      className="flex items-start gap-3 px-4 py-3 rounded-lg mb-6"
                      style={{ background: "#D4A84310", borderLeft: "3px solid #D4A84370" }}
                    >
                      <span className="text-lg mt-0.5">📈</span>
                      <p className={`text-sm font-medium ${i % 2 !== 0 ? "text-white/80" : "text-[#4A4A4A]"}`}>
                        {product.resultLong}
                      </p>
                    </div>
                  )}

                  {/* How-to (mask only) */}
                  {product.howTo && (
                    <div
                      className="flex items-start gap-3 px-4 py-3 rounded-lg mb-6"
                      style={{ background: "#D4A84310", borderLeft: "3px solid #D4A84370" }}
                    >
                      <span className="text-lg mt-0.5">💆</span>
                      <p className={`text-sm ${i % 2 !== 0 ? "text-white/70" : "text-[#5A5A5A]"}`}>
                        {product.howTo}
                      </p>
                    </div>
                  )}

                  {!product.resultLong && !product.howTo && <div className="mb-6" />}

                  {/* Benefits */}
                  <div className="space-y-4">
                    {product.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base"
                          style={{ background: "#D4A84318", border: "1.5px solid #D4A84350" }}
                        >
                          {b.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase mb-0.5" style={{ color: "#B8943C" }}>
                            {b.label}
                          </p>
                          <p className={`text-sm leading-relaxed ${i % 2 !== 0 ? "text-white/60" : "text-[#5A5A5A]"}`}>
                            {b.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Claim */}
                  <p className={`mt-8 text-base font-semibold italic ${i % 2 !== 0 ? "text-white/90" : "text-[#1a1a1a]"}`}>
                    « {product.claim} »
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* ── Key Actives ── */}
      <div className="bg-[#0d0d0d] py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase px-5 py-2 rounded-sm mb-6"
              style={{ background: "#B8943C20", color: "#D4A843", border: "1px solid #B8943C50" }}
            >
              {t("activesBadge")}
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white mb-4">
              {t("activesTitle")}
            </h2>
            <p className="text-white/60 text-base max-w-xl mx-auto">
              {t("activesSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {actives.map((active, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-white/10 hover:border-[#B8943C]/50 transition-all duration-500 cursor-default text-center"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto transition-transform duration-500 group-hover:scale-110"
                  style={{ background: "#B8943C20", border: "1.5px solid #B8943C40" }}
                >
                  {active.emoji}
                </div>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: "#D4A843" }}>
                  {active.name}
                </h4>
                <p className="text-white/55 text-xs leading-relaxed">{active.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-14">
            <div
              className="flex items-center gap-3 px-8 py-4 rounded-full border"
              style={{ borderColor: "#B8943C40", background: "#B8943C10" }}
            >
              <span className="text-2xl">🇩🇿</span>
              <span className="text-white font-semibold text-sm uppercase">
                {t("madeInAlgeria")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Falls back to the product bottle image if the generated lifestyle image doesn't exist yet */
function ImageWithFallback({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover object-center"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src !== fallback) img.src = fallback
      }}
    />
  )
}
