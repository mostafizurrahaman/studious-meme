import { z } from "zod";

// 1. productBaseSchema
const productBaseSchema = z.object({
  title: z
    .string({ error: "Title is required!" })
    .trim()
    .min(1, { message: "Title is required!" }),
  slug: z
    .string({ error: "Slug is required!" })
    .trim()
    .min(1, { message: "Slug is required!" }),
  sku: z
    .string({ error: "SKU is required!" })
    .trim()
    .min(1, { message: "SKU is required!" }),
  images: z
    .array(z.string().trim().min(1))
    .max(5, { message: "You can upload up to 5 product images!" })
    .optional(),
  features: z
    .string({ error: "Features are required!" })
    .trim()
    .min(1, { message: "Features are required!" }),
  description: z
    .string({ error: "Description is required!" })
    .trim()
    .min(1, { message: "Description is required!" }),
  price: z.coerce
    .number({ error: "Price is required!" })
    .min(0, { message: "Price is required!" }),
  oldPrice: z.coerce
    .number()
    .min(0, { message: "Old price must be at least 0!" })
    .optional(),
  badge: z.string().optional(),
  brand: z
    .string({ error: "Brand is required!" })
    .trim()
    .min(1, { message: "Brand is required!" }),
  category: z
    .string({ error: "Category is required!" })
    .trim()
    .min(1, { message: "Category is required!" }),
  subCategorySlug: z.string().optional(),
  weightKg: z.coerce
    .number({ error: "Weight is required!" })
    .min(0.01, { message: "Weight must be greater than 0!" }),
  stock: z.preprocess(
    (value) => (value === "" ? null : value),
    z.union([
      z.coerce.number().int().min(0, { message: "Stock must be at least 0!" }),
      z.null(),
    ]).optional(),
  ),
  rating: z.coerce
    .number({ error: "Rating is required!" })
    .min(0, { message: "Rating is required!" }),
  isFeatured: z.boolean().optional(),
  isNoCOD: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const ProductValidation = {
  productCreateSchema: z.object({ body: productBaseSchema }),
  productUpdateSchema: z.object({
    params: z.object({
      slug: z
        .string({ error: "Slug is required!" })
        .trim()
        .min(1, { message: "Slug is required!" }),
    }),
    body: productBaseSchema.partial(),
  }),
};
