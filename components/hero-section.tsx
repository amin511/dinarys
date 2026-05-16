"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

const slides = [
  { src: "/hero_dinarys.png", alt: "Nour Confection – collection 1" },
  { src: "/hero_dinarys2.png", alt: "Nour Confection – collection 2" },
  { src: "/hero2.jpeg",        alt: "Nour Confection – collection 3" },
]

const SLIDE_INTERVAL = 5000 // ms between auto-advances

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return
      setIsAnimating(true)
      setCurrent(index)
      setTimeout(() => setIsAnimating(false), 700)
    },
    [isAnimating]
  )

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="hero-slider" aria-label="Galerie Nour Confection">
      {/* Slides track */}
      <div
        className="hero-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="hero-slide">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="hero-slide-img"
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="hero-overlay" />

      {/* Text Content */}
      <div className="hero-content">
        <h2 className="hero-title">DINARYS</h2>
        <div className="hero-subtitle-row">
          <span className="hero-line" />
          <p className="hero-subtitle">confection</p>
          <span className="hero-line" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? " hero-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .hero-slider {
          position: relative;
          width: 100%;
          height: 90vh;
          min-height: 480px;
          overflow: hidden;
        }

        /* ── Track: all slides side-by-side ── */
        .hero-track {
          display: flex;
          width: ${slides.length * 100}%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.77, 0, 0.18, 1);
          will-change: transform;
        }

        /* ── Each slide takes full viewport width ── */
        .hero-slide {
          position: relative;
          flex: 0 0 ${100 / slides.length}%;
          height: 100%;
        }

        .hero-slide-img {
          object-fit: cover;
          object-position: center;
        }

        /* ── Overlay ── */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.52);
          pointer-events: none;
        }

        /* ── Text ── */
        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
        }

        .hero-title {
          font-family: var(--font-playfair, 'Playfair Display', serif);
          font-size: clamp(3rem, 14vw, 7rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #fff;
          text-shadow: 0 4px 32px rgba(0,0,0,0.5);
          line-height: 1;
          margin: 0;
          padding: 0 0.5rem;
        }

        @media (min-width: 640px) {
          .hero-title { letter-spacing: 0.18em; }
        }

        .hero-subtitle-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .hero-line {
          display: block;
          width: 2rem;
          height: 1px;
          background: rgba(255,255,255,0.7);
        }

        @media (min-width: 768px) {
          .hero-line { width: 3rem; }
        }

        .hero-subtitle {
          font-family: var(--font-cormorant, 'Cormorant Garamond', serif);
          font-size: clamp(1.1rem, 3vw, 1.875rem);
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.9);
          font-style: italic;
          margin: 0;
        }

        /* ── Dots ── */
        .hero-dots {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          transition: background 0.3s, transform 0.3s;
          padding: 0;
        }

        .hero-dot--active {
          background: #fff;
          transform: scale(1.35);
        }

        .hero-dot:hover:not(.hero-dot--active) {
          background: rgba(255, 255, 255, 0.75);
        }
      `}</style>
    </section>
  )
}