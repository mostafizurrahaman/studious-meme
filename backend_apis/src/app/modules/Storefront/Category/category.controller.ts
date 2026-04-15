import httpStatus from 'http-status';
import { AppError, asyncHandler, sendResponse } from '../../../utils';
import { CategoryService } from './category.service';

const getParam = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

const createCategory = asyncHandler(async (req, res) => {
    const result = await CategoryService.createCategoryIntoDB(req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, message: 'Category created successfully!', data: result });
});

const getAllCategories = asyncHandler(async (_req, res) => {
    const result = await CategoryService.getAllCategoriesFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Categories fetched successfully!', data: result });
});

const getCategory = asyncHandler(async (req, res) => {
    const result = await CategoryService.getCategoryBySlugFromDB(getParam(req.params.slug));
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Category fetched successfully!', data: result });
});

const updateCategory = asyncHandler(async (req, res) => {
    const result = await CategoryService.updateCategoryIntoDB(getParam(req.params.slug), req.body);
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Category updated successfully!', data: result });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const result = await CategoryService.deleteCategoryFromDB(getParam(req.params.slug));
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Category deleted successfully!', data: result });
});

const createCategorySubCategory = asyncHandler(async (req, res) => {
    const result = await CategoryService.createCategorySubCategoryIntoDB(getParam(req.params.slug), req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, message: 'Subcategory created successfully!', data: result });
});

const updateCategorySubCategory = asyncHandler(async (req, res) => {
    const result = await CategoryService.updateCategorySubCategoryIntoDB(getParam(req.params.slug), getParam(req.params.subCategorySlug), req.body);
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Subcategory updated successfully!', data: result });
});

const deleteCategorySubCategory = asyncHandler(async (req, res) => {
    const result = await CategoryService.deleteCategorySubCategoryFromDB(getParam(req.params.slug), getParam(req.params.subCategorySlug));
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Subcategory deleted successfully!', data: result });
});

export const CategoryController = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    createCategorySubCategory,
    updateCategorySubCategory,
    deleteCategorySubCategory,
};
