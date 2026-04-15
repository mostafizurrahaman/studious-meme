/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';
import { updateTag } from 'next/cache';
import { FieldValues } from 'react-hook-form';

// getPageByType
export const getPageByType = async (type: string): Promise<any> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/page/retrieve/${type}`, {
            method: 'GET',

            next: {
                tags: ['PAGES'],
            },
        });

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

// createOrUpdatePageByType
export const createOrUpdatePageByType = async (data: FieldValues): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerActions();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/page/create-or-update`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        updateTag('PAGES');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};
