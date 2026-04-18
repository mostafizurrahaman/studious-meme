'use server';

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

export type ComparisonPayload = {
    IDs: string[];
};

export const getComparisonSuggestions = async (): Promise<BackendEnvelope<unknown[]>> => {
    return requestBackendJson<BackendEnvelope<unknown[]>>('/comparison-history', { method: 'GET' });
};

export const compareProducts = async (payload: ComparisonPayload): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();

    return requestBackendJson<BackendEnvelope<unknown>>('/comparison-history/compare', {
        method: 'POST',
        body: payload,
        token: accessToken ?? undefined,
    });
};

export const getMyComparisonHistory = async (): Promise<BackendEnvelope<unknown[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    return requestBackendJson<BackendEnvelope<unknown[]>>('/comparison-history/history', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

export const getAllComparisonHistory = async (): Promise<BackendEnvelope<unknown[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    return requestBackendJson<BackendEnvelope<unknown[]>>('/comparison-history/admin/history', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

export const clearComparisonHistory = async (): Promise<BackendEnvelope<null>> => {
    const accessToken = await getValidAccessTokenForServerActions();

    return requestBackendJson<BackendEnvelope<null>>('/comparison-history/history', {
        method: 'DELETE',
        token: accessToken ?? undefined,
    });
};
