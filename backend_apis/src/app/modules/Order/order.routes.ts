import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = Router();

router
    .route('/orders')
    .post(
        auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(OrderValidation.createOrderSchema),
        OrderController.createOrder,
    );

router.route('/my-orders').get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), OrderController.getMyOrders);

router
    .route('/my-orders/:orderId')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), OrderController.getMySingleOrder);

router.route('/admin/orders').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), OrderController.getAllOrdersForAdmin);

router
    .route('/admin/orders/:orderId/status')
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(OrderValidation.updateOrderStatusSchema),
        OrderController.updateOrderStatus,
    );

export const OrderRoutes = router;
