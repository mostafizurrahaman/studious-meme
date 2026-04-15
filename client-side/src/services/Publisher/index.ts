/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import {
  getValidAccessTokenForServerActions,
  getValidAccessTokenForServerHandlerGet,
} from '@/lib/getValidAccessToken';
import { CreateUserFormValues } from '@/utils/createAdminValidation';
// import { CreateAdminFormValues } from '@/types';
import { updateTag } from 'next/cache';

// getDashboardMetaData
export const getDashboardMetaData = async (): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerHandlerGet();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/admin/meta-data`,
      {
        method: 'GET',
        next: {
          tags: ['DASHBOARD_META_DATA'],
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// updateNewsStatus
export const updateNewsStatus = async (payload: {
  newsId: string;
  isActive: boolean;
}): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerActions();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/admin/news/status`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    updateTag('DASHBOARD_META_DATA');

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// get All Users
export const getAllUsers = async (): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerHandlerGet();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/admin/users`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          tags: ['USERS'],
        },
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error.message);
  }
};

// blockSingleUserById
export const blockUnblockSingleUserById = async (id: string): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerActions();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/admin/user-isactive-status-change/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    updateTag('USERS');

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error.message);
  }
};

// createUser
export const createUser = async (
  payload: CreateUserFormValues
): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerActions();
  try {
    // Only send the fields that API expects
    const body = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
      role: payload.role,
      password: payload.password,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/create-user`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    updateTag('USERS');

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
