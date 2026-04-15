// import { z } from 'zod';

// const createAccountSchema = z.object({
//     body: z
//         .object({
//             name: z
//                 .string({ error: 'Name is required!' })
//                 .trim()
//                 .min(3, 'Name must be at least 3 characters long!'),
//             email: z
//                 .string({ error: 'Email is required!' })
//                 .trim()
//                 .email({ message: 'Invalid email format!' })
//                 .transform(email => email.toLowerCase()),
//             password: z
//                 .string({ error: 'Password is required!' })
//                 .min(8, 'Password must be at least 8 characters long!')
//                 .max(20, 'Password cannot exceed 20 characters!')
//                 .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter!' })
//                 .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter!' })
//                 .regex(/[0-9]/, { message: 'Password must contain at least one number!' })
//                 .regex(/[@$!%*?&#]/, { message: 'Password must contain at least one special character!' }),
//             phone: z.string().trim().optional(),
//             role: z.enum(['USER', 'ADMIN']).optional(),
//             plan: z.enum(['FREE', 'PREMIUM']).optional(),
//             premiumUntil: z.coerce.date().optional(),
//         })
//         .passthrough(),
// });

// const updateAccountSchema = z.object({
//     params: z.object({
//         userId: z.string({ error: 'User id is required!' }).trim().min(1, 'User id is required!'),
//     }),
//     body: z
//         .object({
//             name: z
//                 .string({ error: 'Name is required!' })
//                 .trim()
//                 .min(3, 'Name must be at least 3 characters long!')
//                 .optional(),
//             email: z
//                 .string({ error: 'Email is required!' })
//                 .trim()
//                 .email({ message: 'Invalid email format!' })
//                 .transform(email => email.toLowerCase())
//                 .optional(),
//             phone: z.string().trim().optional(),
//             password: z
//                 .string({ error: 'Password is required!' })
//                 .min(8, 'Password must be at least 8 characters long!')
//                 .max(20, 'Password cannot exceed 20 characters!')
//                 .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter!' })
//                 .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter!' })
//                 .regex(/[0-9]/, { message: 'Password must contain at least one number!' })
//                 .regex(/[@$!%*?&#]/, { message: 'Password must contain at least one special character!' })
//                 .optional(),
//             role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
//             plan: z.enum(['FREE', 'PREMIUM']).optional(),
//             premiumUntil: z.coerce.date().optional(),
//         })
//         .passthrough()
//         .refine(data => Object.values(data).some(value => value !== undefined), {
//             message: 'At least one field is required!',
//         }),
// });

// // createUser
// // const createUser = z.object({
// //   body: z.object({
// //     name: z.string({ error: 'Name is required1' }).min(1, 'Name is required'),
// //   }),
// // });

// // updateUser
// // const updateUser = z.object({
// //   body: z.object({
// //     name: z.string().optional(),
// //   }),
// // });

// // export const NewsValidation = {
// //   createUser,
// //   updateUser,
// // };

// // updateCategoryImage
// const updateCategoryImage = z.object({
//     body: z.object({
//         category: z
//             .string({ error: 'Category is required' })
//             .trim()
//             .min(1, 'Category is required')
//             .nonempty('Category is required'),
//     }),
// });

// const updateShopLocationSchema = z.object({
//     params: z.object({
//         shopId: z.string({ error: 'Shop id is required!' }).trim().min(1, 'Shop id is required!'),
//     }),
//     body: z
//         .object({
//             address: z
//                 .preprocess(
//                     value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
//                     z.string().trim().min(1, 'Address cannot be empty!').optional(),
//                 )
//                 .optional(),
//             latitude: z.preprocess(
//                 value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
//                 z.coerce.number().finite().optional(),
//             ),
//             longitude: z.preprocess(
//                 value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
//                 z.coerce.number().finite().optional(),
//             ),
//         })
//         .passthrough()
//         .refine(
//             data => {
//                 const hasAddress = typeof data.address === 'string' && data.address.trim().length > 0;
//                 const hasLatitude = data.latitude !== undefined;
//                 const hasLongitude = data.longitude !== undefined;

//                 return hasAddress || (hasLatitude && hasLongitude);
//             },
//             { message: 'address or latitude and longitude are required!' },
//         )
//         .refine(
//             data => {
//                 const hasLatitude = data.latitude !== undefined;
//                 const hasLongitude = data.longitude !== undefined;

//                 return (hasLatitude && hasLongitude) || (!hasLatitude && !hasLongitude);
//             },
//             { message: 'latitude and longitude must be provided together!' },
//         ),
// });

// export const AdminProductValidation = {
//     createAccountSchema,
//     updateAccountSchema,
//     updateCategoryImage,
//     updateShopLocationSchema,
// };
