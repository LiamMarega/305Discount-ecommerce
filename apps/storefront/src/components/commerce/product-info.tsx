'use client';

import {useState, useMemo, useTransition} from 'react';
import {useSearchParams} from 'next/navigation';
import {usePathname, useRouter} from '@/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Separator} from '@/components/ui/separator';
import {ShoppingCart, CheckCircle2} from 'lucide-react';
import {addToCart} from '@/app/[locale]/product/[slug]/actions';
import {toast} from 'sonner';
import {Price} from '@/components/commerce/price';
import {useLocale, useTranslations} from 'next-intl';
import {sanitizeDescriptionHtml} from '@/lib/html/sanitize-description';
import {storeFeatures} from '@/config/store-mode';
import {WhatsAppIcon} from '@/components/brand/icons';
import {whatsappInquiry} from '@/lib/brand';
import {toIntlLocale} from '@/i18n/locale-utils';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        description: string;
        variants: Array<{
            id: string;
            name: string;
            sku: string;
            priceWithTax: number;
            stockLevel: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
                groupId: string;
                group: {
                    id: string;
                    code: string;
                    name: string;
                };
            }>;
        }>;
        optionGroups: Array<{
            id: string;
            code: string;
            name: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
            }>;
        }>;
    };
    searchParams: { [key: string]: string | string[] | undefined };
    currencyCode: string;
}

export function ProductInfo({product, searchParams, currencyCode}: ProductInfoProps) {
    const t = useTranslations('Product');
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);

    // Initialize selected options from URL
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {};

        // Load from URL search params
        product.optionGroups.forEach((group) => {
            const paramValue = searchParams[group.code];
            if (typeof paramValue === 'string') {
                // Find the option by code
                const option = group.options.find((opt) => opt.code === paramValue);
                if (option) {
                    initialOptions[group.id] = option.id;
                }
            }
        });

        return initialOptions;
    });

    // Find the matching variant based on selected options
    const selectedVariant = useMemo(() => {
        if (product.variants.length === 1) {
            return product.variants[0];
        }

        // If not all option groups have a selection, return null
        if (Object.keys(selectedOptions).length !== product.optionGroups.length) {
            return null;
        }

        // Find variant that matches all selected options
        return product.variants.find((variant) => {
            const variantOptionIds = variant.options.map((opt) => opt.id);
            const selectedOptionIds = Object.values(selectedOptions);
            return selectedOptionIds.every((optId) => variantOptionIds.includes(optId));
        });
    }, [selectedOptions, product.variants, product.optionGroups]);

    const handleOptionChange = (groupId: string, optionId: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupId]: optionId,
        }));

        // Find the option group and option to get their codes
        const group = product.optionGroups.find((g) => g.id === groupId);
        const option = group?.options.find((opt) => opt.id === optionId);

        if (group && option) {
            // Update URL with option code
            const params = new URLSearchParams(currentSearchParams);
            params.set(group.code, option.code);
            router.push(`${pathname}?${params.toString()}`, {scroll: false});
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        startTransition(async () => {
            const result = await addToCart(selectedVariant.id, 1);

            if (result.success) {
                setIsAdded(true);
                toast.success(t('addedToCartMessage'), {
                    description: t('addedToCartDescription', {name: product.name}),
                });

                // Reset the added state after 2 seconds
                setTimeout(() => setIsAdded(false), 2000);
            } else {
                toast.error(t('errorTitle'), {
                    description: result.error || t('errorAddToCart'),
                });
            }
        });
    };

    const isInStock = selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK';
    const canAddToCart = selectedVariant && isInStock;
    const selectedVariantPrice = selectedVariant
        ? new Intl.NumberFormat(toIntlLocale(locale), {
            style: 'currency',
            currency: currencyCode,
        }).format(selectedVariant.priceWithTax / 100)
        : undefined;
    const inquiryHref = whatsappInquiry({
        productName: product.name,
        variantName: selectedVariant?.name,
        sku: selectedVariant?.sku,
        price: selectedVariantPrice,
    });

    return (
        <div className="space-y-6">
            {/* Product Title & Price */}
            <div className="space-y-2">
                <h1 className="text-[clamp(24px,3.5vw,38px)] font-extrabold leading-tight tracking-tight text-brand-ink">{product.name}</h1>
                {selectedVariant && (
                    <p className="mt-3 text-[clamp(22px,3vw,34px)] font-extrabold tracking-tight text-brand-red">
                        <Price value={selectedVariant.priceWithTax} currencyCode={currencyCode}/>
                    </p>
                )}
            </div>

            <Separator />

            {/* Product Description */}
            <div className="prose prose-sm max-w-none text-muted-foreground">
                <div dangerouslySetInnerHTML={{__html: sanitizeDescriptionHtml(product.description)}}/>
            </div>

            {/* Option Groups */}
            {product.optionGroups.length > 0 && (
                <div className="space-y-5">
                    {product.optionGroups.map((group) => (
                        <div key={group.id} className="space-y-3">
                            <Label className="text-base font-semibold">
                                {group.name}
                            </Label>
                            <RadioGroup
                                value={selectedOptions[group.id] || ''}
                                onValueChange={(value) => handleOptionChange(group.id, value)}
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {group.options.map((option) => (
                                        <div key={option.id}>
                                            <RadioGroupItem
                                                value={option.id}
                                                id={option.id}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={option.id}
                                                className="flex items-center justify-center rounded-xl border-2 border-brand-line bg-white px-4 py-3 text-sm font-semibold hover:border-brand-blue/40 hover:bg-accent peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-brand-blue/20 peer-data-[state=checked]:bg-brand-blue/5 cursor-pointer transition-all"
                                            >
                                                {option.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Status */}
            {selectedVariant && (
                <div className="text-sm">
                    {isInStock ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                            <span className="h-2 w-2 rounded-full bg-green-600" />
                            {t('inStock')}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-destructive font-medium">
                            <span className="h-2 w-2 rounded-full bg-destructive" />
                            {t('outOfStock')}
                        </span>
                    )}
                </div>
            )}

            {/* Primary CTA */}
            <div className="pt-2 space-y-3">
                {storeFeatures.cart ? (
                    <Button
                        size="lg"
                        className="h-14 w-full rounded-full bg-brand-red text-base font-bold text-white shadow-[0_14px_30px_-10px_rgba(243,98,41,.45)] hover:bg-brand-red-dark"
                        disabled={!canAddToCart || isPending}
                        onClick={handleAddToCart}
                    >
                        {isAdded ? (
                            <>
                                <CheckCircle2 className="mr-2 h-5 w-5"/>
                                {t('addedToCart')}
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-5 w-5"/>
                                {isPending
                                    ? t('adding')
                                    : !selectedVariant && product.optionGroups.length > 0
                                        ? t('selectOptions')
                                        : !isInStock
                                            ? t('outOfStock')
                                            : t('addToCart')}
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        render={<a href={inquiryHref} target="_blank" rel="noopener noreferrer" />}
                        nativeButton={false}
                        size="lg"
                        className="h-14 w-full rounded-full bg-brand-whatsapp text-base font-bold text-white hover:bg-[#1fbc59]"
                        disabled={!selectedVariant && product.optionGroups.length > 0}
                    >
                        <WhatsAppIcon className="mr-2 h-5 w-5"/>
                        {!selectedVariant && product.optionGroups.length > 0
                            ? t('selectOptions')
                            : t('whatsappInquiry')}
                    </Button>
                )}
            </div>

            {/* SKU */}
            {selectedVariant && (
                <div className="text-xs text-muted-foreground">
                    {t('sku', {sku: selectedVariant.sku})}
                </div>
            )}
        </div>
    );
}
