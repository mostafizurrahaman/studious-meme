import httpStatus from 'http-status';
import { AppError } from '../../../utils';
import { deleteImageFromCloudinary, sendImageToCloudinary } from '../../../lib';
import { BrandModel } from './brand.model';
import { IBrand } from './brand.interface';
import { MulterFile } from '../../../lib/upload';

const createBrandIntoDB = async (payload: Partial<IBrand>, imageFile?: MulterFile) => {
    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        return BrandModel.create({ ...payload, image: uploadedImage ?? payload.image });
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};
const getAllBrandsFromDB = async () => BrandModel.find({}).sort({ createdAt: -1 }).lean();
const getBrandBySlugFromDB = async (slug: string) => {
    const doc = await BrandModel.findOne({ slug }).lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!');
    return doc;
};
const updateBrandIntoDB = async (slug: string, payload: Partial<IBrand>, imageFile?: MulterFile) => {
    const existingBrand = await BrandModel.findOne({ slug }).select('image');

    if (!existingBrand) {
        return null;
    }

    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        const updated = await BrandModel.findOneAndUpdate(
            { slug },
            { ...payload, ...(uploadedImage ? { image: uploadedImage } : {}) },
            { new: true, runValidators: true },
        );

        if (!updated) {
            if (uploadedImage) {
                await deleteImageFromCloudinary(uploadedImage);
            }
            return null;
        }

        if (uploadedImage && existingBrand.image && existingBrand.image !== uploadedImage) {
            await deleteImageFromCloudinary(existingBrand.image);
        }

        return updated;
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};
const deleteBrandFromDB = async (slug: string) => BrandModel.findOneAndDelete({ slug });

export const BrandService = {
    createBrandIntoDB,
    getAllBrandsFromDB,
    getBrandBySlugFromDB,
    updateBrandIntoDB,
    deleteBrandFromDB,
};
