export const COD_MIN_SUBTOTAL_BDT = 1000;

export const SHIPPING_ZONE = {
    INSIDE_DHAKA: 'inside_dhaka',
    OUTSIDE_DHAKA: 'outside_dhaka',
} as const;

export type TShippingZone = (typeof SHIPPING_ZONE)[keyof typeof SHIPPING_ZONE];

export const SHIPPING_RULES = {
    [SHIPPING_ZONE.INSIDE_DHAKA]: {
        baseCharge: 80,
        additionalCharge: 20,
    },
    [SHIPPING_ZONE.OUTSIDE_DHAKA]: {
        baseCharge: 130,
        additionalCharge: 30,
    },
} as const;

export const COD_REASONS = {
    subtotal: `Cash on Delivery is available only for orders above ৳${COD_MIN_SUBTOTAL_BDT}.`,
    blockedByProduct: 'One or more products in your cart are not eligible for Cash on Delivery.',
} as const;
