import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { WishlistHistoryController } from './wishlistHistory.controller';
import { WishlistHistoryValidation } from './wishlistHistory.validation';

const router = Router();

router
    .route('/')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), WishlistHistoryController.getMyWishlist)
    .post(
        auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(WishlistHistoryValidation.wishlistProductSchema),
        WishlistHistoryController.addWishlistItem,
    );

router
    .route('/admin')
    .get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), WishlistHistoryController.getAllWishlist);

router
    .route('/:productId')
    .delete(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), WishlistHistoryController.removeWishlistItem);

export const WishlistHistoryRoutes = router;
