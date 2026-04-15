/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { FieldValues } from 'react-hook-form';
import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';

// signInUser
export const signInUser = async (userData: FieldValues): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/signin`,
      {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set('accessToken', result?.data?.accessToken);
      (await cookies()).set('refreshToken', result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// updateProfilePhoto
export const updateProfilePhoto = async (data: FormData): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerActions();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/update-profile-photo`,
      {
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set('accessToken', result?.data?.accessToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
// updateProfileData
export const updateProfileData = async (data: FieldValues): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerActions();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/update-profile-data`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set('accessToken', result?.data?.accessToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// changePassword
export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<any> => {
  const accessToken = await getValidAccessTokenForServerActions();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/change-password`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set('accessToken', result?.data?.accessToken);
      (await cookies()).set('refreshToken', result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// forgotPassword
export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/forgot-password`,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      (await cookies()).set('forgotPassToken', result?.data?.token);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// sendForgotPasswordOtpAgain
export const sendForgotPasswordOtpAgain = async (): Promise<any> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('forgotPassToken')?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/send-forgot-password-otp-again`,
      {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// verifyOtpForForgotPassword
export const verifyOtpForForgotPassword = async (otp: string): Promise<any> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('forgotPassToken')?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/verify-forgot-password-otp`,
      {
        method: 'POST',
        body: JSON.stringify({ token, otp }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      cookieStore.set('resetPasswordToken', result?.data?.resetPasswordToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// setNewPasswordIntoDB
export const setNewPasswordIntoDB = async (newPassword: string): Promise<any> => {
  const cookieStore = await cookies();
  const resetPasswordToken = cookieStore.get('resetPasswordToken')?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/user/reset-password`,
      {
        method: 'POST',
        body: JSON.stringify({ resetPasswordToken, newPassword }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();

    if (result?.success) {
      cookieStore.delete('forgotPassToken');
      cookieStore.delete('resetPasswordToken');
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// ----------------------

// getCurrentUser
export const getCurrentUser = async (): Promise<any> => {
  const accessToken = (await cookies()).get('accessToken')?.value;
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

// logOut
export const logOut = async (): Promise<void> => {
  (await cookies()).delete('accessToken');
  (await cookies()).delete('refreshToken');
};

// getNewAccessToken
export const getNewAccessToken = async (refreshToken: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_FULL_URL}/auth/access-token`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
