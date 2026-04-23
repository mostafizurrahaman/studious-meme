'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/storefront-types';
import { useCompareStore } from '@/lib/compare-store';
import { addCompareItem, removeCompareItem } from '@/services/ComparisonHistory';

type Props = {
    product: Product;
};

export function AddToCompareButton({ product }: Props) {
    const hydrated = useCompareStore(state => state.hydrated);
    const saved = useCompareStore(state => state.items.some(item => item.sku === product.sku));
    const toggle = useCompareStore(state => state.toggle);
    const [isPending, startTransition] = useTransition();

    function handleToggle() {
        const nextSaved = toggle(product);

        if (!product.id) return;

        startTransition(async () => {
            const result = nextSaved ? await addCompareItem(product.id!) : await removeCompareItem(product.id!);

            if (!result.success) {
                toggle(product);
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
            {saved ? 'In compare' : 'Add to compare'}
        </Button>
    );
}
