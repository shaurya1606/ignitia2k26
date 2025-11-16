'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface MinimalPreloaderProps {
  /**
   * When true, triggers the exit animation.
   */
  loaded?: boolean;
  /**
   * Called after the exit animation completes.
   */
  onFinish?: () => void;
}

export interface MinimalPreloaderHandle {
  finish: () => void;
}

/**
 * Minimal preloader with top progress bar and rotating loader icon.
 */
export const MinimalPreloader = React.forwardRef<
  MinimalPreloaderHandle,
  MinimalPreloaderProps
>(({ loaded, onFinish }, ref) => {
  const [windowLoaded, setWindowLoaded] = React.useState(false);
  const [manualFinished, setManualFinished] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  const displayProgress = Math.round(progress);

  // Register imperative handle
  React.useImperativeHandle(
    ref,
    () => ({
      finish() {
        setManualFinished(true);
      },
    }),
    []
  );

  // window.onload fallback
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleLoad = () => setWindowLoaded(true);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Progress bar animation
  React.useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      setProgress((current / steps) * 100);

      if (current >= steps) {
        clearInterval(timer);
        setProgress(100);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Trigger exit when loaded
  React.useEffect(() => {
    if (!showOverlay) return;
    if (loaded || windowLoaded || manualFinished || progress >= 100) {
      // Small delay after progress completes
      const timeout = setTimeout(() => {
        setShowOverlay(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
    return;
  }, [loaded, manualFinished, windowLoaded, showOverlay, progress]);

  const handleExitComplete = () => {
    if (onFinish) onFinish();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {showOverlay && (
        <motion.div
          key="minimal-preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black"
        >
          {/* Progress bar at the top */}
          <div className="absolute left-0 top-0 h-1 w-full bg-white/10">
            <motion.div
              className="h-full bg-linear-to-r from-amber-200 via-yellow-400 to-amber-500"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>

          {/* Bold numeric percentage at bottom-right */}
          <motion.div
            className="absolute bottom-6 right-8 text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.25em] uppercase"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-linear-to-br from-amber-100 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(250,204,21,0.85)]">
              {displayProgress}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MinimalPreloader.displayName = 'MinimalPreloader';

export default MinimalPreloader;
