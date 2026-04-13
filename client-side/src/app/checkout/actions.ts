'use server';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { calculateOrderSummary } from '@/lib/coupons';

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

type OrderRecord = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    note: string;
    payment: string;
  };
  payment: string;
  couponCode: string;
  status: 'Placed';
};

export type CheckoutActionState =
  | { ok: false; error: string }
  | { ok: true; order: OrderRecord };

const ordersPath = path.join(process.cwd(), 'src', 'lib', 'orders-data.json');

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;

  return typeof item.sku === 'string'
    && typeof item.title === 'string'
    && typeof item.href === 'string'
    && typeof item.image === 'string'
    && typeof item.brand === 'string'
    && typeof item.unitPrice === 'number'
    && typeof item.unitPriceLabel === 'string'
    && typeof item.quantity === 'number'
    && Number.isFinite(item.unitPrice)
    && Number.isInteger(item.quantity)
    && item.quantity > 0;
}

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function fail(error: string): CheckoutActionState {
  return { ok: false, error };
}

function succeed(order: OrderRecord): CheckoutActionState {
  return { ok: true, order };
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
    payment: readString(formData, 'payment') || 'Cash on delivery',
  };

  if (!customer.name || !customer.phone || !customer.address || !customer.city) {
    return fail('Please complete the required checkout fields.');
  }

  const couponCode = readString(formData, 'couponCode');
  const summary = calculateOrderSummary(items, couponCode);

  const order: OrderRecord = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    items,
    subtotal: summary.subtotal,
    discount: summary.discount,
    delivery: summary.delivery,
    total: summary.total,
    customer,
    payment: customer.payment,
    couponCode: summary.coupon?.code ?? '',
    status: 'Placed',
  };

  const raw = await fs.readFile(ordersPath, 'utf8').catch(() => '[]');
  const orders = JSON.parse(raw) as OrderRecord[];
  await fs.writeFile(ordersPath, JSON.stringify([order, ...orders], null, 2), 'utf8');

  return succeed(order);
}
