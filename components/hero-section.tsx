"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

// Words that cycle in the animated subtitle
const SUBTITLE_WORDS = ["cosmétique", "premium", "algérienne", "naturelle"]
const WORD_INTERVAL = 2200 // ms per word

const slides = [
  { src: "/hero/prod1.jpeg", alt: "Nour Confection – collection 1" },
  { src: "/hero/prod2.jpeg", alt: "Nour Confection – collection 2" },
  { src: "/hero_dinarys2.png", alt: "Nour Confection – collection 3" },
]

const SLIDE_INTERVAL = 3000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (index: number) => {
    setCurrent((index + slides.length) % slides.length)
  }

  // Reset timer on manual navigation
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Word cycling animation
  useEffect(() => {
    const cycle = setInterval(() => {
      // fade out
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % SUBTITLE_WORDS.length)
        setWordVisible(true)
      }, 400) // wait for fade-out, then swap & fade in
    }, WORD_INTERVAL)
    return () => clearInterval(cycle)
  }, [])

  const handleDotClick = (i: number) => {
    goTo(i)
    startTimer()
  }

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "90svh",
        minHeight: "480px",
        overflow: "hidden",
      }}
      aria-label="Galerie Nour Confection"
    >
      {/* ── Slides Track ── */}
      <div
        style={{
          display: "flex",
          width: `${slides.length * 100}%`,
          height: "100%",
          transform: `translateX(-${(current * 100) / slides.length}%)`,
          transition: "transform 0.75s cubic-bezier(0.77, 0, 0.18, 1)",
          willChange: "transform",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              flex: `0 0 ${100 / slides.length}%`,
              height: "100%",
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        ))}
      </div>

      {/* ── Dark Overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.50)",
          pointerEvents: "none",
        }}
      />

      {/* ── Text ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          pointerEvents: "none",
          padding: "0 1rem",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
            fontSize: "clamp(2.8rem, 13vw, 7rem)",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#fff",
            textShadow: "0 4px 32px rgba(0,0,0,0.5)",
            lineHeight: 1,
            margin: 0,
          }}
        >
          DINARYS
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "0.6rem",
          }}
        >
          <span
            style={{
              display: "block",
              width: "clamp(1.5rem, 5vw, 3rem)",
              height: "1px",
              background: "rgba(255,255,255,0.7)",
            }}
          />
          <p
            style={{
              fontFamily:
                "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontSize: "clamp(1rem, 3vw, 1.875rem)",
              fontWeight: 300,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.9)",
              fontStyle: "italic",
              margin: 0,
              minWidth: "10ch",
              textAlign: "center",
              opacity: wordVisible ? 1 : 0,
              transform: wordVisible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {SUBTITLE_WORDS[wordIndex]}
          </p>
          <span
            style={{
              display: "block",
              width: "clamp(1.5rem, 5vw, 3rem)",
              height: "1px",
              background: "rgba(255,255,255,0.7)",
            }}
          />
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.5rem",
          zIndex: 10,
        }}
      >
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
              background:
                i === current ? "#fff" : "rgba(255,255,255,0.45)",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.35s ease, background 0.35s ease",
            }}
          />
        ))}
      </div>
    </section>
  )
}