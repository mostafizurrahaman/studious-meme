import { Router } from 'express';
import { auth } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

router
    .route('/sslcommerz/init/:orderId')
    .post(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.initiateSslCommerzPayment);

router.route('/sslcommerz/success').post(PaymentController.sslCommerzSuccess).get(PaymentController.sslCommerzSuccess);
router.route('/sslcommerz/fail').post(PaymentController.sslCommerzFail).get(PaymentController.sslCommerzFail);
router.route('/sslcommerz/cancel').post(PaymentController.sslCommerzCancel).get(PaymentController.sslCommerzCancel);
router.route('/sslcommerz/ipn').post(PaymentController.sslCommerzSuccess);

router.route('/my-payments').get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.getMyPayments);
router.route('/admin').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), PaymentController.getAllPaymentsForAdmin);

export const PaymentRoutes = router;
