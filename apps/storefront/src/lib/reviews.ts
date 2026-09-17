/**
 * Real Google reviews for Easy Home Appliances — Miami, FL.
 * Source: Google Maps · 5.0 ★ · 25 reviews (June 2026).
 * Add new reviews here as they come in. Keep author to first name + last initial.
 */
export interface Review {
    author: string;
    rating: number;
    text: string;
    when?: string;
}

export const AGGREGATE = {
    rating: 5.0,
    count: 25,
} as const;

export const REVIEWS: Review[] = [
    {
        author: "Franco N.",
        rating: 5,
        when: "2 days ago",
        text: "Increíble experiencia y atención. Tenían todo lo que necesitaba!",
    },
    {
        author: "Sol G.",
        rating: 5,
        when: "2 days ago",
        text: "Muy buena la calidad de los productos y la atención del staff es lo mejor de todo! Los super recomiendo.",
    },
    {
        author: "Matias G.",
        rating: 5,
        when: "2 days ago",
        text: "Me encantó el lugar! Tenían todo lo que necesitaba y a muy buen precio!",
    },
    {
        author: "Adrián C.",
        rating: 5,
        when: "2 days ago",
        text: "Compré mi televisor ahí y todo impecable, excelente atención.",
    },
    {
        author: "Micaela S.",
        rating: 5,
        when: "2 days ago",
        text: "Increíble atención y servicio.",
    },
    {
        author: "Gaston M.",
        rating: 5,
        when: "2 days ago",
        text: "Excelente servicio y atención, súper recomendable.",
    },
];
