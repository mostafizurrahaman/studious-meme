import { Router } from 'express';
import { auth, validateRequest } from '../../../middlewares';
import { ROLE } from '../../User/user.constant';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = Router();

router
    .route('/products')
    .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(ProductValidation.productCreateSchema), ProductController.createProduct)
    .get(ProductController.getAllProducts);

router
    .route('/products/:slug')
    .get(ProductController.getProduct)
    .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(ProductValidation.productUpdateSchema), ProductController.updateProduct)
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), ProductController.deleteProduct);

router.route('/products/by-category/:slug').get(ProductController.getProductsByCategorySlug);
router.route('/products/by-sub-category/:subCategorySlug').get(ProductController.getProductsBySubCategorySlug);

export const ProductRoutes = router;
