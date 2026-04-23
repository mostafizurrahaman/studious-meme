'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { removeCompareItem } from '@/services/ComparisonHistory';

type Props = {
    productId: string;
};

export function CompareRemoveButton({ productId }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="h-9 rounded-full border-border px-4 text-xs font-semibold text-foreground/70"
            onClick={() => {
                startTransition(async () => {
                    const result = await removeCompareItem(productId);

                    if (!result.success) {
                        toast.error(result.message ?? 'Unable to update compare list.');
                        return;
                    }

                    router.refresh();
                });
            }}
        >
            {isPending ? 'Removing...' : 'Remove'}
        </Button>
    );
}
