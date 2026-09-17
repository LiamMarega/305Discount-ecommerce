import {getRouteLocale} from '@/i18n/server';
import {getTopCollections} from '@/lib/vendure/cached';
import {NavbarLink} from '@/components/layout/navbar/navbar-link';

export async function NavbarCollections() {
    const locale = await getRouteLocale();
    const collections = await getTopCollections(locale);

    return (
        <nav aria-label="Catalog categories" className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
            {collections.map((collection) => (
                <NavbarLink key={collection.id} href={collection.href ?? `/collection/${collection.slug}`}>
                    {collection.name}
                </NavbarLink>
            ))}
        </nav>
    );
}
