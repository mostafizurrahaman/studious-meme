import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderItemSnapshotSchema = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        sku: { type: String, required: true },
        image: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
    },
    { _id: false },
);

const orderCustomerSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        address: { type: String, required: true },
        city: { type: String, required: true },
        note: { type: String },
    },
    { _id: false },
);

const orderSchema = new Schema<IOrder>(
    {
        orderId: { type: String, required: true, unique: true, index: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        items: { type: [orderItemSnapshotSchema], required: true },
        customer: { type: orderCustomerSchema, required: true },
        subtotal: { type: Number, required: true },
        discount: { type: Number, required: true, default: 0 },
        delivery: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true },
        couponCode: { type: String },
        paymentMethod: {
            type: String,
            enum: ['CASH_ON_DELIVERY', 'SSL_COMMERZ'],
            required: true,
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'CANCELLED'],
            required: true,
            default: 'UNPAID',
            index: true,
        },
        status: {
            type: String,
            enum: ['PLACED', 'PROCESSING', 'DELIVERED', 'CANCELLED'],
            required: true,
            default: 'PLACED',
            index: true,
        },
        transactionId: { type: String, index: true },
        gatewayUrl: { type: String },
    },
    { timestamps: true, versionKey: false },
);

orderSchema.index({ user: 1, createdAt: -1 }, { name: 'order_user_createdAt_idx' });

export const OrderModel = model<IOrder>('Order', orderSchema);
