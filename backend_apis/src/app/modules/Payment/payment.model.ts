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
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            index: true,
        },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'BDT' },
        status: {
            type: String,
            enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED'],
            default: 'PENDING',
            index: true,
        },
        provider: { type: String, enum: ['SSL_COMMERZ'], default: 'SSL_COMMERZ' },
        transactionId: { type: String, required: true, unique: true, index: true },
        gatewayUrl: { type: String },
        sessionKey: { type: String, index: true },
        bankTranId: { type: String },
        valId: { type: String },
        gatewayPayload: { type: Schema.Types.Mixed },
    },
    { timestamps: true, versionKey: false },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
