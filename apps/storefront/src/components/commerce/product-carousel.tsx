import {ProductSlider} from '@/components/commerce/product-slider';
import {FragmentOf} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';

interface ProductCarouselProps {
    title: string;
    products: Array<FragmentOf<typeof ProductCardFragment>>;
}

export function ProductCarousel({title, products}: ProductCarouselProps) {
    if (!products.length) return null;

    return (
        <section className="border-t border-brand-line bg-white py-10 md:py-14">
            <div className="eh-wrap">
                <h2 className="mb-5 text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight md:mb-6">
                    {title}
                </h2>
                <ProductSlider products={products} />
            </div>
        </section>
    );
}
