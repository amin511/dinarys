"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

// Words that cycle in the animated subtitle
const SUBTITLE_WORDS = ["cosmétique", "premium", "algérienne", "naturelle"]
const WORD_INTERVAL = 2200

const slides = [
  { src: "/hero/prod1.jpeg", alt: "Dinarys – collection 1" },
  { src: "/hero/prod2.jpeg", alt: "Dinarys – collection 2" },
  { src: "/hero_dinarys2.png", alt: "Dinarys – collection 3" },
]

const SLIDE_INTERVAL = 2200

export default function HeroSection() {
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
        setWordIndex((p) => (p + 1) % SUBTITLE_WORDS.length)
        setWordVisible(true)
      }, 380)
    }, WORD_INTERVAL)
    return () => clearInterval(cycle)
  }, [])

  const handleDotClick = (i: number) => {
    setCurrent(i)
    startTimer()
  }

  /* ── Shared text overlay ── */
  const TextOverlay = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4 z-10">
      <h1
        className="text-white"
        style={{
          fontFamily: "var(--font-playfair,'Playfair Display',serif)",
          fontSize: "clamp(2.8rem, 10vw, 6.5rem)",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textShadow: "0 4px 32px rgba(0,0,0,0.55)",
          lineHeight: 1,
          margin: 0,
        }}
      >
        DINARYS
      </h1>

      <div className="flex items-center gap-4 mt-3">
        <span className="block h-px bg-white/70" style={{ width: "clamp(1.5rem,5vw,3rem)" }} />
        <p
          style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "clamp(1rem, 2.5vw, 1.75rem)",
            fontWeight: 300,
            letterSpacing: "0.2em",
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
          {SUBTITLE_WORDS[wordIndex]}
        </p>
        <span className="block h-px bg-white/70" style={{ width: "clamp(1.5rem,5vw,3rem)" }} />
      </div>
    </div>
  )

  /* ── Dot indicators ── */
  const Dots = () => (
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
  const MobileHero = () => (
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
          transform: `translateX(-${(current * 100) / slides.length}%)`,
          transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
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
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/48 pointer-events-none" />
      <TextOverlay />
      <Dots />
    </div>
  )

  /* ═══════════════════════════════════════════════
     DESKTOP — 3-column triptych layout (>= lg)
  ═══════════════════════════════════════════════ */
  const DesktopHero = () => (
    <div
      className="hidden lg:flex relative overflow-hidden"
      style={{ height: "100vh", minHeight: "560px" }}
    >
      {/* 3 columns */}
      {slides.map((slide, i) => (
        <div
          key={i}
          onClick={() => handleDotClick(i)}
          className="relative flex-1 overflow-hidden cursor-pointer group"
          style={{
            /* Active column is wider */
            flexBasis: i === current ? "42%" : "29%",
            transition: "flex-basis 0.6s cubic-bezier(0.77,0,0.18,1)",
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 42vw, 29vw"
            style={{
              objectFit: "cover",
              objectPosition: "center top",
              transition: "transform 0.7s ease",
            }}
            className="group-hover:scale-105"
          />

          {/* Per-column dark gradient — lighter on active */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: i === current
                ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.15) 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Thin gold separator line between columns */}
          {i > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: "rgba(184,148,60,0.3)" }}
            />
          )}
        </div>
      ))}

      {/* Centered text overlay across all 3 columns */}
      <TextOverlay />

      {/* Bottom: dots + "Made in Algeria" badge */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-10 z-20">
        {/* Made in Algeria */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white/80 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(184,148,60,0.4)" }}
        >
          <span>🇩🇿</span>
          <span>Made in Algeria</span>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
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

        {/* Premium badge */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white/80 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(184,148,60,0.4)" }}
        >
          <span style={{ color: "#D4A843" }}>✦</span>
          <span>Premium</span>
        </div>
      </div>
    </div>
  )

  return (
    <section aria-label="Galerie Dinarys">
      <MobileHero />
      <DesktopHero />
    </section>
  )
}