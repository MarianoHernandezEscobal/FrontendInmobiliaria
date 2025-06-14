"use client"

import { useEffect, useRef, useState } from "react"

interface Video {
  id: string
  title: string
  url: string
  thumbnail?: string
  description?: string
}

interface HomeVideoCenteredProps {
  videos: Video[]
  maxWidth?: number
}

export default function VideoCarousel({ videos }: HomeVideoCenteredProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const currentVideo = videos[currentIndex]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.preload = "auto"

    const safePlay = async () => {
      try {
        video.currentTime = 0
        setIsLoading(true)
        await video.play()
        setIsLoading(false)
      } catch (err) {
        console.warn("Error al reproducir:", err)
        setIsLoading(false)
      }
    }

    safePlay()

    const handleEnded = () => {
      const nextIndex = (currentIndex + 1) % videos.length
      setCurrentIndex(nextIndex)

      const nextSrc = videos[nextIndex].url

      const onLoad = () => {
        video.removeEventListener("loadeddata", onLoad)
        safePlay()
      }

      video.addEventListener("loadeddata", onLoad)
      video.src = nextSrc
      video.load()
    }

    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("ended", handleEnded)
    }
  }, [currentIndex, videos])

  return (
    <section className="relative py-8">
      <div className="mx-auto relative overflow-hidden shadow-xl w-full">
        {/* Título del video */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-6">
          <h2 className="text-white text-2xl md:text-3xl font-bold">{currentVideo.title}</h2>
          {currentVideo.description && (
            <p className="text-white/80 text-sm md:text-base mt-2 max-w-2xl">{currentVideo.description}</p>
          )}
        </div>

        {/* Video */}
        <div className="aspect-video w-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            loop={false}
            preload="auto"
            src={currentVideo.url}
            poster={currentVideo.thumbnail}
          />
        </div>

        {/* Indicadores de video */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {videos.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Indicador de carga */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/30">
            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </section>
  )
}

