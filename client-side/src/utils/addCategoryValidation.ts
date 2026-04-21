import { z } from 'zod';

export const addCategorySchema = z.object({
    name: z
        .string({ error: 'Category name is required!' })
        .trim()
        .min(1, { message: 'Category name is required!' }),
});

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;
