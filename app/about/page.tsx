"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Crosshair,
  Eye,
  Calculator,
  SearchCheck,
  Building2,
  Home,
  Server,
  Lock,
  Users,
} from "lucide-react";
import { FadeIn } from "@/components/motion";

/* ============================================================
   Data
   ============================================================ */

const TENETS = [
  {
    icon: ShieldCheck,
    title: "Zero unsupervised filings",
    text: "Endloops never finalizes an audit file, ledger posting, or regulatory schedule on its own. It produces structured working drafts, ready for human review.",
  },
  {
    icon: Crosshair,
    title: "Coordinate-level traceability",
    text: "Every extracted cell, variance check, or reconciliation row links directly back to the exact coordinate on the source PDF invoice or bank statement.",
  },
  {
    icon: Eye,
    title: "Clarity over complexity",
    text: "Tools built for auditors have to prioritize audit trails and mathematical clarity over opaque, unexplainable algorithms.",
  },
];

const STAKEHOLDERS = [
  {
    icon: Calculator,
    title: "Accountants",
    text: "Eliminating manual expense schedules, recurring journal keying, and ledger reconciliations.",
  },
  {
    icon: SearchCheck,
    title: "Auditors",
    text: "Automating sample vouching, duplicate detection, and draft working paper generation.",
  },
  {
    icon: Building2,
    title: "Corporate finance teams",
    text: "Accelerating month-end closes, verifying tender quotes, and catching purchase order variances.",
  },
  {
    icon: Home,
    title: "Property management companies",
    text: "Structuring complex service-charge budgets, vendor contract verifications, and escrow account audits across portfolios.",
  },
];

const COMMITMENTS = [
  {
    icon: Server,
    title: "High-throughput batch processing",
    text: "Built to handle hundreds of documents concurrently, not one PDF at a time.",
  },
  {
    icon: Lock,
    title: "Bank-grade data protection",
    text: "Isolated tenant workspaces, so one client's financial data never touches another's.",
  },
  {
    icon: Users,
    title: "Continuous co-development",
    text: "Built alongside active practicing auditors, not designed in isolation from the work itself.",
  },
];

/* ============================================================
   Helpers
   ============================================================ */

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

/* ============================================================
   Timeline visual anchor
   ============================================================ */

function OriginTimeline() {
  return (
    <motion.div {...reveal(0.15)} className="relative mt-14">
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6">
        <div className="relative z-10 w-full sm:flex-1 rounded-[26px] border border-line bg-white p-6 md:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/50">2018</p>
          <p className="mt-2 font-serif text-xl tracking-[-0.03em] text-ink md:text-2xl">
            Internal tech team at Alkazim, Dubai
          </p>
        </div>

        <div className="relative hidden h-px flex-1 bg-line md:block">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 origin-left bg-teal"
          />
        </div>

        <div className="relative z-10 w-full sm:flex-1 rounded-[26px] border border-teal/30 bg-mint p-6 md:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal/70">Today</p>
          <p className="mt-2 font-serif text-xl tracking-[-0.03em] text-ink md:text-2xl">
            Endloops — independent financial automation engine
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-paper"
    >
      {/* ============================================================
          Section 1 — Header & mission statement
          ============================================================ */}
      <div className="px-6 pb-20 pt-36 md:px-10 md:pt-48">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <p className="eyebrow">Our origin & mission</p>
            <h1 className="display-heading mt-6 max-w-4xl text-ink">
              Born inside an audit practice.
              <br />
              <span className="text-teal">Engineered for financial judgement.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate">
              Endloops began as the internal technology department of Alkazim, an accounting and
              audit firm in Dubai. Today, we build dedicated automation platforms so financial
              professionals can eliminate repetitive grunt work while retaining absolute control
              over every final decision.
            </p>
          </FadeIn>

          <OriginTimeline />
        </div>
      </div>

      {/* ============================================================
          Section 2 — From practice to platform
          ============================================================ */}
      <div className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.h2
            {...reveal()}
            className="max-w-3xl font-serif text-3xl tracking-[-0.04em] text-ink md:text-4xl"
          >
            Software built by people who actually understand trial balances and audits.
          </motion.h2>

          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
            <motion.div {...reveal(0.08)} className="border-l-2 border-line pl-6">
              <p className="eyebrow">The reality of the profession</p>
              <p className="mt-4 text-sm leading-7 text-slate">
                Much of an accountant's or auditor's working day is lost to manual copy-pasting,
                multi-document cross-checks, and formatting lead schedules under tight deadlines.
                That manual cycle drains time away from advising clients and exercising
                professional judgement — the part of the job that actually needs a person.
              </p>
            </motion.div>
            <motion.div {...reveal(0.16)} className="border-l-2 border-teal pl-6">
              <p className="eyebrow">The technological evolution</p>
              <p className="mt-4 text-sm leading-7 text-slate">
                Rather than relying on generic third-party tools, Alkazim's technology engineers
                developed proprietary software tailored specifically to the rigorous compliance
                needs of GCC accounting, statutory audits, and property management finance. That
                dedicated technology department evolved into Endloops.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ============================================================
          Section 3 — Operating philosophy
          ============================================================ */}
      <div className="bg-ink px-6 py-20 text-paper md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...reveal()} className="mx-auto max-w-3xl text-center">
            <p className="eyebrow !text-[#9ACDBB]">Software prepares. People decide.</p>
            <p className="mt-6 font-serif text-2xl leading-snug tracking-[-0.03em] text-white md:text-3xl">
              "Our approach is simple: the software prepares the work, and the professional
              reviews and decides. We take care of the repetitive tasks, and the final sign-off
              always stays with people."
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {TENETS.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  {...reveal(i * 0.1)}
                  className="rounded-[26px] border border-white/10 bg-white/[0.04] p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#9ACDBB]">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-6 font-serif text-xl tracking-[-0.03em] text-white">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-paper/65">{t.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          Section 4 — Who we build for
          ============================================================ */}
      <div className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.p {...reveal()} className="eyebrow">
            Who we build for
          </motion.p>
          <motion.h2
            {...reveal(0.06)}
            className="mt-4 max-w-2xl font-serif text-3xl tracking-[-0.04em] text-ink md:text-4xl"
          >
            Four teams. One repeated problem.
          </motion.h2>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAKEHOLDERS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  {...reveal(i * 0.08)}
                  whileHover={{ y: -4 }}
                  className="rounded-[24px] border border-line bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-soft"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-teal">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl tracking-[-0.03em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-slate">{s.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          Section 5 — GCC ambition & technical quality
          ============================================================ */}
      <div className="border-t border-line bg-[#FBF9F4] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...reveal()} className="max-w-3xl">
            <p className="eyebrow">Setting the benchmark</p>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-ink md:text-4xl">
              Setting the automation benchmark for the GCC and beyond.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate">
              Based in Dubai, Endloops is engineering platforms tuned to regional financial
              systems — from RERA and Mollak property frameworks to UAE Corporate Tax and VAT
              compliance.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {COMMITMENTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={c.title} {...reveal(i * 0.1)}>
                  <Icon size={22} className="text-teal" />
                  <h3 className="mt-4 font-serif text-lg tracking-[-0.03em] text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate">{c.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          Section 6 — Page CTA
          ============================================================ */}
      <div className="px-6 py-20 text-center md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...reveal()}>
            <p className="eyebrow">Next step</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl tracking-[-0.05em] text-ink">
              See how Endloops fits into your firm's workflow.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="button-teal">
                Request a demo <ArrowUpRight size={15} />
              </Link>
              <Link href="/tools" className="button-outline">
                Explore our tools
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}