import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import {BRAND} from '@/lib/brand';

export function PromoBanners() {
    return (
        <section className="bg-background pb-10 md:pb-14">
            <div className="eh-wrap grid gap-3.5 md:grid-cols-2">
                <a
                    href={BRAND.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[168px] flex-col justify-center rounded-2xl bg-brand-blue p-6 text-white transition-transform duration-300 ease-[var(--ease-brand-out)] hover:-translate-y-0.5 md:p-8"
                >
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-brand-gold-lite">
                        Need help choosing?
                    </span>
                    <span className="mt-2 block text-[clamp(19px,2.1vw,25px)] font-extrabold leading-tight tracking-tight">
                        Ask about financing &amp; availability
                    </span>
                    <span className="mt-2 block max-w-[40ch] text-[13.5px] leading-relaxed text-white/85">
                        Tell us what you are looking for and our team will help you find the right current inventory.
                    </span>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-white underline-offset-4 group-hover:underline">
                        Chat with 305 Discount
                        <ArrowUpRight className="size-[17px]" />
                    </span>
                </a>

                <a
                    href="/search"
                    className="group relative isolate flex min-h-[168px] flex-col justify-center overflow-hidden rounded-2xl p-6 text-white transition-transform duration-300 ease-[var(--ease-brand-out)] hover:-translate-y-0.5 md:p-8"
                >
                    <Image
                        src="/brand/store/exterior.jpg"
                        alt="Retail storefront"
                        fill
                        className="-z-10 object-cover transition-transform duration-700 ease-[var(--ease-brand-out)] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <span className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(1,28,80,.94)_0%,rgba(1,28,80,.76)_55%,rgba(1,28,80,.42)_100%)]" />
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-brand-gold-lite">
                        Miami inventory
                    </span>
                    <span className="mt-2 block text-[clamp(19px,2.1vw,25px)] font-extrabold leading-tight tracking-tight">
                        Furniture, appliances &amp; mattresses
                    </span>
                    <span className="mt-2 block max-w-[40ch] text-[13.5px] leading-relaxed text-white/85">
                        Browse current deals online and contact us to confirm pricing and availability.
                    </span>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-bold text-white underline-offset-4 group-hover:underline">
                        Shop the catalog
                        <ArrowUpRight className="size-[17px]" />
                    </span>
                </a>
            </div>
        </section>
    );
}
