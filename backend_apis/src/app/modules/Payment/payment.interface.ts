import { Document, Types } from 'mongoose';

export type TPaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface IPayment extends Document {
    user: Types.ObjectId;
    amount: number;
    currency: string;
    status: TPaymentStatus;

    stripeCheckoutSessionId?: string;
    stripePaymentIntentId?: string;
    stripeCustomerId?: string;

    plan: 'PREMIUM';
    durationDays: number;
    premiumUntil?: Date;

    createdAt: Date;
    updatedAt: Date;
}
