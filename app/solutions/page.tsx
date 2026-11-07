"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Plus,
  Upload,
  ShieldCheck,
  FileCheck2,
  UserCheck,
  Crosshair,
  AlertTriangle,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { SectionHeading, DemoModal } from "@/components/ui";

/* ============================================================
   Data
   ============================================================ */

type Category = "all" | "audit" | "property";

interface SolutionModule {
  n: string;
  title: string;
  category: Exclude<Category, "all">;
  categoryLabel: string;
  audience: string;
  bottleneck: string;
  automates: string[];
  status: "Active in production" | "In development · early access";
  artifact: string;
}

const MODULES: SolutionModule[] = [
  {
    n: "01",
    title: "Budget Review",
    category: "property",
    categoryLabel: "Property & community finance",
    audience: "Audit firms, OA auditors, and JOP managers",
    bottleneck:
      "Auditing annual property service-charge budgets means manually comparing proposed budget lines against 12–24 months of historical expenditure ledgers, maintenance contracts, and utility invoices.",
    automates: [
      "Ingests previous-year actuals, current-year forecasts, and vendor service contracts",
      "Cross-compares proposed unit costs against historical baselines and regulatory caps",
      "Generates a draft Budget Review working paper highlighting every variance over 5%",
    ],
    status: "Active in production",
    artifact: "Mollak/RERA-compliant Budget Review lead schedule and variance pack",
  },
  {
    n: "02",
    title: "Escrow Audit",
    category: "audit",
    categoryLabel: "Audit & assurance",
    audience: "Statutory audit firms auditing real estate developers across the UAE and GCC",
    bottleneck:
      "Reconciling off-plan buyer collections held in escrow trust accounts against construction completion certificates and eligible contractor payout requests is slow, manual, and easy to get wrong.",
    automates: [
      "Matches buyer deposit receipts against developer Sale and Purchase Agreements",
      "Checks payout vouchers against certified engineer progress reports and statutory retention rules",
      "Flags unauthorized withdrawals and unverified contractor claims automatically",
    ],
    status: "Active in production",
    artifact: "Draft escrow account compliance and reconciliation report",
  },
  {
    n: "03",
    title: "Financial Audit",
    category: "audit",
    categoryLabel: "Audit & assurance",
    audience: "External audit and assurance firms, internal audit heads",
    bottleneck:
      "Junior auditors spend hundreds of hours keying trial balances, vouching sample transactions against stacks of PDF invoices, and checking ledger math by hand.",
    automates: [
      "Maps client trial balances to standardized audit lead schedules",
      "Runs automated sample extraction and three-way vouching against source documents",
      "Flags duplicate invoices, round-number journal anomalies, and ledger cut-off discrepancies",
    ],
    status: "Active in production",
    artifact: "Complete audit working paper file, ready for engagement partner review",
  },
  {
    n: "04",
    title: "Interim Audit",
    category: "audit",
    categoryLabel: "Audit & assurance",
    audience: "Mid-market to enterprise accounting teams, external audit practices",
    bottleneck:
      "Quarterly and mid-year financial health checks get rushed or skipped because manual vouching is too heavy a lift, which stores up surprise adjustments for year-end.",
    automates: [
      "Ingests 3- or 6-month transaction batches to run continuous ledger testing",
      "Identifies unrecorded liabilities, early revenue recognition flags, and internal-control breaches",
      "Compares budget to actual performance to produce interim management letters",
    ],
    status: "In development · early access",
    artifact: "Interim risk assessment and transaction test summary",
  },
  {
    n: "05",
    title: "Budget Preparation",
    category: "property",
    categoryLabel: "Property & community finance",
    audience: "Real estate management companies, strata managers, commercial asset teams",
    bottleneck:
      "Assembling multi-building service-charge budgets across HVAC, security, cleaning, insurance, and sinking funds across disconnected spreadsheets is slow and error-prone.",
    automates: [
      "Extracts renewal terms and contract fees directly from active FM and maintenance vendor contracts",
      "Computes floor-area apportionments and reserve-fund allocations automatically",
      "Produces an export-ready draft annual budget formatted for board and regulatory submission",
    ],
    status: "In development · early access",
    artifact: "Master property operating and reserve-fund budget model",
  },
];

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "All solutions" },
  { id: "audit", label: "Audit & assurance" },
  { id: "property", label: "Property & community finance" },
];

const PIPELINE = [
  {
    icon: Upload,
    title: "Intake & multi-source extraction",
    text: "Ingests a complete document pack — trial balances, general ledgers, vendor invoices, contracts, bank statements — simultaneously.",
  },
  {
    icon: ShieldCheck,
    title: "Automated cross-verification & rule engine",
    text: "Runs three-way vouching, recalculates VAT and retentions, and checks figures against statutory thresholds.",
  },
  {
    icon: FileCheck2,
    title: "Draft working paper assembly",
    text: "Generates standardized lead schedules, variance analysis tables, and audit documentation ready for review.",
  },
  {
    icon: UserCheck,
    title: "Partner sign-off & delivery",
    text: "Senior professionals review flagged exceptions, add advisory notes, and sign off with a complete audit trail.",
  },
];

const STATS = [
  { value: "0", label: "Black-box decisions", text: "100% human-in-the-loop sign-off, every time." },
  { value: "100%", label: "Traceability", text: "Every generated cell links back to its source PDF coordinates." },
  { value: "Days → minutes", label: "Turnaround", text: "Automated vouching, matching, and lead-paper drafting." },
];

const PILLARS = [
  {
    icon: Crosshair,
    title: "Coordinate-level source linking",
    text: "Click any calculated figure in a generated schedule and it highlights the exact line on the original scanned PDF.",
  },
  {
    icon: AlertTriangle,
    title: "Audit exception flagging",
    text: "The software isolates anomalies — variance breaches, unvouched sums — so senior staff spend their time investigating, not searching.",
  },
  {
    icon: UserCheck,
    title: "Role-based sign-off gates",
    text: "Junior prep, then manager verification, then partner or director sign-off — every step stays on the record.",
  },
];

/* ============================================================
   Small building blocks
   ============================================================ */

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function StatusBadge({ status }: { status: SolutionModule["status"] }) {
  const active = status === "Active in production";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] ${
        active ? "bg-mint text-teal" : "bg-[#D7B66D]/20 text-[#8C6210]"
      }`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   Module card
   ============================================================ */

function ModuleCard({
  module,
  open,
  onToggle,
}: {
  module: SolutionModule;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="h-fit rounded-[28px] border border-line bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-soft md:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-teal">{module.n}</span>
          <span className="rounded-full bg-paper px-3 py-1 text-[9px] font-bold tracking-[0.15em] text-slate">
            {module.categoryLabel.toUpperCase()}
          </span>
        </div>
        <StatusBadge status={module.status} />
      </div>

      <h3 className="mt-7 font-serif text-3xl tracking-[-0.04em] text-ink">{module.title}</h3>
      <p className="mt-2 text-xs font-medium text-slate/70">{module.audience}</p>

      <p className="mt-5 text-sm leading-7 text-slate">{module.bottleneck}</p>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-teal"
      >
        {open ? "Hide what Endloops automates" : "See what Endloops automates"}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}>
          <Plus size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-3 border-t border-line pt-5">
              {module.automates.map((d) => (
                <div key={d} className="flex gap-3 text-xs leading-5 text-slate">
                  <Check size={15} className="mt-0.5 shrink-0 text-teal" />
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-paper px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/60">
                Key artifact generated
              </p>
              <p className="mt-1 text-xs leading-5 text-ink">{module.artifact}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function SolutionsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  const counts = useMemo(
    () => ({
      all: MODULES.length,
      audit: MODULES.filter((m) => m.category === "audit").length,
      property: MODULES.filter((m) => m.category === "property").length,
    }),
    [],
  );

  const visible = category === "all" ? MODULES : MODULES.filter((m) => m.category === category);

  return (
    <div className="bg-paper">
      {/* ============================================================
          Section 1 — Header, filter bar, quick stats
          ============================================================ */}
      <div className="px-6 pb-20 pt-36 md:px-10 md:pt-48">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <p className="eyebrow">End-to-end financial platforms</p>
            <h1 className="display-heading mt-6 max-w-4xl text-ink">
              Complete workflow automation
              <br />
              for <span className="text-teal">high-stakes engagements.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate">
              From the first intake of messy source documents to sign-off-ready lead schedules
              and compliance packs. Built for audit firms, corporate finance departments, and
              GCC property managers.
            </p>
          </FadeIn>

          {/* Filter bar */}
          <motion.div {...reveal(0.1)} className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = category === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategory(f.id)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "border-teal bg-mint text-ink"
                      : "border-line text-slate hover:border-teal/50 hover:text-ink"
                  }`}
                >
                  {f.label} ({counts[f.id]})
                </button>
              );
            })}
          </motion.div>

          {/* Quick stats strip */}
          <motion.div
            {...reveal(0.18)}
            className="mt-14 grid gap-8 border-y border-line py-8 sm:grid-cols-3"
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`px-1 ${i > 0 ? "sm:border-l sm:border-line sm:pl-8" : ""}`}
              >
                <p className="font-serif text-3xl tracking-[-0.03em] text-ink md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal">
                  {s.label}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate">{s.text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 2 — The 4-stage pipeline
          ============================================================ */}
      <div className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="How end-to-end solutions work"
            title="One pipeline, four stages, zero black boxes."
            text="What separates an end-to-end solution from a standalone tool is that it owns the whole path — from first document to signed-off output."
          />

          <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            {/* connecting line, desktop only */}
            <div className="pointer-events-none absolute left-0 right-0 top-[27px] hidden h-px bg-line md:block" />

            {PIPELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} {...reveal(i * 0.08)} className="relative">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper text-teal">
                    <Icon size={22} />
                  </div>
                  <p className="mt-5 text-[10px] font-semibold tracking-[0.14em] text-slate/50">
                    STAGE 0{i + 1}
                  </p>
                  <h3 className="mt-2 font-serif text-xl tracking-[-0.03em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate">{step.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          Section 3 — Deep-dive solution modules
          ============================================================ */}
      <div className="bg-[#FBF9F4] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            eyebrow="The five products"
            title="Every module, in depth."
            text="Each solution ships as its own focused workflow. Filter by practice area, or open a card to see exactly what the software automates."
          />

          <motion.div layout className="mt-16 grid gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {visible.map((m) => (
                <ModuleCard
                  key={m.n}
                  module={m}
                  open={expanded === m.n}
                  onToggle={() => setExpanded((prev) => (prev === m.n ? null : m.n))}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 4 — Human-in-the-loop governance
          ============================================================ */}
      <div className="bg-ink px-6 py-20 text-paper md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading
            light
            eyebrow="Software prepares. You decide."
            title="Governance isn't a feature here — it's the architecture."
            text="&ldquo;We never file without your sign-off. Financial software can't be an unpredictable black box.&rdquo;"
          />

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  {...reveal(i * 0.1)}
                  className="rounded-[26px] border border-white/10 bg-white/[0.04] p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#9ACDBB]">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-6 font-serif text-xl tracking-[-0.03em] text-white">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-paper/65">{p.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          Section 5 — Solutions vs. tools
          ============================================================ */}
      <div className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...reveal()}
            className="grid gap-8 rounded-[30px] border border-line bg-white p-8 md:grid-cols-2 md:p-12"
          >
            <div className="border-b border-line pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
              <p className="eyebrow">End-to-end solutions</p>
              <p className="mt-4 text-sm leading-7 text-slate">
                Built for recurring engagements, complete audit cycles, and multi-document
                compliance workflows — the five modules above.
              </p>
            </div>
            <div className="md:pl-10">
              <p className="eyebrow">Standalone tools</p>
              <p className="mt-4 text-sm leading-7 text-slate">
                Built for ad-hoc, single-task bottlenecks — extracting 200 purchase orders, or
                running one bank reconciliation, without running a full engagement.
              </p>
              <Link
                href="/tools"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal"
              >
                Looking for standalone utilities? Explore Standalone Tools
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 6 — Action banner
          ============================================================ */}
      <div className="px-6 pb-28 md:px-10 md:pb-40">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...reveal()}
            className="rounded-[30px] bg-ink p-8 text-paper md:flex md:items-center md:justify-between md:p-12"
          >
            <div>
              <h2 className="max-w-2xl font-serif text-3xl tracking-[-0.04em] md:text-4xl">
                Transform your next audit or budget cycle.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-paper/65">
                Tell us which engagement type your firm handles most, and we'll put together a
                live workflow demonstration.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-0 md:shrink-0 md:flex-col md:items-end">
              <button type="button" onClick={() => setDemoOpen(true)} className="button-teal">
                Request a walkthrough <ArrowUpRight size={15} />
              </button>
              <Link href="/contact" className="button-outline !border-white/20 !text-paper">
                Talk to our Dubai team
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}