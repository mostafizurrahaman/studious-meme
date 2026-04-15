import { Router } from 'express';
import { auth, validateRequestFromFormData } from '../../../middlewares';
import { multerUpload } from '../../../lib';
import { ROLE } from '../../User/user.constant';
import { BrandController } from './brand.controller';
import { BrandValidation } from './brand.validation';

const router = Router();

// 1. createBrand
router
    .route('/brands')
    .post(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(BrandValidation.brandCreateSchema),
        BrandController.createBrand,
    )
    .get(BrandController.getAllBrands);

// 2. getBrand, updateBrand, deleteBrand
router
    .route('/brands/:slug')
    .get(BrandController.getBrand)
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(BrandValidation.brandUpdateSchema),
        BrandController.updateBrand,
    )
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), BrandController.deleteBrand);

export const BrandRoutes = router;
