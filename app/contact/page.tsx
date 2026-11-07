"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  MapPin,
  Clock,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Crosshair,
  Globe2,
  Lock,
} from "lucide-react";

/* ============================================================
   Data
   ============================================================ */

type Intent = "demo" | "partnership";

const ROLE_OPTIONS = [
  "External Audit / Assurance Firm",
  "Chartered Accounting Practice",
  "Corporate Finance Team",
  "Property Management / Strata Company",
  "Other",
];

const SCOPE_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "End-to-end solutions",
    items: ["Budget Review", "Escrow Audit", "Financial Audit", "Interim Audit", "Budget Preparation"],
  },
  {
    label: "Standalone tools",
    items: [
      "PO Extraction",
      "Vouching Automation",
      "Expense Workings",
      "Financial Report Review",
      "Tender Verification",
      "Reconciliation",
    ],
  },
];

const VOLUME_OPTIONS = ["< 500 files/month", "500–2,500 files/month", "2,500+ files/month (bulk)"];

const FAQS = [
  {
    q: "What is the difference between an End-to-End Solution and a Standalone Tool?",
    a: "End-to-End Solutions run entire multi-week workflows from document intake to final audit lead schedules. Standalone Tools solve a single, focused task on demand, without onboarding an entire engagement lifecycle.",
  },
  {
    q: "How does human sign-off work in practice?",
    a: "The software ingests files, performs OCR extraction, runs three-way matching, and pre-fills lead schedules while isolating exceptions. The final working paper still requires a qualified reviewer to inspect flagged exceptions and apply digital sign-off.",
  },
  {
    q: "Can we test Endloops with our own sample documents?",
    a: "Yes. During a guided demo, we process a sample batch of your invoices, purchase orders, or ledgers to show live extraction and exception-flagging speeds, on your own data.",
  },
  {
    q: "Is client financial data protected?",
    a: "Endloops operates on strict data isolation principles, using encrypted data transfer and storage designed to meet institutional financial confidentiality requirements.",
  },
];

const TRUST_BADGES = [
  { icon: Crosshair, label: "100% coordinate audit trail" },
  { icon: ShieldCheck, label: "Role-based reviewer sign-off" },
  { icon: Globe2, label: "Regional GCC regulatory alignment" },
  { icon: Lock, label: "Enterprise encrypted processing" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
   Intake form
   ============================================================ */

function IntakeForm() {
  const [intent, setIntent] = useState<Intent>("demo");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [scope, setScope] = useState<string[]>([]);
  const [volume, setVolume] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const emailValid = EMAIL_RE.test(email);
  const showEmailError = emailTouched && email.length > 0 && !emailValid;

  const toggleScope = (item: string) => {
    setScope((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!emailValid) return;
    setStatus("submitting");
    // Prototype only — no backend wired yet. Replace with a real submit call.
    setTimeout(() => setStatus("success"), 900);
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-teal/20 bg-mint p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal">
          <Check />
        </span>
        <h3 className="mt-5 font-serif text-3xl text-ink">
          {intent === "demo" ? "Demo request received." : "Thanks for reaching out."}
        </h3>
        <div className="mt-4 space-y-1.5 text-sm leading-6 text-slate">
          <p>
            <span className="font-semibold text-ink">{name || "Your request"}</span> —{" "}
            {company || "your company"}
          </p>
          <p>
            Interested in:{" "}
            <span className="font-medium text-ink">
              {scope.length ? scope.join(", ") : "general workflow overview"}
            </span>
          </p>
          {volume && <p>Estimated volume: {volume}</p>}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate">
          This prototype has recorded your submission locally. We typically reply within one
          business day — connect an API endpoint to deliver live enquiries to your team.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setName("");
            setEmail("");
            setEmailTouched(false);
            setCompany("");
            setRole("");
            setScope([]);
            setVolume("");
            setNotes("");
          }}
          className="mt-6 text-sm font-semibold text-teal"
        >
          Send another request →
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Intent toggle */}
      <div className="relative inline-flex w-full rounded-full border border-line bg-paper p-1">
        {(["demo", "partnership"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setIntent(id)}
            className="relative flex-1 rounded-full px-4 py-2.5 text-xs font-semibold transition-colors"
          >
            {intent === id && (
              <motion.span
                layoutId="intent-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-ink"
              />
            )}
            <span className={`relative z-10 ${intent === id ? "text-white" : "text-slate"}`}>
              {id === "demo" ? "Request a demo" : "Partnership & general inquiry"}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-label">
          Full name
          <input required value={name} onChange={(e) => setName(e.target.value)} className="form-input mt-2" placeholder="Your name" />
        </label>
        <label className="form-label">
          Professional work email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            className={`form-input mt-2 ${showEmailError ? "!border-[#B85D43]" : ""}`}
            placeholder="you@company.com"
            aria-invalid={showEmailError}
          />
          <AnimatePresence>
            {showEmailError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 text-[11px] font-medium text-[#B85D43]"
              >
                Enter a valid email address (e.g. you@company.com).
              </motion.p>
            )}
          </AnimatePresence>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-label">
          Company / practice name
          <input required value={company} onChange={(e) => setCompany(e.target.value)} className="form-input mt-2" placeholder="Company name" />
        </label>
        <label className="form-label">
          Role / sector
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-input mt-2"
          >
            <option value="" disabled>
              Select your sector
            </option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="form-label block">Product scope of interest</span>
        <div className="mt-3 space-y-3">
          {SCOPE_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate/50">
                {group.label}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const selected = scope.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleScope(item)}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition ${
                        selected ? "border-teal bg-mint text-ink" : "border-line text-slate hover:border-teal"
                      }`}
                    >
                      {selected && <Check size={12} className="text-teal" />}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className="form-label block">Estimated monthly document volume</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {VOLUME_OPTIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVolume(v)}
              aria-pressed={volume === v}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                volume === v ? "border-teal bg-mint text-ink" : "border-line text-slate hover:border-teal"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <label className="form-label block">
        Workflow notes / specific bottlenecks
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="form-input mt-2 resize-none"
          placeholder="Tell us about the workflow you want to automate…"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="button-dark w-full justify-center sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Submitting…
          </>
        ) : (
          <>
            Submit request <ArrowUpRight size={16} />
          </>
        )}
      </button>
      <p className="text-[11px] text-slate/65">
        Prototype form only; wire to your preferred backend before launch.
      </p>
    </form>
  );
}

/* ============================================================
   Copy-to-clipboard channel card
   ============================================================ */

function ChannelCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently,
      // the href link below still works as a fallback.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
      <a href={href} className="flex items-center gap-3 text-paper hover:text-[#9ACDBB]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#9ACDBB]">
          <Icon size={15} />
        </span>
        <span>
          <span className="block text-[10px] uppercase tracking-[0.12em] text-paper/40">{label}</span>
          <span className="text-sm">{value}</span>
        </span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="shrink-0 rounded-full border border-white/15 p-2 text-paper/70 transition hover:border-[#9ACDBB] hover:text-[#9ACDBB]"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

/* ============================================================
   FAQ accordion
   ============================================================ */

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {FAQS.map((item, i) => (
        <div key={item.q} className="border-b border-line">
          <button
            type="button"
            onClick={() => setOpen((prev) => (prev === i ? null : i))}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
          >
            <span className="font-serif text-lg tracking-[-0.02em] text-ink md:text-xl">{item.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.25 }}>
              <Plus size={18} className="shrink-0 text-slate" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="max-w-2xl pb-6 text-sm leading-7 text-slate">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-paper"
    >
      {/* ============================================================
          Section 1 — Header
          ============================================================ */}
      <div className="px-6 pb-16 pt-36 md:px-10 md:pt-48">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...reveal()}>
            <p className="eyebrow">Talk to us</p>
            <h1 className="display-heading mt-6 max-w-4xl text-ink">
              Automate the repetitive work.
              <br />
              <span className="text-teal">Retain complete control.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate">
              Schedule an interactive workflow demo, discuss a pilot for your audit team, or speak
              directly with our engineering team in Dubai.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 2 — Split-screen contact & demo engine
          ============================================================ */}
      <div className="px-6 pb-20 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <motion.div {...reveal(0.06)} className="rounded-[28px] border border-line bg-white p-7 md:p-10">
            <h2 className="mb-7 font-serif text-3xl text-ink">Start a conversation</h2>
            <IntakeForm />
          </motion.div>

          <motion.div
            {...reveal(0.14)}
            className="flex h-full flex-col justify-between rounded-[28px] bg-ink p-8 text-paper md:p-10"
          >
            <div>
              <p className="eyebrow !text-[#9ACDBB]">Direct communication</p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[#9ACDBB]" />
                  <div>
                    <p className="text-sm font-medium text-white">Dubai, United Arab Emirates</p>
                    <p className="mt-1 text-xs text-paper/55">Alkazim Technology Spin-out</p>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4">
                  <Clock size={16} className="mt-0.5 shrink-0 text-[#9ACDBB]" />
                  <p className="text-xs text-paper/55">
                    Monday – Friday, 09:00 – 18:00 Gulf Standard Time (GST)
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <ChannelCard icon={Mail} label="Email" value="hello@endloops.com" href="mailto:hello@endloops.com" />
                <ChannelCard icon={Phone} label="Phone / WhatsApp" value="+971 00 000 0000" href="tel:+971000000000" />
              </div>
            </div>

            <p className="mt-10 border-t border-white/15 pt-6 text-xs leading-6 text-paper/55">
              Every inquiry is reviewed directly by our product and engineering team. You will
              receive a response within one business day.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 3 — FAQ accordion
          ============================================================ */}
      <div className="border-t border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <motion.p {...reveal()} className="eyebrow">
            Common questions
          </motion.p>
          <motion.h2
            {...reveal(0.06)}
            className="mt-4 max-w-2xl font-serif text-3xl tracking-[-0.04em] text-ink md:text-4xl"
          >
            Before you reach out.
          </motion.h2>
          <motion.div {...reveal(0.12)} className="mt-10 max-w-3xl">
            <FaqAccordion />
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          Section 4 — Security & trust banner
          ============================================================ */}
      <div className="border-t border-line bg-[#FBF9F4] px-6 py-14 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...reveal()} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-teal">
                    <Icon size={17} />
                  </span>
                  <span className="text-xs font-semibold leading-5 text-ink">{b.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}