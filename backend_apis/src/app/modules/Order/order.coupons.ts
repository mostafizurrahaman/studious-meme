export type TCoupon = {
    code: string;
    label: string;
    kind: 'percent' | 'shipping';
    value: number;
    expiresAt: string;
    minSubtotal?: number;
};

export const coupons: Record<string, TCoupon> = {
    SAVE10: {
        code: 'SAVE10',
        label: '10% off',
        kind: 'percent',
        value: 10,
        expiresAt: '2027-12-31T23:59:59+06:00',
        minSubtotal: 5000,
    },
    MALAMAL5: {
        code: 'MALAMAL5',
        label: '5% off',
        kind: 'percent',
        value: 5,
        expiresAt: '2027-12-31T23:59:59+06:00',
        minSubtotal: 2500,
    },
    FREESHIP: {
        code: 'FREESHIP',
        label: 'Free delivery',
        kind: 'shipping',
        value: 0,
        expiresAt: '2027-12-31T23:59:59+06:00',
        minSubtotal: 8000,
    },
};

export function isCouponActive(coupon: TCoupon, subtotal: number) {
    const notExpired = new Date(coupon.expiresAt).getTime() > Date.now();
    const meetsMinimum = !coupon.minSubtotal || subtotal >= coupon.minSubtotal;

    return notExpired && meetsMinimum;
}

export function findCoupon(code: string, subtotal: number) {
    const coupon = coupons[code.trim().toUpperCase()];

    if (!coupon || !isCouponActive(coupon, subtotal)) {
        return null;
    }

    return coupon;
}
