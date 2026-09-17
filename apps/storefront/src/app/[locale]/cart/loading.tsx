import { CartSkeleton } from '@/components/shared/skeletons/cart-skeleton';

export default function CartLoading() {
    return (
        <div className="eh-wrap py-10 md:py-16">
            <div className="h-9 w-48 bg-muted animate-pulse rounded mb-8" />
            <CartSkeleton />
        </div>
    );
}
