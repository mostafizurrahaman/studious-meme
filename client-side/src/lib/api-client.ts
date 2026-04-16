'use client';

import { toast } from 'sonner';
import { buildBackendApiUrl, getBackendApiBase, type BackendApiErrorPayload, type BackendRequestOptions, BackendApiError, requestBackendJson } from '@/lib/backend-api';

export { BackendApiError, buildBackendApiUrl, getBackendApiBase };

export interface ClientApiOptions extends Omit<BackendRequestOptions, 'baseUrl'> {
    notify?: boolean;
}

export async function requestApiJson<T>(path: string, options: ClientApiOptions = {}): Promise<T> {
    const { notify = true, ...requestOptions } = options;

    try {
        return await requestBackendJson<T>(path, requestOptions);
    } catch (error) {
        if (notify && typeof window !== 'undefined' && error instanceof BackendApiError) {
            const payload = error.payload as BackendApiErrorPayload | undefined;
            toast.error(payload?.message ?? error.message ?? 'Request failed');
        }

        throw error;
    }
}
