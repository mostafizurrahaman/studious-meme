import { Router } from 'express';
import { AdminController } from './admin.controller';
import { auth, validateRequest, validateRequestFromFormData } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { multerUpload } from '../../lib';
import { AdminProductValidation } from './admin.validation';

const router = Router();

// 1. adminGetAllDashboardMetaData
// router
//   .route('/meta-data')
//   .get(
//     auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
//     AdminController.adminGetAllDashboardMetaData,
//   );

// 2. updateNewsStatus
// router
//   .route('/news/status')
//   .patch(
//     auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
//     AdminController.updateNewsStatus
//   );

// 3. getAllAdmins
router.route('/users').get(auth(ROLE.SUPER_ADMIN), AdminController.getAllAdmins);

// 3.1 adminCreateAccount
router
    .route('/accounts')
    .post(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(AdminProductValidation.createAccountSchema),
        AdminController.adminCreateAccount,
    );

// 3.2 adminUpdateAccount
router
    .route('/accounts/:userId')
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(AdminProductValidation.updateAccountSchema),
        AdminController.adminUpdateAccount,
    );

// 4. changeSpecificUserIsActiveStatus
router
    .route('/user-isactive-status-change/:userId')
    .patch(auth(ROLE.SUPER_ADMIN), AdminController.changeSpecificUserIsActiveStatus);

// 5. getUniqueProductCategories (for creating grocery list)
router
    .route('/products/categories')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getUniqueProductCategories);

// 6. getUniqueProductNames
router
    .route('/products/names')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getUniqueProductNames);

// 7. getUniqueProductCategoriesAndNames (for search keyword suggestion)
router
    .route('/products/categories-and-names')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getUniqueProductCategoriesAndNames);

// 8. getProductsAvailableInAtLeastTwoShops
router
    .route('/products/minimum-two-shops')
    .get(
        auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
        AdminController.getProductsAvailableInAtLeastTwoShops,
    );

// 9. updateProductCategoryImage
router
    .route('/products/category-image')
    .post(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(AdminProductValidation.updateCategoryImage),
        AdminController.updateProductCategoryImage,
    );

// 10. getAllShops
router.route('/shops').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), AdminController.getAllShops);

// 11. updateShopLocation
router
    .route('/shops/:shopId/location')
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(AdminProductValidation.updateShopLocationSchema),
        AdminController.updateShopLocation,
    );

export const AdminRoutes = router;
