"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { DemoModal } from "./ui";

const nav = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/70 bg-paper/90 px-5 py-3 shadow-[0_8px_35px_rgba(23,44,53,.06)] backdrop-blur-xl md:px-7">
          <Link href="/" className="group flex h-9 w-[156px] items-center" aria-label="Endloops home">
            {/* Add the official static logo at /public/images/endloops-logo.png when ready. */}
            <span className="block h-9 w-[156px]" aria-hidden="true" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(item => <Link key={item.href} href={item.href} className={`nav-link ${path === item.href ? "nav-link-active" : ""}`}>{item.label}</Link>)}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/solutions" className="button-outline !px-5 !py-2.5">Explore products <ArrowUpRight size={15} /></Link>
            <button onClick={() => setDemo(true)} className="button-dark !px-5 !py-2.5">Request a demo <ArrowUpRight size={15} /></button>
          </div>
          <button className="rounded-full p-2 text-ink md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && <div className="mx-auto mt-2 max-w-[1400px] rounded-3xl border border-line bg-paper p-5 shadow-soft md:hidden">
          {nav.map(item => <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className="block border-b border-line py-3 text-sm text-ink">{item.label}</Link>)}
          <button onClick={() => { setOpen(false); setDemo(true); }} className="button-dark mt-4 w-full">Request a demo <ArrowUpRight size={15} /></button>
        </div>}
      </header>
      <DemoModal open={demo} onClose={() => setDemo(false)} />
    </>
  );
}

export function Footer() {
  return <footer className="bg-ink px-6 pb-8 pt-16 text-paper md:px-10">
    <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><Link href="/" aria-label="Endloops home" className="block h-10 w-[170px]"><span className="block h-10 w-[170px]" aria-hidden="true" /></Link><p className="mt-4 max-w-sm text-sm leading-7 text-paper/60">Financial automation built for professionals. The software prepares the work; you review and decide.</p></div>
      <div><p className="eyebrow !text-[#8CC8B2]">EXPLORE</p><div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-paper/70"><Link href="/solutions">Solutions</Link><Link href="/tools">Tools</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div></div>
      <div><p className="eyebrow !text-[#8CC8B2]">GET IN TOUCH</p><a href="mailto:hello@endloops.com" className="mt-5 inline-block text-sm text-paper/80 hover:text-white">hello@endloops.com</a><p className="mt-3 text-sm text-paper/45">Dubai, United Arab Emirates</p></div>
    </div>
    <div className="mx-auto mt-16 flex max-w-[1400px] flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-paper/40 md:flex-row"><span>© 2026 Endloops. Born from Alkazim, Dubai.</span><span>Built for clarity. Designed for control.</span></div>
  </footer>;
}
