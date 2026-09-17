import type {Metadata} from 'next';
import {Suspense} from 'react';
import {noIndexRobots} from '@/lib/metadata';
import {AccountNavLinks} from '@/components/account/account-nav-links';
import {storeFeatures} from '@/config/store-mode';
import {notFound} from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    robots: noIndexRobots(),
};

const navItems = [
    {href: '/account/orders', labelKey: 'orders', icon: 'Package'},
    {href: '/account/addresses', labelKey: 'addresses', icon: 'MapPin'},
    {href: '/account/profile', labelKey: 'profile', icon: 'User'},
];

export default async function AccountLayout({children}: LayoutProps<'/[locale]/account'>) {
    if (!storeFeatures.account) {
        notFound();
    }

    return (
        <div className="eh-wrap py-10 md:py-14">
            {/* Mobile: horizontal tab bar */}
            <div className="md:hidden mb-6">
                <Suspense>
                    <AccountNavLinks items={navItems} layout="horizontal" />
                </Suspense>
            </div>

            <div className="flex gap-8">
                {/* Desktop: sidebar */}
                <aside className="hidden md:block w-64 shrink-0">
                    <Suspense>
                        <AccountNavLinks items={navItems} layout="vertical" />
                    </Suspense>
                </aside>
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
