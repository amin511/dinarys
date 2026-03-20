"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { siteConfig } from "@/lib/config/site"

interface VideoSectionProps {
  embedded?: boolean
}

export default function VideoSection({ embedded = false }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideOverlayTimeout = useRef<NodeJS.Timeout | null>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setShowOverlay(true)
    } else {
      videoRef.current.play()
      // Auto-hide overlay after 2s when playing
      hideOverlayTimeout.current = setTimeout(() => setShowOverlay(false), 2000)
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVideoClick = () => {
    if (isPlaying) {
      setShowOverlay(true)
      // Auto-hide again after 3s
      if (hideOverlayTimeout.current) clearTimeout(hideOverlayTimeout.current)
      hideOverlayTimeout.current = setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused) {
          setShowOverlay(false)
        }
      }, 3000)
    }
  }

  // Track video progress
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }
    video.addEventListener("timeupdate", updateProgress)
    return () => video.removeEventListener("timeupdate", updateProgress)
  }, [])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (hideOverlayTimeout.current) clearTimeout(hideOverlayTimeout.current)
    }
  }, [])

  const videoPlayer = (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl group"
      style={{ width: "min(360px, 90vw)", aspectRatio: "9/16" }}
    >
      <video
        ref={videoRef}
        src={siteConfig.video.url}
        poster={siteConfig.video.poster}
        playsInline
        loop
        muted={isMuted}
        className="w-full h-full object-cover cursor-pointer"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => { setIsPlaying(false); setShowOverlay(true) }}
        onEnded={() => { setIsPlaying(false); setShowOverlay(true) }}
      />

      {/* Gradient overlay at bottom for readability */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-secondary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mute/unmute button - always visible */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200 z-10"
        aria-label={isMuted ? "Activer le son" : "Couper le son"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Play/pause overlay */}
      {showOverlay && (
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{ background: isPlaying ? "transparent" : "rgba(0,0,0,0.35)" }}
        >
          <span
            className="flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              width: 72,
              height: 72,
              background: "rgba(255,255,255,0.20)",
              border: "2px solid rgba(255,255,255,0.60)",
            }}
          >
            {isPlaying ? (
              <Pause className="text-white" size={32} />
            ) : (
              <Play className="text-white ml-1" size={32} fill="white" />
            )}
          </span>
        </button>
      )}
    </div>
  )

  if (embedded) return videoPlayer

  return (
    <section className="w-full py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle decorative elements with brand colors */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-[0.04] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, var(--secondary), transparent)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-[0.04] translate-x-1/3 translate-y-1/3" style={{ background: "radial-gradient(circle, var(--secondary), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left space-y-6 max-w-lg">
            {/* Decorative line */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="w-10 h-[2px] bg-secondary" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-secondary">
                Découvrez notre univers
              </span>
            </div>

            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2D2D2D] leading-tight">
              L&apos;Art de la <br />
              <span className="text-secondary">Confection</span>
            </h2>

            <p className="text-[#5A5A5A] leading-relaxed text-sm md:text-base">
              Plongez dans l&apos;univers de Nour Confection et découvrez notre savoir-faire artisanal. 
              Chaque pièce est confectionnée avec passion, alliant tradition algérienne et élégance moderne 
              pour sublimer vos moments les plus précieux.
            </p>

            <div className="flex items-center gap-4 justify-center lg:justify-start pt-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs text-[#6B6B6B] font-medium">Fait main</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs text-[#6B6B6B] font-medium">Tissu premium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs text-[#6B6B6B] font-medium">Broderie fine</span>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="relative flex-shrink-0">
            {/* Decorative border behind video */}
            <div className="absolute -inset-3 rounded-2xl border-2 border-secondary/20 -z-10" />
            <div className="absolute -inset-6 rounded-3xl border border-[#E5DDD3]/40 -z-20" />
            {videoPlayer}
          </div>
        </div>
      </div>
    </section>
  )
}
