import {getCurrencyCookie} from './currency';
import {getActiveChannelCached} from './vendure/cached';

/**
 * Get the active currency code for the current request.
 * Reads from cookie, falls back to channel default.
 *
 * Reads the per-user currency cookie. Do not move this into shared cached code.
 */
export async function getActiveCurrencyCode(): Promise<string> {
    const cookieValue = await getCurrencyCookie();
    if (cookieValue) return cookieValue;

    const channel = await getActiveChannelCached();
    return channel.defaultCurrencyCode;
}
