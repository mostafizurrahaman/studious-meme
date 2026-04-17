'use server';

import { revalidatePath } from 'next/cache';

import { logOut, sendSignupOtpAgain, signInUser, signUpUser, verifySignupOtp } from '@/services/Auth';

export type SignInState =
    | { ok: false; message: string }
    | { ok: true; message: string };

export type SignUpState =
    | { ok: false; message: string; email?: string }
    | { ok: true; message: string; email: string; step: 'otp' | 'done' };

function readValue(formData: FormData, key: string) {
    return String(formData.get(key) ?? '').trim();
}

export async function submitSignIn(
    _prevState: SignInState,
    formData: FormData,
): Promise<SignInState> {
    const email = readValue(formData, 'email').toLowerCase();
    const password = readValue(formData, 'password');

    if (!email || !password) {
        return { ok: false, message: 'Email and password are required.' };
    }

    const result = await signInUser({ email, password });

    if (!result?.success) {
        return { ok: false, message: result?.message ?? 'Failed to sign in.' };
    }

    revalidatePath('/my-account');
    revalidatePath('/dashboard');

    return {
        ok: true,
        message: result.message ?? 'Signed in successfully.',
    };
}

export async function submitSignOut() {
    await logOut();
    revalidatePath('/my-account');
    revalidatePath('/dashboard');
}

export async function submitSignUp(
    _prevState: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    const name = readValue(formData, 'signup-name');
    const email = readValue(formData, 'signup-email').toLowerCase();
    const password = readValue(formData, 'signup-password');
    const confirmPassword = readValue(formData, 'signup-confirm-password');

    if (!name || !email || !password || !confirmPassword) {
        return { ok: false, message: 'All signup fields are required.', email };
    }

    if (password !== confirmPassword) {
        return { ok: false, message: 'Passwords must match.', email };
    }

    const result = await signUpUser({ name, email, password });
    if (!result?.success) {
        return { ok: false, message: result?.message ?? 'Failed to create account.', email };
    }

    return {
        ok: true,
        email: result.data?.userEmail ?? email,
        step: 'otp',
        message: result.message ?? 'OTP sent successfully.',
    };
}

export async function submitSignupOtp(
    _prevState: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    const userEmail = readValue(formData, 'otp-email').toLowerCase();
    const otp = readValue(formData, 'otp');

    if (!userEmail || !otp) {
        return { ok: false, message: 'Email and OTP are required.', email: userEmail };
    }

    const result = await verifySignupOtp({ userEmail, otp });
    if (!result?.success) {
        return { ok: false, message: result?.message ?? 'Failed to verify OTP.', email: userEmail };
    }

    revalidatePath('/my-account');
    revalidatePath('/dashboard');

    return {
        ok: true,
        email: userEmail,
        step: 'done',
        message: result.message ?? 'Account verified successfully.',
    };
}

export async function resendSignupOtpAction(email: string) {
    return sendSignupOtpAgain(email);
}
