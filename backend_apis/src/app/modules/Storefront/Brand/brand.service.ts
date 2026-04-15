import httpStatus from 'http-status';
import { AppError } from '../../../utils';
import { BrandModel } from './brand.model';
import { IBrand } from './brand.interface';

const createBrandIntoDB = async (payload: Partial<IBrand>) => BrandModel.create(payload);
const getAllBrandsFromDB = async () => BrandModel.find({}).sort({ createdAt: -1 }).lean();
const getBrandBySlugFromDB = async (slug: string) => {
    const doc = await BrandModel.findOne({ slug }).lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!');
    return doc;
};
const updateBrandIntoDB = async (slug: string, payload: Partial<IBrand>) =>
    BrandModel.findOneAndUpdate({ slug }, payload, { new: true, runValidators: true });
const deleteBrandFromDB = async (slug: string) => BrandModel.findOneAndDelete({ slug });

export const BrandService = {
    createBrandIntoDB,
    getAllBrandsFromDB,
    getBrandBySlugFromDB,
    updateBrandIntoDB,
    deleteBrandFromDB,
};
