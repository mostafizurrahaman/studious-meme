/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';
import { updateTag } from 'next/cache';

// getAllUrls
export const getAllUrls = async (): Promise<any> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/data`, {
            method: 'GET',
            next: {
                tags: ['EXTRA_DATA_URLS'],
            },
        });

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

// updateSponsorLogoUrl
export const updateSponsorLogoUrl = async (data: FormData): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerActions();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/data/sponsorLogoUrl`, {
            method: 'PUT',
            body: data,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        updateTag('EXTRA_DATA_URLS');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

// updateSingleUrl
export const updateSingleLink = async (platform: string, link: string): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerActions();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/data/${platform}`, {
            method: 'PUT',
            body: JSON.stringify({ url: link }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        updateTag('EXTRA_DATA_URLS');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

// updatePrintStory
export const updatePrintStory = async (data: FormData): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerActions();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/data/print-story`, {
            method: 'PUT',
            body: data,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        updateTag('EXTRA_DATA_URLS');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};
