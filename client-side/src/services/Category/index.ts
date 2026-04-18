'use server';

import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import {
    getValidAccessTokenForServerActions,
    getValidAccessTokenForServerHandlerGet,
} from '@/lib/getValidAccessToken';
import type { AddCategoryFormValues } from '@/utils/addCategoryValidation';
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
    description?: string;
    accent?: string;
    isActive?: boolean;
};

function toFormData(payload: Record<string, unknown>) {
    const formData = new FormData();
    formData.set('data', JSON.stringify(payload));
    return formData;
}

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

export const createCategory = async (payload: AddCategoryFormValues): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/category/categories', {
        method: 'POST',
        body: toFormData({
            name: payload.name.trim(),
            slug: payload.name
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
        }),
        token: accessToken ?? undefined,
    });

    updateTag('CATEGORIES');
    return result;
};

export const updateCategory = async (
    id: string,
    payload: AddCategoryFormValues,
): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(`/category/categories/${id}`, {
        method: 'PATCH',
        body: toFormData({ name: payload.name.trim() }),
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
            body: toFormData(payload),
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
            body: toFormData(payload),
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
