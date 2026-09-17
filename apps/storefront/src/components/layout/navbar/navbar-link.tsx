'use client';

import {useSelectedLayoutSegments} from 'next/navigation';
import {ComponentProps} from 'react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

/** Category link for the light navigation bar: ink text, red rule when active. */
export function NavbarLink({href, className, children, ...rest}: ComponentProps<typeof Link>) {
    const segments = useSelectedLayoutSegments();
    const current = '/' + segments.join('/');
    const isActive = typeof href === 'string' && href !== '/' && current.startsWith(href);

    return (
        <Link
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'relative whitespace-nowrap px-3.5 py-3 text-[14px] font-semibold text-brand-ink-2 transition-colors',
                'hover:text-brand-blue',
                isActive &&
                    'text-brand-blue after:absolute after:inset-x-3.5 after:bottom-0 after:h-[2px] after:rounded-full after:bg-brand-red',
                className,
            )}
            {...rest}
        >
            {children}
        </Link>
    );
}
