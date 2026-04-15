/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import {
    getValidAccessTokenForServerActions,
    getValidAccessTokenForServerHandlerGet,
} from '@/lib/getValidAccessToken';
import { AddCategoryFormValues } from '@/utils/addCategoryValidation';
import { updateTag } from 'next/cache';

// get All Categories
export const getAllCategoriesWithTotalNewsCount = async (): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/category/with-total-news-count`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                next: {
                    tags: ['CATEGORIES'],
                },
            },
        );

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error.message);
    }
};

// getAllCategories
export const getAllCategoriesNameAndId = async (): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/category/all`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            next: {
                tags: ['CATEGORIES'],
            },
        });

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error.message);
    }
};

// createCategory
export const createCategory = async (payload: AddCategoryFormValues): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerActions();
    try {
        // Only send the fields that API expects
        const body = {
            name: payload.name.trim(),
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/category`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        updateTag('CATEGORIES');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

// updateCategory
export const updateCategory = async (id: string, payload: AddCategoryFormValues): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerActions();
    try {
        // Only send the fields that API expects
        const body = {
            name: payload.name.trim(),
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/category/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        updateTag('CATEGORIES');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

// deleteCategory
export const deleteCategory = async (id: string): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerActions();
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/category/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        updateTag('CATEGORIES');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};
