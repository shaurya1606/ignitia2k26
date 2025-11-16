'use client';

import * as React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DoorsRevealSection } from './ui/DoorsRevealSection';
import { HeroParallaxSection } from './ui/HeroParallaxSection';
import { SmoothScrollLayout } from './ui/SmoothScrollLayout';
import { ReactLenis } from 'lenis/react';

// Register ScrollTrigger safely on the client.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Main landing scene composing the parallax hero and door reveal sections.
 */
const LandingScene: React.FC = () => {
  return (
    <>
    <ReactLenis root />
    <SmoothScrollLayout>
      <main className="min-h-screen bg-black text-slate-100">
        <HeroParallaxSection />
        <DoorsRevealSection />
      </main>
    </SmoothScrollLayout>
    </>
  );
};

export default LandingScene;
