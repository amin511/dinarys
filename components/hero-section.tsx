"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { BLUR_DATA_URL } from "@/lib/utils/blur"

const WORD_INTERVAL = 2200

const slides = [
  { src: "/hero/prod1.jpeg", alt: "Dinarys – collection 1" },
  { src: "/hero/prod22.jpeg", alt: "Dinarys – collection 2" },
  { src: "/hero/prod44.jpeg", alt: "Dinarys – collection 3" },
]

const SLIDE_INTERVAL = 3000

export default function HeroSection() {
  const t = useTranslations("hero")
  const locale = useLocale()
  const isArabic = locale === "ar"
  const words: string[] = t.raw("words")

  const titleFont = "var(--font-heading)"

  const [current, setCurrent] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Slide timer ── */
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      SLIDE_INTERVAL
    )
  }
  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Word cycling ── */
  useEffect(() => {
    const cycle = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex((p) => (p + 1) % words.length)
        setWordVisible(true)
      }, 380)
    }, WORD_INTERVAL)
    return () => clearInterval(cycle)
  }, [words.length])

  const handleDotClick = (i: number) => {
    setCurrent(i)
    startTimer()
  }

  /* ── Shared text overlay ── */
  const renderTextOverlay = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4 z-10">
      <h1
        className="text-white"
        style={{
          fontFamily: titleFont,
          fontSize: isArabic ? "clamp(3rem, 10vw, 7rem)" : "clamp(2.8rem, 10vw, 6.5rem)",
          fontWeight: 700,
          letterSpacing: isArabic ? 0 : "0.14em",
          textShadow: "0 4px 32px rgba(0,0,0,0.55)",
          lineHeight: 1,
          margin: 0,
        }}
      >
        {isArabic ? "ديناريز" : "DINARYS"}
      </h1>

      <div className="flex items-center gap-4 mt-3">
        <span className="block h-px bg-white/70" style={{ width: "clamp(1.5rem,5vw,3rem)" }} />
        <p
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "clamp(1rem, 2.5vw, 1.75rem)",
            fontWeight: 300,
            letterSpacing: isArabic ? 0 : "0.2em",
            color: "rgba(255,255,255,0.9)",
            fontStyle: "italic",
            margin: 0,
            minWidth: "10ch",
            textAlign: "center",
            opacity: wordVisible ? 1 : 0,
            transform: wordVisible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.38s ease, transform 0.38s ease",
          }}
        >
          {words[wordIndex]}
        </p>
        <span className="block h-px bg-white/70" style={{ width: "clamp(1.5rem,5vw,3rem)" }} />
      </div>
    </div>
  )

  /* ── Dot indicators ── */
  const renderDots = () => (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => handleDotClick(i)}
          aria-label={`Slide ${i + 1}`}
          style={{
            width: i === current ? "24px" : "8px",
            height: "8px",
            borderRadius: "9999px",
            border: "none",
            background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
            cursor: "pointer",
            padding: 0,
            transition: "width 0.35s ease, background 0.35s ease",
          }}
        />
      ))}
    </div>
  )

  /* ═══════════════════════════════════════════════
     MOBILE  — full-width slider (< lg)
  ═══════════════════════════════════════════════ */
  const renderMobileHero = () => (
    <div
      className="relative lg:hidden overflow-hidden"
      style={{ height: "90svh", minHeight: "480px" }}
    >
      {/* Track */}
      <div
        style={{
          display: "flex",
          width: `${slides.length * 100}%`,
          height: "100%",
          transform: `translate3d(${isArabic ? "" : "-"}${(current * 100) / slides.length}%, 0, 0)`,
          transition: "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
          willChange: "transform",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{ position: "relative", flex: `0 0 ${100 / slides.length}%`, height: "100%" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/48 pointer-events-none" />
      {renderTextOverlay()}
      {renderDots()}
    </div>
  )

  /* ═══════════════════════════════════════════════
     DESKTOP — Vertical accordion layout (>= lg)
  ═══════════════════════════════════════════════ */
  const renderDesktopHero = () => (
    <div
      className="hidden lg:flex relative overflow-hidden"
      style={{ height: "100vh", minHeight: "560px" }}
    >
      {slides.map((slide, i) => {
        const isActive = i === current
        return (
          <div
            key={i}
            onClick={() => handleDotClick(i)}
            className="relative overflow-hidden cursor-pointer group"
            style={{
              flexBasis: isActive ? "60%" : "20%",
              transition: "flex-basis 0.9s cubic-bezier(0.65, 0, 0.35, 1)",
              willChange: "flex-basis",
            }}
          >
            {/* Image — Ken Burns only on active */}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 60vw, 20vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{ objectFit: "cover", objectPosition: "center top" }}
              className={isActive ? "animate-ken-burns" : ""}
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: isActive
                  ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 45%, transparent 75%)"
                  : "rgba(0,0,0,0.65)",
              }}
            />
            {/* Hover lightening on inactive */}
            {!isActive && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/-20 transition-all duration-300" />
            )}

            {/* Gold separator between columns */}
            {i > 0 && (
              <div
                className="absolute start-0 top-0 bottom-0 w-px z-10"
                style={{ background: "rgba(184,148,60,0.35)" }}
              />
            )}

            {/* INACTIVE — vertical collection number */}
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span
                  className="text-white/50 group-hover:text-white/90 transition-colors duration-300 font-light select-none"
                  style={{
                    transform: "rotate(-90deg)",
                    letterSpacing: isArabic ? 0 : "0.35em",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-primary)",
                  }}
                >
                  0{i + 1}
                </span>
              </div>
            )}

            {/* ACTIVE — text card slides up from bottom */}
            {isActive && (
              <div
                className="absolute bottom-8 left-8 right-8 z-20"
                style={{
                  transform: isActive ? "translateY(0)" : "translateY(50px)",
                  opacity: isActive ? 1 : 0,
                  transition: isActive
                    ? "transform 0.65s cubic-bezier(0.2, 0.8, 0.3, 1) 0.35s, opacity 0.55s ease 0.35s"
                    : "transform 0.25s ease, opacity 0.2s ease",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                {/* Brand name */}
                <h1
                  className="text-white mb-3"
                  style={{
                    fontFamily: titleFont,
                    fontSize: isArabic ? "clamp(2.4rem, 4vw, 3.8rem)" : "clamp(2.2rem, 4vw, 3.5rem)",
                    fontWeight: 700,
                    letterSpacing: isArabic ? 0 : "0.18em",
                    lineHeight: 1,
                    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  {isArabic ? "ديناريز" : "DINARYS"}
                </h1>

                {/* Gold line */}
                <div
                  className="mb-3"
                  style={{ width: "2.5rem", height: "1px", background: "#D4A843" }}
                />

                {/* Cycling word */}
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-cormorant,'Montserrat',sans-serif)",
                    fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
                    fontWeight: 300,
                    letterSpacing: isArabic ? 0 : "0.2em",
                    color: "rgba(255,255,255,0.82)",
                    fontStyle: "italic",
                    minWidth: "8ch",
                    opacity: wordVisible ? 1 : 0,
                    transform: wordVisible ? "translateY(0)" : "translateY(5px)",
                    transition: "opacity 0.38s ease, transform 0.38s ease",
                  }}
                >
                  {words[wordIndex]}
                </p>

                {/* Made in Algeria */}
                <p
                  className="mb-5 flex items-center gap-1.5"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: isArabic ? 0 : "0.25em",
                    color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-primary)",
                  }}
                >
                  <span>🇩🇿</span>
                  <span>{t("madeInAlgeria")}</span>
                </p>

                {/* CTA button */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn inline-flex items-center gap-3 px-6 py-2.5 text-white transition-all duration-300"
                  style={{
                    border: "1px solid rgba(212,168,67,0.7)",
                    fontSize: "0.72rem",
                    letterSpacing: isArabic ? 0 : "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-primary)",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    ; (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,168,67,0.18)"
                      ; (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4A843"
                  }}
                  onMouseLeave={(e) => {
                    ; (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                      ; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,168,67,0.7)"
                  }}
                >
                  <span>{t("discover")}</span>
                  <span
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                    style={{ color: "#D4A843" }}
                  >
                    ——→
                  </span>
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Slide counter — top right */}
      <div
        className="absolute top-6 end-10 z-20 font-light"
        style={{
          fontSize: "0.7rem",
          letterSpacing: isArabic ? 0 : "0.25em",
          color: "rgba(255,255,255,0.45)",
          fontFamily: "var(--font-primary)",
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </div>
  )

  return (
    <section aria-label="Galerie Dinarys">
      {renderMobileHero()}
      {renderDesktopHero()}
    </section>
  )
}
