'use client';

import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/malamal-content';
import { useWishlistStore } from '@/lib/wishlist-store';

type Props = {
    product: Product;
};

export function AddToWishlistButton({ product }: Props) {
    const hydrated = useWishlistStore(state => state.hydrated);
    const saved = useWishlistStore(state => state.items.some(item => item.sku === product.sku));
    const toggle = useWishlistStore(state => state.toggle);

    return (
        <Button
            type="button"
            variant={saved ? 'secondary' : 'outline'}
            disabled={!hydrated}
            onClick={() => toggle(product)}
            className="h-12 rounded-full px-6 text-sm font-bold shadow-sm"
        >
            {saved ? 'Saved in wishlist' : 'Add to wishlist'}
        </Button>
    );
}
