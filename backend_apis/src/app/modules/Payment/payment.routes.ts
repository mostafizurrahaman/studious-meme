import { Router } from 'express';
import { actionLimiter, adminLimiter, auth, burstProtection, duplicateSubmissionGuard, paymentLimiter, paymentWebhookGuard, publicLimiter } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

router
    .route('/sslcommerz/init/:orderId')
    .post(
        auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
        paymentLimiter,
        burstProtection('payment', 10_000, 8),
        duplicateSubmissionGuard(),
        PaymentController.initiateSslCommerzPayment,
    );

router
    .route('/sslcommerz/success')
    .post(publicLimiter, PaymentController.sslCommerzSuccess)
    .get(publicLimiter, PaymentController.sslCommerzSuccess);

router.route('/sslcommerz/fail').post(publicLimiter, PaymentController.sslCommerzFail).get(publicLimiter, PaymentController.sslCommerzFail);

router
    .route('/sslcommerz/cancel')
    .post(publicLimiter, PaymentController.sslCommerzCancel)
    .get(publicLimiter, PaymentController.sslCommerzCancel);

router.route('/sslcommerz/ipn').post(paymentWebhookGuard, PaymentController.sslCommerzSuccess);

router
    .route('/my-payments')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), actionLimiter, PaymentController.getMyPayments);

router.route('/admin').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), adminLimiter, PaymentController.getAllPaymentsForAdmin);

export const PaymentRoutes = router;
