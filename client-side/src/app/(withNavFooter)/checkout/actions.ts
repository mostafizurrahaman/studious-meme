'use server';

import { createOrder, previewCheckout } from '@/services/Order';
import { initiatePortPosPayment } from '@/services/Payment';
import { normalizeOrderPaymentMethod } from '@/lib/payment-method';

type CartItem = {
    sku: string;
    title: string;
    href: '/shop';
    image: string;
    brand: string;
    unitPrice: number;
    unitPriceLabel: string;
    oldPriceLabel?: string;
    quantity: number;
};

export type CheckoutActionState =
    | { ok: false; error: string }
    | { ok: true; orderId: string; gatewayUrl?: string };

function isCartItem(value: unknown): value is CartItem {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const item = value as Record<string, unknown>;

    return (
        typeof item.sku === 'string' &&
        typeof item.title === 'string' &&
        typeof item.href === 'string' &&
        typeof item.image === 'string' &&
        typeof item.brand === 'string' &&
        typeof item.unitPrice === 'number' &&
        typeof item.unitPriceLabel === 'string' &&
        typeof item.quantity === 'number' &&
        Number.isFinite(item.unitPrice) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
}

function readString(formData: FormData, key: string) {
    return String(formData.get(key) ?? '').trim();
}

function fail(error: string): CheckoutActionState {
    return { ok: false, error };
}

export async function submitCheckoutAction(
    _prevState: CheckoutActionState,
    formData: FormData,
): Promise<CheckoutActionState> {
    let items: CartItem[] = [];

    try {
        const parsed = JSON.parse(String(formData.get('cartItemsJson') ?? '[]')) as unknown[];
        items = parsed.filter(isCartItem);
    } catch {
        return fail('Cart data is invalid. Please try again.');
    }

    if (items.length === 0) {
        return fail('Add items to cart before placing the order.');
    }

    const customer = {
        name: readString(formData, 'name'),
        phone: readString(formData, 'phone'),
        email: readString(formData, 'email'),
        address: readString(formData, 'address'),
        city: readString(formData, 'city'),
        note: readString(formData, 'note'),
    };

    if (!customer.name || !customer.phone || !customer.address || !customer.city) {
        return fail('Please complete the required checkout fields.');
    }

    const couponCode = readString(formData, 'couponCode');

    const payment = readString(formData, 'payment') || 'Cash on delivery';
    const normalizedPayment = normalizeOrderPaymentMethod(payment);

    const previewResult = await previewCheckout({
        items: items.map(item => ({ sku: item.sku, quantity: item.quantity })),
        customer,
        couponCode,
        paymentMethod: normalizedPayment,
    });

    if (!previewResult?.success || !previewResult.data) {
        return fail(previewResult?.message ?? 'Failed to preview checkout summary.');
    }

    if (normalizedPayment === 'CASH_ON_DELIVERY' && !previewResult.data.codEligible) {
        return fail(previewResult.data.codReasons.join(' '));
    }

    const orderResult = await createOrder({
        items: items.map(item => ({ sku: item.sku, quantity: item.quantity })),
        customer,
        couponCode,
        paymentMethod: normalizedPayment,
    });

    if (!orderResult?.success || !orderResult.data) {
        return fail(orderResult?.message ?? 'Failed to place order.');
    }

    if (normalizedPayment === 'PORTPOS') {
        const paymentResult = await initiatePortPosPayment(orderResult.data.orderId);

        if (!paymentResult?.success || !paymentResult.data?.url) {
            return fail(paymentResult?.message ?? 'Failed to initiate PortPOS payment.');
        }

        return { ok: true, orderId: orderResult.data.orderId, gatewayUrl: paymentResult.data.url };
    }

    return { ok: true, orderId: orderResult.data.orderId };
}
