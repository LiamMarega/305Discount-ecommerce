/**
 * 305 Discount review data.
 * Populate this file only with reviews verified as belonging to 305 Discount.
 * Inherited Easy Home reviews were intentionally removed during rebranding.
 */
export interface Review {
    author: string;
    rating: number;
    text: string;
    when?: string;
}

export const AGGREGATE = {
    rating: 0,
    count: 0,
} as const;

export const REVIEWS: Review[] = [];
