import type {Metadata} from 'next';
import {getRouteLocale} from '@/i18n/server';
import {getTranslations} from 'next-intl/server';
import {Cart} from "@/app/[locale]/cart/cart";
import {Suspense} from "react";
import {CartSkeleton} from "@/components/shared/skeletons/cart-skeleton";
import {noIndexRobots} from '@/lib/metadata';
import {storeFeatures} from '@/config/store-mode';
import {notFound} from 'next/navigation';
import {connection} from 'next/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Cart'});
    return {
        title: t('title'),
        robots: noIndexRobots(),
    };
}

export default async function CartPage() {
    await connection();
    if (!storeFeatures.cart) {
        notFound();
    }

    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Cart'});

    return (
        <div className="eh-wrap py-10 md:py-14">
            <h1 className="mb-8 text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-tight">
                <span className="mb-3 block h-1 w-[54px] rounded bg-brand-red" />
                {t('title')}
            </h1>

            <Suspense fallback={<CartSkeleton />}>
                <Cart/>
            </Suspense>
        </div>
    );
}
