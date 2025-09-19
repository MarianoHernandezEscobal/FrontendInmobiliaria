'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function HomeVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const videos = [
    '/videos/faro.mp4',
    'https://images-inmo.s3.us-east-2.amazonaws.com/principal.mp4',
    'https://images-inmo.s3.us-east-2.amazonaws.com/barco.mp4',
  ];

  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;

    const safePlay = async () => {
      try {
        currentVideo.currentTime = 0;
        await currentVideo.play();
      } catch (err) {
        console.warn('Error al reproducir:', err);
      }
    };

    safePlay();

    const handleEnded = () => {
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % videos.length;
        setCurrentIndex(nextIndex);
      }, 1); // tiempo de transición
    };

    currentVideo.addEventListener('ended', handleEnded);

    return () => {
      currentVideo.removeEventListener('ended', handleEnded);
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
      />

      {/* Videos precargados */}
      {videos.map((src, index) => (
        <video
          key={index}
          ref={(el) => {
            if (el) videoRefs.current[index] = el;
          }}
          className={clsx(
            'absolute w-full h-full object-cover transition-opacity duration-500',
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
          muted
          playsInline
          loop={false}
          preload="auto"
          src={src}
        />
      ))}

      {/* Flecha */}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <button
          className="text-white opacity-60 hover:opacity-100 transition-all duration-300 animate-bounce group"
          aria-label="Scroll hacia abajo"
          onClick={handleScroll}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Descubre más
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 group-hover:h-10 group-hover:w-10 transition-all duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 10l8 8 8-8" />
            </svg>
          </div>
        </button>
      </div>

    </section>
  );
}
