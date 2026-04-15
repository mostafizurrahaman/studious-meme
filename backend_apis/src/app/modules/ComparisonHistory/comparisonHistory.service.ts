import { AppError } from '../../utils';
import httpStatus from 'http-status';
import { ComparisonHistoryModel } from './comparisonHistory.model';
import { ProductModel } from '../Storefront/Product/product.model';

const getComparisonSuggestionsFromDB = async () => {
    return ProductModel.find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 }).limit(3).lean();
};

const compareProductsFromDB = async (skus: string[]) => {
    const selectedProducts = await ProductModel.find({ sku: { $in: skus }, isActive: true })
        .populate('brand')
        .populate('category')
        .populate('subCategory')
        .lean();

    if (selectedProducts.length < 2) {
        throw new AppError(httpStatus.BAD_REQUEST, 'At least two valid SKUs are required!');
    }

    const record = await ComparisonHistoryModel.create({
        skus,
        products: selectedProducts.map(product => ({
            title: product.title,
            brand: (product.brand as unknown as { name: string }).name,
            sku: product.sku,
            stock: product.stock,
            rating: product.rating,
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
            { label: 'Stock', values: selectedProducts.map(product => product.stock) },
            { label: 'Rating', values: selectedProducts.map(product => product.rating) },
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
