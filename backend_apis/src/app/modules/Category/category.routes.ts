import { Router } from 'express';
import { auth, validateRequestFromFormData } from '../../middlewares';
import { multerUpload } from '../../lib';
import { ROLE } from '../User/user.constant';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';

const router = Router();

// 1. createCategory
router
    .route('/categories')
    .post(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(CategoryValidation.categoryCreateSchema),
        CategoryController.createCategory,
    )
    .get(CategoryController.getAllCategories);

// 2. public active categories
router.route('/categories/active').get(CategoryController.getActiveCategories);
router.route('/categories/active/:slug').get(CategoryController.getActiveCategory);

// 2. getCategory, updateCategory, deleteCategory
router
    .route('/categories/:slug')
    .get(CategoryController.getCategory)
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(CategoryValidation.categoryUpdateSchema),
        CategoryController.updateCategory,
    )
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), CategoryController.deleteCategory);

// 3. createCategorySubCategory
router
    .route('/categories/:slug/sub-categories')
    .post(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(CategoryValidation.categorySubCategoryCreateSchema),
        CategoryController.createCategorySubCategory,
    );

// 4. updateCategorySubCategory, deleteCategorySubCategory
router
    .route('/categories/:slug/sub-categories/:subCategorySlug')
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(CategoryValidation.categorySubCategoryUpdateSchema),
        CategoryController.updateCategorySubCategory,
    )
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), CategoryController.deleteCategorySubCategory);

export const CategoryRoutes = router;
