import Image from 'next/image';
import {MapPin, Phone, Mail, Clock, ArrowUpRight} from 'lucide-react';
import {WhatsAppIcon} from '@/components/brand/icons';
import {Reveal} from '@/components/brand/reveal';
import {BRAND} from '@/lib/brand';

const contactCards = [
    {icon: MapPin, label: 'Location', value: BRAND.locationLabel, href: BRAND.mapsDirections, external: true},
    {icon: Phone, label: 'Phone', value: BRAND.phoneDisplay, href: BRAND.phoneHref},
    ...(BRAND.email ? [{icon: Mail, label: 'Email', value: BRAND.email, href: BRAND.emailHref}] : []),
    {icon: WhatsAppIcon, label: 'WhatsApp', value: BRAND.phoneDisplay, href: BRAND.whatsappHref, external: true},
];

export function LocationContact() {
    return (
        <section className="bg-background py-10 md:py-14" id="location">
            <div className="eh-wrap">
                <Reveal as="h2" className="mb-6 text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight">
                    305 Discount in Miami
                </Reveal>

                <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
                    <Reveal as="div" className="flex flex-col">
                        <p className="max-w-[56ch] text-[clamp(15px,1.4vw,17px)] text-brand-muted">
                            Browse current inventory online, then call or message our team to confirm availability, pricing, financing questions and delivery options.
                        </p>
                        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[20px] shadow-brand">
                            <Image
                                src="/brand/store/interior.jpg"
                                alt="Home products displayed inside a retail store"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 90vw, 560px"
                            />
                        </div>
                        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
                            {contactCards.map((c) => (
                                <a
                                    key={c.label}
                                    href={c.href}
                                    {...(c.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                                    className="flex items-start gap-4 rounded-[14px] border border-brand-line bg-white p-5 transition-all duration-300 hover:translate-x-1 hover:border-transparent hover:shadow-brand"
                                >
                                    <span className="grid size-[46px] shrink-0 place-items-center rounded-[13px] bg-brand-blue/[0.08] text-brand-blue">
                                        <c.icon className="size-[22px]" />
                                    </span>
                                    <div>
                                        <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-brand-muted">{c.label}</div>
                                        <div className="mt-0.5 font-bold text-brand-ink">{c.value}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                        {BRAND.hours.length > 0 && (
                            <div className="mt-3.5 rounded-[14px] border border-brand-line bg-white p-5">
                                <h4 className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-brand-muted">
                                    <Clock className="size-4 text-brand-blue" /> Store Hours
                                </h4>
                                <ul className="text-sm">
                                    {BRAND.hours.map((h, i) => (
                                        <li
                                            key={h.day}
                                            className={`flex justify-between py-1.5 ${i < BRAND.hours.length - 1 ? 'border-b border-dashed border-brand-line' : ''}`}
                                        >
                                            <span className="font-semibold text-brand-ink-2">{h.day}</span>
                                            <span className={`font-semibold ${h.closed ? 'text-brand-red' : 'text-brand-muted'}`}>{h.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Reveal>

                    <Reveal as="div" delay={80} className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-[#e7ebf1] shadow-brand">
                        <iframe
                            title={`${BRAND.name} Miami service area`}
                            src={BRAND.mapEmbed}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 size-full border-0"
                        />
                        <div className="absolute bottom-[18px] left-[18px] z-[3] max-w-[78%] rounded-[14px] bg-white px-[18px] py-3.5 shadow-brand-lg">
                            <div className="text-[15px] font-extrabold">{BRAND.name}</div>
                            <div className="mt-0.5 text-[13px] text-brand-muted">{BRAND.locationLabel}</div>
                        </div>
                        <a
                            href="/search"
                            className="absolute right-[18px] top-[18px] z-[3] inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white shadow-brand-lg transition-transform hover:-translate-y-0.5"
                        >
                            Browse inventory <ArrowUpRight className="size-4" />
                        </a>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
