'use server';

import { updateTag } from 'next/cache';

import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions, getValidAccessTokenForServerHandlerGet } from '@/lib/getValidAccessToken';
import type { AddCategoryFormValues } from '@/utils/addCategoryValidation';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
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

export const createCategory = async (payload: AddCategoryFormValues): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/category/categories', {
        method: 'POST',
        body: { name: payload.name.trim() },
        token: accessToken ?? undefined,
    });

    updateTag('CATEGORIES');
    return result;
};

export const updateCategory = async (id: string, payload: AddCategoryFormValues): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(`/category/categories/${id}`, {
        method: 'PATCH',
        body: { name: payload.name.trim() },
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
