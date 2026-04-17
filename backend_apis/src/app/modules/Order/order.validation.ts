import { z } from 'zod';

const orderItemSchema = z.object({
    sku: z.string().min(1),
    quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
    body: z.object({
        items: z.array(orderItemSchema).min(1),
        customer: z.object({
            name: z.string().trim().min(2),
            phone: z.string().trim().min(6),
            email: z.string().trim().email().optional().or(z.literal('')),
            address: z.string().trim().min(5),
            city: z.string().trim().min(2),
            note: z.string().trim().optional(),
        }),
        couponCode: z.string().trim().optional(),
        paymentMethod: z.enum(['CASH_ON_DELIVERY', 'SSL_COMMERZ']),
    }),
});

const updateOrderStatusSchema = z.object({
    params: z.object({
        orderId: z.string().min(1),
    }),
    body: z.object({
        status: z.enum(['PLACED', 'PROCESSING', 'DELIVERED', 'CANCELLED']),
    }),
});

export const OrderValidation = {
    createOrderSchema,
    updateOrderStatusSchema,
};
