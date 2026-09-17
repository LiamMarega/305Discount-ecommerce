import {query} from './api';
import {GetActiveChannelQuery, GetAvailableCountriesQuery, GetTopCollectionsQuery, GetFeaturedCollectionsQuery, GetCatalogSearchQuery} from './queries';

export interface CatalogCollection {
    id: string;
    name: string;
    slug: string;
    href?: string;
    description?: string | null;
    featuredAsset?: {preview: string} | null;
    children?: Array<{id: string; name: string; slug: string}> | null;
    productVariants?: {
        totalItems?: number;
        items?: Array<{
            product?: {
                featuredAsset?: {preview: string} | null;
            } | null;
        }>;
    } | null;
}

function hasProducts(collection: {productVariants?: {totalItems?: number} | null}) {
    return (collection.productVariants?.totalItems ?? 0) > 0;
}

function collectionHref(slug: string) {
    return `/collection/${slug}`;
}

function searchFacetHref(facetValueId: string) {
    return `/search?facets=${encodeURIComponent(facetValueId)}`;
}

function formatFacetName(name: string) {
    if (name.length <= 3 && name === name.toUpperCase()) return name;

    return name
        .toLowerCase()
        .split(/([\s/&-]+)/)
        .map((part) => {
            if (/^[\s/&-]+$/.test(part)) return part;
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join('');
}

function toCatalogCollection(collection: CatalogCollection): CatalogCollection {
    return {
        ...collection,
        href: collection.href ?? collectionHref(collection.slug),
    };
}

interface SearchFacetValue {
    count: number;
    facetValue: {
        id: string;
        name: string;
        code: string;
        facet: {
            code?: string | null;
        };
    };
}

function getCatalogFacetCandidates(facetValues: SearchFacetValue[]) {
    const facetPriority: Record<string, number> = {
        type: 0,
        collection: 1,
        brand: 2,
    };
    const excludedCodes = new Set(['brand-new', 'open-box', 'shop-by-brand']);
    const seen = new Set<string>();

    return facetValues
        .filter(({count, facetValue}) => {
            const facetCode = facetValue.facet.code ?? '';
            return count > 0 && facetCode in facetPriority && !excludedCodes.has(facetValue.code);
        })
        .sort((a, b) => {
            const priorityA = facetPriority[a.facetValue.facet.code ?? ''] ?? 99;
            const priorityB = facetPriority[b.facetValue.facet.code ?? ''] ?? 99;
            return priorityA - priorityB || b.count - a.count;
        })
        .filter(({facetValue}) => {
            const key = facetValue.code.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

async function getFacetPreview(locale: string, facetValueId: string) {
    const result = await query(GetCatalogSearchQuery, {
        input: {
            take: 1,
            skip: 0,
            groupByProduct: true,
            facetValueFilters: [{and: facetValueId}],
        },
    }, {languageCode: locale});

    return result.data.search.items[0]?.productAsset?.preview ?? null;
}

async function getFallbackCatalogCollections(locale: string, take: number, withPreviews = false): Promise<CatalogCollection[]> {
    const result = await query(GetCatalogSearchQuery, {
        input: {
            take: 12,
            skip: 0,
            groupByProduct: true,
        },
    }, {languageCode: locale});

    const candidates = getCatalogFacetCandidates(result.data.search.facetValues).slice(0, take);

    return Promise.all(candidates.map(async ({count, facetValue}) => {
        const preview = withPreviews ? await getFacetPreview(locale, facetValue.id) : null;

        return {
            id: `facet-${facetValue.id}`,
            name: formatFacetName(facetValue.name),
            slug: facetValue.code,
            href: searchFacetHref(facetValue.id),
            description: `${count} products`,
            featuredAsset: preview ? {preview} : null,
            productVariants: {
                totalItems: count,
                items: preview
                    ? [{
                        product: {
                            featuredAsset: {preview},
                        },
                    }]
                    : [],
            },
        };
    }));
}

/**
 * Get the active channel with caching enabled.
 * Channel configuration rarely changes, so we cache it for 1 hour.
 * Channel config is language-independent, so no locale parameter needed.
 */
export async function getActiveChannelCached() {

    const result = await query(GetActiveChannelQuery);
    return result.data.activeChannel;
}

/**
 * Get available countries with caching enabled.
 * Countries list rarely changes, so we cache it with max duration.
 * Country names are translatable, so locale is required.
 */
export async function getAvailableCountriesCached(locale: string) {

    const result = await query(GetAvailableCountriesQuery, undefined, {languageCode: locale});
    return result.data.availableCountries || [];
}

/**
 * Get top-level collections with caching enabled.
 * Collections rarely change, so we cache them for 1 day.
 * Collection names are translatable, so locale is required.
 */
export async function getTopCollections(locale: string) {

    const result = await query(GetTopCollectionsQuery, undefined, {languageCode: locale});
    const collections = result.data.collections.items.filter(hasProducts).slice(0, 8);

    if (collections.length) {
        return collections.map(toCatalogCollection);
    }

    return getFallbackCatalogCollections(locale, 8);
}

/**
 * Get top-level collections with their featured asset and description, for the
 * homepage category showcase. Cached the same way as top collections.
 */
export async function getFeaturedCollections(locale: string, take = 8) {

    const result = await query(GetFeaturedCollectionsQuery, undefined, {languageCode: locale});
    const collections = result.data.collections.items.filter(hasProducts).slice(0, take);

    if (collections.length) {
        return collections.map(toCatalogCollection);
    }

    return getFallbackCatalogCollections(locale, Math.min(take, 6), true);
}

export interface CatalogBrand {
    id: string;
    name: string;
    code: string;
    count: number;
    href: string;
}

/**
 * Brand facet values with their product counts, for the homepage brand rail.
 * Counts come straight from the search index so nothing here is invented.
 */
export async function getBrandFacets(locale: string, take = 10): Promise<CatalogBrand[]> {
    const result = await query(GetCatalogSearchQuery, {
        input: {
            take: 0,
            skip: 0,
            groupByProduct: true,
        },
    }, {languageCode: locale});

    return result.data.search.facetValues
        .filter(({count, facetValue}) => count > 0 && facetValue.facet.code === 'brand')
        .sort((a, b) => b.count - a.count)
        .slice(0, take)
        .map(({count, facetValue}) => ({
            id: facetValue.id,
            name: formatFacetName(facetValue.name),
            code: facetValue.code,
            count,
            href: searchFacetHref(facetValue.id),
        }));
}
