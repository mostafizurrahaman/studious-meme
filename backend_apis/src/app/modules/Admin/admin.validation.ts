import { z } from 'zod';

const adminCreateSchema = z.object({
    body: z.object({
        name: z.string().trim().min(3),
        email: z.string().trim().email().transform(v => v.toLowerCase()),
        password: z
            .string()
            .min(8)
            .max(20)
            .regex(/[A-Z]/)
            .regex(/[a-z]/)
            .regex(/[0-9]/)
            .regex(/[@$!%*?&#]/),
        phone: z.string().optional(),
        image: z.string().optional(),
    }),
});

const adminUpdateSchema = z.object({
    params: z.object({ userId: z.string().min(1) }),
    body: z.object({
        name: z.string().trim().min(3).optional(),
        email: z.string().trim().email().transform(v => v.toLowerCase()).optional(),
        phone: z.string().optional(),
        image: z.string().optional(),
        isActive: z.boolean().optional(),
    }),
});

export const AdminValidation = {
    adminCreateSchema,
    adminUpdateSchema,
};
