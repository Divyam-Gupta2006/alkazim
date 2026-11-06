"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";

export function SectionHeading({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return <div className="max-w-3xl"><p className={`eyebrow ${light ? "!text-[#9ACDBB]" : ""}`}>{eyebrow}</p><h2 className={`display-heading mt-5 ${light ? "text-paper" : "text-ink"}`}>{title}</h2>{text && <p className={`mt-5 max-w-2xl text-base leading-7 ${light ? "text-paper/65" : "text-slate"}`}>{text}</p>}</div>;
}

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!open) setSent(false); }, [open]);
  return <AnimatePresence>
    {open && <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, y: 25, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: .3 }} className="relative w-full max-w-lg rounded-[28px] bg-paper p-7 shadow-2xl md:p-10">
        <button onClick={onClose} aria-label="Close modal" className="absolute right-5 top-5 rounded-full p-2 text-slate hover:bg-black/5"><X size={18} /></button>
        {!sent ? <><p className="eyebrow">LET’S TALK</p><h3 className="mt-4 font-serif text-4xl tracking-[-.04em] text-ink">See what we can take off your plate.</h3><p className="mt-3 text-sm leading-6 text-slate">Tell us a little about your team and we’ll follow up to arrange a walkthrough.</p>
          <form className="mt-7 space-y-3" onSubmit={e => { e.preventDefault(); setSent(true); }}>
            <input required type="text" placeholder="Your name" className="form-input" />
            <input required type="email" placeholder="Work email" className="form-input" />
            <input required type="text" placeholder="Company / firm" className="form-input" />
            <select className="form-input" defaultValue=""><option value="" disabled>I am a…</option><option>Accountant</option><option>Auditor</option><option>Finance team</option><option>Property manager</option></select>
            <button className="button-dark mt-2 w-full justify-center">Request a demo <ArrowUpRight size={16} /></button>
          </form><p className="mt-4 text-[11px] leading-5 text-slate/70">Demo request is a front-end prototype; connect your CRM or form endpoint to receive submissions.</p>
        </> : <div className="py-8 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint text-teal"><Check size={25} /></span><h3 className="mt-6 font-serif text-3xl text-ink">Thanks for reaching out.</h3><p className="mt-3 text-sm text-slate">Your demo request has been captured in this prototype.</p><button onClick={onClose} className="button-dark mt-7">Close</button></div>}
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState("Both");
  return submitted ? <div className="rounded-3xl border border-teal/20 bg-mint p-8"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal"><Check /></span><h3 className="mt-5 font-serif text-3xl text-ink">Message received.</h3><p className="mt-2 text-sm leading-6 text-slate">This prototype has recorded your submission locally. Connect an API endpoint to deliver enquiries to your team.</p><button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold text-teal">Send another message →</button></div> : <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2"><label className="form-label">Full name<input required className="form-input mt-2" placeholder="Your name" /></label><label className="form-label">Work email<input required type="email" className="form-input mt-2" placeholder="you@company.com" /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="form-label">Company / firm<input required className="form-input mt-2" placeholder="Company name" /></label><label className="form-label">I am a…<select required defaultValue="" className="form-input mt-2"><option value="" disabled>Select your role</option><option>Accountant</option><option>Auditor</option><option>Finance Team</option><option>Property Manager</option></select></label></div>
    <div><span className="form-label">What would you like to explore?</span><div className="mt-2 flex flex-wrap gap-2">{["End-to-End Solutions", "Standalone Tools", "Both"].map(v => <button type="button" key={v} onClick={() => setInterest(v)} className={`rounded-full border px-4 py-2 text-xs transition ${interest === v ? "border-teal bg-mint text-ink" : "border-line text-slate hover:border-teal"}`}>{v}</button>)}</div></div>
    <label className="form-label block">A little about what you need<textarea rows={4} className="form-input mt-2 resize-none" placeholder="Tell us about the workflows you would like to improve…" /></label>
    <button className="button-dark w-full justify-center sm:w-auto">Send inquiry <ArrowUpRight size={16} /></button>
    <p className="text-[11px] text-slate/65">Selected interest: {interest}. Prototype form only; wire to your preferred backend before launch.</p>
  </form>;
}
