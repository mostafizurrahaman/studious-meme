'use server';

import { requestBackendJson } from '@/lib/backend-api';

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
    return requestBackendJson<BackendEnvelope<unknown>>('/comparison-history/compare', {
        method: 'POST',
        body: payload,
    });
};

export const getMyComparisonHistory = async (): Promise<BackendEnvelope<unknown[]>> => {
    return requestBackendJson<BackendEnvelope<unknown[]>>('/comparison-history/history', { method: 'GET' });
};

export const getAllComparisonHistory = async (): Promise<BackendEnvelope<unknown[]>> => {
    return requestBackendJson<BackendEnvelope<unknown[]>>('/comparison-history/admin/history', { method: 'GET' });
};

export const clearComparisonHistory = async (): Promise<BackendEnvelope<null>> => {
    return requestBackendJson<BackendEnvelope<null>>('/comparison-history/history', { method: 'DELETE' });
};
