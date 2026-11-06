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
import { ArrowUpRight, ScanText, GitCompareArrows, ShieldCheck, FileCheck2, Layers3 } from "lucide-react";
import { capabilities, personas, solutions, tools } from "@/lib/data";
import { SectionHeading, ContactForm } from "./ui";
import { InfinityLoopMark } from "./infinity-loop";
import { BalanceScale, type ScaleSide } from "./balancescale";
import {AnimatedInfinityLogo} from "./animated-infinity-logo";

const icons = [ScanText, GitCompareArrows, ShieldCheck, FileCheck2, Layers3];

/* ============================================================
   1.1 — Hero
   Left: "Built" / "for" + a rotating reel of user types, with a
   tagline that swaps with the active type, then two CTAs.
   Right: the mark + wordmark, which rides the hero's own scroll
   progress toward the corner and fades out as the next section
   takes over.
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

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section
      ref={heroRef}
      className="sticky top-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden bg-paper px-6 pt-20 pb-8 md:px-12 md:pt-24 md:pb-12"
    >
      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="mx-auto grid w-full max-w-[1500px] items-center gap-8 md:grid-cols-[1fr_auto]"
      >
        {/* Left: Main hero */}
        <div className="flex flex-col">
          <div className="flex items-center gap-6 md:gap-10">
            <h1 className="flex flex-col font-serif text-[clamp(4.2rem,9vw,8.5rem)] leading-[0.85] tracking-[-.055em] text-ink">
              <span>Built</span>
              <span>For</span>
            </h1>

            <div className="flex items-center font-serif text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[0.9] tracking-[-.04em] text-teal">
              <PersonaReel active={active} />
            </div>
          </div>

          <div className="mt-8 min-h-[90px] max-w-[750px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPersona}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg leading-8 text-slate md:text-2xl md:leading-[1.6]"
              >
                {personas[currentPersona].line}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/contact"
              className="button-teal !px-8 !py-4 !text-base md:!px-10 md:!py-5 md:!text-lg"
            >
              Request a demo <ArrowUpRight size={22} />
            </Link>

            <Link
              href="/contact"
              className="button-outline !px-8 !py-4 !text-base md:!px-10 md:!py-5 md:!text-lg"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Right: Hero logo & brand name */}
        <div className="relative flex flex-col items-center justify-center md:-translate-x-8 lg:-translate-x-12">
          {/* <div className="relative hidden md:flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Endloops hero"
              className="h-auto w-[280px] object-contain lg:w-[380px] xl:w-[440px]"
            />
          </div> */}
          <div className="relative hidden md:flex items-center justify-center md:!w-[380px] lg:!w-[440px]">
            <AnimatedInfinityLogo className="!w-[280px] lg:!w-[380px] xl:!w-[440px]" />
          </div>

          <div className="mt-4 text-center">
            <h2 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.85] tracking-[-.055em] text-[#251605]">
              EndlessLoop
            </h2>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function PersonaReel({ active }: { active: number }) {
  const extendedPersonas = [...personas, ...personas, ...personas];

  return (
    <span
      className="relative inline-block h-[1.55em] w-[7.2em] overflow-hidden align-baseline"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)",
      }}
    >
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: `-${active}em` }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        {extendedPersonas.map((p, i) => (
          <span
            key={`${p.name}-${i}`}
            className="font-display h-[1em] leading-[1em] text-teal"
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
   steps through each user type: names on the left, that type's
   pain point and a partner-quote on the right.
   ============================================================ */

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
    setActive(next);
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

  return (
    <div
      ref={wrapRef}
      id="who-we-serve"
      className="relative z-10 w-full"
      style={{ height: `${(count + 1) * 80}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <section className="relative flex h-screen w-full items-center overflow-hidden rounded-t-[32px] bg-ink px-6 text-paper shadow-[0_-25px_60px_rgba(0,0,0,0.35)] md:rounded-t-[48px] md:px-12">
          <div className="mx-auto grid h-full w-full max-w-[1400px] items-center gap-10 md:grid-cols-[.85fr_1.15fr] md:gap-16">

            {/* Left: Persona List & Navigation */}
            <div className="flex flex-col">
              <span className="eyebrow !text-[#9ACDBB]">02 / WHO WE SERVE</span>

              <div className="mt-6 md:mt-10">
                {personas.map((p, i) => {
                  const isActive = active === i;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => scrollToPersona(i)}
                      className={`group flex w-full items-center justify-between border-t border-white/10 py-3 text-left transition-all duration-300 last:border-b md:py-4.5 ${
                        isActive
                          ? "text-white"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`inline-block h-2 w-2 rounded-full transition-all duration-300 ${
                            isActive
                              ? "scale-100 bg-[#8CC8B2]"
                              : "scale-0 bg-transparent"
                          }`}
                        />
                        <span className="font-serif text-2xl tracking-[-.03em] md:text-4xl">
                          {p.name}
                        </span>
                      </span>
                      <span
                        className={`text-[10px] font-semibold tracking-wider transition-colors duration-300 ${
                          isActive
                            ? "text-[#8CC8B2]"
                            : "text-white/20 group-hover:text-white/40"
                        }`}
                      >
                        0{i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress dots & counter */}
              <div className="mt-6 flex items-center gap-2.5 md:mt-8">
                {personas.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => scrollToPersona(i)}
                    aria-label={`Switch to ${p.name}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-8 bg-[#8CC8B2]"
                        : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
                <span className="ml-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  0{active + 1} of 0{count}
                </span>
              </div>
            </div>

            {/* Right: Dynamic Persona Detail Card */}
            <div className="md:border-l md:border-white/10 md:pl-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-[28px] border border-white/10 bg-white/[.04] p-6 backdrop-blur-md md:p-10"
                >
                  <span className="eyebrow !text-[#9ACDBB]">
                    THE DAILY BOTTLENECK
                  </span>

                  <h3 className="mt-4 font-serif text-2xl leading-snug tracking-[-.03em] text-white md:text-4xl">
                    {personas[active].pain}
                  </h3>

                  <div className="my-6 h-px bg-white/10 md:my-8" />

                  <span className="eyebrow !text-[#9ACDBB]">
                    THE ENDLOOPS APPROACH
                  </span>

                  <p className="mt-4 font-serif text-lg leading-snug text-white/85 md:text-2xl">
                    “{personas[active].quote}”
                  </p>

                  <p className="mt-6 text-[10px] uppercase tracking-[.18em] text-white/35">
                    Illustrative outcome · Human review remains essential
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}


/* ============================================================
   1.3 — Two ways to work
   The scale fills the section. Hovering a pan sinks it and fades
   in that side's feature list; hovering a feature inside the list
   pushes the rest down and shows a short description in its place.
   ============================================================ */

export function ScaleSection() {
  const [side, setSide] = useState<ScaleSide | null>(null);

  return (
    <section className="relative z-10 bg-paper px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[2000px]">
        <SectionHeading
          eyebrow="Two ways to work"
          title="One engine. Two ways to move work forward."
          text="Hover over either side to explore what it carries."
        />

        <div className="mx-auto mt-16 w-full max-w-[760px] lg:mt-20" onMouseLeave={() => setSide(null)}>
          <BalanceScale activeSide={side} onActivate={setSide} className="w-full" />

          <div className="relative mt-4 grid grid-cols-2 gap-10 md:gap-16">
            {/* reserves a steady minimum height so the section doesn't jump
                when nothing is hovered yet */}
            <p
              className={`pointer-events-none absolute inset-x-0 top-10 text-center text-sm text-slate/50 transition-opacity ${
                side ? "opacity-0" : "opacity-100"
              }`}
            >
              Hover a pan to see what it carries
            </p>

            <div onMouseEnter={() => setSide("solutions")}>
              <FeatureList items={solutions} open={side === "solutions"} />
            </div>
            <div onMouseEnter={() => setSide("tools")}>
              <FeatureList items={tools} open={side === "tools"} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function FeatureList({
  items,
  open,
}: {
  items: { n: string; title: string; description: string }[];
  open: boolean;
}) {
  const [hover, setHover] = useState(-1);

  return (
    <motion.div
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {items.map((item, i) => (
        <div
          key={item.title}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(-1)}
          className="border-t border-line py-4 first:border-t-0"
        >
          <div className="flex items-center gap-3 text-sm font-semibold text-ink">
            <span className="text-xs text-slate/50">{item.n}</span>
            <span>{item.title}</span>
          </div>
          <AnimatePresence initial={false}>
            {hover === i && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pt-2 text-xs leading-6 text-slate"
              >
                {item.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
}

/* ============================================================
   1.4 — The engine
   Left: capability list. Right: a small sandbox window that plays
   back each capability's preview.
   ============================================================ */
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
          <div>
            {capabilities.map((c, i) => {
              const I = icons[i];
              return (
                <button
                  key={c.title}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`flex w-full items-center gap-4 border-t border-line py-4 text-left transition last:border-b ${
                    active === i ? "text-ink" : "text-slate/60 hover:text-ink"
                  }`}
                >
                  <I size={18} className={active === i ? "text-teal" : ""} />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{c.title}</span>
                    <span className="mt-0.5 block text-xs text-slate">{c.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-xl border border-line">
            <div className="flex items-center gap-2 border-b border-line bg-paper px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-[#D58C78]" />
              <span className="h-2 w-2 rounded-full bg-[#D7B66D]" />
              <span className="h-2 w-2 rounded-full bg-[#7EAD91]" />
              <span className="ml-2 text-[10px] font-semibold text-slate">endloops / sandbox</span>
            </div>
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={22} className="text-teal" />
                    <h3 className="font-serif text-2xl tracking-[-.03em] text-ink">{capabilities[active].title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate">{capabilities[active].description}</p>
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
    <section id="contact" className="relative z-10 border-t border-line bg-paper px-6 py-28 md:px-10 md:py-40">
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
              <a href="tel:+971000000000" className="mt-1 inline-block text-lg text-ink hover:text-teal">
                +971 00 000 0000
              </a>
            </div>
            <div>
              <p className="text-xs text-slate/70">Email</p>
              <a href="mailto:hello@endloops.com" className="mt-1 inline-block text-lg text-ink hover:text-teal">
                hello@endloops.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}