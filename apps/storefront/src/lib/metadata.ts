import type { Metadata } from 'next';
import {BRAND} from '@/lib/brand';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || BRAND.name;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `https://${BRAND.domain}`;

export interface BreadcrumbJsonLdItem {
  name: string;
  url?: string;
}

/**
 * Truncate text to a maximum length, preserving word boundaries.
 * Strips HTML tags and is ideal for meta descriptions (recommended 150-160 chars).
 */
export function truncateDescription(
  text: string | null | undefined,
  maxLength = 155
): string {
  const cleanText = stripHtml(text);
  if (!cleanText) return '';

  if (cleanText.length <= maxLength) return cleanText;

  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  return lastSpaceIndex > 0
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

export function stripHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/** Build a canonical URL for a given path. */
export function buildCanonicalUrl(path: string): string {
  const baseUrl = SITE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function buildAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return buildCanonicalUrl(url);
}

/** Build Open Graph image array from an image URL. */
export function buildOgImages(
  imageUrl: string | null | undefined,
  alt?: string
): NonNullable<Metadata['openGraph']>['images'] {
  if (!imageUrl) return undefined;

  return [
    {
      url: imageUrl,
      alt: alt || 'Product image',
    },
  ];
}

/** Create noindex/nofollow robots config for protected pages. */
export function noIndexRobots(): Metadata['robots'] {
  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? {item: buildCanonicalUrl(item.url)} : {}),
    })),
  };
}

export function buildLocalBusinessJsonLd() {
  const sameAs = Object.values(BRAND.social).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: BRAND.name,
    description: BRAND.tagline,
    url: SITE_URL,
    telephone: BRAND.phoneDisplay,
    ...(BRAND.email ? {email: BRAND.email} : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: 'Miami',
    },
    ...(BRAND.mapsDirections ? {hasMap: BRAND.mapsDirections} : {}),
    ...(sameAs.length ? {sameAs} : {}),
  };
}
