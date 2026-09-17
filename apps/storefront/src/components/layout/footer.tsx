import {getRouteLocale} from '@/i18n/server';
import {getTopCollections} from '@/lib/vendure/cached';
import {NavigationLink} from '@/components/shared/navigation-link';
import {MapPin, Phone, Mail} from 'lucide-react';
import {WhatsAppIcon, FacebookIcon, InstagramIcon, TikTokIcon} from '@/components/brand/icons';
import {BRAND} from '@/lib/brand';
import {storeFeatures} from '@/config/store-mode';

const COPYRIGHT_YEAR = 2026;

export async function Footer() {
    const locale = await getRouteLocale();
    const collections = await getTopCollections(locale);

    return (
        <footer className="mt-auto bg-brand-ink text-white/70">
            <div className="eh-wrap grid gap-8 py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr] lg:gap-12">
                <div>
                    <NavigationLink href="/" className="mb-5 inline-block">
                        <img src="/brand/logo-light.svg" alt={BRAND.name} width={220} height={77} className="h-14 w-auto" />
                    </NavigationLink>
                    <p className="max-w-[38ch] text-sm leading-relaxed text-white/55">
                        Miami discount destination for furniture, appliances and mattresses. Browse current inventory and contact us directly for availability and pricing.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                        {BRAND.promise.map((word) => (
                            <span key={word} className="text-sm font-extrabold italic">
                                <span className="text-[#58a9ff]">305</span>{' '}
                                <span className="text-brand-red">{word}</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-white">Shop</h4>
                    <ul className="space-y-3 text-sm">
                        {collections.map((collection) => (
                            <li key={collection.id}>
                                <NavigationLink
                                    href={collection.href ?? `/collection/${collection.slug}`}
                                    className="transition-colors hover:text-white"
                                >
                                    {collection.name}
                                </NavigationLink>
                            </li>
                        ))}
                        <li>
                            <NavigationLink href="/search?sort=price-asc" className="transition-colors hover:text-white">
                                Deals &amp; Clearance
                            </NavigationLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-white">Help</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Ask About Financing</a></li>
                        <li><a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Delivery Options</a></li>
                        <li><a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Product Availability</a></li>
                        {storeFeatures.orders && (
                            <li><NavigationLink href="/account/orders" className="transition-colors hover:text-white">Your Orders</NavigationLink></li>
                        )}
                    </ul>
                </div>

                <div>
                    <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-white">Contact</h4>
                    <ul className="space-y-3.5 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="mt-0.5 size-[17px] shrink-0 text-brand-gold-lite" />
                            <a href={BRAND.mapsDirections} target="_blank" rel="noopener noreferrer" className="hover:text-white">{BRAND.locationLabel}</a>
                        </li>
                        <li className="flex items-start gap-3">
                            <Phone className="mt-0.5 size-[17px] shrink-0 text-brand-gold-lite" />
                            <a href={BRAND.phoneHref} className="hover:text-white">{BRAND.phoneDisplay}</a>
                        </li>
                        {BRAND.email && (
                            <li className="flex items-start gap-3">
                                <Mail className="mt-0.5 size-[17px] shrink-0 text-brand-gold-lite" />
                                <a href={BRAND.emailHref} className="hover:text-white">{BRAND.email}</a>
                            </li>
                        )}
                    </ul>
                    <div className="mt-6 flex gap-2.5">
                        {BRAND.social.facebook && (
                            <a href={BRAND.social.facebook} aria-label="Facebook" className="grid size-10 place-items-center rounded-xl bg-white/[0.07] transition-all hover:-translate-y-0.5 hover:bg-brand-blue">
                                <FacebookIcon className="size-[18px] text-white" />
                            </a>
                        )}
                        {BRAND.social.instagram && (
                            <a href={BRAND.social.instagram} aria-label="Instagram" className="grid size-10 place-items-center rounded-xl bg-white/[0.07] transition-all hover:-translate-y-0.5 hover:bg-brand-blue">
                                <InstagramIcon className="size-[18px] text-white" />
                            </a>
                        )}
                        <a href={BRAND.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-xl bg-white/[0.07] transition-all hover:-translate-y-0.5 hover:bg-brand-blue">
                            <WhatsAppIcon className="size-[18px] text-white" />
                        </a>
                        {BRAND.social.tiktok && (
                            <a href={BRAND.social.tiktok} aria-label="TikTok" className="grid size-10 place-items-center rounded-xl bg-white/[0.07] transition-all hover:-translate-y-0.5 hover:bg-brand-blue">
                                <TikTokIcon className="size-[18px] text-white" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="eh-wrap flex flex-col items-center justify-between gap-4 py-6 text-[12.5px] text-white/45 sm:flex-row">
                    <span>&copy; {COPYRIGHT_YEAR} {BRAND.name}. All rights reserved.</span>
                    <span>{BRAND.tagline}</span>
                </div>
            </div>
        </footer>
    );
}
