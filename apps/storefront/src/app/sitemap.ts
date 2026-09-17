import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {buildCanonicalUrl} from '@/lib/metadata';
import {query} from '@/lib/vendure/api';
import {GetTopCollectionsQuery, SearchProductsQuery} from '@/lib/vendure/queries';
import {readFragment} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';

type SitemapEntry = MetadataRoute.Sitemap[number];

function localizedAlternates(path: string) {
    return {
        languages: Object.fromEntries(
            routing.locales.map((locale) => [locale, buildCanonicalUrl(`/${locale}${path}`)])
        ),
    };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const staticEntries: SitemapEntry[] = routing.locales.flatMap((locale) => [
        {
            url: buildCanonicalUrl(`/${locale}`),
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
            alternates: localizedAlternates(''),
        },
    ]);

    const catalogEntries = await getCatalogEntries(now);

    return [...staticEntries, ...catalogEntries];
}

async function getCatalogEntries(lastModified: Date): Promise<SitemapEntry[]> {
    try {
        const entries = await Promise.all(
            routing.locales.map(async (locale) => {
                const [productsResult, collectionsResult] = await Promise.all([
                    query(SearchProductsQuery, {
                        input: {take: 1000, groupByProduct: true},
                    }, {languageCode: locale}),
                    query(GetTopCollectionsQuery, undefined, {languageCode: locale}),
                ]);

                const products = productsResult.data.search.items.map((item) => readFragment(ProductCardFragment, item));
                const productEntries: SitemapEntry[] = products.map((product) => ({
                    url: buildCanonicalUrl(`/${locale}/product/${product.slug}`),
                    lastModified,
                    changeFrequency: 'weekly',
                    priority: 0.9,
                    alternates: localizedAlternates(`/product/${product.slug}`),
                }));

                const collectionEntries: SitemapEntry[] = collectionsResult.data.collections.items.map((collection) => ({
                    url: buildCanonicalUrl(`/${locale}/collection/${collection.slug}`),
                    lastModified,
                    changeFrequency: 'weekly',
                    priority: 0.8,
                    alternates: localizedAlternates(`/collection/${collection.slug}`),
                }));

                return [...collectionEntries, ...productEntries];
            })
        );

        return entries.flat();
    } catch (error) {
        console.error('Failed to generate dynamic sitemap entries', error);
        return [];
    }
}
