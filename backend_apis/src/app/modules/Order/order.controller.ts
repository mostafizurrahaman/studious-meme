import httpStatus from 'http-status';
import { asyncHandler, sendResponse } from '../../utils';
import { OrderService } from './order.service';

const getSingleParam = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

const createOrder = asyncHandler(async (req, res) => {
    const result = await OrderService.createOrderIntoDB(req.user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Order created successfully!',
        data: result,
    });
});

const getMyOrders = asyncHandler(async (req, res) => {
    const result = await OrderService.getMyOrdersFromDB(req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Orders fetched successfully!',
        data: result,
    });
});

const getMySingleOrder = asyncHandler(async (req, res) => {
    const result = await OrderService.getSingleOrderForUserFromDB(
        req.user,
        getSingleParam(req.params.orderId),
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Order fetched successfully!',
        data: result,
    });
});

const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
    const result = await OrderService.getAllOrdersForAdminFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Orders fetched successfully!',
        data: result.data,
        meta: result.meta,
    });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const result = await OrderService.updateOrderStatusIntoDB(
        getSingleParam(req.params.orderId),
        req.body.status,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Order status updated successfully!',
        data: result,
    });
});

export const OrderController = {
    createOrder,
    getMyOrders,
    getMySingleOrder,
    getAllOrdersForAdmin,
    updateOrderStatus,
};
