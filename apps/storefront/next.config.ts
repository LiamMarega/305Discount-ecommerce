import path from 'node:path';
import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

function getHostname(value: string | undefined) {
    if (!value?.trim()) return undefined;

    const normalized = value.includes('://') ? value : `https://${value}`;

    try {
        return new URL(normalized).hostname;
    } catch {
        return value.replace(/^https?:\/\//, '').split('/')[0];
    }
}

const vendureAssetHosts = Array.from(new Set([
    'readonlydemo.vendure.io',
    'demo.vendure.io',
    'localhost',
    'admin.easyhomeappliancesbr.com',
    'vendure-server-production-9c62.up.railway.app',
    getHostname(process.env.NEXT_PUBLIC_VENDURE_ASSET_HOST),
    getHostname(process.env.VENDURE_SHOP_API_URL),
].filter((hostname): hostname is string => Boolean(hostname))));

const nextConfig: NextConfig = {
    turbopack: {
        // Keep Turbopack rooted at the npm workspace root. This avoids the
        // multiple-lockfile warning in local dev and matches the monorepo install
        // shape used by Vercel.
        root: path.resolve(process.cwd(), '../..'),
    },
    images: {
        dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
        remotePatterns: vendureAssetHosts.map((hostname) => ({hostname})),
    }
};

export default withNextIntl(nextConfig);
