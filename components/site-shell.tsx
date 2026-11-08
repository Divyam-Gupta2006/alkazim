"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { DemoModal } from "./ui";
import GlassSurface from "@/components/GlassSurface";

const nav = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const path = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <nav aria-label="Main navigation" className="hidden md:block">
      <ul
        onMouseLeave={() => setHoveredIdx(null)}
        className="flex items-center gap-1"
      >
        {nav.map((item, idx) => {
          const isActive =
            item.href === "/" ? path === "/" : path?.startsWith(item.href);
          const isHighlighted = hoveredIdx === idx || (hoveredIdx === null && isActive);

          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`relative z-10 block px-4 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 ${
                  isActive
                    ? "text-ink font-semibold"
                    : "text-slate/80 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>

              <AnimatePresence>
                {isHighlighted && (
                  <motion.span
                    layoutId="header-nav-pill"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className={`absolute inset-0 -z-0 rounded-full ${
                      isActive
                        ? "bg-[#79AE9B]/15 ring-1 ring-[#79AE9B]/35"
                        : "bg-ink/[0.05] ring-1 ring-ink/[0.04]"
                    }`}
                  />
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Header() {
  const path = usePathname();
  const { scrollY } = useScroll();
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 60;
    setScrolled((prev) => (prev !== next ? next : prev));
  });

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <div
          className={`pointer-events-auto mx-auto transition-all duration-500 ease-out ${
            scrolled ? "max-w-[1180px]" : "max-w-[1400px]"
          }`}
        >
          <GlassSurface
            width="100%"
            height={scrolled ? 60 : 68}
            borderRadius={999}
            borderWidth={0.06}
            brightness={58}
            opacity={0.94}
            blur={14}
            displace={0.35}
            distortionScale={-150}
            backgroundOpacity={scrolled ? 0.28 : 0.14}
            saturation={1.2}
            refraction
            className="transition-all duration-500"
          >
            <div className="flex h-full w-full items-center justify-between px-4 md:px-6">
              {/* Brand / Logo Slot */}
              <Link
                href="/"
                className="group flex h-9 items-center gap-2.5"
                aria-label="Endloops home"
              >
                <Image
                  src="/images/logo.webp"
                  alt="Endloops logo"
                  width={32}
                  height={26}
                  priority
                  className="h-7 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-serif text-xl font-semibold tracking-[-0.03em] text-ink">
                  Endloops
                </span>
              </Link>

              {/* Center Links */}
              <Navbar />

              {/* Right Desktop Actions */}
              <div className="hidden items-center gap-2.5 md:flex">
                <Link
                  href="/solutions"
                  className="button-outline !px-5 !py-2"
                >
                  Explore products <ArrowUpRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => setDemo(true)}
                  className="button-dark !px-5 !py-2"
                >
                  Request a demo <ArrowUpRight size={15} />
                </button>
              </div>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/[0.05] text-ink transition-colors hover:bg-ink/[0.1] md:hidden"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </GlassSurface>
        </div>

        {/* Mobile Glass Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto mx-auto mt-2.5 max-w-[1400px] md:hidden"
            >
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={28}
                borderWidth={0.05}
                brightness={64}
                opacity={0.96}
                blur={16}
                displace={0.25}
                distortionScale={-110}
                backgroundOpacity={0.45}
                saturation={1.2}
                refraction
              >
                <div className="w-full p-5">
                  <div className="divide-y divide-line">
                    {nav.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? path === "/"
                          : path?.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between py-3 text-sm transition-colors ${
                            isActive
                              ? "font-semibold text-ink"
                              : "text-slate hover:text-ink"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#79AE9B]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-col gap-2.5">
                    <Link
                      href="/solutions"
                      onClick={() => setOpen(false)}
                      className="button-outline flex w-full items-center justify-center gap-1.5 !py-2.5"
                    >
                      Explore products <ArrowUpRight size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setDemo(true);
                      }}
                      className="button-dark flex w-full items-center justify-center gap-1.5 !py-2.5"
                    >
                      Request a demo <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </GlassSurface>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <DemoModal open={demo} onClose={() => setDemo(false)} />
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink px-6 pb-8 pt-16 text-paper md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            aria-label="Endloops home"
            className="inline-flex items-center gap-2.5"
          >
            <Image
              src="/images/logo.webp"
              alt="Endloops logo"
              width={32}
              height={26}
              className="h-7 w-auto brightness-0 invert"
            />
            <span className="font-serif text-2xl font-semibold tracking-[-0.03em] text-white">
              Endloops
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-paper/60">
            Financial automation built for professionals. The software prepares
            the work; you review and decide.
          </p>
        </div>

        <div>
          <p className="eyebrow !text-[#8CC8B2]">EXPLORE</p>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-paper/70">
            <Link href="/solutions" className="transition-colors hover:text-white">
              Solutions
            </Link>
            <Link href="/tools" className="transition-colors hover:text-white">
              Tools
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <p className="eyebrow !text-[#8CC8B2]">GET IN TOUCH</p>
          <a
            href="mailto:hello@endloops.com"
            className="mt-5 inline-block text-sm text-paper/80 transition-colors hover:text-white"
          >
            hello@endloops.com
          </a>
          <p className="mt-3 text-sm text-paper/45">
            Dubai, United Arab Emirates
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1400px] flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-paper/40 md:flex-row">
        <span>© 2026 Endloops. Born from Alkazim, Dubai.</span>
        <span>Built for clarity. Designed for control.</span>
      </div>
    </footer>
  );
}