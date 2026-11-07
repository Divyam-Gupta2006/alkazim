'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import GlassSurface from '@/components/GlassSurface'; // adjust path if needed

const NAV_LINKS = [
  { label: 'Who We Serve', href: '#who-we-serve' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Platform', href: '#platform' },
  { label: 'Partnership', href: '#contact' },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isPastThreshold = latest > 80;
    if (isPastThreshold !== scrolled) {
      setScrolled(isPastThreshold);
    }
  });

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-8 md:pt-6">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          // isolation: isolate gives this its own compositing boundary, so the
          // glass backdrop is derived from a stable, self-contained layer
          // rather than re-deriving through whatever is scroll-animating
          // beneath it on the page.
          style={{ isolation: 'isolate' }}
          className={`pointer-events-auto w-full transition-all duration-500 ease-out ${
            scrolled ? 'max-w-[980px]' : 'max-w-[1240px]'
          }`}
        >
          {/*
            refraction is deliberately OFF here.

            With refraction on and no `backdrop` prop supplied, GlassSurface's
            WebGL path (Boolean(backdrop) === false) never engages, so Chrome
            falls back to an SVG `backdrop-filter: url(#...)` chromatic-
            refraction filter. That filter path is what produced the frozen,
            rainbow-fringed smear under the nav during scroll — Chrome doesn't
            reliably re-rasterize a custom SVG backdrop-filter against a
            fast-scrolling, multi-layer page, so it was running a channel-
            splitting filter over a *stale* frame. Turning refraction off
            drops GlassSurface into its plain CSS `backdrop-filter: blur(...)`
            fallback, which Chrome's compositor handles natively and reliably.

            If you want the fancier liquid-glass refraction back on the nav
            specifically, it needs a real `backdrop` source (e.g. a live
            canvas snapshot of the page) so the WebGL path can engage instead
            of the fragile SVG one — that's a bigger follow-up, not a one-line
            toggle.
          */}
          <GlassSurface
            width="100%"
            height={scrolled ? 60 : 68}
            borderRadius={999}
            borderWidth={0.06}
            brightness={60}
            opacity={0.94}
            blur={14}
            displace={0.35}
            distortionScale={-140}
            backgroundOpacity={scrolled ? 0.22 : 0.12}
            saturation={1.2}
            refraction={false}
            className="transition-all duration-500"
          >
            <nav
              aria-label="Main Navigation"
              className="flex h-full w-full items-center justify-between px-4 md:px-6"
            >
              {/* LEFT: BRAND LOGO */}
              <Link
                href="/"
                className="group flex items-center gap-2.5 text-ink focus:outline-none"
              >
                {/* Compact Infinity Loop SVG */}
                <svg
                  width="32"
                  height="18"
                  viewBox="0 0 64 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-300 group-hover:scale-105"
                >
                  <path
                    d="M18 6C10.268 6 4 11.373 4 18C4 24.627 10.268 30 18 30C25.5 30 29.5 23.5 32 18C34.5 12.5 38.5 6 46 6C53.732 6 60 11.373 60 18C60 24.627 53.732 30 46 30C38.5 30 34.5 23.5 32 18C29.5 12.5 25.5 6 18 6Z"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="font-serif text-xl tracking-[-0.03em] text-[#111110]">
                  Endloops
                </span>
              </Link>

              {/* CENTER: DESKTOP NAVIGATION LINKS */}
              <ul
                onMouseLeave={() => setHoveredIdx(null)}
                className="hidden items-center gap-1 md:flex"
              >
                {NAV_LINKS.map((item, idx) => (
                  <li key={item.label} className="relative">
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      className="relative z-10 block px-4 py-2 text-sm font-medium tracking-[-0.01em] text-[#242424]/80 transition-colors hover:text-[#111110]"
                    >
                      {item.label}
                    </Link>

                    <AnimatePresence>
                      {hoveredIdx === idx && (
                        <motion.span
                          layoutId="nav-glass-pill"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute inset-0 -z-0 rounded-full bg-black/[0.05] ring-1 ring-black/[0.04]"
                        />
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>

              {/* RIGHT: CTA BUTTONS + MOBILE TOGGLE */}
              <div className="flex items-center gap-2.5">
                <Link
                  href="/contact"
                  className="hidden rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#242424]/80 transition-colors hover:text-[#111110] sm:inline-flex"
                >
                  Contact
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#79AE9B] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-[#659C88] hover:shadow"
                >
                  <span>Request a demo</span>
                  <ArrowUpRight size={14} />
                </Link>

                {/* Mobile Hamburger Button */}
                <button
                  type="button"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  aria-label="Toggle Menu"
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.05] text-[#111110] transition-colors hover:bg-black/[0.1] md:hidden"
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </nav>
          </GlassSurface>
        </motion.div>
      </header>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ isolation: 'isolate' }}
            className="fixed inset-x-4 top-[88px] z-40 md:hidden"
          >
            {/* refraction off here too, for the same reason as the desktop pill */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={28}
              borderWidth={0.05}
              brightness={65}
              opacity={0.96}
              blur={16}
              displace={0.25}
              distortionScale={-100}
              backgroundOpacity={0.35}
              saturation={1.2}
              refraction={false}
            >
              <div className="flex w-full flex-col divide-y divide-black/[0.06] p-5">
                <div className="flex flex-col gap-1 pb-4">
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-2.5 font-serif text-lg text-[#111110] transition-colors hover:bg-black/[0.04]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5 pt-4">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#79AE9B] py-3 text-sm font-semibold text-white shadow-sm"
                  >
                    Request a demo <ArrowUpRight size={15} />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center rounded-full border border-black/10 py-2.5 text-sm font-medium text-[#111110]"
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            </GlassSurface>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}