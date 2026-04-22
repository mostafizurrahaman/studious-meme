import { AppError } from '../../utils';
import httpStatus from 'http-status';
import { ComparisonHistoryModel } from './comparisonHistory.model';
import { ProductModel } from '../Product/product.model';
import { IUser } from '../User/user.interface';
import { BrandModel } from '../Brand/brand.model';
import { CategoryModel } from '../Category/category.model';

const getComparisonSuggestionsFromDB = async () => {
    const [activeBrandIds, activeCategoryIds] = await Promise.all([
        BrandModel.find({ isActive: true }).distinct('_id'),
        CategoryModel.find({ isActive: true }).distinct('_id'),
    ]);

    return ProductModel.find({
        isActive: true,
        isFeatured: true,
        brand: { $in: activeBrandIds },
        category: { $in: activeCategoryIds },
    })
        .populate('brand')
        .populate('category')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();
};

// 1. compareProductsFromDB
const compareProductsFromDB = async (user: IUser, IDs: string[]) => {
    const uniqueIDs = [...new Set(IDs)];

    if (uniqueIDs.length < 2) {
        throw new AppError(httpStatus.BAD_REQUEST, 'At least two valid IDs are required!');
    }

    const selectedProducts = await ProductModel.find({ _id: { $in: uniqueIDs }, isActive: true })
        .populate({ path: 'brand', match: { isActive: true } })
        .populate({ path: 'category', match: { isActive: true } })
        .lean();

    if (selectedProducts.length !== uniqueIDs.length || selectedProducts.some(product => !product.brand || !product.category)) {
        throw new AppError(httpStatus.NOT_FOUND, 'One or more products were not found or are inactive!');
    }

    const record = await ComparisonHistoryModel.create({
        user: user._id.toString(),
        IDs: uniqueIDs,
        products: selectedProducts.map(product => ({
            title: product.title,
            brand: (product.brand as unknown as { name: string }).name,
            category: (product.category as unknown as { name: string }).name,
            subCategorySlug: product.subCategorySlug,
            image: product.image,
            sku: product.sku,
            slug: product.slug,
            stock: product.stock,
            rating: product.rating,
            isFeatured: product.isFeatured,
            oldPrice: product.oldPrice,
        })),
    });

    return {
        record,
        comparison: selectedProducts,
        rows: [
            {
                label: 'Brand',
                values: selectedProducts.map(product => (product.brand as unknown as { name: string }).name),
            },
            { label: 'SKU', values: selectedProducts.map(product => product.sku) },
            { label: 'Title', values: selectedProducts.map(product => product.title) },
            { label: 'Slug', values: selectedProducts.map(product => product.slug) },
            { label: 'Image', values: selectedProducts.map(product => product.image) },
            {
                label: 'Category',
                values: selectedProducts.map(
                    product => (product.category as unknown as { name: string }).name,
                ),
            },
            { label: 'SubCategorySlug', values: selectedProducts.map(product => product.subCategorySlug) },
            { label: 'Stock', values: selectedProducts.map(product => product.stock) },
            { label: 'isFeatured', values: selectedProducts.map(product => product.isFeatured) },
            { label: 'Rating', values: selectedProducts.map(product => product.rating) },
            { label: 'Price', values: selectedProducts.map(product => product.price ?? '-') },
            { label: 'Old price', values: selectedProducts.map(product => product.oldPrice ?? '-') },
        ],
    };
};

// 2. getMyComparisonHistoryFromDB
const getMyComparisonHistoryFromDB = async (user: IUser) => {
    return ComparisonHistoryModel.find({ user: user._id.toString() }).sort({ createdAt: -1 }).lean();
};

// 3. getAllComparisonHistoryFromDB
const getAllComparisonHistoryFromDB = async (query: Record<string, unknown>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        ComparisonHistoryModel.find({})
            .populate('user', 'name email phone image role isActive')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        ComparisonHistoryModel.countDocuments(),
    ]);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
};

// 4. clearComparisonHistoryFromDB
const clearComparisonHistoryFromDB = async () => {
    await ComparisonHistoryModel.deleteMany({});
    return null;
};

export const ComparisonHistoryService = {
    getComparisonSuggestionsFromDB,
    compareProductsFromDB,
    getMyComparisonHistoryFromDB,
    getAllComparisonHistoryFromDB,
    clearComparisonHistoryFromDB,
};
