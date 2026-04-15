import { Router } from 'express';
import { auth, validateRequestFromFormData } from '../../../middlewares';
import { multerUpload } from '../../../lib';
import { ROLE } from '../../User/user.constant';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = Router();

// 1. createProduct
router
    .route('/products')
    .post(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(ProductValidation.productCreateSchema),
        ProductController.createProduct,
    )
    .get(ProductController.getAllProducts);

// 2. getProduct, updateProduct, deleteProduct
router
    .route('/products/:slug')
    .get(ProductController.getProduct)
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(ProductValidation.productUpdateSchema),
        ProductController.updateProduct,
    )
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), ProductController.deleteProduct);

// 3. getProductsByCategorySlug
router.route('/products/by-category/:slug').get(ProductController.getProductsByCategorySlug);
// 4. getProductsBySubCategorySlug
router.route('/products/by-sub-category/:subCategorySlug').get(ProductController.getProductsBySubCategorySlug);

export const ProductRoutes = router;
