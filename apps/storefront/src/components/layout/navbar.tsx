import {Suspense} from "react";
import {NavigationLink} from '@/components/shared/navigation-link';
import {NavbarCollections} from '@/components/layout/navbar/navbar-collections';
import {NavbarCart} from '@/components/layout/navbar/navbar-cart';
import {NavbarUser} from '@/components/layout/navbar/navbar-user';
import {LanguagePicker} from '@/components/layout/navbar/language-picker';
import {CurrencyPickerWrapper} from '@/components/layout/navbar/currency-picker-wrapper';
import {MobileNavWrapper} from '@/components/layout/navbar/mobile-nav-wrapper';
import {SearchInput} from '@/components/layout/search-input';
import {HeaderShell} from '@/components/layout/navbar/header-shell';
import {NavbarUserSkeleton} from '@/components/shared/skeletons/navbar-user-skeleton';
import {SearchInputSkeleton} from '@/components/shared/skeletons/search-input-skeleton';
import {WhatsAppIcon} from '@/components/brand/icons';
import {Phone, Tag, MapPin, LayoutGrid} from 'lucide-react';
import {BRAND} from '@/lib/brand';
import {storeFeatures} from '@/config/store-mode';

export function Navbar() {
    const topBar = (
        <>
            <p className="flex items-center gap-2 text-white/85">
                <Tag className="size-[15px] text-brand-gold-lite" />
                <span className="font-semibold">Furniture · Appliances · Mattresses</span>
                <span className="hidden text-white/70 md:inline">discount inventory in Miami</span>
            </p>
            <div className="flex items-center gap-5">
                <a href={BRAND.phoneHref} className="inline-flex items-center gap-1.5 text-white/85 transition-colors hover:text-white">
                    <Phone className="size-[14px]" />
                    {BRAND.phoneDisplay}
                </a>
                <span className="hidden items-center gap-1.5 text-white/70 lg:inline-flex">
                    <MapPin className="size-[14px]" />
                    {BRAND.locationLabel}
                </span>
            </div>
        </>
    );

    const logo = (
        <NavigationLink href="/" aria-label={`${BRAND.name} home`} className="inline-flex items-center">
            <img src="/brand/logo.webp" alt={BRAND.name} width={285} height={100} className="h-10 w-auto sm:h-11" />
        </NavigationLink>
    );

    const actions = (
        <>
            <a
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with ${BRAND.name} on WhatsApp`}
                className="inline-flex size-10 items-center justify-center gap-2 rounded-full bg-brand-whatsapp text-sm font-bold text-white transition-transform duration-200 ease-[var(--ease-brand-out)] hover:-translate-y-px active:scale-[0.97] sm:size-auto sm:px-4 sm:py-2.5"
            >
                <WhatsAppIcon className="size-[18px]" />
                <span className="hidden md:inline">WhatsApp</span>
            </a>
            <Suspense>
                <LanguagePicker />
            </Suspense>
            <Suspense>
                <CurrencyPickerWrapper />
            </Suspense>
            {storeFeatures.cart && (
                <Suspense>
                    <NavbarCart />
                </Suspense>
            )}
            {storeFeatures.auth && (
                <Suspense fallback={<NavbarUserSkeleton />}>
                    <NavbarUser />
                </Suspense>
            )}
        </>
    );

    const nav = (
        <>
            <NavigationLink
                href="/search"
                className="-ml-1 mr-1 inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-blue px-3.5 py-2 text-[13.5px] font-bold text-white transition-colors duration-200 hover:bg-brand-blue-deep"
            >
                <LayoutGrid className="size-4" />
                All categories
            </NavigationLink>
            <Suspense>
                <NavbarCollections />
            </Suspense>
            <NavigationLink
                href="/search?sort=price-asc"
                className="ml-auto inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap py-3 pl-3 text-[13.5px] font-bold text-brand-red transition-colors duration-200 hover:text-brand-red-dark"
            >
                <Tag className="size-4" />
                Best prices
            </NavigationLink>
        </>
    );

    return (
        <HeaderShell
            topBar={topBar}
            mobileMenu={
                <Suspense>
                    <MobileNavWrapper />
                </Suspense>
            }
            logo={logo}
            search={
                <Suspense fallback={<SearchInputSkeleton />}>
                    <SearchInput />
                </Suspense>
            }
            actions={actions}
            nav={nav}
        />
    );
}
