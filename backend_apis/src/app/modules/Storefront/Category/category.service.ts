import httpStatus from 'http-status';
import { AppError } from '../../../utils';
import { CategoryModel } from './category.model';
import { ICategory, ISubCategoryItem } from './category.interface';

const createCategoryIntoDB = async (payload: Partial<ICategory>) => CategoryModel.create(payload);
const getAllCategoriesFromDB = async () => CategoryModel.find({}).sort({ createdAt: -1 }).lean();
const getCategoryBySlugFromDB = async (slug: string) => {
    const doc = await CategoryModel.findOne({ slug }).lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    return doc;
};
const updateCategoryIntoDB = async (slug: string, payload: Partial<ICategory>) =>
    CategoryModel.findOneAndUpdate({ slug }, payload, { new: true, runValidators: true });
const deleteCategoryFromDB = async (slug: string) => CategoryModel.findOneAndDelete({ slug });

const createCategorySubCategoryIntoDB = async (categorySlug: string, subCategory: ISubCategoryItem) => {
    const category = await CategoryModel.findOne({ slug: categorySlug });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    category.subCategories.push(subCategory);
    return category.save();
};

const updateCategorySubCategoryIntoDB = async (
    categorySlug: string,
    subCategorySlug: string,
    payload: Partial<ISubCategoryItem>,
) => {
    const category = await CategoryModel.findOne({ slug: categorySlug });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    const item = category.subCategories.find(item => item.slug === subCategorySlug);
    if (!item) throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found!');
    Object.assign(item, payload);
    return category.save();
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
