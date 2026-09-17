import {Link} from '@/i18n/navigation';
import {ArrowRight} from 'lucide-react';
import {getRouteLocale} from '@/i18n/server';
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {query} from '@/lib/vendure/api';
import {SearchProductsQuery} from '@/lib/vendure/queries';
import {Countdown} from '@/components/home/countdown';
import {ProductSlider} from '@/components/commerce/product-slider';

async function getBestValueProducts(locale: string, currencyCode: string) {
    const result = await query(
        SearchProductsQuery,
        {
            input: {
                take: 10,
                skip: 0,
                groupByProduct: true,
                sort: {price: 'ASC'},
            },
        },
        {languageCode: locale, currencyCode},
    );

    return result.data.search.items;
}

export async function DealOfTheWeek() {
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const products = await getBestValueProducts(locale, currencyCode);

    if (!products.length) return null;

    return (
        <section className="bg-background py-10 md:py-14" id="deals">
            <div className="eh-wrap">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:mb-6">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight">
                            Lowest prices this week
                        </h2>
                        <Countdown tone="light" />
                    </div>
                    <Link
                        href="/search?sort=price-asc"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-2 text-[13.5px] font-bold text-brand-blue transition-colors duration-200 hover:border-brand-blue/40"
                    >
                        See all
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="rounded-2xl border border-brand-line bg-white p-3.5 md:p-5">
                    <ProductSlider products={products} />
                </div>
            </div>
        </section>
    );
}
