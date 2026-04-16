import { requestBackendJson } from '@/lib/backend-api';
import type { Product as StorefrontProduct } from '@/lib/malamal-content';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

type BackendProductRef = { name?: string; slug?: string } | string;

export type BackendProduct = {
    title: string;
    slug: string;
    sku: string;
    image: string;
    price: string;
    oldPrice?: string;
    badge?: string;
    brand: BackendProductRef;
    category: BackendProductRef;
    subCategorySlug?: string;
    stock: string;
    rating: string;
    isFeatured: boolean;
    isActive: boolean;
};

function resolveName(value: BackendProductRef): string {
    if (typeof value === 'string') {
        return value;
    }

    return value.name ?? value.slug ?? 'Unknown';
}

export function mapBackendProductToStorefrontProduct(product: BackendProduct): StorefrontProduct {
    return {
        title: product.title,
        href: '/shop',
        image: product.image,
        price: product.price,
        oldPrice: product.oldPrice,
        badge: product.badge,
        brand: resolveName(product.brand),
        sku: product.sku,
        stock: product.stock,
        rating: product.rating,
        category: resolveName(product.category),
    };
}

export const getAllProducts = async (): Promise<BackendEnvelope<BackendProduct[]>> => {
    return requestBackendJson<BackendEnvelope<BackendProduct[]>>('/product/products', { method: 'GET' });
};

export const getProductBySlug = async (slug: string): Promise<BackendEnvelope<BackendProduct>> => {
    return requestBackendJson<BackendEnvelope<BackendProduct>>(`/product/products/${slug}`, { method: 'GET' });
};

export const getProductsByCategorySlug = async (slug: string): Promise<BackendEnvelope<BackendProduct[]>> => {
    return requestBackendJson<BackendEnvelope<BackendProduct[]>>(`/product/products/by-category/${slug}`, { method: 'GET' });
};

export const getProductsBySubCategorySlug = async (slug: string): Promise<BackendEnvelope<BackendProduct[]>> => {
    return requestBackendJson<BackendEnvelope<BackendProduct[]>>(`/product/products/by-sub-category/${slug}`, { method: 'GET' });
};
