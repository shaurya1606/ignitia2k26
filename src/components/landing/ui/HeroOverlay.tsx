'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Instagram, Linkedin, Menu, Twitter, X, Youtube } from 'lucide-react';
import CtaPillButton from './CtaPillButton';
import { LoginButton } from './login-button'
import { useRouter } from 'next/navigation';

/**
 * Overlay UI for the landing hero: menu, countdown, socials, and CTA buttons.
 * Positioned on top of the parallax background.
 */

const MenuOption = [
  {
    name: 'Home',
    href: '#',
  },
  {
    name: 'Gallery',
    href: '#',
  },
  {
    name: 'Sponsors',
    href: '#',
  },
  {
    name: 'Contact',
    href: '#',
  },
  {
    name: 'Leaderboard',
    href: '#',
  }
]

const HeroOverlay: React.FC = () => {

  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0 });

  // Countdown to upcoming Jan 1st
  React.useEffect(() => {
    const computeTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const eventYear =
        now.getMonth() > 0 || (now.getMonth() === 0 && now.getDate() > 1)
          ? currentYear + 1
          : currentYear;
      const eventDate = new Date(eventYear, 0, 1, 0, 0, 0);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
      const minutes = totalMinutes % 60;
      setTimeLeft({ days, hours, minutes });
    };

    computeTimeLeft();
    const id = window.setInterval(computeTimeLeft, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const handleNavigate = (href: string) => {
    router.push(href);
  }; 

  return (
    <div className="relative z-20 h-screen w-full">
      {/* Top bar: menu + countdown */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between px-6 pt-6 sm:px-10">
        {/* Menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 text-slate-100 shadow-[0_0_30px_rgba(0,0,0,0.75)] backdrop-blur hover:border-amber-300/80 hover:text-amber-200 transition-all ease-in-out cursor-pointer hover:scale-105"
          aria-label="Open navigation menu"
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <motion.div
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Menu className="h-7 w-7 drop-shadow-[0_0_14px_rgba(248,250,252,0.6)]" />
          </motion.div>
        </button>

        {/* Countdown */}
        <div className="pointer-events-auto rounded-full border border-white/25 bg-black/80 px-6 py-3 text-xs sm:text-sm md:text-base font-semibold tracking-[0.24em] uppercase text-amber-100 shadow-[0_0_22px_rgba(0,0,0,0.7)] hover:border-amber-300/90 cursor-none">
          <span className="mr-3 text-[10px] sm:text-xs text-slate-300">Ignitia begins in</span>
          <span className="text-amber-200">
            {String(timeLeft.days).padStart(2, '0')}d
          </span>
          <span className="mx-1 text-slate-500">·</span>
          <span className="text-amber-200">
            {String(timeLeft.hours).padStart(2, '0')}h
          </span>
          <span className="mx-1 text-slate-500">·</span>
          <span className="text-amber-200">
            {String(timeLeft.minutes).padStart(2, '0')}m
          </span>
        </div>
      </div>

      {/* Social icons bottom-left */}
      <div className="pointer-events-auto absolute bottom-8 left-6 flex flex-col gap-3 text-xs text-slate-300 sm:left-10 sm:bottom-12">
        <p className="text-[11px] sm:text-xs tracking-[0.26em] uppercase text-slate-400">
          Follow the signal
        </p>
        <div className="flex gap-3">
          {[Instagram, Youtube, Twitter, Linkedin].map((Icon, idx) => (
            <button
              key={idx}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/75 text-slate-100 shadow-[0_0_20px_rgba(0,0,0,0.75)] hover:scale-120 transition-transform ease-in-out cursor-pointer hover:border-amber-300/90 hover:text-amber-200"
              aria-label={`Open social link ${idx + 1}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>

      {/* CTAs bottom-right */}
      <div className="pointer-events-auto absolute bottom-8 right-6 flex flex-col items-end gap-3 sm:right-10 sm:bottom-12">
        <LoginButton asChild type="signup" mode="redirect">
          <CtaPillButton variant="primary">Register Now</CtaPillButton>
        </LoginButton>
        <LoginButton asChild type="login" mode="modal">
          <CtaPillButton variant="primary">Login</CtaPillButton>
        </LoginButton>
        <CtaPillButton variant="outline">Brochure</CtaPillButton>
      </div>

      {/* Fullscreen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="hero-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-30 bg-black/75 backdrop-blur-md flex flex-col"
            aria-modal="true"
            role="dialog"
          >
            <div className="absolute inset-0 flex flex-col">
              <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/75 text-slate-100"
                  aria-label="Close navigation menu"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                </button>
              </div>

              <nav
                aria-label="Primary"
                className="flex flex-1 flex-col items-center justify-center gap-5 text-center"
              >
                {MenuOption.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.32em] text-slate-100 hover:text-amber-200 transition-colors ease-in-out cursor-pointer"
                    onClick={() => {setMenuOpen(false);
                      handleNavigate(item.href);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroOverlay;
