import type {MetadataRoute} from 'next';
import {SITE_URL, buildCanonicalUrl} from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/*/cart',
                '/*/checkout',
                '/*/account',
                '/*/sign-in',
                '/*/register',
                '/*/forgot-password',
                '/*/reset-password',
                '/*/verify',
                '/*/verify-pending',
                '/*/order-confirmation',
                '/api/',
            ],
        },
        sitemap: buildCanonicalUrl('/sitemap.xml'),
        host: SITE_URL,
    };
}
