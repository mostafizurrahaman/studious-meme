'use server';

import { updateTag } from 'next/cache';
import { requestBackendJson } from '@/lib/backend-api';
import {
    getValidAccessTokenForServerActions,
    getValidAccessTokenForServerHandlerGet,
} from '@/lib/getValidAccessToken';
import { CreateUserFormValues } from '@/utils/createAdminValidation';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

const unsupported = <T>(message: string): BackendEnvelope<T> => ({ success: false, message });

export const getDashboardMetaData = async (): Promise<BackendEnvelope<unknown>> =>
    unsupported('Endpoint not supported by current backend.');

export const updateNewsStatus = async (): Promise<BackendEnvelope<unknown>> =>
    unsupported('Endpoint not supported by current backend.');

export const getAllUsers = async (): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();
    return requestBackendJson<BackendEnvelope<unknown>>('/user/admin-get-all', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

export const getAllAdmins = async (): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();
    return requestBackendJson<BackendEnvelope<unknown>>('/admin/admins', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

export const blockUnblockSingleUserById = async (): Promise<BackendEnvelope<unknown>> =>
    unsupported('Endpoint not supported by current backend.');

export const createUser = async (payload: CreateUserFormValues): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const formData = new FormData();
    formData.set(
        'data',
        JSON.stringify({
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
            phone: payload.phone,
            password: payload.password,
        }),
    );

    const result = await requestBackendJson<BackendEnvelope<unknown>>('/admin/admins', {
        method: 'POST',
        body: formData,
        token: accessToken ?? undefined,
    });

    updateTag('ADMINS');
    return result;
};

export const updateAdmin = async (
    userId: string,
    payload: { name?: string; email?: string; phone?: string; isActive?: boolean },
): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const formData = new FormData();
    formData.set('data', JSON.stringify(payload));

    const result = await requestBackendJson<BackendEnvelope<unknown>>(`/admin/admins/${userId}`, {
        method: 'PATCH',
        body: formData,
        token: accessToken ?? undefined,
    });

    updateTag('ADMINS');
    return result;
};

export const deleteAdmin = async (userId: string): Promise<BackendEnvelope<unknown>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<unknown>>(`/admin/admins/${userId}`, {
        method: 'DELETE',
        token: accessToken ?? undefined,
    });

    updateTag('ADMINS');
    return result;
};
