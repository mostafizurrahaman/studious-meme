import { z } from "zod";

// 1. brandBaseSchema
const brandBaseSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  slug: z
    .string({ error: "Slug is required" })
    .trim()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(50, { message: "Slug must be at most 50 characters long" }),
  image: z.string().optional(),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(1, { message: "Description is required" }),
  isActive: z.boolean().optional(),
});

export const BrandValidation = {
  brandCreateSchema: z.object({ body: brandBaseSchema }),
  brandUpdateSchema: z.object({
    params: z.object({
      slug: z
        .string({ error: "Slug is required" })
        .trim()
        .min(3, { message: "Slug must be at least 3 characters long" }),
    }),
    body: brandBaseSchema.partial().extend({
      description: brandBaseSchema.shape.description,
    }),
  }),
};
