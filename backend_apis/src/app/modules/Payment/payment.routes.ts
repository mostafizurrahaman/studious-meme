import { Router } from 'express';
import { auth } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

// 1. createPremiumCheckout
router
    .route('/premium/checkout')
    .post(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.createPremiumCheckout);

// 2. stripeWebhook
router.route('/webhook').post(PaymentController.stripeWebhook);

// 3. getMyCurrentStatus
router
    .route('/status')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.getMyCurrentStatus);

// 4. getAllPaymentsForAdmin
router.route('/admin').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.getAllPaymentsForAdmin);

export const PaymentRoutes = router;
