import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { query } from '@/lib/vendure/api';
import { GetProductDetailQuery } from '@/lib/vendure/queries';
import { ProductImageCarousel } from '@/components/commerce/product-image-carousel';
import { ProductInfo } from '@/components/commerce/product-info';
import { RelatedProducts } from '@/components/commerce/related-products';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { notFound } from 'next/navigation';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';
import { routing } from '@/i18n/routing';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
    buildAbsoluteUrl,
    buildBreadcrumbJsonLd,
    stripHtml,
} from '@/lib/metadata';
import {getTranslations} from 'next-intl/server';
import {toOgLocale} from '@/i18n/locale-utils';
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {getRouteLocale} from '@/i18n/server';
import {JsonLd} from '@/components/seo/json-ld';
import {BRAND} from '@/lib/brand';
import {storeFeatures} from '@/config/store-mode';
import {WhatsAppIcon} from '@/components/brand/icons';

async function getProductData(slug: string, currencyCode: string) {

    const locale = await getRouteLocale();

    return await query(GetProductDetailQuery, {slug}, {languageCode: locale, currencyCode});
}

export async function generateMetadata({
    params,
}: PageProps<'/[locale]/product/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const result = await getProductData(slug, currencyCode);
    const product = result.data.product;

    const t = await getTranslations({locale, namespace: 'Product'});

    if (!product) {
        return {
            title: t('notFound'),
        };
    }

    const description = truncateDescription(product.description);
    const fallbackDescription = t('shopProductAt', {name: product.name, siteName: SITE_NAME});
    const ogImage = product.assets?.[0]?.preview;
    const ogLocale = toOgLocale(locale);
    const productPath = `/product/${product.slug}`;

    return {
        title: product.name,
        description: description || fallbackDescription,
        alternates: {
            canonical: buildCanonicalUrl(`/${locale}${productPath}`),
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, buildCanonicalUrl(`/${l}${productPath}`)])
            ),
        },
        openGraph: {
            title: product.name,
            description: description || fallbackDescription,
            type: 'website',
            locale: ogLocale,
            url: buildCanonicalUrl(`/${locale}${productPath}`),
            images: buildOgImages(ogImage, product.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description || fallbackDescription,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function ProductDetailPage({params, searchParams}: PageProps<'/[locale]/product/[slug]'>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const locale = await getRouteLocale();
    const currencyCode = await getActiveCurrencyCode();
    const t = await getTranslations({locale, namespace: 'Product'});

    const result = await getProductData(slug, currencyCode);

    const product = result.data.product;

    if (!product) {
        notFound();
    }

    // Get the primary collection (prefer deepest nested / most specific)
    const primaryCollection = product.collections?.find(c => c.parent?.id) ?? product.collections?.[0];
    const productPath = `/product/${product.slug}`;
    const productUrl = buildCanonicalUrl(`/${locale}${productPath}`);
    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: stripHtml(product.description),
        image: product.assets.map((asset) => buildAbsoluteUrl(asset.preview)).filter(Boolean),
        brand: {
            '@type': 'Brand',
            name: BRAND.name,
        },
        sku: product.variants[0]?.sku,
        offers: product.variants.map((variant) => ({
            '@type': 'Offer',
            name: variant.name,
            sku: variant.sku,
            priceCurrency: currencyCode,
            price: (variant.priceWithTax / 100).toFixed(2),
            availability: variant.stockLevel === 'OUT_OF_STOCK'
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            url: productUrl,
        })),
    };
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        {name: t('home'), url: `/${locale}`},
        ...(primaryCollection
            ? [{name: primaryCollection.name, url: `/${locale}/collection/${primaryCollection.slug}`}]
            : []),
        {name: product.name, url: `/${locale}${productPath}`},
    ]);

    return (
        <>
            <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
            <div className="eh-wrap py-8 md:py-12">
                {/* Breadcrumb Navigation */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/" />}>{t('home')}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {primaryCollection && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink render={<Link href={`/collection/${primaryCollection.slug}`} />}>
                                        {primaryCollection.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </>
                        )}
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Image Carousel */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <ProductImageCarousel images={product.assets} />
                    </div>

                    {/* Right Column: Product Info */}
                    <div>
                        <ProductInfo product={product} searchParams={searchParamsResolved} currencyCode={currencyCode} />
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <section className="border-y border-brand-line bg-brand-surface py-6">
                <div className="eh-wrap flex flex-wrap items-center justify-center gap-3 md:gap-6">
                    {[
                        {icon: Truck, label: t('trustBadges.fastShipping')},
                        {icon: RotateCcw, label: t('trustBadges.freeReturns')},
                        {icon: Clock, label: t('trustBadges.guarantee')},
                    ].map(({icon: Icon, label}) => (
                        <span key={label} className="inline-flex items-center gap-2 rounded-full bg-brand-surface-2 px-4 py-2 text-sm font-semibold text-brand-muted">
                            <Icon className="size-4 text-brand-red" />
                            {label}
                        </span>
                    ))}
                    {storeFeatures.checkout ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-surface-2 px-4 py-2 text-sm font-semibold text-brand-muted">
                            <ShieldCheck className="size-4 text-brand-red" />
                            {t('trustBadges.secureCheckout')}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-whatsapp/10 px-4 py-2 text-sm font-semibold text-brand-ink-2">
                            <WhatsAppIcon className="size-4 text-brand-whatsapp" />
                            {t('trustBadges.whatsappConsultation')}
                        </span>
                    )}
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-background py-14">
                <div className="eh-wrap max-w-2xl">
                    <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight">{t('faq.title')}</h2>
                    <Accordion className="w-full">
                        <AccordionItem value="shipping">
                            <AccordionTrigger>{t('faq.shipping.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.shipping.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="returns">
                            <AccordionTrigger>{t('faq.returns.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.returns.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tracking">
                            <AccordionTrigger>{t('faq.tracking.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.tracking.answer')}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="international">
                            <AccordionTrigger>{t('faq.international.question')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.international.answer')}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {primaryCollection && (

                <RelatedProducts
                    collectionSlug={primaryCollection.slug}
                    currentProductId={product.id}
                />
            )}
        </>
    );
}
