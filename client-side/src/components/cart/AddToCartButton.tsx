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
      className="h-12 rounded-full px-6 text-[11px] font-semibold shadow-sm"
    >
      {added ? 'Added' : 'Add to cart'}
    </Button>
  );
}
