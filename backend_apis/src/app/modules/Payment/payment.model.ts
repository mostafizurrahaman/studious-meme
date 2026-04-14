import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'USD' },
        status: {
            type: String,
            enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED'],
            default: 'PENDING',
            index: true,
        },

        stripeCheckoutSessionId: { type: String, index: true },
        stripePaymentIntentId: { type: String, index: true },
        stripeCustomerId: { type: String, index: true },

        plan: { type: String, enum: ['PREMIUM'], default: 'PREMIUM' },
        durationDays: { type: Number, required: true, default: 30 },
        premiumUntil: { type: Date },
    },
    { timestamps: true, versionKey: false },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
