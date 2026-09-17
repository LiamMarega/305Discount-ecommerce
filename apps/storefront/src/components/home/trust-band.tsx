import {Star, ArrowRight} from 'lucide-react';
import {Reveal} from '@/components/brand/reveal';
import {BRAND} from '@/lib/brand';

const stats = [
    {n: '40+', l: 'Premium brands'},
    {n: '0%', l: 'Down to start'},
    {n: 'Free', l: 'Delivery & install'},
    {n: 'All', l: 'Credit welcome'},
];

export function TrustBand() {
    return (
        <section className="relative overflow-hidden text-white [background:linear-gradient(135deg,var(--brand-navy),#0d1f4d_55%,var(--brand-blue-deep))]">
            <div className="eh-wrap relative z-[2] py-12 text-center md:py-16">
                <Reveal as="p" className="mb-[18px] inline-flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.22em] text-brand-gold-lite">
                    <Star className="size-[15px] fill-current" /> Family owned · Serving the community
                </Reveal>
                <Reveal as="h2" delay={80} className="mx-auto max-w-[22ch] text-balance text-[clamp(24px,3.2vw,36px)] font-extrabold leading-[1.1] tracking-tight">
                    Quality you can trust,<br />terms you can afford.
                </Reveal>
                <Reveal as="p" delay={160} className="mx-auto mt-5 max-w-[54ch] text-[clamp(15px,1.5vw,18px)] text-white/[0.74]">
                    We help South Florida families furnish their homes with the brands they love — and the easy financing
                    that makes it possible. All credit types welcome, no perfect credit required.
                </Reveal>
                <Reveal as="div" delay={160} className="mt-8">
                    <a
                        href={BRAND.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-brand-gold-lite/55 px-8 py-[17px] text-base font-bold text-brand-gold-lite transition-all hover:-translate-y-0.5 hover:bg-brand-gold-lite/[0.12]"
                    >
                        See Financing Options <ArrowRight className="size-[18px]" />
                    </a>
                </Reveal>
                <Reveal as="div" delay={240} className="mx-auto mt-9 grid max-w-[880px] grid-cols-2 gap-x-3 gap-y-9 md:mt-14 md:grid-cols-4">
                    {stats.map((s, i) => (
                        <div key={s.l} className="relative">
                            {i > 0 && <span className="absolute inset-y-[14%] left-0 hidden w-px bg-white/[0.16] md:block" />}
                            <div className="text-[clamp(24px,2.8vw,34px)] font-extrabold tracking-tight text-brand-gold-lite">{s.n}</div>
                            <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/60">{s.l}</div>
                        </div>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
