'use server';

import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';
import type { Brand as StorefrontBrand } from '@/lib/malamal-content';
import { slugify } from '@/lib/slug';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export type BackendBrand = {
    _id?: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export async function mapBackendBrandToStorefrontBrand(brand: BackendBrand): Promise<StorefrontBrand> {
    return {
        name: brand.name,
        href: '/shop-by-brands',
        image: brand.image ?? '/placeholder-brand.svg',
    };
}

export const getAllBrands = async (): Promise<BackendEnvelope<BackendBrand[]>> => {
    return requestBackendJson<BackendEnvelope<BackendBrand[]>>('/brand/brands', { method: 'GET' });
};

export const getBrandBySlug = async (slug: string): Promise<BackendEnvelope<BackendBrand>> => {
    return requestBackendJson<BackendEnvelope<BackendBrand>>(`/brand/brands/${slug}`, { method: 'GET' });
};

type BrandMutationPayload = {
    name: string;
    slug: string;
    image?: File | string;
    description?: string;
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

export const createBrand = async (payload: BrandMutationPayload): Promise<BackendEnvelope<BackendBrand>> => {
    const accessToken = await getValidAccessTokenForServerActions();

    const result = await requestBackendJson<BackendEnvelope<BackendBrand>>('/brand/brands', {
        method: 'POST',
        body: toFormData({
            ...payload,
            slug: slugify(payload.slug),
        }),
        token: accessToken ?? undefined,
    });

    updateTag('BRANDS');
    return result;
};

export const updateBrand = async (
    slug: string,
    payload: Partial<BrandMutationPayload>,
): Promise<BackendEnvelope<BackendBrand>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendBrand>>(`/brand/brands/${slug}`, {
        method: 'PATCH',
        body: toFormData({
            ...payload,
            slug: payload.slug ? slugify(payload.slug) : payload.slug,
        }),
        token: accessToken ?? undefined,
    });

    updateTag('BRANDS');
    return result;
};

export const deleteBrand = async (slug: string): Promise<BackendEnvelope<BackendBrand>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendBrand>>(`/brand/brands/${slug}`, {
        method: 'DELETE',
        token: accessToken ?? undefined,
    });

    updateTag('BRANDS');
    return result;
};
