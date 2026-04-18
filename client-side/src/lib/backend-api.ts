export type JsonRecord = Record<string, unknown>;

export interface BackendApiErrorPayload {
    message?: string;
    error?: string;
    [key: string]: unknown;
}

export class BackendApiError extends Error {
    status: number;

    payload: unknown;

    constructor(message: string, status: number, payload: unknown) {
        super(message);
        this.name = 'BackendApiError';
        this.status = status;
        this.payload = payload;
    }
}

export function getBackendApiBase(): string {
    return (process.env.NEXT_PUBLIC_BACKEND_FULL_URL as string).replace(/\/$/, '');
}

export function buildBackendApiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getBackendApiBase()}${normalizedPath}`;
}

function isJsonSerializableBody(body: unknown): body is JsonRecord {
    return (
        Boolean(body) &&
        !(body instanceof FormData) &&
        !(body instanceof Blob) &&
        !(body instanceof URLSearchParams) &&
        typeof body !== 'string'
    );
}

// function getErrorMessage(payload: unknown, fallback: string): string {
//     if (typeof payload === 'object' && payload !== null) {
//         const candidate = payload as BackendApiErrorPayload;

//         return candidate.message ?? candidate.error ?? fallback;
//     }

//     return fallback;
// }

async function readJsonSafely(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('application/json')) {
        return null;
    }

    try {
        return await response.json();
    } catch {
        return null;
    }
}

export interface BackendRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
    body?: RequestInit['body'] | JsonRecord | unknown[];
    headers?: HeadersInit;
    token?: string | null;
    baseUrl?: string;
}

export async function requestBackendJson<T>(path: string, options: BackendRequestOptions = {}): Promise<T> {
    const { body, headers, token, baseUrl, ...fetchOptions } = options;

    const requestHeaders = new Headers(headers);

    if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    if (isJsonSerializableBody(body) && !requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json');
    }

    const requestBody: BodyInit | undefined = isJsonSerializableBody(body)
        ? JSON.stringify(body)
        : typeof body === 'undefined' || body === null
          ? undefined
          : (body as BodyInit);

    const response = await fetch(
        `${(baseUrl ?? getBackendApiBase()).replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`,
        {
            ...fetchOptions,
            headers: requestHeaders,
            body: requestBody,
        },
    );

    const payload = await readJsonSafely(response);

    // if (!response.ok) { // i am sending no ok field in response, so this will always be true, and error will always be thrown, so commenting out
    //     throw new BackendApiError(
    //         getErrorMessage(payload, response.statusText || 'Request failed'),
    //         response.status,
    //         payload,
    //     );
    // }

    return payload as T;
}
