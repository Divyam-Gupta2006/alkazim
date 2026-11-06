import Link from "next/link";
import { ArrowUpRight, ScanText, GitCompareArrows, ShieldCheck, FileCheck2, Layers3 } from "lucide-react";
import { capabilities } from "@/lib/data";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/ui";

const icons = [ScanText, GitCompareArrows, ShieldCheck, FileCheck2, Layers3];
export default function AboutPage() {
  return <div className="bg-paper px-6 pb-24 pt-36 md:px-10 md:pt-48"><div className="mx-auto max-w-[1400px]">
    <FadeIn><p className="eyebrow">ABOUT ENDLOOPS</p><h1 className="display-heading mt-6 max-w-5xl text-ink">Born from real financial work. <span className="text-teal">Built to make it better.</span></h1><p className="mt-8 max-w-3xl text-base leading-8 text-slate">Over several years, Alkazim’s internal technology department engineered proprietary software to automate high-volume audit and financial workflows in Dubai. That capability became Endloops: a B2B software company building financial automation for the GCC region and beyond.</p></FadeIn>
    <div className="my-16 grid gap-4 md:grid-cols-3"><div className="rounded-[26px] bg-ink p-8 text-paper md:col-span-2"><p className="eyebrow !text-[#9ACDBB]">OUR PRINCIPLE</p><h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight tracking-[-.05em] md:text-5xl">The software prepares the work. The professional reviews and decides.</h2></div><div className="rounded-[26px] border border-line bg-white p-8"><p className="eyebrow">OUR ORIGIN</p><p className="mt-5 font-serif text-3xl text-ink">Alkazim</p><p className="mt-3 text-sm leading-7 text-slate">A technology spin-out from years of internal financial workflow automation in Dubai.</p></div></div>
    <SectionHeading eyebrow="THE ENGINE" title="Five capabilities. One connected workflow." text="The Endloops engine reads financial information, checks it against other sources and rules, then prepares the work for a person to review."/>
    <div className="mt-12 divide-y divide-line border-y border-line">{capabilities.map((c,i)=>{const I=icons[i];return <FadeIn key={c.title}><div className="grid gap-4 py-7 md:grid-cols-[70px_1fr_1.1fr] md:items-center"><span className="text-xs font-semibold text-teal">0{i+1}</span><div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-teal"><I size={20}/></span><div><h3 className="font-serif text-2xl text-ink">{c.title}</h3><p className="mt-1 text-[10px] uppercase tracking-[.13em] text-slate">{c.subtitle}</p></div></div><p className="text-sm leading-7 text-slate">{c.description}</p></div></FadeIn>})}</div>
    <div className="mt-16 text-center"><p className="eyebrow">READY TO SEE IT IN CONTEXT?</p><h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl tracking-[-.05em] text-ink">Bring us the workflow that takes too long.</h2><Link href="/contact" className="button-teal mt-7">Talk to our team <ArrowUpRight size={15}/></Link></div>
  </div></div>;
}
