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
import {DiscountSignature} from "@/components/home/easy-signature";
import {Reviews} from "@/components/home/reviews";
import {LocationContact} from "@/components/home/location-contact";
import {Newsletter} from "@/components/home/newsletter";
import {SITE_NAME, buildCanonicalUrl, buildLocalBusinessJsonLd} from "@/lib/metadata";
import {toOgLocale} from '@/i18n/locale-utils';
import {routing} from '@/i18n/routing';
import {JsonLd} from '@/components/seo/json-ld';
import {BRAND} from '@/lib/brand';

function homeSeo(locale: string) {
    if (locale.startsWith('es')) {
        return {
            title: 'Muebles, Electrodomésticos y Colchones en Miami',
            description: 'Compra muebles, electrodomésticos y colchones en 305 Discount en Miami, FL. Consulta inventario, precios y disponibilidad directamente con nuestro equipo.',
        };
    }

    return {
        title: 'Furniture, Appliances & Mattresses in Miami',
        description: 'Shop furniture, appliances and mattresses at 305 Discount in Miami, FL. Browse current discount inventory and contact us for pricing and availability.',
    };
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const ogLocale = toOgLocale(locale);
    const seo = homeSeo(locale);

    return {
        title: {
            absolute: `${SITE_NAME} | ${seo.title}`,
        },
        description: seo.description,
        alternates: {
            canonical: buildCanonicalUrl(`/${locale}`),
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, buildCanonicalUrl(`/${l}`)])
            ),
        },
        openGraph: {
            title: `${SITE_NAME} | ${seo.title}`,
            description: seo.description,
            type: "website",
            locale: ogLocale,
            url: buildCanonicalUrl(`/${locale}`),
            images: [{url: '/brand/logo.svg', alt: `${BRAND.name} logo`}],
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
            <DiscountSignature />
            <Reviews />
            <LocationContact />
            <Newsletter />
        </div>
    );
}
