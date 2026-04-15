import { z } from 'zod';

// 1. categorySubCategorySchema
const categorySubCategorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    image: z.string().optional(),
    description: z.string().optional(),
    accent: z.string().optional(),
    isActive: z.boolean().optional(),
});

// 2. categoryBaseSchema
const categoryBaseSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    subCategories: z.array(categorySubCategorySchema).optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    accent: z.string().optional(),
    isActive: z.boolean().optional(),
});

export const CategoryValidation = {
    categoryCreateSchema: z.object({ body: categoryBaseSchema }),
    categoryUpdateSchema: z.object({ params: z.object({ slug: z.string().min(1) }), body: categoryBaseSchema.partial() }),
    categorySubCategoryCreateSchema: z.object({ params: z.object({ slug: z.string().min(1) }), body: categorySubCategorySchema }),
    categorySubCategoryUpdateSchema: z.object({ params: z.object({ slug: z.string().min(1), subCategorySlug: z.string().min(1) }), body: categorySubCategorySchema.partial() }),
};
