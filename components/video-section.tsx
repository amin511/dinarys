"use client"

import { useState, useRef } from "react"
import { Play, Pause } from "lucide-react"
import { siteConfig } from "@/lib/config/site"

interface VideoSectionProps {
  embedded?: boolean
}

export default function VideoSection({ embedded = false }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setShowOverlay(true)
    } else {
      videoRef.current.play()
      setShowOverlay(false)
    }
    setIsPlaying(!isPlaying)
  }

  const handleVideoClick = () => {
    if (isPlaying) {
      setShowOverlay(true)
      videoRef.current?.pause()
      setIsPlaying(false)
    }
  }

  const videoPlayer = (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl"
      style={{ width: "min(340px, 90vw)", aspectRatio: "9/16" }}
    >
      <video
        ref={videoRef}
        src={siteConfig.video.url}
        poster={siteConfig.video.poster}
        playsInline
        loop
        className="w-full h-full object-cover cursor-pointer"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => { setIsPlaying(false); setShowOverlay(true) }}
        onEnded={() => { setIsPlaying(false); setShowOverlay(true) }}
      />

      {showOverlay && (
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.30)" }}
        >
          <span
            className="flex items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95"
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
    <section className="w-full py-12 bg-black flex flex-col items-center">
      <h2 className="text-white text-2xl font-semibold tracking-wide mb-8 uppercase">
        Notre Vidéo
      </h2>
      {videoPlayer}
    </section>
  )
}
