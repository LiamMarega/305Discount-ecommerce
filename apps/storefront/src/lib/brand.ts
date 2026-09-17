/**
 * Easy Home Appliances — business identity & contact details.
 * Single source of truth reused across navbar, footer, contact and SEO.
 * Mirrors the values in the original design prototype.
 */
export const BRAND = {
    name: "Easy Home Appliances",
    tagline: "Quality Appliances, Easy Financing",
    phoneDisplay: "(305) 216-3996",
    phoneHref: "tel:+13052163996",
    whatsappNumber: "13052163996",
    whatsappHref: "https://wa.me/13052163996",
    email: "easyhome.ap@gmail.com",
    emailHref: "mailto:easyhome.ap@gmail.com",
    addressLine: "Suite 104 · Miami, FL",
    mapsDirections: "https://maps.app.goo.gl/m5Bea8wNguae3yZH8",
    mapsReviews: "https://maps.app.goo.gl/YgrtxQ3zuRS2QYkP9",
    mapEmbed: "https://www.google.com/maps?q=Easy+Home+Appliances+Miami+FL&output=embed",
    promise: ["Financing", "Approval", "Delivery"] as const,
    hours: [
        {day: "Monday – Friday", value: "9:00 AM – 7:00 PM", closed: false},
        {day: "Saturday", value: "9:00 AM – 6:00 PM", closed: false},
        {day: "Sunday", value: "Closed", closed: true},
    ],
    social: {
        facebook: "#",
        instagram: "#",
        tiktok: "#",
    },
    brands: ["SAMSUNG", "LG", "Whirlpool", "GE", "Frigidaire", "Bosch", "Maytag"],
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
        : "Hi! I'd like to ask about your appliances.";

    const text = encodeURIComponent(details.length ? `${base}\n\n${details.join('\n')}` : base);
    return `${BRAND.whatsappHref}?text=${text}`;
}
