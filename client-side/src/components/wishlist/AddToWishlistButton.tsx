'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/storefront-types';
import { useWishlistStore } from '@/lib/wishlist-store';
import { addWishlistItem, removeWishlistItem } from '@/services/WishlistHistory';

type Props = {
    product: Product;
};

export function AddToWishlistButton({ product }: Props) {
    const hydrated = useWishlistStore(state => state.hydrated);
    const saved = useWishlistStore(state => state.items.some(item => item.sku === product.sku));
    const toggle = useWishlistStore(state => state.toggle);
    const [isPending, startTransition] = useTransition();

    function handleToggle() {
        const nextSaved = toggle(product);

        if (!product.id) return;

        startTransition(async () => {
            if (nextSaved) {
                await addWishlistItem(product.id!);
            } else {
                await removeWishlistItem(product.id!);
            }
        });
    }

    return (
        <Button
            type="button"
            variant={saved ? 'secondary' : 'outline'}
            disabled={!hydrated || isPending}
            onClick={handleToggle}
            className="h-12 rounded-full px-6 text-sm font-bold shadow-sm"
        >
            {saved ? 'Saved in wishlist' : 'Add to wishlist'}
        </Button>
    );
}
