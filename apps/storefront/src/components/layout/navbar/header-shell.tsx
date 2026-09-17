import type {ReactNode} from 'react';

interface HeaderShellProps {
    topBar: ReactNode;
    mobileMenu: ReactNode;
    logo: ReactNode;
    search: ReactNode;
    actions: ReactNode;
    nav: ReactNode;
}

/**
 * Storefront header. The utility bar sits in normal flow and scrolls away;
 * only the search row and the category nav stick. No scroll listener, so the
 * header cannot fight the scroll position it is changing.
 */
export function HeaderShell({topBar, mobileMenu, logo, search, actions, nav}: HeaderShellProps) {
    return (
        <>
            <div className="hidden bg-brand-navy text-white md:block">
                <div className="eh-wrap flex items-center justify-between gap-4 py-2 text-[12.5px]">{topBar}</div>
            </div>

            <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-surface">
                <div className="eh-wrap">
                    <div className="flex items-center gap-3 py-2.5 md:gap-6 md:py-3">
                        <div className="flex shrink-0 items-center gap-2 md:gap-5">
                            {mobileMenu}
                            {logo}
                        </div>
                        <div className="hidden min-w-0 flex-1 lg:flex lg:max-w-[520px]">{search}</div>
                        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">{actions}</div>
                    </div>
                    <div className="pb-2.5 lg:hidden">{search}</div>
                </div>

                <div className="hidden border-t border-brand-line bg-brand-surface md:block">
                    <div className="eh-wrap flex items-center gap-1">{nav}</div>
                </div>
            </header>
        </>
    );
}
