import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import {BRAND} from '@/lib/brand';

export function PromoBanners() {
    return (
        <section className="bg-background pb-10 md:pb-14">
            <div className="eh-wrap grid gap-3.5 md:grid-cols-2">
                {/* Financing: typographic, no photography */}
                <a
                    href={BRAND.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[168px] flex-col justify-center rounded-2xl bg-brand-blue p-6 text-white transition-transform duration-300 ease-[var(--ease-brand-out)] hover:-translate-y-0.5 md:p-8"
                >
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-brand-gold-lite">
                        Apply in under 5 minutes
                    </span>
                    <span className="mt-2 block text-[clamp(19px,2.1vw,25px)] font-extrabold leading-tight tracking-tight">
                        Take it home today, pay monthly
                    </span>
                    <span className="mt-2 block max-w-[40ch] text-[13.5px] leading-relaxed text-white/85">
                        No perfect credit needed. Tell us what you are looking for and we will send your options.
                    </span>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-white underline-offset-4 group-hover:underline">
                        Check my options
                        <ArrowUpRight className="size-[17px]" />
                    </span>
                </a>

                {/* Showroom: photographic */}
                <a
                    href={BRAND.mapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative isolate flex min-h-[168px] flex-col justify-center overflow-hidden rounded-2xl p-6 text-white transition-transform duration-300 ease-[var(--ease-brand-out)] hover:-translate-y-0.5 md:p-8"
                >
                    <Image
                        src="/brand/store/exterior.jpg"
                        alt="Easy Home Appliances storefront in Miami, FL"
                        fill
                        className="-z-10 object-cover transition-transform duration-700 ease-[var(--ease-brand-out)] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <span className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(8,14,30,.92)_0%,rgba(8,14,30,.72)_55%,rgba(8,14,30,.35)_100%)]" />
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-brand-gold-lite">
                        {BRAND.addressLine}
                    </span>
                    <span className="mt-2 block text-[clamp(19px,2.1vw,25px)] font-extrabold leading-tight tracking-tight">
                        See it, open it, compare it
                    </span>
                    <span className="mt-2 block max-w-[40ch] text-[13.5px] leading-relaxed text-white/85">
                        Every unit on our floor is one you can measure today and take home this week.
                    </span>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-white underline-offset-4 group-hover:underline">
                        Get directions
                        <ArrowUpRight className="size-[17px]" />
                    </span>
                </a>
            </div>
        </section>
    );
}
