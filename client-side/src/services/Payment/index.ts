'use server';

import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions, getValidAccessTokenForServerHandlerGet } from '@/lib/getValidAccessToken';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
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
