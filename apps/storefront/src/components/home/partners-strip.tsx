import {Reveal} from '@/components/brand/reveal';
import {BRAND} from '@/lib/brand';

export function PartnersStrip() {
    if (!BRAND.brands.length) return null;

    return (
        <section className="border-b border-brand-line/60 bg-brand-surface">
            <div className="eh-wrap py-7 md:py-9">
                <Reveal as="p" className="mb-6 text-center text-[12px] font-bold uppercase tracking-[0.22em] text-brand-muted-2">
                    Brands in our catalog
                </Reveal>
                <Reveal
                    as="div"
                    delay={80}
                    className="grid grid-cols-3 items-center gap-x-6 gap-y-6 sm:grid-cols-4 md:grid-cols-7 md:gap-x-10"
                >
                    {BRAND.brands.map((brand) => (
                        <span
                            key={brand}
                            className="grid h-[30px] place-items-center text-center text-[clamp(15px,1.5vw,20px)] font-extrabold tracking-tight text-brand-ink opacity-55 grayscale transition-all duration-300 hover:scale-105 hover:opacity-100 hover:grayscale-0"
                        >
                            {brand}
                        </span>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
