import { z } from 'zod';

export const createAdminValidation = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, { message: 'Name is required' })
            .min(2, { message: 'Please enter at least 2 characters' }),

        email: z.string().trim().min(1, { message: 'Email is required' }).email({ message: 'Enter a valid email' }),

        // Keep raw input for UX; normalize to digits for submit
        phone: z
            .string()
            .trim()
            .min(1, { message: 'Phone number is required' })
            .transform(v => v.replace(/\D/g, ''))
            .refine(v => v.length >= 10 && v.length <= 15, {
                message: 'Enter a valid phone number (10-15 digits)',
            }),

        role: z.string(),

        password: z
            .string({ error: 'Password is required' })
            // .min(1, { message: 'Password is required' })
            .min(8, { message: 'Min 8 characters' })
            .max(20, { message: 'Max 20 characters' })
            .refine(v => /[a-z]/.test(v), { message: 'Needs a lowercase letter' })
            .refine(v => /[A-Z]/.test(v), { message: 'Needs an uppercase letter' })
            .refine(v => /\d/.test(v), { message: 'Needs a number' })
            .refine(v => /[^A-Za-z0-9]/.test(v), { message: 'Needs a symbol' }),

        confirmPassword: z.string().trim().min(1, { message: 'Please confirm password!' }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['confirmPassword'],
                message: 'Passwords must match',
            });
        }
    });

export type CreateUserFormValues = z.infer<typeof createAdminValidation>;
