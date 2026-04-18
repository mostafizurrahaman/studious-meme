'use server';

import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export const getAllUrls = async (): Promise<BackendEnvelope<unknown>> => {
    return requestBackendJson<BackendEnvelope<unknown>>('/data', {
        method: 'GET',
    });
};

export const updateSponsorLogoUrl = async (data: FormData): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/data/sponsorLogoUrl', {
        method: 'PUT',
        body: data,
        token: accessToken ?? undefined,
    });

    updateTag('EXTRA_DATA_URLS');
    return result;
};

export const updateSingleLink = async (platform: string, link: string): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(`/data/${platform}`, {
        method: 'PUT',
        body: { url: link },
        token: accessToken ?? undefined,
    });

    updateTag('EXTRA_DATA_URLS');
    return result;
};

export const updatePrintStory = async (data: FormData): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/data/print-story', {
        method: 'PUT',
        body: data,
        token: accessToken ?? undefined,
    });

    updateTag('EXTRA_DATA_URLS');
    return result;
};
