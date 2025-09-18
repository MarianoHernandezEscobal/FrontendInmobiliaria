'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function HomeVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videos = [
    'https://images-inmo.s3.us-east-2.amazonaws.com/faro.mp4',
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
      setIsTransitioning(true);
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % videos.length;
        setCurrentIndex(nextIndex);
        setIsTransitioning(false);
      }, 500); // tiempo de transición
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
