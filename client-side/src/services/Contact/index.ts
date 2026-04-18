'use server';

import type { FieldValues } from 'react-hook-form';
import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerHandlerGet } from '@/lib/getValidAccessToken';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export const createContact = async (contactData: FieldValues): Promise<BackendEnvelope<unknown>> => {
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/contact', {
        method: 'POST',
        body: contactData as Record<string, unknown>,
    });

    updateTag('CONTACTS');
    return result;
};

export const getAllContacts = async (
    page: string = '1',
    limit: string = '20',
): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    const query = new URLSearchParams({ page, limit });
    return requestBackendJson<BackendEnvelope<unknown>>(`/contact?${query.toString()}`, {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};
