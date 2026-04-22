import type { Product } from '@/lib/storefront-types';

export type CartItem = {
    sku: string;
    title: string;
    href: Product['href'];
    image: string;
    brand: string;
    unitPrice: number;
    unitPriceLabel: string;
    oldPriceLabel?: string;
    quantity: number;
};

export function parseMoney(value: string) {
    return Number(value.replace(/[^0-9.]/g, ''));
}

export function formatMoney(value: number) {
    return `Tk. ${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function toCartItem(product: Product): CartItem {
    return {
        sku: product.sku,
        title: product.title,
        href: product.href,
        image: product.image,
        brand: product.brand,
        unitPrice: parseMoney(product.price),
        unitPriceLabel: product.price,
        oldPriceLabel: product.oldPrice,
        quantity: 1,
    };
}
