"use client"
import * as React from 'react';
import Lenis from 'lenis';
import { useRef } from 'react';

export const SmoothScrollLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const frameIdRef = useRef<number | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.12,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      frameIdRef.current = window.requestAnimationFrame(raf);
    };

    frameIdRef.current = window.requestAnimationFrame(raf);

    return () => {
      if (frameIdRef.current != null) {
        window.cancelAnimationFrame(frameIdRef.current);
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};