import httpStatus from 'http-status';
import { asyncHandler, sendResponse } from '../../utils';
import { PaymentService } from './payment.service';

const getSingleParam = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

const initiateSslCommerzPayment = asyncHandler(async (req, res) => {
    const result = await PaymentService.initiateSslCommerzPayment(
        req.user,
        getSingleParam(req.params.orderId),
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'SSLCommerz session created successfully!',
        data: result,
    });
});

const sslCommerzSuccess = asyncHandler(async (req, res) => {
    const redirectUrl = await PaymentService.handleSslCommerzSuccess({
        ...req.query,
        ...req.body,
    });

    res.redirect(redirectUrl);
});

const sslCommerzFail = asyncHandler(async (req, res) => {
    const redirectUrl = await PaymentService.handleSslCommerzFailure(
        {
            ...req.query,
            ...req.body,
        },
        'FAILED',
    );

    res.redirect(redirectUrl);
});

const sslCommerzCancel = asyncHandler(async (req, res) => {
    const redirectUrl = await PaymentService.handleSslCommerzFailure(
        {
            ...req.query,
            ...req.body,
        },
        'CANCELED',
    );

    res.redirect(redirectUrl);
});

const getMyPayments = asyncHandler(async (req, res) => {
    const result = await PaymentService.getMyPaymentsFromDB(req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payments retrieved successfully!',
        data: result,
    });
});

const getAllPaymentsForAdmin = asyncHandler(async (req, res) => {
    const result = await PaymentService.getAllPaymentsForAdminFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payments retrieved successfully!',
        data: result.data,
        meta: result.meta,
        summary: result.summary,
    });
});

export const PaymentController = {
    initiateSslCommerzPayment,
    sslCommerzSuccess,
    sslCommerzFail,
    sslCommerzCancel,
    getMyPayments,
    getAllPaymentsForAdmin,
};
