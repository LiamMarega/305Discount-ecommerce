'use client';

import {useState, useEffect, useTransition} from 'react';
import {useSearchParams} from 'next/navigation';
import {useRouter} from '@/i18n/navigation';
import {Search, Loader2} from 'lucide-react';
import {useTranslations} from 'next-intl';

export function SearchInput() {
    const t = useTranslations('Navigation');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setSearchValue(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        startTransition(() => {
            router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="group flex w-full items-center gap-2 rounded-full border border-brand-line bg-brand-surface-2 py-1 pl-4 pr-1 md:py-1.5 md:pr-1.5 transition-[border-color,box-shadow] duration-200 focus-within:border-brand-blue focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(47,81,163,0.1)]"
        >
            <Search className="size-[18px] shrink-0 text-brand-muted" aria-hidden="true" />
            <input
                type="search"
                name="q"
                placeholder={t('searchProducts')}
                aria-label={t('searchProducts')}
                className="min-w-0 flex-1 bg-transparent py-2 text-[14.5px] text-brand-ink outline-none placeholder:text-brand-muted [&::-webkit-search-cancel-button]:hidden"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-8 shrink-0 md:h-9 items-center gap-1.5 rounded-full bg-brand-red px-4 text-[13.5px] font-bold text-white transition-[transform,opacity] duration-200 ease-[var(--ease-brand-out)] hover:-translate-y-px active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60"
            >
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                    <Search className="size-4 sm:hidden" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{t('searchAction')}</span>
            </button>
        </form>
    );
}
