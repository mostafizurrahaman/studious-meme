'use server';

import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';
import type { Brand as StorefrontBrand } from '@/lib/malamal-content';

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
    image?: string;
    description?: string;
    isActive?: boolean;
};

function toFormData(payload: Record<string, unknown>) {
    const formData = new FormData();
    formData.set('data', JSON.stringify(payload));
    return formData;
}

export const createBrand = async (payload: BrandMutationPayload): Promise<BackendEnvelope<BackendBrand>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendBrand>>('/brand/brands', {
        method: 'POST',
        body: toFormData(payload),
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
        body: toFormData(payload),
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
