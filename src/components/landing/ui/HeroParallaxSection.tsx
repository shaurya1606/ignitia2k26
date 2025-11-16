"use client"
import * as React from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useRef } from 'react';
import HeroOverlay from './HeroOverlay';

export const HeroParallaxSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Scroll-driven parallax for the background only
  React.useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black text-slate-100"
    >
      {/* Base mountain + sky */}
      <div ref={bgRef} className="absolute inset-0">
        <Image
          src="/landing/background1.png"
          alt="Ignitia mountain nightscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Overlay UI (menu, countdown, socials, CTAs) */}
      <HeroOverlay />
    </section>
  );
};
