import httpStatus from 'http-status';
import { AppError, asyncHandler, sendResponse } from '../../../utils';
import { ProductService } from './product.service';

const getParam = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

const createProduct = asyncHandler(async (req, res) => {
    const result = await ProductService.createProductIntoDB(req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, message: 'Product created successfully!', data: result });
});

const getAllProducts = asyncHandler(async (_req, res) => {
    const result = await ProductService.getAllProductsFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Products fetched successfully!', data: result });
});

const getProduct = asyncHandler(async (req, res) => {
    const result = await ProductService.getProductBySlugFromDB(getParam(req.params.slug));
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Product fetched successfully!', data: result });
});

const updateProduct = asyncHandler(async (req, res) => {
    const result = await ProductService.updateProductIntoDB(getParam(req.params.slug), req.body);
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Product updated successfully!', data: result });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const result = await ProductService.deleteProductFromDB(getParam(req.params.slug));
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Product deleted successfully!', data: result });
});

const getProductsByCategorySlug = asyncHandler(async (req, res) => {
    const result = await ProductService.getProductsByCategorySlugFromDB(getParam(req.params.slug));
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Products fetched successfully!', data: result });
});

const getProductsBySubCategorySlug = asyncHandler(async (req, res) => {
    const result = await ProductService.getProductsBySubCategorySlugFromDB(getParam(req.params.subCategorySlug));
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Products fetched successfully!', data: result });
});

export const ProductController = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategorySlug,
    getProductsBySubCategorySlug,
};
