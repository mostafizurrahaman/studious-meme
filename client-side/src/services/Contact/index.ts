/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getValidAccessTokenForServerHandlerGet } from '@/lib/getValidAccessToken';
import { updateTag } from 'next/cache';
import type { FieldValues } from 'react-hook-form';

// createContact
export const createContact = async (contactData: FieldValues): Promise<any> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/contact`, {
            method: 'POST',
            body: JSON.stringify(contactData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        updateTag('CONTACTS');

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};

// getAllContacts
export const getAllContacts = async (page: string = '1', limit: string = '20'): Promise<any> => {
    const accessToken = await getValidAccessTokenForServerHandlerGet();

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/contact?page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                next: {
                    tags: ['CONTACTS'],
                },
            },
        );

        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error);
    }
};
