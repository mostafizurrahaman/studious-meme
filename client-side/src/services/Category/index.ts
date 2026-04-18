'use server';

import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import {
    getValidAccessTokenForServerActions,
    getValidAccessTokenForServerHandlerGet,
} from '@/lib/getValidAccessToken';
import { slugify } from '@/lib/slug';
import type { BackendCategory } from './mappers';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

type CategorySubCategoryPayload = {
    name: string;
    slug: string;
    image?: File | string;
    description?: string;
    accent?: string;
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

type CategoryMutationPayload = {
    name: string;
    slug: string;
    image?: File | string;
    description?: string;
    accent?: string;
    isActive?: boolean;
};

export const getAllCategoriesWithTotalNewsCount = async (): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();
    return requestBackendJson<BackendEnvelope<unknown>>('/category/categories', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

export const getAllCategoriesNameAndId = async (): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();
    return requestBackendJson<BackendEnvelope<unknown>>('/category/categories', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

export const getCategoryBySlug = async (slug: string): Promise<BackendEnvelope<BackendCategory>> => {
    return requestBackendJson<BackendEnvelope<BackendCategory>>(`/category/categories/${slug}`, {
        method: 'GET',
    });
};

export const createCategory = async (payload: CategoryMutationPayload): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/category/categories', {
        method: 'POST',
        body: toFormData({
            name: payload.name.trim(),
            slug: slugify(payload.slug ?? payload.name),
            image: payload.image,
            description: payload.description,
            accent: payload.accent,
            isActive: payload.isActive,
        }),
        token: accessToken ?? undefined,
    });

    updateTag('CATEGORIES');
    return result;
};

export const updateCategory = async (
    id: string,
    payload: CategoryMutationPayload,
): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(`/category/categories/${id}`, {
        method: 'PATCH',
        body: toFormData({
            name: payload.name.trim(),
            slug: slugify(payload.slug ?? payload.name),
            image: payload.image,
            description: payload.description,
            accent: payload.accent,
            isActive: payload.isActive,
        }),
        token: accessToken ?? undefined,
    });

    updateTag('CATEGORIES');
    return result;
};

export const deleteCategory = async (id: string): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(`/category/categories/${id}`, {
        method: 'DELETE',
        token: accessToken ?? undefined,
    });

    updateTag('CATEGORIES');
    return result;
};

export const createCategorySubCategory = async (
    categorySlug: string,
    payload: CategorySubCategoryPayload,
): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(
        `/category/categories/${categorySlug}/sub-categories`,
        {
            method: 'POST',
            body: toFormData({
                ...payload,
                slug: slugify(payload.slug),
            }),
            token: accessToken ?? undefined,
        },
    );

    updateTag('CATEGORIES');
    return result;
};

export const updateCategorySubCategory = async (
    categorySlug: string,
    subCategorySlug: string,
    payload: Partial<CategorySubCategoryPayload>,
): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(
        `/category/categories/${categorySlug}/sub-categories/${subCategorySlug}`,
        {
            method: 'PATCH',
            body: toFormData({
                ...payload,
                slug: payload.slug ? slugify(payload.slug) : payload.slug,
            }),
            token: accessToken ?? undefined,
        },
    );

    updateTag('CATEGORIES');
    return result;
};

export const deleteCategorySubCategory = async (
    categorySlug: string,
    subCategorySlug: string,
): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(
        `/category/categories/${categorySlug}/sub-categories/${subCategorySlug}`,
        {
            method: 'DELETE',
            token: accessToken ?? undefined,
        },
    );

    updateTag('CATEGORIES');
    return result;
};
