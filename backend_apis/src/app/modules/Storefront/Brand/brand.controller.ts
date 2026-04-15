import httpStatus from 'http-status';
import { AppError, asyncHandler, sendResponse } from '../../../utils';
import { BrandService } from './brand.service';

const getParam = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

const createBrand = asyncHandler(async (req, res) => {
    const result = await BrandService.createBrandIntoDB(req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, message: 'Brand created successfully!', data: result });
});

const getAllBrands = asyncHandler(async (_req, res) => {
    const result = await BrandService.getAllBrandsFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Brands fetched successfully!', data: result });
});

const getBrand = asyncHandler(async (req, res) => {
    const result = await BrandService.getBrandBySlugFromDB(getParam(req.params.slug));
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Brand fetched successfully!', data: result });
});

const updateBrand = asyncHandler(async (req, res) => {
    const result = await BrandService.updateBrandIntoDB(getParam(req.params.slug), req.body);
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Brand updated successfully!', data: result });
});

const deleteBrand = asyncHandler(async (req, res) => {
    const result = await BrandService.deleteBrandFromDB(getParam(req.params.slug));
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Brand deleted successfully!', data: result });
});

export const BrandController = { createBrand, getAllBrands, getBrand, updateBrand, deleteBrand };
