'use client';

import {useId} from 'react';
import {ProductCard} from '@/components/commerce/product-card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {FragmentOf} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';
import {cn} from '@/lib/utils';

interface ProductSliderProps {
    products: Array<FragmentOf<typeof ProductCardFragment>>;
    /** Per-slide basis classes; controls how many cards are visible. */
    itemClassName?: string;
    /** Arrow button colour scheme. */
    tone?: 'light' | 'dark';
    className?: string;
}

/**
 * Bare product carousel with no section chrome, so callers own the heading,
 * background and any side panel around it.
 */
export function ProductSlider({
    products,
    itemClassName = 'basis-[64%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 [@media(min-width:1400px)]:basis-1/5',
    tone = 'light',
    className,
}: ProductSliderProps) {
    const id = useId();

    const arrow =
        tone === 'dark'
            ? 'border-white/25 bg-white/10 text-white hover:bg-white hover:text-brand-ink'
            : 'border-brand-line bg-white text-brand-ink hover:bg-brand-blue hover:text-white';

    return (
        <Carousel opts={{align: 'start', loop: products.length > 4}} className={cn('w-full', className)}>
            <CarouselContent className="-ml-3 md:-ml-4">
                {products.map((product, i) => (
                    <CarouselItem key={`${id}-${i}`} className={cn('pl-3 md:pl-4', itemClassName)}>
                        <ProductCard product={product} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className={cn('hidden size-10 md:flex', arrow)} />
            <CarouselNext className={cn('hidden size-10 md:flex', arrow)} />
        </Carousel>
    );
}
