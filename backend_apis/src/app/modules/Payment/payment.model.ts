import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'BDT' },
        status: {
            type: String,
            enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED'],
            default: 'PENDING',
        },
        provider: { type: String, enum: ['SSL_COMMERZ'], default: 'SSL_COMMERZ' },
        transactionId: { type: String, required: true, unique: true },
        gatewayUrl: { type: String },
        sessionKey: { type: String },
        bankTranId: { type: String },
        valId: { type: String },
        gatewayPayload: { type: Schema.Types.Mixed },
    },
    { timestamps: true, versionKey: false },
);

paymentSchema.index({ user: 1, createdAt: -1 }, { name: 'payment_user_createdAt_idx' });

export const Payment = model<IPayment>('Payment', paymentSchema);
