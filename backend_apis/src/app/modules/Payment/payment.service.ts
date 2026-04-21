import httpStatus from 'http-status';
import { fetch } from 'undici';
import { AppError } from '../../utils';
import config from '../../config';
import { IUser } from '../User/user.interface';
import { Payment } from './payment.model';
import { OrderService } from '../Order/order.service';
import { OrderModel } from '../Order/order.model';

type PaymentServiceResult = {
    url?: string;
    transactionId?: string;
    data?: unknown[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
    summary?: { totalAmount: number };
};

const requireSslConfig = () => {
    if (!config.sslcommerz.store_id || !config.sslcommerz.store_password) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'SSLCommerz credentials are not configured.');
    }

    if (!config.urls.backend_public || !config.urls.frontend_app) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Public app URLs are not configured.');
    }
};

const buildFrontendRedirect = (path: string) =>
    `${String(config.urls.frontend_app).replace(/\/$/, '')}${path}`;
const buildBackendCallback = (path: string) =>
    `${String(config.urls.backend_public).replace(/\/$/, '')}${path}`;

const initiateSslCommerzPayment = async (user: IUser, orderId: string): Promise<PaymentServiceResult> => {
    requireSslConfig();

    const order = await OrderModel.findOne({ orderId, user: user._id }).lean();

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
    }

    if (order.paymentMethod !== 'SSL_COMMERZ') {
        throw new AppError(httpStatus.BAD_REQUEST, 'This order is not configured for SSLCommerz payment.');
    }

    if (order.paymentStatus === 'PAID') {
        throw new AppError(httpStatus.BAD_REQUEST, 'This order is already paid.');
    }

    const transactionId = order.transactionId ?? `TXN-${order.orderId}-${Date.now()}`;

    const payload = new URLSearchParams({
        store_id: String(config.sslcommerz.store_id),
        store_passwd: String(config.sslcommerz.store_password),
        total_amount: String(order.total),
        currency: 'BDT',
        tran_id: transactionId,
        success_url: buildBackendCallback('/api/v1/payment/sslcommerz/success'),
        fail_url: buildBackendCallback('/api/v1/payment/sslcommerz/fail'),
        cancel_url: buildBackendCallback('/api/v1/payment/sslcommerz/cancel'),
        ipn_url: buildBackendCallback('/api/v1/payment/sslcommerz/ipn'),
        product_name: `Order ${order.orderId}`,
        product_category: 'ecommerce',
        product_profile: 'general',
        cus_name: order.customer.name,
        cus_email: order.customer.email || `${user.email}`,
        cus_add1: order.customer.address,
        cus_city: order.customer.city,
        cus_country: 'Bangladesh',
        cus_phone: order.customer.phone,
        shipping_method: 'Courier',
        num_of_item: String(order.items.length),
        value_a: order.orderId,
        value_b: String(user._id),
    });

    const response = await fetch(String(config.sslcommerz.init_api), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
    });

    const result = (await response.json()) as {
        GatewayPageURL?: string;
        sessionkey?: string;
        failedreason?: string;
    };

    if (!response.ok || !result.GatewayPageURL) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            result.failedreason || 'Failed to initialize SSLCommerz payment.',
        );
    }

    await Payment.findOneAndUpdate(
        { transactionId },
        {
            user: user._id,
            order: order._id,
            amount: order.total,
            currency: 'BDT',
            status: 'PENDING',
            provider: 'SSL_COMMERZ',
            transactionId,
            gatewayUrl: result.GatewayPageURL,
            sessionKey: result.sessionkey,
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
    );

    await OrderService.updateOrderPaymentIntoDB(order.orderId, {
        paymentStatus: 'PENDING',
        transactionId,
        gatewayUrl: result.GatewayPageURL,
    });

    return {
        url: result.GatewayPageURL,
        transactionId,
    };
};

const validateSslPayment = async (valId: string) => {
    requireSslConfig();

    const validationUrl = new URL(String(config.sslcommerz.validation_api));
    validationUrl.searchParams.set('val_id', valId);
    validationUrl.searchParams.set('store_id', String(config.sslcommerz.store_id));
    validationUrl.searchParams.set('store_passwd', String(config.sslcommerz.store_password));
    validationUrl.searchParams.set('format', 'json');

    const response = await fetch(validationUrl, { method: 'GET' });
    const result = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
        throw new AppError(httpStatus.BAD_GATEWAY, 'Failed to validate SSLCommerz payment.');
    }

    return result;
};

const handleSslCommerzSuccess = async (payload: Record<string, unknown>) => {
    const orderId = typeof payload.value_a === 'string' ? payload.value_a : '';
    const transactionId = typeof payload.tran_id === 'string' ? payload.tran_id : '';
    const valId = typeof payload.val_id === 'string' ? payload.val_id : '';

    if (!orderId || !transactionId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payment callback payload.');
    }

    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found.');
    }

    if (payment.status === 'SUCCEEDED') {
        return buildFrontendRedirect(`/my-account/orders/${orderId}?payment=success`);
    }

    const validationPayload = valId ? await validateSslPayment(valId) : payload;

    const validationStatus =
        typeof validationPayload.status === 'string' ? validationPayload.status.toUpperCase() : '';
    const validationAmount = Number(validationPayload.amount ?? payload.amount ?? 0);

    if (validationStatus && !['VALID', 'VALIDATED'].includes(validationStatus)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Payment validation status is not valid.');
    }

    if (Number.isFinite(validationAmount) && validationAmount > 0 && validationAmount !== payment.amount) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Payment amount mismatch detected.');
    }

    payment.status = 'SUCCEEDED';
    payment.valId = valId || payment.valId;
    payment.bankTranId = typeof payload.bank_tran_id === 'string' ? payload.bank_tran_id : payment.bankTranId;
    payment.gatewayPayload = validationPayload;
    await payment.save();

    await OrderService.updateOrderPaymentIntoDB(orderId, {
        paymentStatus: 'PAID',
        status: 'PLACED',
        transactionId,
    });

    return buildFrontendRedirect(`/my-account/orders/${orderId}?payment=success`);
};

const handleSslCommerzFailure = async (payload: Record<string, unknown>, status: 'FAILED' | 'CANCELED') => {
    const orderId = typeof payload.value_a === 'string' ? payload.value_a : '';
    const transactionId = typeof payload.tran_id === 'string' ? payload.tran_id : '';

    if (transactionId) {
        const existingPayment = await Payment.findOne({ transactionId });

        if (existingPayment?.status === 'SUCCEEDED') {
            return buildFrontendRedirect(`/my-account/orders/${orderId}?payment=success`);
        }

        await Payment.findOneAndUpdate(
            { transactionId },
            {
                status,
                gatewayPayload: payload,
            },
        );
    }

    if (orderId) {
        await OrderService.updateOrderPaymentIntoDB(orderId, {
            paymentStatus: status === 'FAILED' ? 'FAILED' : 'CANCELLED',
            status: 'CANCELLED',
        });
    }

    const query = new URLSearchParams({
        payment: status.toLowerCase(),
        ...(orderId ? { orderId } : {}),
    });

    return buildFrontendRedirect(`/checkout?${query.toString()}`);
};

const getMyPaymentsFromDB = async (user: IUser) => {
    return Payment.find({ user: user._id })
        .populate('order', 'orderId total status paymentStatus')
        .sort({ createdAt: -1 })
        .lean();
};

const getAllPaymentsForAdminFromDB = async (query: Record<string, unknown>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total, summary] = await Promise.all([
        Payment.find({})
            .populate('user', 'name email phone role')
            .populate('order', 'orderId total status paymentStatus')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Payment.countDocuments(),
        Payment.aggregate([{ $group: { _id: null, totalAmount: { $sum: '$amount' } } }]),
    ]);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit) || 1,
        },
        summary: {
            totalAmount: summary[0]?.totalAmount || 0,
        },
    };
};

export const PaymentService = {
    initiateSslCommerzPayment,
    handleSslCommerzSuccess,
    handleSslCommerzFailure,
    getMyPaymentsFromDB,
    getAllPaymentsForAdminFromDB,
};
