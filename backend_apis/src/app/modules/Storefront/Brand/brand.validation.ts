import { z } from 'zod';

const brandBaseSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    image: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const BrandValidation = {
    brandCreateSchema: z.object({ body: brandBaseSchema }),
    brandUpdateSchema: z.object({ params: z.object({ slug: z.string().min(1) }), body: brandBaseSchema.partial() }),
};
