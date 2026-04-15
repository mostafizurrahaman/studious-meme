import { Router } from 'express';
import { auth, validateRequest } from '../../../middlewares';
import { ROLE } from '../../User/user.constant';
import { BrandController } from './brand.controller';
import { StorefrontValidation } from '../storefront.validation';

const router = Router();

router
    .route('/brands')
    .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(StorefrontValidation.brandCreateSchema), BrandController.createBrand)
    .get(BrandController.getAllBrands);

router
    .route('/brands/:slug')
    .get(BrandController.getBrand)
    .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(StorefrontValidation.brandUpdateSchema), BrandController.updateBrand)
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), BrandController.deleteBrand);

export const BrandRoutes = router;
