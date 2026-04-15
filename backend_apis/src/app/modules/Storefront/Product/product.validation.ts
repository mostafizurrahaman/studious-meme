import { z } from 'zod';

// 1. productBaseSchema
const productBaseSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    sku: z.string().min(1),
    image: z.string().min(1),
    price: z.string().min(1),
    oldPrice: z.string().optional(),
    badge: z.string().optional(),
    brand: z.string().min(1),
    category: z.string().min(1),
    subCategorySlug: z.string().min(1).optional(),
    stock: z.string().min(1),
    rating: z.string().min(1),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const ProductValidation = {
    productCreateSchema: z.object({ body: productBaseSchema }),
    productUpdateSchema: z.object({ params: z.object({ slug: z.string().min(1) }), body: productBaseSchema.partial() }),
};
