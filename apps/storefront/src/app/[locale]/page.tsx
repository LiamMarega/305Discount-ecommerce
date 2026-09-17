import type {Metadata} from "next";
import {Suspense} from "react";
import {getRouteLocale} from "@/i18n/server";
import {HeroSection} from "@/components/layout/hero-section";
import {ServiceStrip} from "@/components/home/service-strip";
import {CategoryExplorer} from "@/components/home/category-explorer";
import {DealOfTheWeek} from "@/components/home/deal-of-week";
import {PromoBanners} from "@/components/home/promo-banners";
import {FeaturedProducts} from "@/components/commerce/featured-products";
import {PartnersStrip} from "@/components/home/partners-strip";
import {TrustBand} from "@/components/home/trust-band";
import {EasySignature} from "@/components/home/easy-signature";
import {Reviews} from "@/components/home/reviews";
import {LocationContact} from "@/components/home/location-contact";
import {Newsletter} from "@/components/home/newsletter";
import {SITE_NAME, buildCanonicalUrl, buildLocalBusinessJsonLd} from "@/lib/metadata";
import {getTranslations} from 'next-intl/server';
import {toOgLocale} from '@/i18n/locale-utils';
import {routing} from '@/i18n/routing';
import {JsonLd} from '@/components/seo/json-ld';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});
    const ogLocale = toOgLocale(locale);

    return {
        title: {
            absolute: `${SITE_NAME} - ${t('pageTitle')}`,
        },
        description: t('description'),
        alternates: {
            canonical: buildCanonicalUrl(`/${locale}`),
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, buildCanonicalUrl(`/${l}`)])
            ),
        },
        openGraph: {
            title: `${SITE_NAME} - ${t('pageTitle')}`,
            description: t('ogDescription'),
            type: "website",
            locale: ogLocale,
            url: buildCanonicalUrl(`/${locale}`),
        },
    };
}

export default function Home() {
    return (
        <div>
            <JsonLd data={buildLocalBusinessJsonLd()} />
            {/* Commerce first: offer, service promise, catalog entry points, then the story. */}
            <HeroSection />
            <ServiceStrip />
            <Suspense>
                <CategoryExplorer />
            </Suspense>
            <Suspense>
                <DealOfTheWeek />
            </Suspense>
            <PromoBanners />
            <Suspense>
                <FeaturedProducts />
            </Suspense>
            <PartnersStrip />
            <TrustBand />
            <EasySignature />
            <Reviews />
            <LocationContact />
            <Newsletter />
        </div>
    );
}
