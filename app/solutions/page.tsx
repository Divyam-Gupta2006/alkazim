import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { solutions } from "@/lib/data";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/ui";

export default function SolutionsPage() {
  return <div className="bg-paper px-6 pb-24 pt-36 md:px-10 md:pt-48">
    <div className="mx-auto max-w-[1400px]"><FadeIn><p className="eyebrow">END-TO-END SOLUTIONS</p><h1 className="display-heading mt-6 max-w-4xl text-ink">Complete workflows.<br/><span className="text-teal">Clearer decisions.</span></h1><p className="mt-7 max-w-2xl text-base leading-8 text-slate">Endloops brings multi-stage financial services together—from initial document intake and verification to working papers prepared for professional review.</p></FadeIn>
      <div className="mt-16 grid gap-4 md:grid-cols-2">{solutions.map((s,i)=><FadeIn key={s.n} delay={i*.06}><article className="h-full rounded-[28px] border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft md:p-9"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-teal">{s.n}</span><span className="rounded-full bg-paper px-3 py-1.5 text-[9px] font-bold tracking-[.15em] text-slate">{s.tag}</span></div><h2 className="mt-8 font-serif text-3xl tracking-[-.04em] text-ink">{s.title}</h2><p className="mt-4 min-h-[72px] text-sm leading-7 text-slate">{s.description}</p><div className="mt-7 space-y-3 border-t border-line pt-6">{s.details.map(d=><div key={d} className="flex gap-3 text-xs leading-5 text-slate"><Check size={15} className="mt-0.5 shrink-0 text-teal"/>{d}</div>)}</div></article></FadeIn>)}</div>
      <div className="mt-16 rounded-[30px] bg-ink p-8 text-paper md:flex md:items-center md:justify-between md:p-12"><div><p className="eyebrow !text-[#9ACDBB]">HUMAN-IN-THE-LOOP BY DESIGN</p><h2 className="mt-4 max-w-2xl font-serif text-3xl tracking-[-.04em] md:text-4xl">Your team owns the judgement. Endloops handles the preparation.</h2></div><Link href="/contact" className="button-teal mt-8 md:mt-0">Discuss your workflow <ArrowUpRight size={15}/></Link></div>
    </div>
  </div>;
}
