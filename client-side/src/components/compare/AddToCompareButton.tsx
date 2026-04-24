'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/storefront-types';
import { useCompareStore } from '@/lib/compare-store';
import { addCompareItem, removeCompareItem } from '@/services/ComparisonHistory';
import { canAddToCompare } from '@/lib/compare';

type Props = {
    product: Product;
    compact?: boolean;
    className?: string;
};

export function AddToCompareButton({ product, compact = false, className }: Props) {
    const hydrated = useCompareStore(state => state.hydrated);
    const items = useCompareStore(state => state.items);
    const saved = useCompareStore(state => state.items.some(item => item.sku === product.sku));
    const toggle = useCompareStore(state => state.toggle);
    const [isPending, startTransition] = useTransition();
    const canAdd = canAddToCompare(items, product);

    function handleToggle() {
        if (!saved && !canAdd.allowed) {
            toast.error(canAdd.message ?? 'Unable to update compare list.');
            return;
        }

        const productId = product.id;

        if (!productId) {
            toast.error('This product cannot be compared right now.');
            return;
        }

        const nextSaved = toggle(product);

        startTransition(async () => {
            const result = nextSaved ? await addCompareItem(productId) : await removeCompareItem(productId);

            if (!result.success) {
                toggle(product);
                toast.error(result.message ?? 'Unable to update compare list.');
            }
        });
    }

    return (
        <Button
            type="button"
            variant={saved ? 'secondary' : 'outline'}
            disabled={!hydrated || isPending || (!saved && !canAdd.allowed)}
            onClick={handleToggle}
            className={cn(
                compact
                    ? 'h-9 w-full justify-center rounded-full border-border px-2 py-0.5 text-[10px] font-semibold shadow-sm'
                    : 'h-12 rounded-full px-6 text-sm font-bold shadow-sm',
                className,
            )}
        >
            {saved ? 'In compare' : compact ? 'Compare' : 'Add to compare'}
        </Button>
    );
}
