'use client';

import { useEffect, useRef, useState } from 'react';

export default function HomeVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    'https://images-inmo.s3.us-east-2.amazonaws.com/faro.mp4',
    'https://images-inmo.s3.us-east-2.amazonaws.com/principal.mp4',
    'https://images-inmo.s3.us-east-2.amazonaws.com/barco.mp4',
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = 'auto';

    const safePlay = async () => {
      try {
        video.currentTime = 0;
        await video.play();
      } catch (err) {
        console.warn('Error al reproducir:', err);
      }
    };

    safePlay();

    const handleEnded = () => {
      const nextIndex = (currentIndex + 1) % videos.length;
      setCurrentIndex(nextIndex);

      const nextSrc = videos[nextIndex];

      const onLoad = () => {
        video.removeEventListener('loadeddata', onLoad);
        safePlay();
      };

      video.addEventListener('loadeddata', onLoad);
      video.src = nextSrc;
      video.load();
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex]);

  const handleScroll = () => {
    const target = document.getElementById('next-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Imagen fallback */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/fotosInmo.jpg?height=1080&width=1920')",
        }}
      ></div>

      {/* Video */}
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover z-0"
        muted
        playsInline
        loop={false}
        preload="auto"
        src={videos[currentIndex]}
      />

      {/* Flecha */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-20">
        <button
          className="text-white opacity-40 hover:opacity-80 transition-opacity duration-300 animate-bounce"
          aria-label="Scroll hacia abajo"
          onClick={handleScroll}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10l8 8 8-8" />
          </svg>
        </button>
      </div>
    </section>
  );
}
