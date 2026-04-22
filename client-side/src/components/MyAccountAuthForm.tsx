'use client';

import { useState, type ComponentProps } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import {
    resendSignupOtpAction,
    submitSignIn,
    submitSignUp,
    submitSignupOtp,
} from '@/app/(withNavFooter)/my-account/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { accountBenefits } from '@/lib/static-site-content';
import { useUser } from '@/context/UserContext';
import { authFormSchemas, makeZodResolver } from '@/lib/form-validation';

const initialState = { ok: false, message: '' } as const;

type SignInValues = z.infer<typeof authFormSchemas.signIn>;
type SignUpValues = z.infer<typeof authFormSchemas.signUp>;
type OtpValues = z.infer<typeof authFormSchemas.otp>;

function LabeledInput({ id, label, ...props }: ComponentProps<typeof Input> & { id: string; label: string }) {
    return (
        <div className="grid gap-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <Input id={id} {...props} aria-label={label} />
        </div>
    );
}

function PasswordField({
    id,
    label,
    placeholder,
    onToggle,
    visible,
    autoComplete,
    ...props
}: ComponentProps<typeof Input> & {
    id: string;
    label: string;
    placeholder: string;
    onToggle: () => void;
    visible: boolean;
    autoComplete?: string;
}) {
    return (
        <div className="grid gap-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>

            <div className="relative">
                <Input
                    id={id}
                    placeholder={placeholder}
                    type={visible ? 'text' : 'password'}
                    aria-label={label}
                    className="h-11 px-4 pr-14 text-sm"
                    autoComplete={autoComplete}
                    {...props}
                />

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    title={visible ? 'Hide password' : 'Show password'}
                    className="absolute right-1 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-foreground/60 transition hover:bg-muted hover:text-foreground"
                >
                    {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
        </div>
    );
}

function ErrorText({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="text-xs text-destructive">{message}</p>;
}

export function MyAccountAuthForm() {
    const router = useRouter();
    const { setIsLoading } = useUser();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [showSigninPassword, setShowSigninPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [signupEmail, setSignupEmail] = useState('');
    const [showOtpStep, setShowOtpStep] = useState(false);

    const signInForm = useForm<SignInValues>({
        resolver: makeZodResolver(authFormSchemas.signIn),
        defaultValues: { email: '', password: '' },
        mode: 'onTouched',
    });

    const signUpForm = useForm<SignUpValues>({
        resolver: makeZodResolver(authFormSchemas.signUp),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
        mode: 'onTouched',
    });

    const otpForm = useForm<OtpValues>({
        resolver: makeZodResolver(authFormSchemas.otp),
        defaultValues: { otp: '' },
        mode: 'onTouched',
    });

    function toFormData(values: Record<string, string>) {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            formData.set(key, value);
        });

        return formData;
    }

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
                        <form
                            className="grid gap-4"
                            onSubmit={signInForm.handleSubmit(async values => {
                                setIsSubmitting(true);
                                const result = await submitSignIn(initialState, toFormData(values));
                                setIsSubmitting(false);

                                if (!result.ok) {
                                    toast.error(result.message);
                                    return;
                                }

                                toast.success(result.message);
                                setIsLoading(true);
                                router.push('/');
                            })}
                        >
                            <LabeledInput
                                id="login-email"
                                label="Email address"
                                {...signInForm.register('email')}
                                type="email"
                                placeholder="Email address"
                                autoComplete="email"
                                className="h-11 px-4 text-sm"
                            />
                            <ErrorText message={signInForm.formState.errors.email?.message} />
                            <PasswordField
                                id="signin-password"
                                label="Password"
                                placeholder="Password"
                                autoComplete="current-password"
                                onToggle={() => setShowSigninPassword(value => !value)}
                                visible={showSigninPassword}
                                value={undefined}
                                {...signInForm.register('password')}
                            />
                            <ErrorText message={signInForm.formState.errors.password?.message} />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 w-fit rounded-full px-6 text-sm font-bold shadow-sm"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    ) : showOtpStep ? (
                        <form
                            className="grid gap-4"
                            onSubmit={otpForm.handleSubmit(async values => {
                                setIsSubmitting(true);
                                const result = await submitSignupOtp(
                                    initialState,
                                    toFormData({
                                        'otp-email': signupEmail,
                                        otp: values.otp,
                                    }),
                                );
                                setIsSubmitting(false);

                                if (!result.ok) {
                                    toast.error(result.message);
                                    return;
                                }

                                toast.success(result.message);
                                setIsLoading(true);
                                router.push('/');
                            })}
                        >
                            <LabeledInput
                                id="otp-email"
                                label="Email address"
                                name="otp-email"
                                type="email"
                                value={signupEmail}
                                readOnly
                                className="h-11 px-4 text-sm"
                            />

                            <LabeledInput
                                id="otp-code"
                                label="OTP code"
                                {...otpForm.register('otp')}
                                placeholder="6 digit OTP"
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                className="h-11 px-4 text-sm"
                            />
                            <ErrorText message={otpForm.formState.errors.otp?.message} />
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-11 rounded-full px-6 text-sm font-bold shadow-sm"
                                >
                                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isResending || !signupEmail}
                                    onClick={() => {
                                        setIsResending(true);
                                        void (async () => {
                                            const result = await resendSignupOtpAction(signupEmail);
                                            setIsResending(false);
                                            if (!result?.success) {
                                                toast.error(result?.message ?? 'Failed to resend OTP.');
                                                return;
                                            }
                                            toast.success(result.message ?? 'OTP sent again successfully.');
                                        })();
                                    }}
                                >
                                    {isResending ? 'Sending...' : 'Resend OTP'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form
                            className="grid gap-4"
                            onSubmit={signUpForm.handleSubmit(async values => {
                                setIsSubmitting(true);
                                const result = await submitSignUp(initialState, toFormData(values));
                                setIsSubmitting(false);

                                if (!result.ok) {
                                    toast.error(result.message);
                                    return;
                                }

                                toast.success(result.message);
                                setSignupEmail(result.email);
                                setShowOtpStep(true);
                            })}
                        >
                            <LabeledInput
                                id="signup-name"
                                label="Full name"
                                {...signUpForm.register('name')}
                                placeholder="Full name"
                                className="h-11 px-4 text-sm"
                            />
                            <ErrorText message={signUpForm.formState.errors.name?.message} />
                            <LabeledInput
                                id="signup-email"
                                label="Email address"
                                {...signUpForm.register('email')}
                                type="email"
                                placeholder="Email address"
                                autoComplete="email"
                                className="h-11 px-4 text-sm"
                            />
                            <ErrorText message={signUpForm.formState.errors.email?.message} />
                            <PasswordField
                                id="signup-password"
                                label="Password"
                                placeholder="Password"
                                autoComplete="new-password"
                                onToggle={() => setShowSignupPassword(value => !value)}
                                visible={showSignupPassword}
                                value={undefined}
                                {...signUpForm.register('password')}
                            />
                            <ErrorText message={signUpForm.formState.errors.password?.message} />
                            <PasswordField
                                id="signup-confirm-password"
                                label="Confirm password"
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                onToggle={() => setShowSignupConfirmPassword(value => !value)}
                                visible={showSignupConfirmPassword}
                                value={undefined}
                                {...signUpForm.register('confirmPassword')}
                            />
                            <ErrorText message={signUpForm.formState.errors.confirmPassword?.message} />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 w-fit rounded-full px-6 text-sm font-bold shadow-sm"
                            >
                                {isSubmitting ? 'Creating account...' : 'Create account'}
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
