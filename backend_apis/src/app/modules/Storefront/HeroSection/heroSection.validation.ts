import { z } from 'zod';

const heroCardSchema = z.object({
    image: z.string().min(1).optional(),
    imageAlt: z.string().min(1),
    title: z.string().min(1),
    clickUrl: z.string().min(1),
});

export const HeroSectionValidation = {
    heroSectionCreateSchema: z.object({
        body: z.object({
            slides: z.array(heroCardSchema).default([]),
            features: z.array(heroCardSchema).default([]),
            isActive: z.boolean().optional(),
        }),
    }),
    heroSectionUpdateSchema: z.object({
        body: z.object({
            slides: z.array(heroCardSchema).optional(),
            features: z.array(heroCardSchema).optional(),
            isActive: z.boolean().optional(),
        }),
        params: z.object({ heroSectionId: z.string().min(1) }),
    }),
};
