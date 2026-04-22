'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { compareProducts } from '@/services/ComparisonHistory';

type Props = {
    productIds: string[];
};

export function CompareSaveButton({ productIds }: Props) {
    const [isPending, startTransition] = useTransition();
    const canSave = productIds.length >= 2;

    return (
        <Button
            type="button"
            disabled={!canSave || isPending}
            onClick={() => {
                startTransition(async () => {
                    const result = await compareProducts({ IDs: productIds });

                    if (!result.success) {
                        toast.error(result.message ?? 'Sign in to save comparison history.');
                        return;
                    }

                    toast.success(result.message ?? 'Comparison saved.');
                });
            }}
            className="mt-4 h-11 rounded-full px-5 text-sm font-bold text-white!"
        >
            {isPending ? 'Saving...' : 'Save comparison'}
        </Button>
    );
}
