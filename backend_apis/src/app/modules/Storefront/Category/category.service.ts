import httpStatus from 'http-status';
import { AppError } from '../../../utils';
import { deleteImageFromCloudinary, sendImageToCloudinary } from '../../../lib';
import { CategoryModel } from './category.model';
import { ICategory, ISubCategoryItem } from './category.interface';
import { MulterFile } from '../../../lib/upload';

const createCategoryIntoDB = async (payload: Partial<ICategory>, imageFile?: MulterFile) => {
    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        return CategoryModel.create({ ...payload, image: uploadedImage ?? payload.image });
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};
const getAllCategoriesFromDB = async () => CategoryModel.find({}).sort({ createdAt: -1 }).lean();
const getCategoryBySlugFromDB = async (slug: string) => {
    const doc = await CategoryModel.findOne({ slug }).lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    return doc;
};
const updateCategoryIntoDB = async (slug: string, payload: Partial<ICategory>, imageFile?: MulterFile) => {
    const existingCategory = await CategoryModel.findOne({ slug }).select('image');

    if (!existingCategory) {
        return null;
    }

    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        const updated = await CategoryModel.findOneAndUpdate(
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

        if (uploadedImage && existingCategory.image && existingCategory.image !== uploadedImage) {
            await deleteImageFromCloudinary(existingCategory.image);
        }

        return updated;
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};
const deleteCategoryFromDB = async (slug: string) => CategoryModel.findOneAndDelete({ slug });

const createCategorySubCategoryIntoDB = async (
    categorySlug: string,
    subCategory: ISubCategoryItem,
    imageFile?: MulterFile,
) => {
    const category = await CategoryModel.findOne({ slug: categorySlug });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');

    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        category.subCategories.push({ ...subCategory, image: uploadedImage ?? subCategory.image });
        return category.save();
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};

const updateCategorySubCategoryIntoDB = async (
    categorySlug: string,
    subCategorySlug: string,
    payload: Partial<ISubCategoryItem>,
    imageFile?: MulterFile,
) => {
    const category = await CategoryModel.findOne({ slug: categorySlug });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    const item = category.subCategories.find(item => item.slug === subCategorySlug);
    if (!item) throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found!');

    const previousImage = item.image;
    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        Object.assign(item, payload, uploadedImage ? { image: uploadedImage } : {});
        const saved = await category.save();

        if (uploadedImage && previousImage && previousImage !== uploadedImage) {
            await deleteImageFromCloudinary(previousImage);
        }

        return saved;
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};

const deleteCategorySubCategoryFromDB = async (categorySlug: string, subCategorySlug: string) => {
    const category = await CategoryModel.findOne({ slug: categorySlug });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    const next = category.subCategories.filter(item => item.slug !== subCategorySlug);
    if (next.length === category.subCategories.length)
        throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found!');
    category.subCategories = next;
    return category.save();
};

export const CategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getCategoryBySlugFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
    createCategorySubCategoryIntoDB,
    updateCategorySubCategoryIntoDB,
    deleteCategorySubCategoryFromDB,
};
