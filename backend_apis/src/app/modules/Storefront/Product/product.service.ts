import httpStatus from 'http-status';
import { AppError } from '../../../utils';
import { deleteImageFromCloudinary, sendImageToCloudinary } from '../../../lib';
import { ProductModel } from './product.model';
import { IProduct } from './product.interface';
import { CategoryModel } from '../Category/category.model';
import { MulterFile } from '../../../lib/upload';

const createProductIntoDB = async (payload: Partial<IProduct>, imageFile?: MulterFile) => {
    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        return ProductModel.create({ ...payload, image: uploadedImage ?? payload.image });
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};
const getAllProductsFromDB = async () =>
    ProductModel.find({}).populate('brand').populate('category').sort({ createdAt: -1 }).lean();
const getProductBySlugFromDB = async (slug: string) => {
    const doc = await ProductModel.findOne({ slug }).populate('brand').populate('category').lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    return doc;
};
const updateProductIntoDB = async (slug: string, payload: Partial<IProduct>, imageFile?: MulterFile) => {
    const existingProduct = await ProductModel.findOne({ slug }).select('image');

    if (!existingProduct) {
        return null;
    }

    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        const updated = await ProductModel.findOneAndUpdate(
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

        if (uploadedImage && existingProduct.image && existingProduct.image !== uploadedImage) {
            await deleteImageFromCloudinary(existingProduct.image);
        }

        return updated;
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};
const deleteProductFromDB = async (slug: string) => ProductModel.findOneAndDelete({ slug });

const getProductsByCategorySlugFromDB = async (slug: string) => {
    const category = await CategoryModel.findOne({ slug, isActive: true }).lean();
    if (!category) return [];
    return ProductModel.find({ category: category._id, isActive: true })
        .populate('brand')
        .populate('category')
        .lean();
};

const getProductsBySubCategorySlugFromDB = async (subCategorySlug: string) =>
    ProductModel.find({ subCategorySlug, isActive: true }).populate('brand').populate('category').lean();

export const ProductService = {
    createProductIntoDB,
    getAllProductsFromDB,
    getProductBySlugFromDB,
    updateProductIntoDB,
    deleteProductFromDB,
    getProductsByCategorySlugFromDB,
    getProductsBySubCategorySlugFromDB,
};
