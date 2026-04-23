import httpStatus from 'http-status';
import { AppError } from '../../utils';
import { IUser } from '../User/user.interface';
import { ProductModel } from '../Product/product.model';
import { OrderModel } from './order.model';
import { IOrderItemSnapshot, TOrderStatus, TPaymentMethod, TPaymentStatus } from './order.interface';
import { calculateCodEligibility, calculateShippingCharge, deriveShippingZone, getTotalWeightKg } from './order.utils';
import { findCoupon } from './order.coupons';

type CreateOrderPayload = {
    items: Array<{ sku: string; quantity: number }>;
    customer: {
        name: string;
        phone: string;
        email?: string;
        address: string;
        city: string;
        note?: string;
    };
    couponCode?: string;
    paymentMethod: TPaymentMethod;
};

type ProductForCheckout = {
    _id: unknown;
    sku: string;
    title: string;
    slug: string;
    image: string;
    price: number;
    stock: number;
    weightKg?: number;
    isNoCOD?: boolean;
    brand: unknown;
    category: unknown;
};

const parsePrice = (value: number) => {
    if (!Number.isFinite(value)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product price found in catalog.');
    }

    return value;
};

const parseWeight = (value: number | undefined) => {
    const weight = Number(value ?? 1);

    if (!Number.isFinite(weight) || weight < 0.01) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product weight found in catalog.');
    }

    return weight;
};

const createOrderId = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const decrementProductStock = async (sku: string, quantity: number) => {
    const updated = await ProductModel.findOneAndUpdate(
        { sku, isActive: true, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { returnDocument: 'after', runValidators: true },
    ).lean();

    if (!updated) {
        throw new AppError(httpStatus.BAD_REQUEST, `Not enough stock available for SKU ${sku}.`);
    }

    return updated;
};

const resolveName = (value: unknown) => {
    if (typeof value === 'string') {
        return value;
    }

    if (value && typeof value === 'object' && 'name' in value && typeof (value as { name?: unknown }).name === 'string') {
        return (value as { name: string }).name;
    }

    return 'Unknown';
};

const buildOrderSnapshot = (product: ProductForCheckout, quantity: number): IOrderItemSnapshot => {
    const unitPrice = parsePrice(product.price);
    const weightKg = parseWeight(product.weightKg);

    return {
        product: product._id as never,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        image: product.image,
        brand: resolveName(product.brand),
        category: resolveName(product.category),
        unitPrice,
        weightKg,
        isNoCOD: Boolean(product.isNoCOD),
        quantity,
        lineTotal: unitPrice * quantity,
    };
};

const calculateOrderTotals = (payload: CreateOrderPayload, items: IOrderItemSnapshot[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalWeightKg = getTotalWeightKg(items.reduce((sum, item) => sum + item.weightKg * item.quantity, 0));
    const shippingZone = deriveShippingZone(payload.customer.city, payload.customer.address);
    const coupon = payload.couponCode ? findCoupon(payload.couponCode, subtotal) : null;
    const discount = coupon?.kind === 'percent' ? (subtotal * coupon.value) / 100 : 0;
    const shippingCharge = coupon?.kind === 'shipping' ? 0 : calculateShippingCharge({ totalWeightKg, zone: shippingZone });
    const codEligibility = calculateCodEligibility({
        subtotal,
        itemBlocksCod: items.some(item => item.isNoCOD),
    });

    return {
        subtotal,
        discount,
        totalWeightKg,
        shippingZone,
        shippingCharge,
        codEligibility,
    };
};

const previewCheckoutFromDB = async (payload: CreateOrderPayload) => {
    const skuList = payload.items.map(item => item.sku);
    const products = (await ProductModel.find({ sku: { $in: skuList }, isActive: true })
        .populate('brand', 'name')
        .populate('category', 'name')
        .lean()) as ProductForCheckout[];

    if (products.length !== skuList.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'One or more products are unavailable for ordering.');
    }

    const productMap = new Map(products.map(product => [product.sku, product]));

    const items: IOrderItemSnapshot[] = payload.items.map(item => {
        const product = productMap.get(item.sku);

        if (!product) {
            throw new AppError(httpStatus.BAD_REQUEST, `Product with SKU ${item.sku} is unavailable.`);
        }

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid quantity for SKU ${item.sku}.`);
        }

        const unitStock = Number(product.stock);

        if (!Number.isFinite(unitStock) || unitStock < item.quantity) {
            throw new AppError(httpStatus.BAD_REQUEST, `Not enough stock available for SKU ${item.sku}.`);
        }

        return buildOrderSnapshot(product, item.quantity);
    });

    const { subtotal, discount, totalWeightKg, shippingZone, shippingCharge, codEligibility } = calculateOrderTotals(
        payload,
        items,
    );

    return {
        items,
        subtotal,
        discount,
        shippingZone,
        shippingCharge,
        totalWeightKg,
        codEligible: codEligibility.eligible,
        codReasons: codEligibility.reasons,
        total: Math.max(subtotal - discount + shippingCharge, 0),
    };
};

const createOrderIntoDB = async (user: IUser, payload: CreateOrderPayload) => {
    const skuList = payload.items.map(item => item.sku);
    const products = (await ProductModel.find({ sku: { $in: skuList }, isActive: true })
        .populate('brand', 'name')
        .populate('category', 'name')
        .lean()) as ProductForCheckout[];

    if (products.length !== skuList.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'One or more products are unavailable for ordering.');
    }

    const productMap = new Map(products.map(product => [product.sku, product]));

    const updatedStocks: Array<{ sku: string; quantity: number }> = [];

    try {
        const items: IOrderItemSnapshot[] = payload.items.map(item => {
            const product = productMap.get(item.sku);

            if (!product) {
                throw new AppError(httpStatus.BAD_REQUEST, `Product with SKU ${item.sku} is unavailable.`);
            }

            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new AppError(httpStatus.BAD_REQUEST, `Invalid quantity for SKU ${item.sku}.`);
            }

            const unitStock = Number(product.stock);

            if (!Number.isFinite(unitStock) || unitStock < item.quantity) {
                throw new AppError(httpStatus.BAD_REQUEST, `Not enough stock available for SKU ${item.sku}.`);
            }

            return buildOrderSnapshot(product, item.quantity);
        });

        for (const item of payload.items) {
            await decrementProductStock(item.sku, item.quantity);
            updatedStocks.push({ sku: item.sku, quantity: item.quantity });
        }

        const { subtotal, discount, totalWeightKg, shippingZone, shippingCharge, codEligibility } = calculateOrderTotals(
            payload,
            items,
        );
        const delivery = shippingCharge;
        const total = Math.max(subtotal - discount + shippingCharge, 0);

        if (payload.paymentMethod === 'CASH_ON_DELIVERY' && !codEligibility.eligible) {
            throw new AppError(httpStatus.BAD_REQUEST, codEligibility.reasons.join(' '));
        }

        const paymentStatus: TPaymentStatus = payload.paymentMethod === 'SSL_COMMERZ' ? 'PENDING' : 'UNPAID';
        const status: TOrderStatus = 'PLACED';

        const order = await OrderModel.create({
            orderId: createOrderId(),
            user: user._id,
            items,
            customer: {
                ...payload.customer,
                email: payload.customer.email || undefined,
                note: payload.customer.note || undefined,
            },
            subtotal,
            discount,
            delivery,
            shippingZone,
            shippingCharge,
            totalWeightKg,
            codEligible: codEligibility.eligible,
            codReasons: codEligibility.reasons,
            total,
            couponCode: payload.couponCode || undefined,
            paymentMethod: payload.paymentMethod,
            paymentStatus,
            status,
        });

        return order;
    } catch (error) {
        await Promise.all(
            updatedStocks.map(item =>
                ProductModel.updateOne({ sku: item.sku }, { $inc: { stock: item.quantity } }),
            ),
        );

        throw error;
    }
};

const getMyOrdersFromDB = async (user: IUser) => {
    return OrderModel.find({ user: user._id }).sort({ createdAt: -1 }).lean();
};

const getSingleOrderForUserFromDB = async (user: IUser, orderId: string) => {
    const order = await OrderModel.findOne({ orderId, user: user._id }).lean();

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
    }

    return order;
};

const getAllOrdersForAdminFromDB = async (query: Record<string, unknown>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;
    const status = typeof query.status === 'string' ? query.status : undefined;

    const filter: Record<string, unknown> = {};
    if (status) {
        filter.status = status;
    }

    const [data, total] = await Promise.all([
        OrderModel.find(filter)
            .populate('user', 'name email phone role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        OrderModel.countDocuments(filter),
    ]);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
};

const updateOrderStatusIntoDB = async (orderId: string, status: TOrderStatus) => {
    const order = await OrderModel.findOneAndUpdate(
        { orderId },
        { status },
        { returnDocument: 'after', runValidators: true },
    ).lean();

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
    }

    return order;
};

const getOrderByIdFromDB = async (orderId: string) => {
    const order = await OrderModel.findOne({ orderId }).lean();

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
    }

    return order;
};

const updateOrderPaymentIntoDB = async (
    orderId: string,
    payload: Partial<{
        paymentStatus: TPaymentStatus;
        transactionId: string;
        gatewayUrl: string;
        status: TOrderStatus;
    }>,
) => {
    const order = await OrderModel.findOneAndUpdate({ orderId }, payload, {
        returnDocument: 'after',
        runValidators: true,
    }).lean();

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
    }

    return order;
};

export const OrderService = {
    createOrderIntoDB,
    previewCheckoutFromDB,
    getMyOrdersFromDB,
    getSingleOrderForUserFromDB,
    getAllOrdersForAdminFromDB,
    updateOrderStatusIntoDB,
    getOrderByIdFromDB,
    updateOrderPaymentIntoDB,
};
