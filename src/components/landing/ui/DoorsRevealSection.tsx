"use client";

import * as React from 'react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import Image from 'next/image';


export const DoorsRevealSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const doorLeftRef = useRef<HTMLDivElement | null>(null);
  const doorRightRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!sectionRef.current || !doorLeftRef.current || !doorRightRef.current) return;

    const ctx = gsap.context(() => {
      // Doors slide outwards on scroll
      gsap.to(doorLeftRef.current, {
        xPercent: -160,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });

      gsap.to(doorRightRef.current, {
        xPercent: 160,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
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
      {/* Blurred background behind the doors */}
      <div className="absolute inset-0 scale-105 blur-md">
        <Image
          src="/landing/background1.png"
          alt="Blurred mountain nightscape"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Dark overlay to push focus to gates */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Doors fully covering the screen initially */}
      <div className="relative z-10 flex min-h-screen items-stretch justify-center">
        <div className="relative flex h-screen w-screen items-stretch justify-center">
          {/* Left door */}
          <div
            ref={doorLeftRef}
            className="relative z-20 h-full w-1/2 origin-left"
          >
            <Image
              src="/landing/Door1.png"
              alt="Left gate"
              fill
              sizes="50vw"
              className="object-cover object-right"
            />
          </div>

          {/* Right door */}
          <div
            ref={doorRightRef}
            className="relative z-20 h-full w-1/2 origin-right"
          >
            <Image
              src="/landing/Door2.png"
              alt="Right gate"
              fill
              sizes="50vw"
              className="object-cover object-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
