const SCRIPT_TAG_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_PATTERN = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_PATTERN = /\s+(href|src)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi;

/**
 * Vendure product descriptions are HTML. Keep benign markup, but strip executable
 * content so React/Next does not warn and, more importantly, so product copy
 * cannot execute scripts in the storefront.
 */
export function sanitizeDescriptionHtml(html: string): string {
    return html
        .replace(SCRIPT_TAG_PATTERN, '')
        .replace(EVENT_HANDLER_PATTERN, '')
        .replace(JAVASCRIPT_URL_PATTERN, '');
}
