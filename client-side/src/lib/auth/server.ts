import 'server-only';
import { cookies } from 'next/headers';
import { decodeAuthToken } from './session';
import type { AuthUser } from '@/types';

export async function getAuthTokenFromCookies(): Promise<string | null> {
    return (await cookies()).get('accessToken')?.value ?? null;
}

export async function getAuthUserFromCookies(): Promise<AuthUser | null> {
    return decodeAuthToken(await getAuthTokenFromCookies());
}
