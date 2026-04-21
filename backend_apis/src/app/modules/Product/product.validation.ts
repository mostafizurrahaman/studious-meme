import { z } from 'zod';

// 1. productBaseSchema
const productBaseSchema = z.object({
    title: z.string({ error: 'Title is required!' }).min(1),
    slug: z.string({ error: 'Slug is required!' }).min(1),
    sku: z.string({ error: 'SKU is required!' }).min(1),
    image: z.string().optional(),
    price: z.coerce.number({ error: 'Price is required!' }).min(0),
    oldPrice: z.coerce.number().min(0).optional(),
    badge: z.string().optional(),
    brand: z.string({ error: 'Brand is required!' }).min(1),
    category: z.string({ error: 'Category is required!' }).min(1),
    subCategorySlug: z.string().min(1).optional(),
    stock: z.coerce.number({ error: 'Stock is required!' }).int().min(0),
    rating: z.coerce.number({ error: 'Rating is required!' }).min(0),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const ProductValidation = {
    productCreateSchema: z.object({ body: productBaseSchema }),
    productUpdateSchema: z.object({
        params: z.object({ slug: z.string({ error: 'Slug is required!' }).min(1) }),
        body: productBaseSchema.partial(),
    }),
};
