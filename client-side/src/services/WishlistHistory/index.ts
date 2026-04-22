'use server';

import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import {
    getValidAccessTokenForServerActions,
    getValidAccessTokenForServerHandlerGet,
} from '@/lib/getValidAccessToken';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export type WishlistHistoryRecord = {
    _id?: string;
    user?: unknown;
    product?: unknown;
    productSnapshot?: {
        title: string;
        brand: string;
        category: string;
        image: string;
        sku: string;
        slug: string;
        price: number;
        stock: number;
    };
    createdAt?: string;
    updatedAt?: string;
};

export const addWishlistItem = async (productId: string): Promise<BackendEnvelope<WishlistHistoryRecord>> => {
    const accessToken = await getValidAccessTokenForServerActions();

    if (!accessToken) {
        return { success: false, message: 'Sign in to save wishlist items to your account.' };
    }

    const result = await requestBackendJson<BackendEnvelope<WishlistHistoryRecord>>('/wishlist-history', {
        method: 'POST',
        body: { productId },
        token: accessToken,
    });

    updateTag('WISHLIST');
    return result;
};

export const removeWishlistItem = async (productId: string): Promise<BackendEnvelope<null>> => {
    const accessToken = await getValidAccessTokenForServerActions();

    if (!accessToken) {
        return { success: false, message: 'Sign in to update wishlist items on your account.' };
    }

    const result = await requestBackendJson<BackendEnvelope<null>>(`/wishlist-history/${productId}`, {
        method: 'DELETE',
        token: accessToken,
    });

    updateTag('WISHLIST');
    return result;
};

export const getMyWishlist = async (): Promise<BackendEnvelope<WishlistHistoryRecord[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    if (!accessToken) {
        return { success: false, data: [] };
    }

    return requestBackendJson<BackendEnvelope<WishlistHistoryRecord[]>>('/wishlist-history', {
        method: 'GET',
        token: accessToken,
        next: { tags: ['WISHLIST'] },
    });
};

export const getAllWishlist = async (): Promise<BackendEnvelope<WishlistHistoryRecord[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    return requestBackendJson<BackendEnvelope<WishlistHistoryRecord[]>>('/wishlist-history/admin', {
        method: 'GET',
        token: accessToken ?? undefined,
        next: { tags: ['WISHLIST'] },
    });
};
