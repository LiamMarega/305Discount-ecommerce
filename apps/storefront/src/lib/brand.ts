/**
 * 305 Discount — business identity & contact details.
 * Single source of truth reused across navbar, footer, contact and SEO.
 */
export const BRAND = {
    name: "305 Discount",
    shortName: "305Discount",
    domain: "305discount.com",
    tagline: "Furniture · Appliances · Mattresses · Miami, FL",
    phoneDisplay: "(954) 254-0056",
    phoneHref: "tel:+19542540056",
    whatsappNumber: "19542540056",
    whatsappHref: "https://wa.me/19542540056",
    // No public email or exact street address has been supplied yet. Keep these
    // values intentionally empty/generic so we never publish inherited Easy Home data.
    email: "",
    emailHref: "",
    locationLabel: "Miami, FL",
    addressLine: "Miami, FL",
    mapsDirections: "https://www.google.com/maps/search/?api=1&query=Miami%2C+FL",
    mapsReviews: "",
    mapEmbed: "https://www.google.com/maps?q=Miami%2C+FL&output=embed",
    promise: ["Furniture", "Appliances", "Mattresses"] as const,
    hours: [] as readonly {day: string; value: string; closed: boolean}[],
    social: {
        facebook: "",
        instagram: "",
        tiktok: "",
    },
    // Populate only with brands that 305 Discount can verify it currently carries.
    brands: [] as readonly string[],
} as const;

interface WhatsAppInquiryOptions {
    productName?: string;
    variantName?: string;
    sku?: string;
    price?: string;
    url?: string;
}

/** Pre-built WhatsApp inquiry link for a specific product or catalog lead. */
export function whatsappInquiry(productOrOptions?: string | WhatsAppInquiryOptions): string {
    if (!productOrOptions) return BRAND.whatsappHref;

    const options =
        typeof productOrOptions === 'string'
            ? {productName: productOrOptions}
            : productOrOptions;

    const details = [
        options.variantName && `Variant: ${options.variantName}`,
        options.sku && `SKU: ${options.sku}`,
        options.price && `Price: ${options.price}`,
        options.url && `Link: ${options.url}`,
    ].filter(Boolean);

    const base = options.productName
        ? `Hi! I'm interested in the ${options.productName}. Is it available?`
        : "Hi! I'd like to ask about furniture, appliances, or mattresses at 305 Discount.";

    const text = encodeURIComponent(details.length ? `${base}\n\n${details.join('\n')}` : base);
    return `${BRAND.whatsappHref}?text=${text}`;
}
