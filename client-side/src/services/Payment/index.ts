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
    meta?: { page: number; limit: number; total: number; totalPages: number };
    summary?: { total?: number; totalAmount?: number };
};

export type BackendPayment = {
    _id: string;
    transactionId: string;
    order: string | { orderId: string };
    amount: number;
    status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
    createdAt: string;
    bankTranId?: string;
    valId?: string;
};

export const initiateSslCommerzPayment = async (
    orderId: string,
): Promise<BackendEnvelope<{ url?: string; transactionId?: string }>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    return requestBackendJson<BackendEnvelope<{ url?: string; transactionId?: string }>>(
        `/payment/sslcommerz/init/${orderId}`,
        {
            method: 'POST',
            token: accessToken ?? undefined,
        },
    );
};

export const getMyPayments = async (): Promise<BackendEnvelope<unknown[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();
    return requestBackendJson<BackendEnvelope<unknown[]>>('/payment/my-payments', {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};

type AdminPaymentParams = {
    page?: number;
    limit?: number;
};

export const getAllPaymentsForAdmin = async (
    params: AdminPaymentParams = {},
): Promise<BackendEnvelope<BackendPayment[]>> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();

    return requestBackendJson<BackendEnvelope<BackendPayment[]>>(`/payment/admin${query ? `?${query}` : ''}`, {
        method: 'GET',
        token: accessToken ?? undefined,
    });
};
