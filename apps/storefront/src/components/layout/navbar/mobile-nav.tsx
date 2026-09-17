'use client';

import {useState} from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import {Menu, Search, ShoppingBag, User, Package, MapPin, Phone} from 'lucide-react';
import {WhatsAppIcon} from '@/components/brand/icons';
import {BRAND} from '@/lib/brand';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';
import {useTranslations} from 'next-intl';
import {storeFeatures} from '@/config/store-mode';

interface Collection {
    id: string;
    name: string;
    slug: string;
    href?: string;
}

interface MobileNavProps {
    collections: Collection[];
}

export function MobileNav({collections}: MobileNavProps) {
    const t = useTranslations('Navigation');
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        setOpen(false);
    };

    const handleLinkClick = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu className="size-5" />
                <span className="sr-only">{t('openMenu')}</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center">
                        <img src="/brand/logo.webp" alt={BRAND.name} width={171} height={60} className="h-8 w-auto" />
                        <span className="sr-only">{t('menu')}</span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 px-4 pb-6">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t('searchProducts')}
                            className="pl-9 w-full"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </form>

                    {/* Shop All */}
                    <div>
                        <SheetClose
                            render={
                                <Link
                                    href="/search"
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                                />
                            }
                            onClick={handleLinkClick}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {t('shopAll')}
                        </SheetClose>
                    </div>

                    {/* Collections */}
                    {collections.length > 0 && (
                        <div>
                            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('collections')}
                            </p>
                            <nav className="flex flex-col gap-0.5">
                                {collections.map((collection) => (
                                    <SheetClose
                                        key={collection.id}
                                        render={
                                            <Link
                                                href={collection.href ?? `/collection/${collection.slug}`}
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                                            />
                                        }
                                        onClick={handleLinkClick}
                                    >
                                        {collection.name}
                                    </SheetClose>
                                ))}
                            </nav>
                        </div>
                    )}

                    {/* Account links */}
                    {storeFeatures.account && (
                        <div>
                            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('account')}
                            </p>
                            <nav className="flex flex-col gap-0.5">
                                <SheetClose
                                    render={
                                        <Link
                                            href="/account/profile"
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                                        />
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <User className="h-5 w-5" />
                                    {t('profile')}
                                </SheetClose>
                                <SheetClose
                                    render={
                                        <Link
                                            href="/account/orders"
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                                        />
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <Package className="h-5 w-5" />
                                    {t('orders')}
                                </SheetClose>
                                <SheetClose
                                    render={
                                        <Link
                                            href="/account/addresses"
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                                        />
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <MapPin className="h-5 w-5" />
                                    {t('addresses')}
                                </SheetClose>
                            </nav>
                        </div>
                    )}

                    {/* Contact CTAs */}
                    <div className="grid gap-2.5">
                        <a
                            href={BRAND.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-whatsapp px-5 py-3 text-sm font-bold text-white"
                        >
                            <WhatsAppIcon className="size-[18px]" /> WhatsApp
                        </a>
                        <a
                            href={BRAND.phoneHref}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-bold text-white"
                        >
                            <Phone className="size-[17px]" /> {BRAND.phoneDisplay}
                        </a>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
