import { z } from 'zod';

const compareSchema = z.object({
    body: z.object({
        skus: z.array(z.string().min(1)).min(2).max(4),
    }),
});

export const ComparisonHistoryValidation = { compareSchema };
