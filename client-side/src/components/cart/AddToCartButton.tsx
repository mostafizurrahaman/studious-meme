'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import type { Product } from '@/lib/malamal-content';

export function AddToCartButton({ product }: { product: Product }) {
    const addProduct = useCartStore(state => state.addProduct);
    const [added, setAdded] = useState(false);

    return (
        <Button
            type="button"
            onClick={() => {
                addProduct(product);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1200);
            }}
            className="h-9 w-full rounded-full px-3 text-[9px] font-semibold shadow-sm sm:h-12 sm:w-auto sm:px-6 sm:text-[11px]"
        >
            {added ? 'Added' : 'Add to cart'}
        </Button>
    );
}
