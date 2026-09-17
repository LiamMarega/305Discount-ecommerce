import {getLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

/**
 * Safe wrapper around next-intl request locale that validates against routing config
 * and falls back to defaultLocale instead of returning undefined.
 *
 * Use this in server components and generateMetadata.
 */
export async function getRouteLocale(): Promise<string> {
    const loc = await getLocale();
    return hasLocale(routing.locales, loc) ? loc : routing.defaultLocale;
}
