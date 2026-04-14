import httpStatus from 'http-status';
import { asyncHandler, sendResponse } from '../../utils';
import { PaymentService } from './payment.service';

// createPremiumCheckout
const createPremiumCheckout = asyncHandler(async (req, res) => {
    const result = await PaymentService.createPremiumCheckoutSession(req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Checkout session created successfully!',
        data: result,
    });
});

// stripeWebhook
const stripeWebhook = asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'];
    const rawBody: Buffer = (req as { rawBody?: Buffer }).rawBody!;

    const result = await PaymentService.handleStripeWebhook(signature, rawBody);

    res.status(httpStatus.OK).json(result);
});

// getMyCurrentStatus
const getMyCurrentStatus = asyncHandler(async (req, res) => {
    const result = await PaymentService.getMyCurrentStatus(req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payment status retrieved successfully!',
        data: result,
    });
});

// getAllPaymentsForAdmin
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
    createPremiumCheckout,
    stripeWebhook,
    getMyCurrentStatus,
    getAllPaymentsForAdmin,
};
