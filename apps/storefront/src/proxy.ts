import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {routing} from './i18n/routing';
import {storeFeatures} from './config/store-mode';

const middleware = createMiddleware(routing);
const ecommerceSegments = new Set([
    'account',
    'cart',
    'checkout',
    'forgot-password',
    'order-confirmation',
    'register',
    'reset-password',
    'sign-in',
    'verify',
    'verify-pending',
]);

export function proxy(request: NextRequest) {
    if (storeFeatures.isCatalog && isEcommercePath(request.nextUrl.pathname)) {
        return new NextResponse(null, {status: 404});
    }

    return middleware(request);
}

export const config = {matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']};

function isEcommercePath(pathname: string) {
    const [, locale, segment] = pathname.split('/');
    return routing.locales.includes(locale as (typeof routing.locales)[number]) && ecommerceSegments.has(segment);
}
