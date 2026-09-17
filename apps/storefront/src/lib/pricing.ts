/**
 * Price helpers shared by the catalog surfaces.
 * All values are Vendure minor units (cents).
 */

/** Lowest price of a search result, or null when the product has no price. */
export function basePrice(
    price: {__typename?: string; min?: number; max?: number; value?: number},
): number | null {
    if (price.__typename === 'PriceRange') return price.min ?? null;
    if (price.__typename === 'SinglePrice') return price.value ?? null;
    return null;
}

/** True when a search result spans more than one price. */
export function isPriceRange(
    price: {__typename?: string; min?: number; max?: number},
): boolean {
    return price.__typename === 'PriceRange' && price.min !== price.max;
}

/** Items below this price are not worth financing, so no instalment is shown. */
const FINANCING_THRESHOLD = 30_000; // $300.00

/**
 * Indicative monthly instalment over 24 months, rounded to whole dollars.
 * Returns null for items too cheap to finance so the storefront never quotes
 * a monthly plan that the store would not actually offer.
 */
export function monthlyFrom(base: number | null, months = 24): number | null {
    if (base == null || base < FINANCING_THRESHOLD) return null;
    return Math.round(base / months / 100) * 100;
}
