'use server';

import { updateTag } from 'next/cache';

import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions, getValidAccessTokenForServerHandlerGet } from '@/lib/getValidAccessToken';
import { CreateUserFormValues } from '@/utils/createAdminValidation';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

const unsupported = <T>(message: string): BackendEnvelope<T> => ({ success: false, message });

export const getDashboardMetaData = async (): Promise<BackendEnvelope<unknown>> => unsupported('Endpoint not supported by current backend.');

export const updateNewsStatus = async (): Promise<BackendEnvelope<unknown>> => unsupported('Endpoint not supported by current backend.');

export const getAllUsers = async (): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();
    return requestBackendJson<BackendEnvelope<unknown>>('/user/admin-get-all', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

export const blockUnblockSingleUserById = async (): Promise<BackendEnvelope<unknown>> => unsupported('Endpoint not supported by current backend.');

export const createUser = async (payload: CreateUserFormValues): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>('/user/signup', {
        method: 'POST',
        body: {
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
            phone: payload.phone,
            role: payload.role,
            password: payload.password,
        },
        token: accessToken ?? undefined,
    });

    updateTag('USERS');
    return result;
};
