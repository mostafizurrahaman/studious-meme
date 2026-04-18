import { z } from 'zod';

// 1. brandBaseSchema
const brandBaseSchema = z.object({
    name: z
        .string({ error: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters long' })
        .max(50),
    slug: z
        .string({ error: 'Slug is required' })
        .min(3, { message: 'Slug must be at least 3 characters long' })
        .max(50),
    image: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const BrandValidation = {
    brandCreateSchema: z.object({ body: brandBaseSchema }),
    brandUpdateSchema: z.object({
        params: z.object({
            slug: z
                .string({ error: 'Slug is required' })
                .min(3, { message: 'Slug must be at least 3 characters long' }),
        }),
        body: brandBaseSchema.partial(),
    }),
};
