import Link from "next/link";
import { ArrowUpRight, ArrowUpRight as Arrow } from "lucide-react";
import { tools } from "@/lib/data";
import { FadeIn } from "@/components/motion";

const accents: Record<string,string> = { teal: "bg-mint text-teal", blue: "bg-[#E7EBF5] text-blue", lilac: "bg-[#EEE9F3] text-lilac" };
export default function ToolsPage() {
  return <div className="bg-paper px-6 pb-24 pt-36 md:px-10 md:pt-48"><div className="mx-auto max-w-[1400px]">
    <FadeIn><p className="eyebrow">STANDALONE TOOLS</p><h1 className="display-heading mt-6 max-w-4xl text-ink">One task at a time.<br/><span className="text-blue">Done with precision.</span></h1><p className="mt-7 max-w-2xl text-base leading-8 text-slate">Modular utilities for the daily bottlenecks that slow finance teams down. Run a batch, review exceptions, and export a structured result.</p></FadeIn>
    <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map((t,i)=><FadeIn key={t.n} delay={i*.05}><article className="group flex h-full min-h-[310px] flex-col rounded-[28px] border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate/50">{t.n}</span><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accents[t.color]}`}><ArrowUpRight size={19}/></span></div><h2 className="mt-8 font-serif text-2xl leading-tight tracking-[-.04em] text-ink">{t.title}</h2><p className="mt-4 flex-1 text-sm leading-7 text-slate">{t.description}</p><div className="mt-7 border-t border-line pt-5"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-slate/55">TYPICAL OUTPUT</p><p className="mt-2 text-xs font-semibold text-ink">{t.output}</p></div></article></FadeIn>)}</div>
    <div className="mt-16 flex flex-col justify-between gap-6 rounded-[28px] border border-line bg-[#EAEDE5] p-8 md:flex-row md:items-center md:p-10"><div><p className="eyebrow">NEED MORE THAN ONE TOOL?</p><h2 className="mt-3 font-serif text-3xl tracking-[-.04em] text-ink">Explore an end-to-end workflow.</h2></div><Link href="/solutions" className="button-dark">Explore solutions <Arrow size={15}/></Link></div>
  </div></div>;
}
