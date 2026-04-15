// import Stripe from 'stripe';
// import httpStatus from 'http-status';
// import config from '../../config';
// import { AppError } from '../../utils';
// import { IUser } from '../User/user.interface';
// import UserModel from '../User/user.model';
// import { Payment } from './payment.model';
// import { IMeta } from '../../types';
// import { PipelineStage } from 'mongoose';

// const stripe = new Stripe(config.stripe.secret_key as string, {
//     apiVersion: '2026-03-25.dahlia',
// });

// const PREMIUM_PRICE_USD = 10.99;
// const PREMIUM_DURATION_DAYS = 30;

// // createPremiumCheckoutSession
// const createPremiumCheckoutSession = async (user: IUser) => {
//     if (!config.stripe.secret_key) {
//         throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Stripe secret key is missing');
//     }
//     if (!config.stripe.success_url || !config.stripe.cancel_url) {
//         throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Stripe success/cancel URL is missing');
//     }

//     const payment = await Payment.create({
//         user: user._id,
//         amount: PREMIUM_PRICE_USD,
//         currency: 'USD',
//         status: 'PENDING',
//         plan: 'PREMIUM',
//         durationDays: PREMIUM_DURATION_DAYS,
//     });

//     const session = await stripe.checkout.sessions.create({
//         mode: 'payment',
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: 'Premium Plan (30 days)',
//                     },
//                     unit_amount: Math.round(PREMIUM_PRICE_USD * 100),
//                 },
//                 quantity: 1,
//             },
//         ],
//         success_url: config.stripe.success_url,
//         cancel_url: config.stripe.cancel_url,
//         client_reference_id: String(user._id),
//         metadata: {
//             userId: String(user._id),
//             paymentId: String(payment._id),
//             durationDays: String(PREMIUM_DURATION_DAYS),
//         },
//     });

//     payment.stripeCheckoutSessionId = session.id;
//     await payment.save();

//     return { sessionId: session.id, url: session.url };
// };

// // handleStripeWebhook
// const handleStripeWebhook = async (signature: string | string[] | undefined, rawBody: Buffer) => {
//     if (!config.stripe.webhook_secret) {
//         throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Stripe webhook secret is missing');
//     }

//     const sig = Array.isArray(signature) ? signature[0] : signature;
//     if (!sig) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Stripe signature is missing');
//     }

//     // let event: Stripe.Event;
//     let event;
//     try {
//         event = stripe.webhooks.constructEvent(rawBody, sig, config.stripe.webhook_secret);
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//         throw new AppError(httpStatus.BAD_REQUEST, `Invalid Stripe signature: ${err.message}`);
//     }

//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;
//         const paymentId = session.metadata?.paymentId;
//         const userId = session.metadata?.userId || session.client_reference_id;

//         if (paymentId) {
//             const payment = await Payment.findById(paymentId);
//             if (payment) {
//                 payment.status = 'SUCCEEDED';
//                 payment.stripePaymentIntentId =
//                     typeof session.payment_intent === 'string' ? session.payment_intent : undefined;
//                 payment.stripeCustomerId =
//                     typeof session.customer === 'string' ? session.customer : undefined;

//                 const until = new Date(Date.now() + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000);
//                 payment.premiumUntil = until;
//                 await payment.save();

//                 if (userId) {
//                     await UserModel.findByIdAndUpdate(userId, {
//                         plan: 'PREMIUM',
//                         premiumUntil: until,
//                     });
//                 }
//             }
//         }
//     }

//     return { received: true };
// };

// // getMyCurrentStatus
// const getMyCurrentStatus = async (user: IUser) => {
//     const premiumUntil = user.premiumUntil ? new Date(user.premiumUntil) : undefined;
//     const isPremium = user.plan === 'PREMIUM' && (!premiumUntil || premiumUntil.getTime() > Date.now());

//     return {
//         plan: user.plan || 'FREE',
//         premiumUntil: premiumUntil || null,
//         isPremium,
//     };
// };

// // getAllPaymentsForAdminFromDB
// const getAllPaymentsForAdminFromDB = async (
//     query: Record<string, unknown>,
// ): Promise<{ data: unknown[]; meta: IMeta; summary: { totalAmount: number } }> => {
//     const { page, limit, searchTerm, status } = query;

//     const pageNumber = Number(page) || 1;
//     const limitNumber = Number(limit) || 10;
//     const skip = (pageNumber - 1) * limitNumber;

//     const matchStage: Record<string, unknown> = {};

//     if (status) {
//         matchStage.status = status;
//     }

//     const pipeline: PipelineStage[] = [{ $match: matchStage }];

//     if (searchTerm) {
//         pipeline.push({
//             $lookup: {
//                 from: 'users',
//                 localField: 'user',
//                 foreignField: '_id',
//                 as: 'user',
//             },
//         });
//         pipeline.push({ $unwind: '$user' });
//         pipeline.push({
//             $match: {
//                 $or: [
//                     { 'user.name': { $regex: searchTerm, $options: 'i' } },
//                     { 'user.email': { $regex: searchTerm, $options: 'i' } },
//                     { stripeCheckoutSessionId: { $regex: searchTerm, $options: 'i' } },
//                     { stripePaymentIntentId: { $regex: searchTerm, $options: 'i' } },
//                 ],
//             },
//         });
//     } else {
//         pipeline.push({
//             $lookup: {
//                 from: 'users',
//                 localField: 'user',
//                 foreignField: '_id',
//                 as: 'user',
//             },
//         });
//         pipeline.push({ $unwind: '$user' });
//     }

//     pipeline.push({ $sort: { createdAt: -1 } });
//     pipeline.push({
//         $facet: {
//             data: [
//                 { $skip: skip },
//                 { $limit: limitNumber },
//                 {
//                     $project: {
//                         amount: 1,
//                         currency: 1,
//                         status: 1,
//                         plan: 1,
//                         durationDays: 1,
//                         premiumUntil: 1,
//                         stripeCheckoutSessionId: 1,
//                         stripePaymentIntentId: 1,
//                         stripeCustomerId: 1,
//                         createdAt: 1,
//                         user: {
//                             _id: '$user._id',
//                             name: '$user.name',
//                             email: '$user.email',
//                             phone: '$user.phone',
//                             image: '$user.image',
//                             plan: '$user.plan',
//                         },
//                     },
//                 },
//             ],
//             meta: [{ $count: 'total' }],
//             summary: [{ $group: { _id: null, totalAmount: { $sum: '$amount' } } }],
//         },
//     });

//     const result = await Payment.aggregate(pipeline);
//     const facetResult = result[0] || { data: [], meta: [] };

//     const total = facetResult.meta[0]?.total || 0;
//     const totalPage = Math.ceil(total / limitNumber) || 1;

//     return {
//         data: facetResult.data,
//         meta: {
//             page: pageNumber,
//             limit: limitNumber,
//             total,
//             totalPage,
//         },
//         summary: {
//             totalAmount: facetResult.summary[0]?.totalAmount || 0,
//         },
//     };
// };

// export const PaymentService = {
//     createPremiumCheckoutSession,
//     handleStripeWebhook,
//     getMyCurrentStatus,
//     getAllPaymentsForAdminFromDB,
// };

type PaymentServiceResult = {
    sessionId?: string;
    url?: string;
    received?: boolean;
    plan?: string;
    premiumUntil?: Date | null;
    isPremium?: boolean;
    data?: unknown[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
    summary?: { totalAmount: number };
};

const unsupportedPaymentFeature = async (...args: unknown[]): Promise<PaymentServiceResult> => {
    void args;

    return {
        sessionId: '',
        url: '',
        received: true,
        plan: 'FREE',
        premiumUntil: null,
        isPremium: false,
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPage: 0 },
        summary: { totalAmount: 0 },
    };
};

export const PaymentService = {
    createPremiumCheckoutSession: unsupportedPaymentFeature,
    handleStripeWebhook: unsupportedPaymentFeature,
    getMyCurrentStatus: unsupportedPaymentFeature,
    getAllPaymentsForAdminFromDB: unsupportedPaymentFeature,
};
