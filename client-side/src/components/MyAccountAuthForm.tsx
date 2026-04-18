'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import {
    resendSignupOtpAction,
    submitSignIn,
    submitSignUp,
    submitSignupOtp,
    type SignInState,
    type SignUpState,
} from '@/app/(withNavFooter)/my-account/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { accountBenefits } from '@/lib/malamal-content';

const initialState: SignInState = {
    ok: false,
    message: '',
};

const initialSignUpState: SignUpState = {
    ok: false,
    message: '',
    email: '',
};

function PasswordField({
    name,
    placeholder,
    value,
    onToggle,
    visible,
    readOnly,
}: {
    name: string;
    placeholder: string;
    value?: string;
    onToggle: () => void;
    visible: boolean;
    readOnly?: boolean;
}) {
    return (
        <div className="relative">
            <Input
                name={name}
                placeholder={placeholder}
                type={visible ? 'text' : 'password'}
                value={value}
                readOnly={readOnly}
                required={!readOnly}
                className="h-11 px-4 pr-12 text-sm"
            />
            <button
                type="button"
                onClick={onToggle}
                aria-label={visible ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-3 inline-flex items-center text-foreground/50 transition hover:text-foreground"
            >
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}

export function MyAccountAuthForm() {
    const router = useRouter();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [showSigninPassword, setShowSigninPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
    const [isResending, startResendTransition] = useTransition();
    const [state, formAction, isPending] = useActionState(submitSignIn, initialState);
    const [signupState, signupAction, signupPending] = useActionState(submitSignUp, initialSignUpState);
    const [otpState, otpAction, otpPending] = useActionState(submitSignupOtp, initialSignUpState);

    useEffect(() => {
        if (!state.message) {
            return;
        }

        if (state.ok) {
            toast.success(state.message);
            router.push('/');
            return;
        }

        toast.error(state.message);
    }, [router, state]);

    useEffect(() => {
        if (!signupState.message) return;

        if (signupState.ok) {
            toast.success(signupState.message);
            return;
        }

        toast.error(signupState.message);
    }, [signupState]);

    useEffect(() => {
        if (!otpState.message) return;

        if (otpState.ok) {
            toast.success(otpState.message);
            router.push('/');
            return;
        }

        toast.error(otpState.message);
    }, [otpState, router]);

    const signupEmail = otpState.email || signupState.email || '';
    const showOtpStep = signupState.ok && signupState.step === 'otp' && !otpState.ok;

    return (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <Card className="p-6 shadow-sm">
                <CardHeader className="p-0">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={mode === 'signin' ? 'default' : 'outline'}
                            onClick={() => setMode('signin')}
                        >
                            Login
                        </Button>
                        <Button
                            type="button"
                            variant={mode === 'signup' ? 'default' : 'outline'}
                            onClick={() => setMode('signup')}
                        >
                            Sign up
                        </Button>
                    </div>
                    <h2 className="mt-4 text-2xl font-black text-secondary">
                        {mode === 'signin' ? 'Login' : showOtpStep ? 'Verify OTP' : 'Create account'}
                    </h2>
                </CardHeader>
                <CardContent className="mt-5 p-0">
                    {mode === 'signin' ? (
                        <form action={formAction} className="grid gap-4">
                            <Input name="email" type="email" placeholder="Email address" required className="h-11 px-4 text-sm" />
                            <PasswordField
                                name="password"
                                placeholder="Password"
                                onToggle={() => setShowSigninPassword(value => !value)}
                                visible={showSigninPassword}
                            />
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-11 w-fit rounded-full px-6 text-sm font-bold shadow-sm"
                            >
                                {isPending ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    ) : showOtpStep ? (
                        <form action={otpAction} className="grid gap-4">
                            <Input name="otp-email" type="email" value={signupEmail} readOnly className="h-11 px-4 text-sm" />
                            <Input name="otp" placeholder="6 digit OTP" required className="h-11 px-4 text-sm" />
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    type="submit"
                                    disabled={otpPending}
                                    className="h-11 rounded-full px-6 text-sm font-bold shadow-sm"
                                >
                                    {otpPending ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isResending || !signupEmail}
                                    onClick={() => {
                                        startResendTransition(async () => {
                                            const result = await resendSignupOtpAction(signupEmail);
                                            if (!result?.success) {
                                                toast.error(result?.message ?? 'Failed to resend OTP.');
                                                return;
                                            }
                                            toast.success(result.message ?? 'OTP sent again successfully.');
                                        });
                                    }}
                                >
                                    {isResending ? 'Sending...' : 'Resend OTP'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form action={signupAction} className="grid gap-4">
                            <Input name="signup-name" placeholder="Full name" required className="h-11 px-4 text-sm" />
                            <Input name="signup-email" type="email" placeholder="Email address" required className="h-11 px-4 text-sm" />
                            <PasswordField
                                name="signup-password"
                                placeholder="Password"
                                onToggle={() => setShowSignupPassword(value => !value)}
                                visible={showSignupPassword}
                            />
                            <PasswordField
                                name="signup-confirm-password"
                                placeholder="Confirm password"
                                onToggle={() => setShowSignupConfirmPassword(value => !value)}
                                visible={showSignupConfirmPassword}
                            />
                            <Button
                                type="submit"
                                disabled={signupPending}
                                className="h-11 w-fit rounded-full px-6 text-sm font-bold shadow-sm"
                            >
                                {signupPending ? 'Creating account...' : 'Create account'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <div className="mt-6 text-sm text-foreground/55">
                    {mode === 'signin'
                        ? 'Use your existing account to access orders and dashboards.'
                        : 'New users receive an OTP by email before the account is activated.'}
                </div>
            </Card>

            <Card className="border-0 bg-secondary p-6 text-secondary-foreground shadow-sm">
                <h2 className="text-2xl font-black">Why create an account</h2>
                <div className="mt-4 space-y-3 text-sm text-secondary-foreground/80">
                    {accountBenefits.map(item => (
                        <div key={item} className="rounded-2xl bg-white/10 px-4 py-3">
                            {item}
                        </div>
                    ))}
                </div>
            </Card>
        </section>
    );
}
