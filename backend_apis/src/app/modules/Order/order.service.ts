import httpStatus from 'http-status';
import { AppError } from '../../utils';
import { IUser } from '../User/user.interface';
import { ProductModel } from '../Product/product.model';
import { OrderModel } from './order.model';
import { IOrderItemSnapshot, TOrderStatus, TPaymentMethod, TPaymentStatus } from './order.interface';

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

const parsePrice = (value: number) => {
    if (!Number.isFinite(value)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product price found in catalog.');
    }

    return value;
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

const createOrderIntoDB = async (user: IUser, payload: CreateOrderPayload) => {
    const skuList = payload.items.map(item => item.sku);
    const products = await ProductModel.find({ sku: { $in: skuList }, isActive: true })
        .populate('brand', 'name')
        .populate('category', 'name')
        .lean();

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

            const unitPrice = parsePrice(product.price);

            return {
                product: product._id,
                title: product.title,
                slug: product.slug,
                sku: product.sku,
                image: product.image,
                brand: (product.brand as unknown as { name: string }).name,
                category: (product.category as unknown as { name: string }).name,
                unitPrice,
                quantity: item.quantity,
                lineTotal: unitPrice * item.quantity,
            };
        });

        for (const item of payload.items) {
            await decrementProductStock(item.sku, item.quantity);
            updatedStocks.push({ sku: item.sku, quantity: item.quantity });
        }

        const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
        const discount = 0;
        const delivery = subtotal > 0 ? 250 : 0;
        const total = Math.max(subtotal - discount + delivery, 0);
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
    const limit = Number(query.limit) || 20;
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
    getMyOrdersFromDB,
    getSingleOrderForUserFromDB,
    getAllOrdersForAdminFromDB,
    updateOrderStatusIntoDB,
    getOrderByIdFromDB,
    updateOrderPaymentIntoDB,
};
