import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { AppError } from '../../utils';
import { IUser } from '../User/user.interface';
import { ProductModel } from '../Product/product.model';
import { WishlistHistoryModel } from './wishlistHistory.model';

const toObjectId = (value: string) => {
    if (!Types.ObjectId.isValid(value)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID!');
    }

    return new Types.ObjectId(value);
};

const getActiveProductSnapshot = async (productId: string) => {
    const product = await ProductModel.findOne({ _id: toObjectId(productId), isActive: true })
        .populate({ path: 'brand', match: { isActive: true } })
        .populate({ path: 'category', match: { isActive: true } })
        .lean();

    if (!product || !product.brand || !product.category) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    }

    return {
        product,
        snapshot: {
            title: product.title,
            brand: (product.brand as unknown as { name: string }).name,
            category: (product.category as unknown as { name: string }).name,
            image: product.image,
            sku: product.sku,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
        },
    };
};

const addWishlistItemIntoDB = async (user: IUser, productId: string) => {
    const { product, snapshot } = await getActiveProductSnapshot(productId);

    return WishlistHistoryModel.findOneAndUpdate(
        { user: user._id, product: product._id },
        { user: user._id, product: product._id, productSnapshot: snapshot },
        { upsert: true, new: true, runValidators: true },
    ).lean();
};

const removeWishlistItemFromDB = async (user: IUser, productId: string) => {
    await WishlistHistoryModel.findOneAndDelete({ user: user._id, product: toObjectId(productId) });
    return null;
};

const getMyWishlistFromDB = async (user: IUser) =>
    WishlistHistoryModel.find({ user: user._id })
        .populate('product')
        .sort({ updatedAt: -1 })
        .lean();

const getAllWishlistFromDB = async (query: Record<string, unknown>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        WishlistHistoryModel.find({})
            .populate('user', 'name email phone image role isActive')
            .populate('product')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        WishlistHistoryModel.countDocuments(),
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

export const WishlistHistoryService = {
    addWishlistItemIntoDB,
    removeWishlistItemFromDB,
    getMyWishlistFromDB,
    getAllWishlistFromDB,
};
