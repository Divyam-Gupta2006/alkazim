"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  ArrowUpRight,
  ScanText,
  GitCompareArrows,
  ShieldCheck,
  FileCheck2,
  Layers3,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Check,
  ArrowRight,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { capabilities, personas, solutions, tools } from "@/lib/data";
import { SectionHeading, ContactForm } from "./ui";
import { BalanceScale, type ScaleSide } from "./balancescale";
import { AnimatedInfinityLogo } from "./animated-infinity-logo";

// Exactly one icon per sandbox view below (active indexes 0–4 are hardcoded
// against ReadDocumentsView / CompareMatchView / CheckRulesView /
// PrepareDraftsView / HandleBulkView), so this stays a fixed 5-entry array
// rather than a longer list that silently drifts out of sync with the views.
const icons = [ScanText, GitCompareArrows, ShieldCheck, FileCheck2, Layers3];

/* ============================================================
   1.1 — Hero
   Left: "Built" / "for" + a rotating reel of user types, with a
   tagline that swaps with the active type, then two CTAs.
   Right: the mark + wordmark.
   ============================================================ */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => prev + 1);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const currentPersona = active % personas.length;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Scale and Y only. An earlier version also animated opacity on this same
  // full-viewport wrapper, which sits directly beneath the nav's glass
  // backdrop — fading a huge layer in and out every frame forces the
  // backdrop filter to keep regenerating its source texture, which is what
  // produced the stale/glitched nav rendering during scroll. Scale and Y are
  // pure transforms (no repaint) and don't have that problem. The hero also
  // gets visually covered by PersonasSection's sticky reveal panel as you
  // scroll past it, so a separate opacity fade here was redundant anyway.
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section
      ref={heroRef}
      className="sticky top-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden bg-paper px-6 pt-20 pb-8 md:px-12 md:pt-24 md:pb-12"
    >
      <motion.div
        style={{ scale: heroScale, y: heroY }}
        className="mx-auto grid w-full max-w-[1500px] items-center gap-8 md:grid-cols-[1fr_auto]"
      >
        {/* Left: Main hero */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10 min-w-0">
            <h1 className="flex flex-col font-serif text-[clamp(2.8rem,8vw,8.5rem)] leading-[0.99] tracking-[-.055em] text-ink">
              <span>Built</span>
              <span>For</span>
            </h1>

            <div className="flex items-center font-serif text-[clamp(1.5rem,3.8vw,3.6rem)] leading-[0.9] tracking-[-.04em] text-teal italic min-w-0">
              <PersonaReel active={active} />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 min-h-[90px] max-w-[750px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPersona}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-base sm:text-lg leading-7 sm:leading-8 text-slate md:text-xl md:leading-[1.6] text-[#251605] z-100"
              >
                {personas[currentPersona].line}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-6">
            <Link
              href="/contact"
              className="button-teal !px-6 !py-3.5 !text-sm sm:!px-8 sm:!py-4 sm:!text-base md:!px-10 md:!py-5 md:!text-lg"
            >
              Request a demo <ArrowUpRight size={20} className="sm:w-[22px] sm:h-[22px]" />
            </Link>

            <Link
              href="/contact"
              className="button-outline !px-6 !py-3.5 !text-sm sm:!px-8 sm:!py-4 sm:!text-base md:!px-10 md:!py-5 md:!text-lg"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Right: Hero logo & brand name */}
        <div className="relative flex flex-col items-center justify-center md:-translate-x-5 lg:-translate-x-17">
          <div className="relative flex items-center justify-center">
            <AnimatedInfinityLogo className="w-[180px] sm:w-[240px] md:!w-[280px] lg:!w-[380px] xl:!w-[440px]" />
          </div>

          <div className="mt-2 sm:mt-4 text-center">
            <h2 className="font-serif text-[clamp(2.4rem,5.5vw,6rem)] leading-[0.85] tracking-[-.055em] text-[#251605]">
              Endloops
            </h2>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function PersonaReel({ active }: { active: number }) {
  const count = personas.length;
  // Three stacked copies. Steady state lives in the middle copy; once
  // forward motion carries us into the trailing copy, we silently snap
  // (duration: 0) back to the equivalent spot in the middle copy — the two
  // spots render identical text, so the snap is invisible.
  const extendedPersonas = [...personas, ...personas, ...personas];

  const [tick, setTick] = useState<number>(count);
  const [instant, setInstant] = useState(false);
  const prevActive = useRef(active);

  useEffect(() => {
    if (active === prevActive.current) return;
    const delta = (active - prevActive.current + count) % count;
    prevActive.current = active;
    setInstant(false);
    setTick((t: number) => t + delta);
  }, [active, count]);

  return (
    <span
      className="relative h-[1.6em] min-w-[5.2em] sm:min-w-[7.2em] align-middle overflow-hidden text-left font-serif text-[clamp(1.5rem,3.8vw,3.6rem)] leading-[1em] tracking-[-0.04em] text-teal italic"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)",
      }}
    >
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: `calc(-${tick}em + 0.28em)` }}
        transition={
          instant
            ? { duration: 0 }
            : { type: "spring", stiffness: 180, damping: 22 }
        }
        onAnimationComplete={() => {
          if (tick >= count * 2) {
            setInstant(true);
            setTick((t: number) => t - count);
          } else if (instant) {
            setInstant(false);
          }
        }}
      >
        {extendedPersonas.map((p, i) => (
          <span
            key={`${p.name}-${i}`}
            className="font-display h-[1em] whitespace-nowrap leading-[1em] text-[#251605] min-w-[1em]"
          >
            {p.name}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/* ============================================================
   1.2 — Who we serve
   A tall scroll track; a full-screen panel rides up to cover the
   hero as you enter it, then stays pinned while further scrolling
   steps through each user type: names in the center roller, pain
   point and partner-quote on either side.
   ============================================================ */

// Bumped from 76 to 88px: at the selected size (up to text-[44px] on
// desktop) some persona names ("Property Managers") sat close to the row
// height ceiling. 88px gives consistent clearance across every name in the
// list without needing per-name tuning.
const ITEM_HEIGHT = 88;

export function PersonasSection() {
  const count = personas.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const clamped = Math.max(0, Math.min(0.999, v));
    const next = Math.min(count - 1, Math.floor(clamped * count));
    setActive((prev) => (prev !== next ? next : prev));
  });

  const scrollToPersona = (index: number) => {
    if (!wrapRef.current || typeof window === "undefined") return;

    const wrap = wrapRef.current;
    const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
    const pinTravel = wrap.offsetHeight - window.innerHeight;
    const targetFraction = (index + 0.5) / count;
    const targetY = wrapTop + targetFraction * pinTravel;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const persona = personas[active] || personas[0];

  return (
    <div
      ref={wrapRef}
      id="who-we-serve"
      className="relative z-10 w-full"
      style={{ height: `${(count + 1) * 85}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden rounded-t-[32px] bg-[#fbf9f4] px-5 shadow-[0_-24px_60px_rgba(0,0,0,0.08)] md:rounded-t-[48px] md:px-8 lg:px-14">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-6 md:grid-cols-[1.15fr_0.9fr_1.15fr] lg:gap-12">
          {/* MOBILE / TABLET PILL SELECTOR */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:hidden">
            {personas.map((p, i) => {
              const isSelected = active === i;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => scrollToPersona(i)}
                  className={`rounded-full px-3.5 py-1.5 font-serif text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79AE9B] ${
                    isSelected
                      ? "bg-[#111110] text-[#fbf9f4] shadow-sm"
                      : "bg-[#efece4] text-[#7a766c]"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* LEFT: BEFORE ENDLOOPS */}
          <div className="flex flex-col items-center text-center">
            <h3 className="mb-3 font-serif text-base italic tracking-[-0.01em] text-[#242424]/80 md:mb-5 md:text-xl">
              Before Endloops
            </h3>

            {/* Left Card */}
            <div className="relative flex aspect-[4/3] w-full max-w-[500px] overflow-hidden rounded-[20px] bg-[#fffefa] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.06]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`before-${active}`}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full w-full flex-col justify-between p-6 text-left sm:p-8 lg:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e8a80]">
                      The Challenge
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b0ac9f]">
                      {persona.short}
                    </span>
                  </div>

                  <blockquote className="font-serif text-lg leading-[1.38] tracking-[-0.02em] text-[#1c1b18] sm:text-xl lg:text-[26px] text-center italic">
                    “{persona.pain}”
                  </blockquote>

                  <div className="flex items-center justify-between border-t border-black/[0.06] pt-4">
                    <span className="text-xs font-medium text-[#7a766c]">
                      — {persona.name}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c8c4b7]" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated bottom caption */}
            <div className="mt-3.5 min-h-[20px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`cap-before-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs tracking-[-0.01em] text-[#7c786f]"
                >
                  {persona.captionBefore}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* CENTER: VERTICAL ROLLER (Desktop) */}<div className="relative hidden h-[380px] w-full overflow-hidden md:block text-center bg-[url('/images/boardroom.jpg')] bg-cover bg-center rounded-[50px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.06]">
            {/* Soft top & bottom gradient masks */}

            {/* Exact mathematical center-anchored track */}
            <motion.div
              animate={{ y: -active * ITEM_HEIGHT }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
                mass: 0.8,
              }}
              className="absolute inset-x-0 flex flex-col items-center"
              style={{ top: `calc(50% - ${ITEM_HEIGHT / 2}px)` }}
            >
              {personas.map((p, i) => {
                const distance = Math.abs(active - i);
                const isSelected = active === i;

                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => scrollToPersona(i)}
                    style={{ height: `${ITEM_HEIGHT}px` }}
                    className={`group flex items-center justify-center whitespace-nowrap px-4 font-serif tracking-[-0.035em] transition-all duration-300 focus:outline-none text-[#ffffff] ${
                      isSelected
                        ? "scale-100 text-3xl font-normal text-[#111110] opacity-100 lg:text-[44px]"
                        : distance === 1
                          ? "scale-95 text-2xl text-[#b8b4a6] opacity-55 hover:text-[#111110]/70 hover:opacity-80 lg:text-[36px]"
                          : "scale-90 text-xl text-[#cfcbc0] opacity-25 hover:opacity-50 lg:text-[30px]"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT: AFTER ENDLOOPS */}
          <div className="flex flex-col items-center text-center">
            <h3 className="mb-3 font-serif text-base italic tracking-[-0.01em] text-[#242424]/80 md:mb-5 md:text-xl">
              Now
            </h3>

            {/* Right Card */}
            <div className="relative flex aspect-[4/3] w-full max-w-[500px] overflow-hidden rounded-[20px] bg-[#e9f0ec] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#6b9485]/25">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`after-${active}`}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full w-full flex-col justify-between p-6 text-left sm:p-8 lg:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#558271]">
                      With Endloops
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b9485]/80">
                      {persona.short}
                    </span>
                  </div>

                  <blockquote className="font-serif text-lg leading-[1.38] tracking-[-0.02em] text-[#141d19] sm:text-xl lg:text-[26px] text-center italic">
                    “{persona.quote}”
                  </blockquote>

                  <div className="flex items-center justify-between border-t border-[#6b9485]/15 pt-4">
                    <span className="text-xs font-medium text-[#527366]">
                      — Verified Transformation
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#6b9485]" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated bottom caption */}
            <div className="mt-3.5 min-h-[20px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`cap-after-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs tracking-[-0.01em] text-[#7c786f]"
                >
                  {persona.captionAfter}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   1.3 — Two ways to work
   The scale fills the section. Hovering a pan sinks it and fades
   in that side's feature list; hovering a feature inside the list
   expands a short description in its place.
   ============================================================ */
export function ScaleSection() {
  const [side, setSide] = useState<ScaleSide | null>(null);

  return (
    <div className="relative min-h-screen py-12 lg:h-[100vh] lg:py-0">
      <section className="flex min-h-screen lg:h-full w-full items-center bg-paper px-6 py-8 md:px-10 lg:py-16">
        <div className="mx-auto w-full max-w-[1800px]">
          <SectionHeading
            eyebrow="Two ways to work"
            title="One engine. Two ways to move work forward."
            text="Explore the capabilities behind each approach."
          />

          {/* Mobile view selector */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => setSide("solutions")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                side === "solutions"
                  ? "bg-teal text-white shadow-sm"
                  : "border border-line bg-white text-slate hover:text-ink"
              }`}
            >
              01 End-to-end solutions
            </button>
            <button
              type="button"
              onClick={() => setSide("tools")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                side === "tools"
                  ? "bg-teal text-white shadow-sm"
                  : "border border-line bg-white text-slate hover:text-ink"
              }`}
            >
              02 Standalone tools
            </button>
          </div>

          {/* 40 / 20 / 40 layout */}
          <div
            className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[2fr_1fr_2fr] lg:gap-6 xl:gap-12"
            onMouseLeave={() => setSide(null)}
          >
            {/* LEFT — END-TO-END SOLUTIONS */}
            <div
              className="flex min-w-0 items-center lg:min-h-[400px] lg:pr-8"
              onMouseEnter={() => setSide("solutions")}
            >
              <FeatureList
                heading="End-to-end solutions"
                sublabel="01"
                items={solutions}
                open={side === "solutions"}
                activeSide={side}
                align="left"
              />
            </div>

            {/* CENTER — BALANCE SCALE */}
            <div className="relative z-10 order-first flex min-w-0 items-center justify-center overflow-visible lg:order-none lg:min-h-[400px]">
              <BalanceScale
                activeSide={side}
                onActivate={setSide}
                className="w-[min(78vw,400px)] max-w-none shrink-0 lg:w-[min(30vw,500px)]"
              />
            </div>

            {/* RIGHT — STANDALONE TOOLS */}
            <div
              className="flex min-w-0 items-center lg:min-h-[400px] lg:pl-8"
              onMouseEnter={() => setSide("tools")}
            >
              <FeatureList
                heading="Standalone tools"
                sublabel="02"
                items={tools}
                open={side === "tools"}
                activeSide={side}
                align="right"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureList({
  heading,
  sublabel,
  items,
  open,
  activeSide,
  align,
}: {
  heading: string;
  sublabel: string;
  items: { n: string; title: string; description: string }[];
  open: boolean;
  activeSide: ScaleSide | null;
  align: "left" | "right";
}) {
  const [hover, setHover] = useState(-1);

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: activeSide === null ? 0.9 : open ? 1 : 0.35,
        x: open ? 0 : align === "left" ? -8 : 8,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`w-full min-w-0 ${
        align === "right" ? "lg:text-right text-left" : "text-left"
      }`}
    >
      {/* Minimal heading */}
      <div
        className={`mb-7 flex items-center gap-3 ${
          align === "right" ? "lg:justify-end justify-start" : ""
        }`}
      >
        <span className="text-[10px] font-medium tracking-[0.18em] text-[#79AE9B]">
          {sublabel}
        </span>

        <h3 className="font-serif text-xl tracking-tight text-ink md:text-2xl">
          {heading}
        </h3>
      </div>

      {/* Feature list */}
      <div className="border-t border-line">
        {items.map((item, i) => {
          const isHovered = hover === i;

          return (
            <div
              key={item.title}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              className="border-b border-line/70 py-4"
            >
              <div
                className={`flex items-center gap-3 ${
                  align === "right" ? "lg:justify-end justify-start" : ""
                }`}
              >
                {align === "left" && (
                  <span className="text-[10px] tabular-nums text-slate/40">
                    {item.n}
                  </span>
                )}

                <span
                  className={`text-sm font-medium transition-colors duration-300 md:text-base ${
                    isHovered ? "text-[#659C88]" : "text-ink"
                  }`}
                >
                  {item.title}
                </span>

                {align === "right" && (
                  <span className="text-[10px] tabular-nums text-slate/40">
                    {item.n}
                  </span>
                )}
              </div>

              <AnimatePresence initial={false}>
                {isHovered && open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="overflow-hidden"
                  >
                    <p
                      className={`pt-3 text-xs leading-6 text-slate md:text-sm ${
                        align === "right"
                          ? "ml-auto max-w-[90%]"
                          : "max-w-[90%]"
                      }`}
                    >
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ============================================================
   1.4 — The engine
   Left: capability list. Right: a small sandbox window that plays
   back each capability's preview.
   ============================================================ */

/* -------------------------------------------------------------------------- */
/*  1. READ DOCUMENTS SANDBOX                                                 */
/* -------------------------------------------------------------------------- */
function ReadDocumentsView() {
  const docs = [
    {
      id: "INV-2026-089",
      type: "Tax Invoice",
      vendor: "Al Futtaim MEP Services LLC",
      date: "14 Oct 2026",
      trn: "100293847500003",
      fields: [
        {
          label: "Document No.",
          value: "INV-2026-089",
          conf: "99.9%",
          line: "Line 4",
        },
        {
          label: "Vendor TRN",
          value: "100293847500003",
          conf: "99.8%",
          line: "Header",
        },
        {
          label: "HVAC Chiller Maintenance",
          value: "AED 38,400.00",
          conf: "99.7%",
          line: "Item 01",
        },
        {
          label: "5% VAT Amount",
          value: "AED 1,920.00",
          conf: "100%",
          line: "Tax Row",
        },
        {
          label: "Net Payable Total",
          value: "AED 40,320.00",
          conf: "99.9%",
          line: "Footer",
        },
      ],
    },
    {
      id: "PO-8841-DXB",
      type: "Purchase Order",
      vendor: "Emirates Strata Facilities Co.",
      date: "09 Oct 2026",
      trn: "100481920300003",
      fields: [
        {
          label: "PO Reference",
          value: "PO-8841-DXB",
          conf: "100%",
          line: "Header",
        },
        {
          label: "Approved Cap",
          value: "AED 65,000.00",
          conf: "99.6%",
          line: "Clause 2",
        },
        {
          label: "Lift Modernization Parts",
          value: "AED 61,750.00",
          conf: "99.8%",
          line: "Item 01",
        },
        {
          label: "Delivery Terms",
          value: "30 Days Net — Marina Tower",
          conf: "99.4%",
          line: "Terms",
        },
        {
          label: "Authorized Total",
          value: "AED 64,837.50",
          conf: "99.9%",
          line: "Footer",
        },
      ],
    },
  ];

  const [docIdx, setDocIdx] = useState(0);
  const [selectedField, setSelectedField] = useState(0);
  const [scanning, setScanning] = useState(false);

  const currentDoc = docs[docIdx];

  const triggerScan = (nextIdx: number) => {
    setDocIdx(nextIdx);
    setSelectedField(0);
    setScanning(true);
    setTimeout(() => setScanning(false), 450);
  };

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          {docs.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => triggerScan(idx)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                docIdx === idx
                  ? "border-teal bg-teal/10 text-ink"
                  : "border-line bg-paper text-slate hover:text-ink"
              }`}
            >
              {d.type}: {d.id}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal">
          <Sparkles size={13} />
          {scanning ? "Extracting coordinates..." : "5/5 fields extracted"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Simulated Source Document PDF */}
        <div className="relative rounded-lg border border-line bg-paper p-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-line pb-2 text-[11px] text-slate">
            <span>SOURCE_PDF // {currentDoc.id}.pdf</span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink">
              PAGE 1 OF 1
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="text-[11px] font-semibold text-ink">
              {currentDoc.vendor}
            </div>
            <div className="text-[10px] text-slate">
              Date: {currentDoc.date}
            </div>

            <div className="mt-3 space-y-1.5 pt-1">
              {currentDoc.fields.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setSelectedField(i)}
                  onMouseEnter={() => setSelectedField(i)}
                  className={`flex w-full items-center justify-between rounded border px-2.5 py-1.5 text-left transition ${
                    selectedField === i
                      ? "border-teal bg-white text-ink shadow-sm"
                      : "border-transparent bg-white/60 text-slate hover:border-line"
                  }`}
                >
                  <span className="truncate pr-2 text-[11px]">{f.label}</span>
                  <span className="font-semibold text-ink">{f.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Structured Extracted Payload */}
        <div className="flex flex-col justify-between rounded-lg border border-line bg-white p-4">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-xs font-semibold text-ink">
                Structured Output
              </span>
              <span className="text-[11px] font-medium text-teal">
                Confidence {currentDoc.fields[selectedField]?.conf}
              </span>
            </div>

            <div className="mt-3 divide-y divide-line">
              {currentDoc.fields.map((f, i) => (
                <div
                  key={f.label}
                  onClick={() => setSelectedField(i)}
                  className={`flex cursor-pointer items-center justify-between py-2 text-xs transition ${
                    selectedField === i
                      ? "font-semibold text-ink"
                      : "text-slate"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedField === i ? "bg-teal" : "bg-line"
                      }`}
                    />
                    <span>{f.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-ink">{f.value}</span>
                    <span className="rounded bg-paper px-1.5 py-0.5 text-[10px] text-slate">
                      {f.line}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md bg-paper px-3 py-2 text-[11px] text-slate">
            <span>Mapped to General Ledger schema</span>
            <span className="font-semibold text-ink">Ready for matching →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. COMPARE AND MATCH SANDBOX                                              */
/* -------------------------------------------------------------------------- */
function CompareMatchView() {
  const [filter, setFilter] = useState<"all" | "matched" | "exception">("all");
  const [selectedRow, setSelectedRow] = useState(2);

  const rows = [
    {
      id: "VOUCH-01",
      docRef: "INV-2026-089",
      ledgerRef: "GL-44021",
      vendor: "Al Futtaim MEP Services",
      docAmount: "AED 40,320.00",
      ledgerAmount: "AED 40,320.00",
      status: "matched",
      note: "Exact 3-way match across PO, Invoice, and General Ledger.",
    },
    {
      id: "VOUCH-02",
      docRef: "PO-8841-DXB",
      ledgerRef: "GL-44025",
      vendor: "Emirates Strata Facilities",
      docAmount: "AED 64,837.50",
      ledgerAmount: "AED 64,837.50",
      status: "matched",
      note: "Line items, 5% VAT, and retention schedule verified.",
    },
    {
      id: "VOUCH-03",
      docRef: "INV-2026-104",
      ledgerRef: "GL-44029",
      vendor: "Gulf Coast Security LLC",
      docAmount: "AED 19,450.00",
      ledgerAmount: "AED 18,200.00",
      status: "exception",
      note: "Variance of +AED 1,250.00 detected between invoice and ledger entry.",
    },
    {
      id: "VOUCH-04",
      docRef: "CNT-9920-ESC",
      ledgerRef: "GL-44033",
      vendor: "Apex Elevators Co.",
      docAmount: "AED 112,000.00",
      ledgerAmount: "AED 112,000.00",
      status: "matched",
      note: "Matched against certified engineer progress certificate #4.",
    },
  ];

  const filtered = rows.filter((r) =>
    filter === "all" ? true : r.status === filter,
  );

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-1.5">
          {(["all", "matched", "exception"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium capitalize transition ${
                filter === tab
                  ? "border-teal bg-teal/10 text-ink"
                  : "border-line bg-paper text-slate hover:text-ink"
              }`}
            >
              {tab === "all"
                ? "All Entries (4)"
                : tab === "matched"
                  ? "Matched (3)"
                  : "Discrepancies (1)"}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate">
          Click any row to inspect cross-document link
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[500px] text-left text-xs">
          <thead className="border-b border-line bg-paper text-[11px] uppercase text-slate">
            <tr>
              <th className="px-3 py-2.5">Source Doc</th>
              <th className="px-3 py-2.5">Ledger Entry</th>
              <th className="px-3 py-2.5">Doc Total</th>
              <th className="px-3 py-2.5">Ledger Total</th>
              <th className="px-3 py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {filtered.map((r, idx) => {
              const isSelected = r.id === rows[selectedRow]?.id;
              return (
                <tr
                  key={r.id}
                  onClick={() =>
                    setSelectedRow(rows.findIndex((item) => item.id === r.id))
                  }
                  className={`cursor-pointer transition ${
                    isSelected ? "bg-teal/5" : "hover:bg-paper/60"
                  }`}
                >
                  <td className="px-3 py-2.5 font-mono font-medium text-ink">
                    {r.docRef}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-slate">
                    {r.ledgerRef} · {r.vendor}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-ink">
                    {r.docAmount}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-ink">
                    {r.ledgerAmount}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {r.status === "matched" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">
                        <CheckCircle2 size={12} /> Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#D7B66D]/20 px-2 py-0.5 text-[11px] font-medium text-[#9A6B13]">
                        <AlertTriangle size={12} /> +AED 1,250 Diff
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows[selectedRow] && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-paper px-3.5 py-2.5 text-xs">
          <span className="text-slate">
            <strong className="text-ink">{rows[selectedRow].docRef}</strong> ↔{" "}
            <strong className="text-ink">{rows[selectedRow].ledgerRef}</strong>:{" "}
            {rows[selectedRow].note}
          </span>
          <span className="ml-2 shrink-0 font-mono text-[11px] font-semibold text-teal">
            100% Traceable
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. CHECK AGAINST RULES SANDBOX                                            */
/* -------------------------------------------------------------------------- */
function CheckRulesView() {
  const [rules, setRules] = useState({
    duplicateCheck: true,
    budgetCap: true,
    vatVerify: true,
  });
  const [acknowledged, setAcknowledged] = useState<string[]>([]);

  const toggleRule = (key: keyof typeof rules) => {
    setRules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAck = (id: string) => {
    setAcknowledged((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const findings = [
    {
      id: "RULE-01",
      ruleKey: "duplicateCheck" as const,
      title: "Duplicate Invoice Number Detected",
      detail:
        "INV-2026-041 appears in both August and September payment batches (AED 14,900).",
      severity: "High",
    },
    {
      id: "RULE-02",
      ruleKey: "budgetCap" as const,
      title: "Quote Exceeds Approved Service-Charge Cap",
      detail:
        "Tender bid #TND-19 exceeds approved RERA budget allocation by 8.4% (AED 11,200).",
      severity: "Medium",
    },
    {
      id: "RULE-03",
      ruleKey: "vatVerify" as const,
      title: "Missing Vendor Tax Registration Number (TRN)",
      detail:
        "Expense voucher #EXP-309 claims 5% VAT recovery without a valid 15-digit UAE TRN.",
      severity: "High",
    },
  ];

  const activeFindings = findings.filter((f) => rules[f.ruleKey]);

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <span className="text-xs font-semibold text-ink">
          Active Audit Rules (Click to toggle live check):
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "duplicateCheck" as const, label: "Duplicate Detection" },
            { key: "budgetCap" as const, label: "Budget Limit Cap" },
            { key: "vatVerify" as const, label: "UAE VAT & TRN Rule" },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => toggleRule(r.key)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                rules[r.key]
                  ? "border-teal bg-teal/10 text-ink"
                  : "border-line bg-paper text-slate line-through"
              }`}
            >
              <Check
                size={12}
                className={rules[r.key] ? "text-teal" : "opacity-0"}
              />
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {activeFindings.length === 0 ? (
          <div className="rounded-lg border border-line bg-paper p-6 text-center text-xs text-slate">
            All rule checks disabled. Enable a compliance rule above to inspect
            flagged exceptions.
          </div>
        ) : (
          activeFindings.map((item) => {
            const isAck = acknowledged.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between gap-3 rounded-lg border p-3.5 transition sm:flex-row sm:items-center ${
                  isAck
                    ? "border-line bg-paper/70 opacity-75"
                    : "border-[#D58C78]/40 bg-[#D58C78]/5"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#B85D43]">
                      {item.id} · {item.severity} Priority
                    </span>
                    {isAck && (
                      <span className="rounded bg-teal/15 px-1.5 py-0.5 text-[10px] font-semibold text-teal">
                        Flagged for Partner Note
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-slate">{item.detail}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleAck(item.id)}
                  className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                    isAck
                      ? "border-line bg-white text-slate hover:text-ink"
                      : "border-ink bg-ink text-white hover:opacity-90"
                  }`}
                >
                  {isAck ? "Undo Flag" : "Include in Working Paper"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. PREPARE DRAFTS SANDBOX                                                 */
/* -------------------------------------------------------------------------- */
function PrepareDraftsView() {
  const [signedOff, setSignedOff] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([0, 1]);

  const scheduleRows = [
    {
      code: "WP-101",
      name: "General Fund Service Charge Schedule",
      variance: "0.0%",
      ready: true,
    },
    {
      code: "WP-102",
      name: "Escrow Trust Account Reconciliation",
      variance: "0.0%",
      ready: true,
    },
    {
      code: "WP-103",
      name: "Exception Summary (1 Variance Note)",
      variance: "+1.8%",
      ready: true,
    },
  ];

  const toggleItem = (idx: number) => {
    setCheckedItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="rounded-lg border border-line bg-paper p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate">
              DRAFT WORKING PAPER // REF: EL-WP-2026-Q4
            </span>
            <h4 className="text-sm font-semibold text-ink">
              Statutory Audit & Budget Review Lead Schedule
            </h4>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              signedOff
                ? "bg-teal/15 text-teal"
                : "bg-[#D7B66D]/25 text-[#8C6210]"
            }`}
          >
            {signedOff
              ? "Signed Off by Reviewer"
              : "Draft Prepared · Awaiting Sign-Off"}
          </span>
        </div>

        <div className="mt-3 divide-y divide-line rounded-md border border-line bg-white">
          {scheduleRows.map((row, idx) => {
            const isChecked = checkedItems.includes(idx);
            return (
              <div
                key={row.code}
                onClick={() => !signedOff && toggleItem(idx)}
                className="flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-xs transition hover:bg-paper/50"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    disabled={signedOff}
                    className="h-3.5 w-3.5 accent-teal"
                  />
                  <span className="font-mono text-[11px] text-slate">
                    {row.code}
                  </span>
                  <span className="font-medium text-ink">{row.name}</span>
                </div>
                <span className="font-mono text-[11px] text-slate">
                  Net Var: <strong className="text-ink">{row.variance}</strong>
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-slate">
            {signedOff
              ? "Working paper locked with full document audit trail."
              : "The software prepares the draft schedule; final sign-off stays with you."}
          </p>

          <button
            type="button"
            onClick={() => setSignedOff((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition ${
              signedOff
                ? "border border-line bg-white text-ink hover:bg-paper"
                : "bg-teal text-white hover:opacity-95"
            }`}
          >
            {signedOff ? (
              <>
                <RotateCcw size={13} /> Re-open Draft
              </>
            ) : (
              <>
                <FileCheck size={14} /> Approve & Sign Off Working Paper
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. HANDLE BULK WORK SANDBOX                                               */
/* -------------------------------------------------------------------------- */
function HandleBulkView() {
  const [progress, setProgress] = useState(100);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    let animId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      if (time - lastTime >= 65) {
        lastTime = time;
        setProgress((prev) => {
          if (prev >= 100) {
            setRunning(false);
            return 100;
          }
          return Math.min(100, prev + 5);
        });
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [running]);

  const startBatch = () => {
    setProgress(0);
    setRunning(true);
  };

  const totalDocs = 450;
  const processedDocs = Math.round((progress / 100) * totalDocs);
  const matchedDocs = Math.round((progress / 100) * 442);
  const flaggedDocs = Math.round((progress / 100) * 8);

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div>
          <span className="text-xs font-semibold text-ink">
            Batch Queue: Q3 Property & Audit Pack (450 Files)
          </span>
          <span className="ml-2 font-mono text-[11px] text-teal">
            {running ? `Processing ${progress}%...` : "Batch Complete · 11.4s"}
          </span>
        </div>

        <button
          type="button"
          onClick={startBatch}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-teal disabled:opacity-50"
        >
          <Play size={12} className="text-teal" />
          {running ? "Running Batch..." : "Simulate 450-File Batch"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
        <div
          className="h-full bg-teal transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="rounded-lg border border-line bg-paper p-3">
          <span className="text-[11px] text-slate">Documents Read</span>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">
            {processedDocs}{" "}
            <span className="text-xs font-normal text-slate">/ 450</span>
          </p>
        </div>
        <div className="rounded-lg border border-line bg-paper p-3">
          <span className="text-[11px] text-slate">Auto-Verified</span>
          <p className="mt-1 font-mono text-xl font-semibold text-teal">
            {matchedDocs}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-paper p-3">
          <span className="text-[11px] text-slate">Exceptions Isolated</span>
          <p className="mt-1 font-mono text-xl font-semibold text-[#B85D43]">
            {flaggedDocs}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-white px-3.5 py-2.5 text-xs text-slate">
        <span>Streams Invoices, POs, Contracts & Statements in parallel</span>
        <span className="font-mono text-[11px] font-semibold text-ink">
          ~38 hrs manual prep saved
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  MAIN ENGINE SECTION                                                       */
/* -------------------------------------------------------------------------- */
export function EngineSection() {
  const [active, setActive] = useState(0);
  const Icon = icons[active];

  return (
    <section className="relative z-10 border-t border-line bg-white px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="The Endloops engine"
          title="From unstructured files to structured decisions."
          text="Five connected capabilities turn document-heavy financial work into clear, reviewable outputs."
        />

        <div className="mt-20 grid gap-14 lg:grid-cols-[.6fr_1.4fr]">
          {/* Left Column: 5 Capability Triggers */}
          <div>
            {capabilities.map((c, i) => {
              const I = icons[i];
              const isActive = active === i;
              return (
                <button
                  key={c.title}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center gap-4 border-t border-line py-4 text-left transition last:border-b ${
                    isActive ? "text-ink" : "text-slate/60 hover:text-ink"
                  }`}
                >
                  <I size={18} className={isActive ? "text-teal" : ""} />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate">
                      {c.subtitle}
                    </span>
                  </span>
                  <ArrowRight
                    size={14}
                    className={`transition-transform ${
                      isActive
                        ? "translate-x-0 text-teal opacity-100"
                        : "-translate-x-2 opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Sandbox Window */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D58C78]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#D7B66D]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#7EAD91]" />
                <span className="ml-2 font-mono text-[10px] font-semibold text-slate">
                  endloops / sandbox / {capabilities[active].id}
                </span>
              </div>
              <span className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[10px] font-semibold text-teal">
                {capabilities[active].badge}
              </span>
            </div>

            {/* Window Body */}
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={22} className="text-teal" />
                    <h3 className="font-serif text-2xl tracking-[-.03em] text-ink">
                      {capabilities[active].title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate">
                    {capabilities[active].description}
                  </p>

                  {/* Interactive Capability View */}
                  {active === 0 && <ReadDocumentsView />}
                  {active === 1 && <CompareMatchView />}
                  {active === 2 && <CheckRulesView />}
                  {active === 3 && <PrepareDraftsView />}
                  {active === 4 && <HandleBulkView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   1.5 — Contact
   Left: tagline + form. Right: talk to our team, phone, email.
   ============================================================ */
export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 border-t border-line bg-paper px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto grid max-w-[1200px] gap-20 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <SectionHeading
            eyebrow="Partner with us"
            title="Make room for the work that needs you."
            text="Partner with us to automate the repetitive work, and keep every final decision in your hands."
          />
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>

        <div className="lg:pt-24">
          <p className="eyebrow">Talk to our team</p>
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-xs text-slate/70">Phone</p>
              {/* placeholder — swap in the real number */}
              <a
                href="tel:+971000000000"
                className="mt-1 inline-block text-lg text-ink hover:text-teal"
              >
                +971 00 000 0000
              </a>
            </div>
            <div>
              <p className="text-xs text-slate/70">Email</p>
              <a
                href="mailto:hello@endloops.com"
                className="mt-1 inline-block text-lg text-ink hover:text-teal"
              >
                hello@endloops.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}