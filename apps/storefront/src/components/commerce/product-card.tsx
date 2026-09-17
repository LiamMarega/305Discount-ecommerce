import {ArrowRight} from 'lucide-react';
import {AssetImage} from '@/components/shared/asset-image';
import {FragmentOf, readFragment} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';
import {Price} from '@/components/commerce/price';
import {Link} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import {WhatsAppIcon} from '@/components/brand/icons';
import {whatsappInquiry} from '@/lib/brand';
import {basePrice, isPriceRange, monthlyFrom} from '@/lib/pricing';
import {cn} from '@/lib/utils';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
    className?: string;
}

export function ProductCard({product: productProp, className}: ProductCardProps) {
    const t = useTranslations('Product');
    const product = readFragment(ProductCardFragment, productProp);
    const base = basePrice(product.priceWithTax);
    const monthly = monthlyFrom(base);
    const href = `/product/${product.slug}`;

    return (
        <article
            className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-line bg-white',
                'transition-[border-color,box-shadow] duration-200 hover:border-brand-blue/30 hover:shadow-brand-sm',
                'focus-within:border-brand-blue/40',
                className,
            )}
        >
            <div className="relative aspect-square overflow-hidden bg-brand-surface-2">
                <AssetImage
                    src={product.productAsset?.preview}
                    alt={product.productName}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                    fallbackTone="light"
                    fallbackLabel={t('noImage')}
                    className="object-contain p-4 transition-transform duration-500 ease-[var(--ease-brand-out)] group-hover:scale-[1.04]"
                />

                {monthly != null && (
                    <span className="absolute left-2.5 top-2.5 rounded-full border border-brand-line bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-blue">
                        <Price value={monthly} currencyCode={product.currencyCode} />
                        /mo
                    </span>
                )}

                {/* Touch devices keep this visible; pointer devices reveal it on hover. */}
                <a
                    href={whatsappInquiry(product.productName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('whatsappInquiry')}: ${product.productName}`}
                    className={cn(
                        'absolute right-2.5 top-2.5 z-10 grid size-9 place-items-center rounded-full bg-brand-whatsapp text-white shadow-brand-sm',
                        'transition-[opacity,transform] duration-200 ease-[var(--ease-brand-out)] active:scale-95',
                        'md:[@media(hover:hover)]:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
                    )}
                >
                    <WhatsAppIcon className="size-[17px]" />
                </a>
            </div>

            <div className="flex flex-1 flex-col gap-2 border-t border-brand-line p-3.5">
                <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-brand-ink transition-colors group-hover:text-brand-blue">
                    <Link href={href} className="outline-none after:absolute after:inset-0 after:content-['']">
                        {product.productName}
                    </Link>
                </h3>

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            {isPriceRange(product.priceWithTax) && (
                                <span className="text-[11px] font-semibold text-brand-muted">{t('from')}</span>
                            )}
                            <span className="text-[19px] font-extrabold tracking-tight text-brand-red">
                                {base != null && <Price value={base} currencyCode={product.currencyCode} />}
                            </span>
                        </div>
                        {monthly != null && (
                            <p className="mt-0.5 text-[11.5px] text-brand-muted">
                                <Price value={monthly} currencyCode={product.currencyCode} />
                                /mo {t('monthlyFinancing')}
                            </p>
                        )}
                    </div>
                    <ArrowRight className="mb-1 size-4 shrink-0 text-brand-muted transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                </div>
            </div>
        </article>
    );
}
