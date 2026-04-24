'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import type { Product } from '@/lib/storefront-types';
import { addCartItem } from '@/services/Cart';

export function AddToCartButton({ product, className }: { product: Product; className?: string }) {
    const addProduct = useCartStore(state => state.addProduct);
    const [added, setAdded] = useState(false);

    return (
        <Button
            type="button"
            onClick={() => {
                addProduct(product);
                setAdded(true);
                if (product.id) {
                    void addCartItem(product.id).catch(() => null);
                }
                window.setTimeout(() => setAdded(false), 1200);
            }}
            className={cn('h-9 w-full rounded-full px-3 text-[9px] font-semibold shadow-sm sm:h-12 sm:w-auto sm:px-6 sm:text-[11px]', className)}
        >
            {added ? 'Added' : 'Add to cart'}
        </Button>
    );
}
