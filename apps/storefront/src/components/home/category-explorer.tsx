import {Link} from '@/i18n/navigation';
import {ArrowRight} from 'lucide-react';
import {getRouteLocale} from '@/i18n/server';
import {getFeaturedCollections, getBrandFacets, type CatalogCollection} from '@/lib/vendure/cached';
import {AssetImage} from '@/components/shared/asset-image';

function previewOf(collection: CatalogCollection) {
    return (
        collection.productVariants?.items?.[0]?.product?.featuredAsset?.preview ??
        collection.featuredAsset?.preview
    );
}

function hrefOf(slug: string) {
    return `/collection/${slug}`;
}

function CategoryBlock({collection}: {collection: CatalogCollection}) {
    const href = collection.href ?? hrefOf(collection.slug);
    const children = (collection.children ?? []).slice(0, 4);
    const count = collection.productVariants?.totalItems ?? 0;

    return (
        <li className="flex gap-4">
            <Link
                href={href}
                tabIndex={-1}
                aria-hidden="true"
                className="relative size-[72px] shrink-0 overflow-hidden rounded-xl border border-brand-line bg-brand-surface-2"
            >
                <AssetImage
                    src={previewOf(collection)}
                    alt=""
                    sizes="72px"
                    fallbackTone="light"
                    className="object-contain p-2"
                />
            </Link>

            <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-extrabold leading-tight text-brand-ink">
                    <Link href={href} className="transition-colors hover:text-brand-blue">
                        {collection.name}
                    </Link>
                </h3>

                {children.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                        {children.map((child) => (
                            <li key={child.id}>
                                <Link
                                    href={hrefOf(child.slug)}
                                    className="inline-flex items-center gap-1.5 text-[13px] text-brand-muted transition-colors hover:text-brand-blue"
                                >
                                    <span className="size-1 rounded-full bg-brand-red/70" aria-hidden="true" />
                                    {child.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-2">
                        <p className="text-[13px] text-brand-muted">{count} items available</p>
                        <Link
                            href={href}
                            className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-bold text-brand-blue transition-colors hover:text-brand-blue-deep"
                        >
                            Shop all
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                )}
            </div>
        </li>
    );
}

export async function CategoryExplorer() {
    const locale = await getRouteLocale();
    const [collections, brands] = await Promise.all([
        getFeaturedCollections(locale, 8) as Promise<CatalogCollection[]>,
        getBrandFacets(locale, 10),
    ]);

    if (!collections.length) return null;

    return (
        <section className="bg-white py-10 md:py-14" id="categories">
            <div className="eh-wrap">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-3 md:mb-9">
                    <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight">
                        Shop by category
                    </h2>
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-brand-blue"
                    >
                        All products
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

                <ul className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
                    {collections.map((collection) => (
                        <CategoryBlock key={collection.id} collection={collection} />
                    ))}
                </ul>

                {brands.length > 0 && (
                    <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-brand-line pt-6 md:mt-11">
                        <h3 className="text-[13px] font-bold text-brand-ink">Shop by brand</h3>
                        <ul className="flex flex-wrap gap-2">
                            {brands.map((brand) => (
                                <li key={brand.id}>
                                    <Link
                                        href={brand.href}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-brand-line px-3.5 py-1.5 text-[13px] font-semibold text-brand-ink-2 transition-colors duration-200 hover:border-brand-blue hover:text-brand-blue"
                                    >
                                        {brand.name}
                                        <span className="text-[11.5px] text-brand-muted">{brand.count}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}
