import {Star, Quote, ArrowUpRight} from 'lucide-react';
import {Reveal} from '@/components/brand/reveal';
import {REVIEWS, AGGREGATE} from '@/lib/reviews';
import {BRAND} from '@/lib/brand';

function Stars({n, size = 4}: {n: number; size?: number}) {
    return (
        <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
            {Array.from({length: 5}).map((_, i) => (
                <Star
                    key={i}
                    style={{width: size, height: size}}
                    className={i < n ? 'fill-brand-gold-lite text-brand-gold-lite' : 'fill-brand-line text-brand-line'}
                />
            ))}
        </div>
    );
}

export function Reviews() {
    return (
        <section className="bg-background py-10 md:py-14" id="reviews">
            <div className="eh-wrap">
                <Reveal as="div" className="mx-auto mb-7 max-w-[640px] text-center md:mb-9">
                    <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold tracking-tight">
                        What our customers say
                    </h2>
                    {/* Aggregate badge */}
                    <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-brand-line bg-white px-5 py-3 shadow-brand-sm">
                        <span className="text-[clamp(26px,2.6vw,32px)] font-extrabold tracking-tight text-brand-ink">
                            {AGGREGATE.rating.toFixed(1)}
                        </span>
                        <div className="flex flex-col items-start gap-1">
                            <Stars n={5} size={16} />
                            <span className="text-[12px] font-semibold text-brand-muted">
                                {AGGREGATE.count} Google reviews
                            </span>
                        </div>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {REVIEWS.map((r, i) => (
                        <Reveal
                            key={`${r.author}-${i}`}
                            delay={(i % 3) * 80}
                            className="flex flex-col rounded-[20px] border border-brand-line bg-white p-7 shadow-brand-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-brand"
                        >
                            <Quote className="size-7 text-brand-red/25" />
                            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-brand-ink-2">
                                &ldquo;{r.text}&rdquo;
                            </p>
                            <div className="mt-5 flex items-center justify-between border-t border-brand-line pt-4">
                                <div>
                                    <div className="font-bold text-brand-ink">{r.author}</div>
                                    {r.when && (
                                        <div className="text-xs text-brand-muted">{r.when}</div>
                                    )}
                                </div>
                                <Stars n={r.rating} size={14} />
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal as="div" delay={80} className="mt-8 text-center">
                    <a
                        href={BRAND.mapsReviews}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-full border border-brand-line bg-white px-6 py-3 text-sm font-bold text-brand-ink shadow-brand-sm transition-transform hover:-translate-y-0.5"
                    >
                        Read all {AGGREGATE.count} reviews on Google
                        <ArrowUpRight className="size-4 text-brand-blue" />
                    </a>
                </Reveal>
            </div>
        </section>
    );
}
