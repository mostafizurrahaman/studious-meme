import { AppError } from '../../utils';
import httpStatus from 'http-status';
import { ComparisonHistoryModel } from './comparisonHistory.model';
import { ProductModel } from '../Product/product.model';

const getComparisonSuggestionsFromDB = async () => {
    return ProductModel.find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 }).limit(3).lean();
};

const compareProductsFromDB = async (IDs: string[]) => {
    if (IDs.length < 2) {
        throw new AppError(httpStatus.BAD_REQUEST, 'At least two valid IDs are required!');
    }

    const selectedProducts = await ProductModel.find({ _id: { $in: IDs }, isActive: true })
        .populate('brand')
        .populate('category')
        .populate('subCategory')
        .lean();

    const record = await ComparisonHistoryModel.create({
        IDs,
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
            {
                label: 'Brand',
                values: selectedProducts.map(product => (product.brand as unknown as { name: string }).name),
            },
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

const getComparisonHistoryFromDB = async () => {
    return ComparisonHistoryModel.find({}).sort({ createdAt: -1 }).lean();
};

const clearComparisonHistoryFromDB = async () => {
    await ComparisonHistoryModel.deleteMany({});
    return null;
};

export const ComparisonHistoryService = {
    getComparisonSuggestionsFromDB,
    compareProductsFromDB,
    getComparisonHistoryFromDB,
    clearComparisonHistoryFromDB,
};
