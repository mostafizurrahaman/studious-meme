import { z } from 'zod';

// Reusable validators
export const zodEnumFromObject = <T extends Record<string, string>>(obj: T) =>
    z.enum([...Object.values(obj)] as [string, ...string[]]);

// 1. createUserSchema
const createUserSchema = z.object({
    body: z.object({
        name: z
            .string({ error: 'Name is required!' })
            .trim()
            .min(3, { message: 'Name must be at least 3 characters long!' }),

        // phone: z
        //   .string({ error: 'Phone number is required!' })
        //   .trim()
        //   .regex(/^[0-9+]+$/, { message: 'Invalid phone number format!' })
        //   .min(10, { message: 'Phone number must be at least 10 digits!' }),

        email: z
            .string({ error: 'Email is required!' })
            .trim()
            .email({ message: 'Invalid email format!' }) // Ensure it's a valid email
            .transform(email => email.toLowerCase()) // Convert email to lowercase
            .refine(email => email !== '', { message: 'Email is required!' }) // Check that email is not empty
            .refine(value => typeof value === 'string', {
                message: 'Email must be string!', // Check that email is string
            }),

        password: z
            .string({
                error: 'Password is required',
            })
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(20, { message: 'Password cannot exceed 20 characters' })
            .regex(/[A-Z]/, {
                message: 'Password must contain at least one uppercase letter',
            })
            .regex(/[a-z]/, {
                message: 'Password must contain at least one lowercase letter',
            })
            .regex(/[0-9]/, {
                message: 'Password must contain at least one number',
            })
            .regex(/[@$!%*?&#]/, {
                message: 'Password must contain at least one special character',
            }),
    }).passthrough(),
});

// 2. sendSignupOtpAgainSchema
const sendSignupOtpAgainSchema = z.object({
    body: z.object({
        userEmail: z
            .string({ error: 'Email is required!' })
            .trim()
            .email({ message: 'Invalid email format!' }) // Ensure it's a valid email
            .transform(email => email.toLowerCase()) // Convert email to lowercase
            .refine(email => email !== '', { message: 'Email is required!' }) // Check that email is not empty
            .refine(value => typeof value === 'string', {
                message: 'Email must be string!', // Check that email is string
            }),
    }),
});

// 3. verifySignupOtpSchema
const verifySignupOtpSchema = z.object({
    body: z.object({
        userEmail: z
            .string({ error: 'Email is required!' })
            .trim()
            .email({ message: 'Invalid email format!' }) // Ensure it's a valid email
            .transform(email => email.toLowerCase()) // Convert email to lowercase
            .refine(email => email !== '', { message: 'Email is required!' }) // Check that email is not empty
            .refine(value => typeof value === 'string', {
                message: 'Email must be string!', // Check that email is string
            }),

        otp: z
            .string({
                error: 'Password is required!',
            })
            .min(6, { message: 'Password must be at least 6 characters long!' })
            .max(6, { message: 'Password cannot exceed 6 characters!' }),
    }),
});

// 4. signinSchema
const signinSchema = z.object({
    body: z.object({
        email: z
            .string({ error: 'Email is required!' })
            .trim()
            .email({ message: 'Invalid email format!' }) // Ensure it's a valid email
            .transform(email => email.toLowerCase()) // Convert email to lowercase
            .refine(email => email !== '', { message: 'Email is required!' }) // Check that email is not empty
            .refine(value => typeof value === 'string', {
                message: 'Email must be string!', // Check that email is string
            }),

        password: z
            .string({
                error: 'Password is required!',
            })
            .min(8, { message: 'Password must be at least 8 characters long!' })
            .max(20, { message: 'Password cannot exceed 20 characters!' })
            .regex(/[A-Z]/, {
                message: 'Password must contain at least one uppercase letter!',
            })
            .regex(/[a-z]/, {
                message: 'Password must contain at least one lowercase letter!',
            })
            .regex(/[0-9]/, {
                message: 'Password must contain at least one number!',
            })
            .regex(/[@$!%*?&#]/, {
                message: 'Password must contain at least one special character!',
            }),
    }),
});

// 5. updateProfileDataSchema
const updateProfileDataSchema = z.object({
    body: z.object({
        name: z
            .string({ error: 'Name is required!' })
            .trim()
            .min(3, { message: 'Name must be at least 3 characters long!' }),

        phone: z
            .string({ error: 'Phone number is required!' })
            .trim()
            .regex(/^[0-9+]+$/, { message: 'Invalid phone number format!' })
            .min(10, { message: 'Phone number must be at least 10 digits!' }),

        // Validates if the string is a valid ISO 8601 date format
        dob: z
            .string({ error: 'Date of birth is required!' })
            .datetime({ message: 'Invalid ISO date format!' })
            .transform(val => new Date(val)), // Converts the string to a Date object automatically
    }),
});

// 6. changePasswordSchema
const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z
            .string({
                error: 'Old password is required!',
            })
            .trim()
            .min(8, {
                message: 'Old password must be at least 8 characters long!',
            })
            .max(20, { message: 'Old password cannot exceed 20 characters!' })
            .regex(/[A-Z]/, {
                message: 'Old password must contain at least one uppercase letter!',
            })
            .regex(/[a-z]/, {
                message: 'Old password must contain at least one lowercase letter!',
            })
            .regex(/[0-9]/, {
                message: 'Password must contain at least one number!',
            })
            .regex(/[@$!%*?&#]/, {
                message: 'Old password must contain at least one special character!',
            }),

        newPassword: z
            .string({
                error: 'New password is required!',
            })
            .trim()
            .min(8, {
                message: 'New password must be at least 8 characters long!',
            })
            .max(20, { message: 'New password cannot exceed 20 characters!' })
            .regex(/[A-Z]/, {
                message: 'New password must contain at least one uppercase letter!',
            })
            .regex(/[a-z]/, {
                message: 'New password must contain at least one lowercase letter!',
            })
            .regex(/[0-9]/, {
                message: 'Password must contain at least one number!',
            })
            .regex(/[@$!%*?&#]/, {
                message: 'New password must contain at least one special character!',
            }),
    }),
});

// 7. forgotPasswordSchema
const forgotPasswordSchema = z.object({
    body: z.object({
        email: z
            .string({ error: 'Email is required!' })
            .trim()
            .email({ message: 'Invalid email format!' }) // Ensure it's a valid email
            .transform(email => email.toLowerCase()) // Convert email to lowercase
            .refine(email => email !== '', { message: 'Email is required!' }) // Check that email is not empty
            .refine(value => typeof value === 'string', {
                message: 'Email must be string!', // Check that email is string
            }),
    }),
});

// 8. sendForgotPasswordOtpAgainSchema
const sendForgotPasswordOtpAgainSchema = z.object({
    body: z.object({
        token: z.string({ error: 'Token is required!' }),
    }),
});

// 9. verifyOtpForForgotPasswordSchema
const verifyOtpForForgotPasswordSchema = z.object({
    body: z.object({
        token: z.string({ error: 'Token is required!' }),
        otp: z
            .string({
                error: 'OTP is required!',
            })
            .regex(/^\d+$/, { message: 'OTP must be a number!' })
            .length(6, { message: 'OTP must be exactly 6 digits' }),
    }),
});

// 10. resetPasswordSchema
const resetPasswordSchema = z.object({
    body: z.object({
        resetPasswordToken: z.string({ error: 'Token is required!' }),

        newPassword: z
            .string({
                error: 'New password is required!',
            })
            .min(8, {
                message: 'New password must be at least 8 characters long!',
            })
            .max(20, { message: 'New password cannot exceed 20 characters!' })
            .regex(/[A-Z]/, {
                message: 'New password must contain at least one uppercase letter!',
            })
            .regex(/[a-z]/, {
                message: 'New password must contain at least one lowercase letter!',
            })
            .regex(/[0-9]/, {
                message: 'New password must contain at least one number!',
            })
            .regex(/[@$!%*?&#]/, {
                message: 'New password must contain at least one special character!',
            }),
    }),
});

// 11. getNewAccessTokenSchema
const getNewAccessTokenSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            error: 'Refresh token is required!',
        }),
    }),
});

// 12. deactivateUserAccountSchema
const deactivateUserAccountSchema = z.object({
    body: z
        .object({
            email: z
                .string({ error: 'Email is required!' })
                .trim()
                .email('Invalid email format!')
                .transform(email => email.toLowerCase())
                .refine(email => email !== '', {
                    message: 'Email is required!',
                })
                .refine(value => typeof value === 'string', {
                    message: 'Email must be string!',
                }),

            password: z
                .string({
                    error: 'Password is required!',
                })
                .min(6, {
                    message: 'Password must be at least 6 characters long!',
                })
                .max(20, { message: 'Password cannot exceed 20 characters!' }),

            deactivationReason: z
                .string({
                    error: 'Deactivation reason is required!',
                })
                .min(3, 'Reason must be at least 3 characters!')
                .max(200, 'Reason cannot exceed 200 characters!'),
        })
        .strict(),
});

export const UserValidation = {
    createUserSchema,
    sendSignupOtpAgainSchema,
    verifySignupOtpSchema,
    signinSchema,
    updateProfileDataSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    sendForgotPasswordOtpAgainSchema,
    verifyOtpForForgotPasswordSchema,
    resetPasswordSchema,
    getNewAccessTokenSchema,
    deactivateUserAccountSchema,
};
