"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Upload,
  ShieldCheck,
  GitCompareArrows,
  Receipt,
  FileCheck2,
  FileSpreadsheet,
  RefreshCw,
  Check,
  AlertTriangle,
  Play,
  Download,
} from "lucide-react";
import { FadeIn } from "@/components/motion";
import { DemoModal } from "@/components/ui";

/* ============================================================
   Data
   ============================================================ */

type ToolCategory = "extraction" | "audit" | "matching";
type ToolStatus = "active" | "development";
type Accent = "teal" | "blue" | "lilac";

interface ResultRow {
  label: string;
  value: string;
  status: "ok" | "flag";
  note?: string;
}

interface ToolItem {
  n: string;
  id: string;
  title: string;
  icon: typeof Upload;
  category: ToolCategory;
  categoryLabel: string;
  status: ToolStatus;
  description: string;
  input: string;
  engineAction: string;
  output: string;
  metric: string;
  accent: Accent;
  inspector: {
    files: string[];
    stages: string[];
    rows: ResultRow[];
  };
}

const ACCENTS: Record<Accent, { chip: string; ring: string; dot: string; bar: string }> = {
  teal: { chip: "bg-mint text-teal", ring: "ring-teal/25", dot: "bg-teal", bar: "from-teal/25 to-teal/5" },
  blue: { chip: "bg-[#E7EBF5] text-blue", ring: "ring-blue/25", dot: "bg-blue", bar: "from-blue/25 to-blue/5" },
  lilac: { chip: "bg-[#EEE9F3] text-lilac", ring: "ring-lilac/25", dot: "bg-lilac", bar: "from-lilac/25 to-lilac/5" },
};

const CATEGORY_META: Record<ToolCategory, { label: string; icon: typeof Upload }> = {
  extraction: { label: "Extraction & parsing", icon: Upload },
  audit: { label: "Audit verification", icon: ShieldCheck },
  matching: { label: "Matching & ledgers", icon: GitCompareArrows },
};

const TOOLS: ToolItem[] = [
  {
    n: "01",
    id: "po-extraction",
    title: "Purchase-Order Extraction",
    icon: Upload,
    category: "extraction",
    categoryLabel: CATEGORY_META.extraction.label,
    status: "active",
    description:
      "Reads bulk PDF and scanned purchase orders, pulls header and tabular line items, and structures them into ERP-compatible formats.",
    input: "Multi-page scanned/digital PO PDFs, any layout",
    engineAction: "Coordinate-level OCR, TRN verification, unit price & currency parsing",
    output: "Clean CSV/JSON mapped to your ERP or General Ledger schema",
    metric: "Sub-second per page",
    accent: "teal",
    inspector: {
      files: ["PO-4471.pdf", "PO-4472.pdf", "PO-4473_scan.pdf"],
      stages: ["OCR extraction", "TRN & field parsing", "Schema mapping"],
      rows: [
        { label: "PO Number", value: "PO-4471", status: "ok" },
        { label: "Vendor TRN", value: "100293847500003", status: "ok" },
        { label: "Unit price", value: "AED 1,250.00 / unit", status: "ok" },
        {
          label: "Line 4 total",
          value: "Mismatch vs. header sum",
          status: "flag",
          note: "Off by AED 36.00 — check rounding",
        },
      ],
    },
  },
  {
    n: "02",
    id: "vouching",
    title: "Vouching Automation",
    icon: GitCompareArrows,
    category: "audit",
    categoryLabel: CATEGORY_META.audit.label,
    status: "active",
    description:
      "Cross-examines General Ledger sample entries against supporting tax invoices, receipts, and delivery notes, flagging missing records or mismatches automatically.",
    input: "GL transaction sample CSV + folder of scanned invoices",
    engineAction: "3-way line-item match, date cutoff check, VAT math verification",
    output: "Vouching lead schedule with hyperlinked proof coordinates",
    metric: "~80% less manual checking",
    accent: "blue",
    inspector: {
      files: ["GL_Sample_Q3.csv", "INV-2201.pdf", "INV-2202.pdf", "DN-0098.pdf"],
      stages: ["3-way line match", "Date cutoff check", "VAT math check"],
      rows: [
        { label: "GL-00142", value: "Matched to INV-2201", status: "ok" },
        { label: "GL-00143", value: "Matched to INV-2202", status: "ok" },
        {
          label: "GL-00147",
          value: "No supporting invoice found",
          status: "flag",
          note: "Missing record — flagged for review",
        },
      ],
    },
  },
  {
    n: "03",
    id: "expense-working",
    title: "Expense Working Automation",
    icon: Receipt,
    category: "audit",
    categoryLabel: CATEGORY_META.audit.label,
    status: "active",
    description:
      "Ingests employee expense claims, petty cash receipts, and supplier bills to build categorized, math-verified expense working papers.",
    input: "Scanned receipts, credit card statements, expense forms",
    engineAction: "Duplicate receipt detection, UAE 5% VAT extraction, GL categorization",
    output: "Standardized expense working schedule, ready for manager review",
    metric: "100% duplicate detection",
    accent: "blue",
    inspector: {
      files: ["Receipt_0231.jpg", "Receipt_0232.jpg", "CardStatement_Oct.csv"],
      stages: ["Duplicate detection", "VAT extraction", "GL categorisation"],
      rows: [
        { label: "EXP-118", value: "AED 420.00 — Office supplies", status: "ok" },
        {
          label: "EXP-119",
          value: "Duplicate of EXP-104",
          status: "flag",
          note: "Same receipt submitted twice",
        },
        { label: "EXP-121", value: "AED 1,050.00 — Travel", status: "ok" },
      ],
    },
  },
  {
    n: "04",
    id: "report-review",
    title: "Financial Report Review",
    icon: FileCheck2,
    category: "audit",
    categoryLabel: CATEGORY_META.audit.label,
    status: "development",
    description:
      "Reads draft financial statements to verify that internal numbers cast correctly and that notes tie out to balance sheet lines.",
    input: "Draft PDF/Word financial statements & disclosure notes",
    engineAction: "Cross-table casting, prior-period comparison, note reference check",
    output: "Anomaly report detailing casting errors and unreferenced notes",
    metric: "Zero-math-error assurance",
    accent: "blue",
    inspector: {
      files: ["Draft_FS_FY26.pdf", "Disclosure_Notes.docx"],
      stages: ["Cross-table casting", "Prior-period comparison", "Note reference check"],
      rows: [
        { label: "Balance sheet", value: "Casts correctly", status: "ok" },
        {
          label: "Note 14 reference",
          value: "Cited but not found in notes",
          status: "flag",
          note: "Unreferenced note — needs author review",
        },
      ],
    },
  },
  {
    n: "05",
    id: "tender-verification",
    title: "Tender Verification",
    icon: FileSpreadsheet,
    category: "matching",
    categoryLabel: CATEGORY_META.matching.label,
    status: "development",
    description:
      "Extracts pricing, bill of quantities, and scope clauses from competing contractor quotes to generate side-by-side bid comparison matrices.",
    input: "Multiple vendor quote PDFs & master procurement budget",
    engineAction: "Line-item normalization, rate comparison, budget cap compliance check",
    output: "Tender evaluation matrix, cheapest compliant vendor per line",
    metric: "Built for property teams",
    accent: "lilac",
    inspector: {
      files: ["Quote_AlNoor.pdf", "Quote_GulfBuild.pdf", "Quote_Apex.pdf", "Procurement_Budget.xlsx"],
      stages: ["Line-item normalisation", "Rate comparison", "Budget cap check"],
      rows: [
        { label: "HVAC chiller unit", value: "Al Noor — lowest compliant", status: "ok" },
        {
          label: "Lift modernisation",
          value: "Apex exceeds budget cap by 8%",
          status: "flag",
        },
      ],
    },
  },
  {
    n: "06",
    id: "reconciliation",
    title: "Reconciliation",
    icon: RefreshCw,
    category: "matching",
    categoryLabel: CATEGORY_META.matching.label,
    status: "active",
    description:
      "Ingests two high-volume datasets — bank statements vs. general ledgers, or vendor statements vs. accounts payable — and matches them instantly.",
    input: "Two CSV/Excel datasets or statement PDFs",
    engineAction: "Exact amount & reference matching, fuzzy vendor match, timing isolation",
    output: "Clean two-column reconciliation sheet with isolated exceptions",
    metric: "10,000+ rows in seconds",
    accent: "lilac",
    inspector: {
      files: ["Bank_Statement_Oct.csv", "GL_Export_Oct.csv"],
      stages: ["Exact match", "Fuzzy vendor match", "Timing difference isolation"],
      rows: [
        { label: "10,482 rows", value: "Matched exactly", status: "ok" },
        { label: "6 rows", value: "Timing difference — next statement", status: "ok" },
        { label: "3 rows", value: "Unmatched — no counterpart found", status: "flag" },
      ],
    },
  },
];

type CategoryFilter = "all" | ToolCategory;

const FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All tools" },
  { id: "extraction", label: CATEGORY_META.extraction.label },
  { id: "audit", label: CATEGORY_META.audit.label },
  { id: "matching", label: CATEGORY_META.matching.label },
];

/* ============================================================
   Small helpers
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
   Tool card — the "data recipe" card
   ============================================================ */

function ToolCard({
  tool,
  onInspect,
  onRequest,
}: {
  tool: ToolItem;
  onInspect: (id: string) => void;
  onRequest: () => void;
}) {
  const a = ACCENTS[tool.accent];
  const Icon = tool.icon;
  const isActive = tool.status === "active";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-white shadow-sm transition-shadow duration-300 hover:shadow-soft"
    >
      {/* preview swatch — stands in for a future product screenshot */}
      <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${a.bar}`}>
        <Icon size={34} className="text-ink/70" />
        <span className="absolute left-4 top-4 text-[10px] font-semibold tracking-[0.14em] text-ink/50">
          {tool.n}
        </span>
        <span
          className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
            isActive ? "text-teal" : "text-[#8C6210]"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-teal" : "bg-[#D7B66D]"}`} />
          {isActive ? "In production" : "In development"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${a.chip}`}>
          {tool.categoryLabel}
        </span>
        <h2 className="mt-4 font-serif text-2xl leading-tight tracking-[-0.04em] text-ink">
          {tool.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate">{tool.description}</p>

        {/* data flow breakdown */}
        <div className="mt-5 space-y-2 rounded-xl bg-paper p-3.5 font-mono text-[11px] leading-5">
          <p className="text-slate">
            <span className="text-ink/40">IN · </span>
            {tool.input}
          </p>
          <p className="text-slate">
            <span className="text-ink/40">ENGINE · </span>
            {tool.engineAction}
          </p>
          <p className="text-ink">
            <span className="text-ink/40">OUT · </span>
            {tool.output}
          </p>
        </div>

        <p className="mt-4 text-xs font-semibold text-teal">{tool.metric}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => onInspect(tool.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink"
          >
            {isActive ? "Inspect workflow" : "View demo spec"} <ArrowRight size={13} />
          </button>
          <button type="button" onClick={onRequest} className="text-xs font-medium text-slate hover:text-ink">
            {isActive ? "Request access" : "Join waitlist"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   Live inspector — shared across all 6 tools, driven by data
   ============================================================ */

function Inspector({ tool }: { tool: ToolItem }) {
  const [stage, setStage] = useState(-1); // -1 idle, 0..n-1 running, n done
  const [exported, setExported] = useState(false);
  const runId = useRef(0);

  const run = () => {
    runId.current += 1;
    const id = runId.current;
    setExported(false);
    setStage(0);
    tool.inspector.stages.forEach((_, i) => {
      if (i === 0) return;
      setTimeout(() => {
        if (runId.current === id) setStage(i);
      }, i * 700);
    });
    setTimeout(() => {
      if (runId.current === id) setStage(tool.inspector.stages.length);
    }, tool.inspector.stages.length * 700);
  };

  // Auto-run once whenever a different tool is selected, so the section
  // never sits empty — re-selecting the same tool uses the "Run again" button.
  useEffect(() => {
    run();
    return () => {
      runId.current += 1; // invalidate any in-flight timers on unmount/switch
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.id]);

  const done = stage >= tool.inspector.stages.length;
  const a = ACCENTS[tool.accent];

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D58C78]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D7B66D]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#7EAD91]" />
          <span className="ml-2 font-mono text-[10px] font-semibold text-slate">
            endloops / sandbox / {tool.id}
          </span>
        </div>
        <button
          type="button"
          onClick={run}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition hover:border-teal"
        >
          <Play size={12} className="text-teal" /> {done ? "Run again" : "Running…"}
        </button>
      </div>

      <div className="grid gap-px bg-line md:grid-cols-[.8fr_.7fr_1.1fr]">
        {/* INPUT */}
        <div className="bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/50">
            Input stage
          </p>
          <div className="mt-4 space-y-2">
            {tool.inspector.files.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-lg border border-dashed border-line bg-paper px-3 py-2 font-mono text-[11px] text-slate"
              >
                <Upload size={12} className="shrink-0 text-ink/40" />
                <span className="truncate">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ENGINE */}
        <div className="bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/50">
            Engine action
          </p>
          <div className="mt-4 space-y-3">
            {tool.inspector.stages.map((s, i) => {
              const state = i < stage ? "done" : i === stage ? "active" : "pending";
              return (
                <div key={s} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                      state === "done"
                        ? `${a.dot} border-transparent text-white`
                        : state === "active"
                          ? "border-ink text-ink"
                          : "border-line text-slate/40"
                    }`}
                  >
                    {state === "done" ? <Check size={12} /> : i + 1}
                  </span>
                  <span
                    className={`text-xs ${state === "pending" ? "text-slate/40" : "font-medium text-ink"}`}
                  >
                    {s}
                  </span>
                  {state === "active" && (
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-ink"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RESULT */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/50">
              Live result
            </p>
            {!done && <span className="text-[10px] text-slate/40">Processing…</span>}
          </div>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-2"
              >
                {tool.inspector.rows.map((r) => (
                  <div
                    key={r.label}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      r.status === "ok" ? "border-line bg-paper" : "border-[#D58C78]/40 bg-[#D58C78]/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink">{r.label}</span>
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${
                          r.status === "ok" ? "bg-mint text-teal" : "bg-[#D58C78]/20 text-[#B85D43]"
                        }`}
                      >
                        {r.status === "ok" ? <Check size={10} /> : <AlertTriangle size={10} />}
                        {r.status === "ok" ? "Confirmed" : "Flagged"}
                      </span>
                    </div>
                    <p className="mt-1 text-slate">{r.value}</p>
                    {r.note && <p className="mt-1 text-[11px] text-[#B85D43]">{r.note}</p>}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setExported(true)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <Download size={13} />
                  {exported ? "Exported ✓" : "Export to Excel / working paper"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 space-y-2"
              >
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-paper" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function ToolsPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(TOOLS[0].id);
  const [demoOpen, setDemoOpen] = useState(false);
  const inspectorRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(
    () => ({
      all: TOOLS.length,
      extraction: TOOLS.filter((t) => t.category === "extraction").length,
      audit: TOOLS.filter((t) => t.category === "audit").length,
      matching: TOOLS.filter((t) => t.category === "matching").length,
    }),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      const matchesCategory = category === "all" || t.category === category;
      const matchesQuery =
        !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const activeTool = TOOLS.find((t) => t.id === activeId) ?? TOOLS[0];

  const inspect = (id: string) => {
    setActiveId(id);
    inspectorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    // Mount-in entrance for this page. A true crossfade *between* routes has
    // to be wired in the root layout (AnimatePresence keyed on pathname) —
    // this only covers this page's own arrival.
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-paper"
    >
      {/* ============================================================
          Section 1 — Header, search, filters, status legend
          ============================================================ */}
      <div className="px-6 pb-16 pt-36 md:px-10 md:pt-48">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <p className="eyebrow">Standalone utilities</p>
            <h1 className="display-heading mt-6 max-w-4xl text-ink">
              Single-purpose automation.
              <br />
              <span className="text-blue">Instant relief.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate">
              Focused tools built to eliminate one specific manual bottleneck. Ingest raw files,
              let the engine extract and match, and export a clean, review-ready table — without
              running a full audit engagement.
            </p>
          </FadeIn>

          <motion.div {...reveal(0.1)} className="mt-10 flex flex-col gap-4">
            <div className="relative max-w-md">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search by task (e.g., PO, vouching, reconciliation)…"
                className="form-input w-full pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
            </div>

            <div className="flex items-center gap-5 text-[11px] text-slate/70">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal" /> In production
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#D7B66D]" /> In development
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 2 — The 6-tool interactive grid
          ============================================================ */}
      <div className="px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((t) => (
                <ToolCard key={t.id} tool={t} onInspect={inspect} onRequest={() => setDemoOpen(true)} />
              ))}
            </AnimatePresence>
          </motion.div>
          {visible.length === 0 && (
            <p className="mt-10 text-center text-sm text-slate">
              No tools match “{query}”. Try a different search or clear the filter.
            </p>
          )}
        </div>
      </div>

      {/* ============================================================
          Section 3 — Live tool inspector
          ============================================================ */}
      <div ref={inspectorRef} className="scroll-mt-28 bg-[#FBF9F4] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...reveal()} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Live tool inspector</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-ink md:text-4xl">
                Watch {activeTool.title.toLowerCase()} run.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => inspect(t.id)}
                  aria-pressed={t.id === activeId}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    t.id === activeId
                      ? "border-ink bg-ink text-white"
                      : "border-line text-slate hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {t.n}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal(0.1)} className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <Inspector tool={activeTool} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 4 — Bridging tools & solutions
          ============================================================ */}
      <div className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...reveal()}
            className="grid gap-8 rounded-[30px] border border-line bg-white p-8 md:grid-cols-2 md:p-12"
          >
            <div className="border-b border-line pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
              <p className="eyebrow">Choose standalone tools if…</p>
              <p className="mt-4 text-sm leading-7 text-slate">
                You have a specific task to knock out today — batch-extracting 200 vendor
                invoices, or reconciling last month's bank feed. No complex onboarding required.
              </p>
            </div>
            <div className="md:pl-10">
              <p className="eyebrow">Choose end-to-end solutions if…</p>
              <p className="mt-4 text-sm leading-7 text-slate">
                You manage an entire engagement from document intake to final report — a complete
                escrow audit or an annual property budget review.
              </p>
              <Link
                href="/solutions"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal"
              >
                Explore end-to-end solutions <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 5 — Bottom CTA banner
          ============================================================ */}
      <div className="px-6 pb-28 md:px-10 md:pb-40">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...reveal()}
            className="rounded-[30px] bg-ink p-8 text-paper md:flex md:items-center md:justify-between md:p-12"
          >
            <div>
              <h2 className="max-w-2xl font-serif text-3xl tracking-[-0.04em] md:text-4xl">
                Put repetitive document work on autopilot.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-paper/65">
                Tell us which standalone tool fits your current bottleneck, and we'll set up a
                live batch test with your sample data.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-0 md:shrink-0 md:flex-col md:items-end">
              <button type="button" onClick={() => setDemoOpen(true)} className="button-teal">
                Request tool demo <ArrowUpRight size={15} />
              </button>
              <Link href="/contact" className="button-outline !border-white/20 !text-paper">
                Contact our Dubai tech team
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </motion.div>
  );
}