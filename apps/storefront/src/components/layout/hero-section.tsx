import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {ArrowRight, ArrowUpRight, CreditCard, Truck, MapPin} from 'lucide-react';
import {BRAND} from '@/lib/brand';

interface PromoTile {
    label: string;
    title: string;
    body: string;
    href: string;
    external?: boolean;
    icon: typeof CreditCard;
    accent: 'red' | 'blue';
}

const promoTiles: PromoTile[] = [
    {
        label: 'Financing',
        title: '0% down, monthly plans',
        body: 'All credit types welcome',
        href: BRAND.whatsappHref,
        external: true,
        icon: CreditCard,
        accent: 'red',
    },
    {
        label: 'Delivery',
        title: 'Free delivery and haul-away',
        body: 'On qualifying orders',
        href: '/search',
        icon: Truck,
        accent: 'blue',
    },
    {
        label: 'Showroom',
        title: BRAND.addressLine,
        body: 'Open Monday to Saturday',
        href: BRAND.mapsDirections,
        external: true,
        icon: MapPin,
        accent: 'blue',
    },
];

function PromoTileCard({tile}: {tile: PromoTile}) {
    const Icon = tile.icon;
    const className =
        'group flex h-full items-center gap-3.5 rounded-2xl border border-brand-line bg-white p-4 transition-[border-color,box-shadow] duration-200 hover:border-brand-blue/35 hover:shadow-brand-sm';

    const body = (
        <>
            <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                    tile.accent === 'red' ? 'bg-brand-red/10 text-brand-red-dark' : 'bg-brand-blue/10 text-brand-blue'
                }`}
            >
                <Icon className="size-[19px]" strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-brand-muted">
                    {tile.label}
                </span>
                <span className="mt-0.5 block truncate text-[15px] font-extrabold leading-tight text-brand-ink">
                    {tile.title}
                </span>
                <span className="block text-[12.5px] text-brand-muted">{tile.body}</span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-brand-muted transition-colors duration-200 group-hover:text-brand-blue" />
        </>
    );

    if (tile.external) {
        return (
            <a href={tile.href} target="_blank" rel="noopener noreferrer" className={className}>
                {body}
            </a>
        );
    }

    return (
        <Link href={tile.href} className={className}>
            {body}
        </Link>
    );
}

export function HeroSection() {
    return (
        <section className="bg-background py-5 md:py-7" id="top">
            <div className="eh-wrap grid gap-3.5 lg:grid-cols-[1.62fr_1fr]">
                <div className="relative isolate flex min-h-[340px] overflow-hidden rounded-[20px] bg-brand-navy sm:min-h-[376px] lg:min-h-[404px]">
                    <Image
                        src="/brand/store/showroom.jpg"
                        alt="Refrigerators and ranges on the Easy Home Appliances showroom floor"
                        fill
                        priority
                        className="-z-10 object-cover object-[68%_50%]"
                        sizes="(max-width: 1024px) 100vw, 760px"
                    />
                    {/* Narrow layouts put copy over the whole photo, so they need a
                        vertical scrim; wide layouts only darken the text column. */}
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(176deg,rgba(16,27,56,.93)_0%,rgba(16,27,56,.86)_60%,rgba(16,27,56,.82)_100%)] lg:hidden" />
                    <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(102deg,rgba(16,27,56,.96)_0%,rgba(16,27,56,.9)_42%,rgba(16,27,56,.45)_74%,rgba(16,27,56,.18)_100%)] lg:block" />

                    <div className="flex max-w-[520px] flex-col justify-center p-7 sm:p-9 lg:p-10">
                        <h1 className="text-balance text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.06] tracking-[-0.025em] text-white">
                            The best for your home,{' '}
                            <span className="whitespace-nowrap text-brand-red">
                                made <span className="italic">easy</span>
                            </span>
                        </h1>
                        <p className="mt-3.5 max-w-[42ch] text-[15px] leading-relaxed text-white/85">
                            Refrigerators, ranges and washers from the brands you know, with monthly plans that fit your
                            budget.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                            <Link
                                href="/search"
                                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-[14.5px] font-bold text-white transition-transform duration-200 ease-[var(--ease-brand-out)] hover:-translate-y-0.5 active:scale-[0.97]"
                            >
                                Shop appliances
                                <ArrowRight className="size-[17px]" />
                            </Link>
                            <a
                                href={BRAND.whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-1.5 text-[14.5px] font-bold text-white underline-offset-[6px] hover:underline"
                            >
                                Get pre-approved
                                <ArrowUpRight className="size-[17px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </a>
                        </div>
                        <p className="mt-7 text-[12.5px] font-semibold text-white/80">
                            40+ brands carried · 0% down financing · Free delivery and haul-away
                        </p>
                    </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
                    {promoTiles.map((tile, i) => (
                        <div key={tile.title} className={i === 2 ? 'sm:col-span-2 lg:col-span-1' : undefined}>
                            <PromoTileCard tile={tile} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
