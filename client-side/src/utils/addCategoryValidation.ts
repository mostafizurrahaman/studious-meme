import { z } from 'zod';

export const addCategorySchema = z.object({
  name: z
    .string({ error: 'Category name is required!' })
    .min(1, { message: 'Category must be at least 1 character long!' }),
});

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;
