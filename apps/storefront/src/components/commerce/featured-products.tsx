import {Link} from '@/i18n/navigation';
import {ArrowRight, Ruler} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/i18n/server';
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {query} from '@/lib/vendure/api';
import {SearchProductsQuery} from '@/lib/vendure/queries';
import {ProductSlider} from '@/components/commerce/product-slider';
import {WhatsAppIcon} from '@/components/brand/icons';
import {whatsappInquiry} from '@/lib/brand';

async function getFeaturedProducts(locale: string, currencyCode: string) {
    const result = await query(
        SearchProductsQuery,
        {
            input: {
                take: 12,
                skip: 0,
                groupByProduct: true,
            },
        },
        {languageCode: locale, currencyCode},
    );

    return result.data.search.items;
}

export async function FeaturedProducts() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Product'});
    const products = await getFeaturedProducts(locale, currencyCode);

    if (!products.length) return null;

    return (
        <section className="border-t border-brand-line bg-white py-10 md:py-14">
            <div className="eh-wrap">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-6">
                    <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight">
                        {t('featuredProducts')}
                    </h2>
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-brand-blue"
                    >
                        {t('viewAllProducts')}
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid gap-3.5 lg:grid-cols-[minmax(0,236px)_minmax(0,1fr)]">
                    {/* Advice panel: the highest-intent action in this section */}
                    <a
                        href={whatsappInquiry()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group hidden h-full flex-col justify-between rounded-xl border border-brand-line bg-brand-surface-2 p-5 transition-colors duration-200 hover:border-brand-blue/35 lg:flex"
                    >
                        <div>
                            <span className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                                <Ruler className="size-[19px]" strokeWidth={1.9} />
                            </span>
                            <h3 className="mt-4 text-[17px] font-extrabold leading-tight tracking-tight text-brand-ink">
                                Not sure it fits?
                            </h3>
                            <p className="mt-2 text-[13px] leading-relaxed text-brand-muted">
                                Send us the width and height of your space. We shortlist three units that fit and quote
                                them the same day.
                            </p>
                        </div>
                        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-whatsapp px-4 py-2.5 text-[13.5px] font-bold text-white transition-transform duration-200 group-hover:-translate-y-0.5">
                            <WhatsAppIcon className="size-[17px]" />
                            Ask our team
                        </span>
                    </a>

                    <div className="min-w-0">
                        <ProductSlider
                            products={products}
                            itemClassName="basis-[64%] sm:basis-1/2 lg:basis-1/2 xl:basis-1/3 [@media(min-width:1400px)]:basis-1/4"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
