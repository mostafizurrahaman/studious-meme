import { Router } from 'express';
import { actionLimiter, adminLimiter, auth, burstProtection, duplicateSubmissionGuard, paymentWebhookGuard, publicLimiter } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

router
    .route('/portpos/init/:orderId')
    .post(
        auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
        actionLimiter,
        burstProtection('payment', 10_000, 8),
        duplicateSubmissionGuard(),
        PaymentController.initiatePortPosPayment,
    );

router
    .route('/portpos/ipn')
    .post(paymentWebhookGuard, PaymentController.portPosIpn);

router
    .route('/portpos/verify/:orderId')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), publicLimiter, PaymentController.verifyPortPosPayment);

router
    .route('/portpos/refund/:orderId')
    .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), adminLimiter, PaymentController.refundPortPosPayment);

router
    .route('/my-payments')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), actionLimiter, PaymentController.getMyPayments);

router.route('/admin').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), adminLimiter, PaymentController.getAllPaymentsForAdmin);

export const PaymentRoutes = router;
