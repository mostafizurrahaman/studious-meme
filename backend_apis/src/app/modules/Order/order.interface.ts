import { Document, Types } from 'mongoose';

export type TOrderStatus = 'PLACED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
export type TPaymentMethod = 'CASH_ON_DELIVERY' | 'SSL_COMMERZ';
export type TPaymentStatus = 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface IOrderItemSnapshot {
    product: Types.ObjectId;
    title: string;
    slug: string;
    sku: string;
    image: string;
    brand: string;
    category: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

export interface IOrderCustomerInfo {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    note?: string;
}

export interface IOrder extends Document {
    orderId: string;
    user: Types.ObjectId;
    items: IOrderItemSnapshot[];
    customer: IOrderCustomerInfo;
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
    couponCode?: string;
    paymentMethod: TPaymentMethod;
    paymentStatus: TPaymentStatus;
    status: TOrderStatus;
    transactionId?: string;
    gatewayUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
