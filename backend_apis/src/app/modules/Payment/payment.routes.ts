import { Router } from 'express';
import { auth } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

// createPremiumCheckout
router
    .route('/premium/checkout')
    .post(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.createPremiumCheckout);

// stripeWebhook
router.route('/webhook').post(PaymentController.stripeWebhook);

// getMyCurrentStatus
router
    .route('/status')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.getMyCurrentStatus);

// getAllPaymentsForAdmin
router.route('/admin').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.getAllPaymentsForAdmin);

export const PaymentRoutes = router;
