"use client"

import { useEffect, useState } from "react"
import { heroConfig } from "@/lib/config/hero"
import { Playfair_Display, Cormorant_Garamond } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
})

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (heroConfig.autoRotate) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % heroConfig.slides.length)
      }, heroConfig.rotateInterval)

      return () => clearInterval(interval)
    }
  }, [])

  const currentSlide = heroConfig.slides[currentImage]

  return (
    <section className="relative w-full min-h-[70vh] lg:min-h-screen overflow-hidden bg-background">
      {/* Mobile Layout - Image with title */}
      <div className="lg:hidden relative h-[70vh]">
        {heroConfig.slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {slide.overlay && (
              <div
                className="absolute inset-0 bg-black pointer-events-none"
                style={{ opacity: slide.overlay / 100 }}
              />
            )}

            {/* Title overlay on mobile */}
            {slide.title && (
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className={`${playfair.className} text-5xl md:text-5xl font-bold tracking-wider text-white drop-shadow-2xl leading-tight text-center px-6`}>
                  {slide.title}
                </h1>
              </div>
            )}
          </div>
        ))}

        {/* Mobile Navigation Arrows */}
        <button
          onClick={() => setCurrentImage((prev) => (prev === 0 ? heroConfig.slides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentImage((prev) => (prev + 1) % heroConfig.slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Mobile Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroConfig.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${currentImage === index
                ? "bg-white w-8 shadow-lg"
                : "bg-white/40 w-2 hover:bg-white/60"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Layout - Split sections: Text Left | Image Right */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
        {/* Text Section */}
        <div className="flex flex-col justify-center items-start px-12 xl:px-20 2xl:px-28 py-16 bg-[#F5F0E8] text-[#2D2D2D]">
          <div className="max-w-xl space-y-8 animate-fade-in">
            {currentSlide.title && (
              <h1 className={`${playfair.className} text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-wide leading-tight`}>
                {currentSlide.title}
              </h1>
            )}
            {currentSlide.subtitle && (
              <p className={`${cormorant.className} text-xl xl:text-2xl font-light tracking-wide opacity-90 leading-relaxed`}>
                {currentSlide.subtitle}
              </p>
            )}
            {currentSlide.cta && (
              <div className="pt-4">
                <a
                  href={currentSlide.cta.href}
                  className={`${cormorant.className} inline-block px-10 py-4 bg-[#2D2D2D] text-white text-lg font-medium tracking-widest uppercase hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg`}
                >
                  {currentSlide.cta.text}
                </a>
              </div>
            )}

            {/* Desktop Navigation Dots */}
            <div className="flex gap-3 pt-8">
              {heroConfig.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentImage === index
                    ? "bg-[#2D2D2D] w-10"
                    : "bg-[#2D2D2D]/40 w-2 hover:bg-[#2D2D2D]/60"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative overflow-hidden">
          {heroConfig.slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"
                }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: heroConfig.imagePosition,
                backgroundRepeat: "no-repeat",
              }}
            >
              {slide.overlay && (
                <div
                  className="absolute inset-0 bg-black pointer-events-none"
                  style={{ opacity: slide.overlay / 100 }}
                />
              )}
            </div>
          ))}

          {/* Navigation Arrows on Image */}
          <button
            onClick={() => setCurrentImage((prev) => (prev === 0 ? heroConfig.slides.length - 1 : prev - 1))}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentImage((prev) => (prev + 1) % heroConfig.slides.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  )
}