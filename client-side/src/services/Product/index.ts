'use server';

import { updateTag } from 'next/cache';

import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';
import type { Product as StorefrontProduct } from '@/lib/malamal-content';
import { slugify } from '@/lib/slug';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
    meta?: { page: number; limit: number; total: number; totalPage: number };
};

type BackendProductRef = { _id?: string; name?: string; slug?: string } | string;

export type BackendProduct = {
    _id?: string;
    title: string;
    slug: string;
    sku: string;
    image: string;
    price: number;
    oldPrice?: number;
    badge?: string;
    brand: BackendProductRef;
    category: BackendProductRef;
    subCategorySlug?: string;
    stock: number;
    rating: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

function resolveName(value: BackendProductRef): string {
    if (typeof value === 'string') {
        return value;
    }

    return value.name ?? value.slug ?? 'Unknown';
}

export async function mapBackendProductToStorefrontProduct(
    product: BackendProduct,
): Promise<StorefrontProduct> {
    return {
        title: product.title,
        slug: product.slug,
        href: '/shop',
        image: product.image,
        price: String(product.price),
        oldPrice: product.oldPrice === undefined ? undefined : String(product.oldPrice),
        badge: product.badge,
        brand: resolveName(product.brand),
        sku: product.sku,
        stock: product.stock > 0 ? `${product.stock} in stock` : 'Out of stock',
        rating: String(product.rating),
        category: resolveName(product.category),
        isFeatured: product.isFeatured,
        createdAt: product.createdAt,
    };
}

type GetAllProductsParams = {
    page?: number;
    limit?: number;
    searchTerm?: string;
};

export const getAllProducts = async (
    params: GetAllProductsParams = {},
): Promise<BackendEnvelope<BackendProduct[]>> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.searchTerm?.trim()) searchParams.set('searchTerm', params.searchTerm.trim());

    const query = searchParams.toString();

    return requestBackendJson<BackendEnvelope<BackendProduct[]>>(
        `/product/products${query ? `?${query}` : ''}`,
        { method: 'GET' },
    );
};

export const getProductBySlug = async (slug: string): Promise<BackendEnvelope<BackendProduct>> => {
    return requestBackendJson<BackendEnvelope<BackendProduct>>(`/product/products/${slug}`, {
        method: 'GET',
    });
};

export const getProductsByCategorySlug = async (slug: string): Promise<BackendEnvelope<BackendProduct[]>> => {
    return requestBackendJson<BackendEnvelope<BackendProduct[]>>(`/product/products/by-category/${slug}`, {
        method: 'GET',
    });
};

export const getProductsBySubCategorySlug = async (
    slug: string,
): Promise<BackendEnvelope<BackendProduct[]>> => {
    return requestBackendJson<BackendEnvelope<BackendProduct[]>>(
        `/product/products/by-sub-category/${slug}`,
        { method: 'GET' },
    );
};

type ProductMutationPayload = {
    title: string;
    slug: string;
    sku: string;
    image?: File | string;
    price: number;
    oldPrice?: number;
    badge?: string;
    brand: string;
    category: string;
    subCategorySlug?: string;
    stock: number;
    rating: number;
    isFeatured?: boolean;
    isActive?: boolean;
};

function toFormData(payload: Record<string, unknown>) {
    const formData = new FormData();

    const { image, ...rest } = payload as { image?: File | string; [key: string]: unknown };

    formData.set(
        'data',
        JSON.stringify({
            ...rest,
            ...(typeof image === 'string' && image ? { image } : {}),
        }),
    );

    if (image instanceof File) {
        formData.append('image', image);
    }

    return formData;
}

export const createProduct = async (
    payload: ProductMutationPayload,
): Promise<BackendEnvelope<BackendProduct>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendProduct>>('/product/products', {
        method: 'POST',
        body: toFormData({
            ...payload,
            slug: slugify(payload.slug),
        }),
        token: accessToken ?? undefined,
    });

    updateTag('PRODUCTS');
    return result;
};

export const updateProduct = async (
    slug: string,
    payload: Partial<ProductMutationPayload>,
): Promise<BackendEnvelope<BackendProduct>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendProduct>>(`/product/products/${slug}`, {
        method: 'PATCH',
        body: toFormData({
            ...payload,
            slug: payload.slug ? slugify(payload.slug) : payload.slug,
        }),
        token: accessToken ?? undefined,
    });

    updateTag('PRODUCTS');
    return result;
};

export const deleteProduct = async (slug: string): Promise<BackendEnvelope<BackendProduct>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendProduct>>(`/product/products/${slug}`, {
        method: 'DELETE',
        token: accessToken ?? undefined,
    });

    updateTag('PRODUCTS');
    return result;
};
