import { z } from 'zod';

const heroCardSchema = z.object({
    image: z.string().min(1),
    imageAlt: z.string().min(1),
    title: z.string().min(1),
    clickUrl: z.string().min(1),
});

const heroSectionCreateSchema = z.object({
    body: z.object({
        slides: z.array(heroCardSchema).default([]),
        features: z.array(heroCardSchema).default([]),
        isActive: z.boolean().optional(),
    }),
});

const heroSectionUpdateSchema = z.object({
    body: z.object({
        slides: z.array(heroCardSchema).optional(),
        features: z.array(heroCardSchema).optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({ heroSectionId: z.string().min(1) }),
});

const brandBaseSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    image: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});

const categoryBaseSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    subCategories: z
        .array(
            z.object({
                name: z.string().min(1),
                slug: z.string().min(1),
                image: z.string().optional(),
                description: z.string().optional(),
                accent: z.string().optional(),
                isActive: z.boolean().optional(),
            }),
        )
        .optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    accent: z.string().optional(),
    isActive: z.boolean().optional(),
});

const categorySubCategorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    image: z.string().optional(),
    description: z.string().optional(),
    accent: z.string().optional(),
    isActive: z.boolean().optional(),
});

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

const buildCrudSchema = <T extends z.ZodTypeAny>(body: T) => z.object({ body });

export const StorefrontValidation = {
    heroSectionCreateSchema,
    heroSectionUpdateSchema,
    brandCreateSchema: buildCrudSchema(brandBaseSchema),
    brandUpdateSchema: z.object({ params: z.object({ slug: z.string().min(1) }), body: brandBaseSchema.partial() }),
    categoryCreateSchema: buildCrudSchema(categoryBaseSchema),
    categoryUpdateSchema: z.object({ params: z.object({ slug: z.string().min(1) }), body: categoryBaseSchema.partial() }),
    categorySubCategoryCreateSchema: z.object({
        params: z.object({ slug: z.string().min(1) }),
        body: categorySubCategorySchema,
    }),
    categorySubCategoryUpdateSchema: z.object({
        params: z.object({ slug: z.string().min(1), subCategorySlug: z.string().min(1) }),
        body: categorySubCategorySchema.partial(),
    }),
    categorySubCategoryDeleteSchema: z.object({
        params: z.object({ slug: z.string().min(1), subCategorySlug: z.string().min(1) }),
    }),
    productCreateSchema: buildCrudSchema(productBaseSchema),
    productUpdateSchema: z.object({ params: z.object({ slug: z.string().min(1) }), body: productBaseSchema.partial() }),
};
