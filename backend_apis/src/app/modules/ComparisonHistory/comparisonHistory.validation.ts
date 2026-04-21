import { z } from 'zod';

// 1. compareSchema
const compareSchema = z.object({
    body: z.object({
        IDs: z
            .array(z.string({ error: 'ID is required!' }).trim().min(1, { message: 'ID is required!' }))
            .min(2, { message: 'At least two IDs are required!' })
            .max(4, { message: 'At most four IDs are allowed!' }),
    }),
});

export const ComparisonHistoryValidation = { compareSchema };
