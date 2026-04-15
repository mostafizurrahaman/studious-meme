import httpStatus from 'http-status';
import { AppError } from '../../../utils';
import { ProductModel } from './product.model';
import { IProduct } from './product.interface';
import { CategoryModel } from '../Category/category.model';

const createProductIntoDB = async (payload: Partial<IProduct>) => ProductModel.create(payload);
const getAllProductsFromDB = async () =>
    ProductModel.find({}).populate('brand').populate('category').sort({ createdAt: -1 }).lean();
const getProductBySlugFromDB = async (slug: string) => {
    const doc = await ProductModel.findOne({ slug }).populate('brand').populate('category').lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    return doc;
};
const updateProductIntoDB = async (slug: string, payload: Partial<IProduct>) =>
    ProductModel.findOneAndUpdate({ slug }, payload, { new: true, runValidators: true });
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
