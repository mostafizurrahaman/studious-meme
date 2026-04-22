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
    meta?: { page: number; limit: number; total: number; totalPages: number };
};

export type ComparisonPayload = {
    IDs: string[];
};

export const getComparisonSuggestions = async (): Promise<BackendEnvelope<unknown[]>> => {
    return requestBackendJson<BackendEnvelope<unknown[]>>('/comparison-history', { method: 'GET' });
};

export const compareProducts = async (payload: ComparisonPayload): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();

    if (!accessToken) {
        return { success: false, message: 'Sign in to save comparison history.' };
    }

    const result = await requestBackendJson<BackendEnvelope<unknown>>('/comparison-history/compare', {
        method: 'POST',
        body: payload,
        token: accessToken,
    });

    updateTag('COMPARISON_HISTORY');
    return result;
};

export const getMyComparisonHistory = async (): Promise<BackendEnvelope<unknown[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    return requestBackendJson<BackendEnvelope<unknown[]>>('/comparison-history/history', {
        method: 'GET',
        token: accessToken ?? undefined,
        next: { tags: ['COMPARISON_HISTORY'] },
    });
};

type HistoryListParams = {
    page?: number;
    limit?: number;
};

const buildHistoryQuery = (params: HistoryListParams = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

export const getAllComparisonHistory = async (
    params: HistoryListParams = {},
): Promise<BackendEnvelope<unknown[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    return requestBackendJson<BackendEnvelope<unknown[]>>(`/comparison-history/admin/history${buildHistoryQuery(params)}`, {
        method: 'GET',
        token: accessToken ?? undefined,
        next: { tags: ['COMPARISON_HISTORY'] },
    });
};

export const clearComparisonHistory = async (): Promise<BackendEnvelope<null>> => {
    const accessToken = await getValidAccessTokenForServerActions();

    const result = await requestBackendJson<BackendEnvelope<null>>('/comparison-history/history', {
        method: 'DELETE',
        token: accessToken ?? undefined,
    });

    updateTag('COMPARISON_HISTORY');
    return result;
};
