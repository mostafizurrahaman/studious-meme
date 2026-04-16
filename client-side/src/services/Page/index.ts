'use server';

import type { FieldValues } from 'react-hook-form';
import { updateTag } from 'next/cache';

import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export const getPageByType = async (type: string): Promise<BackendEnvelope<unknown>> => {
    return requestBackendJson<BackendEnvelope<unknown>>(`/page/retrieve/${type}`, {
        method: 'GET',
    });
};

export const createOrUpdatePageByType = async (data: FieldValues): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/page/create-or-update', {
        method: 'PUT',
        body: data as Record<string, unknown>,
        token: accessToken ?? undefined,
    });

    updateTag('PAGES');
    return result;
};
