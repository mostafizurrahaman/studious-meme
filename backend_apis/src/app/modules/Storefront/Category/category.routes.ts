import { Router } from 'express';
import { auth, validateRequest } from '../../../middlewares';
import { ROLE } from '../../User/user.constant';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = Router();

router
    .route('/categories')
    .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(CategoryValidation.categoryCreateSchema), CategoryController.createCategory)
    .get(CategoryController.getAllCategories);

router
    .route('/categories/:slug')
    .get(CategoryController.getCategory)
    .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(CategoryValidation.categoryUpdateSchema), CategoryController.updateCategory)
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), CategoryController.deleteCategory);

router
    .route('/categories/:slug/sub-categories')
    .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(CategoryValidation.categorySubCategoryCreateSchema), CategoryController.createCategorySubCategory);

router
    .route('/categories/:slug/sub-categories/:subCategorySlug')
    .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(CategoryValidation.categorySubCategoryUpdateSchema), CategoryController.updateCategorySubCategory)
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), CategoryController.deleteCategorySubCategory);

export const CategoryRoutes = router;
