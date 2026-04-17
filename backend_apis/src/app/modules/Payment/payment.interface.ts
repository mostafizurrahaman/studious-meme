import { Document, Types } from 'mongoose';

export type TPaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface IPayment extends Document {
    user: Types.ObjectId;
    order: Types.ObjectId;
    amount: number;
    currency: string;
    status: TPaymentStatus;

    provider: 'SSL_COMMERZ';
    transactionId: string;
    gatewayUrl?: string;
    sessionKey?: string;
    bankTranId?: string;
    valId?: string;
    gatewayPayload?: Record<string, unknown>;

    createdAt: Date;
    updatedAt: Date;
}
