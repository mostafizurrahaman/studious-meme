import { z } from 'zod';

// 1. compareSchema
const compareSchema = z.object({
    body: z.object({
        IDs: z.array(z.string().min(1)).min(2).max(4),
    }),
});

export const ComparisonHistoryValidation = { compareSchema };
