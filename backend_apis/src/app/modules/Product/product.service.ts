import httpStatus from 'http-status';
import { AppError } from '../../utils';
import { deleteImageFromCloudinary, sendImageToCloudinary } from '../../lib';
import { ProductModel } from './product.model';
import { IProduct } from './product.interface';
import { CategoryModel } from '../Category/category.model';
import { MulterFile } from '../../lib/upload';
import { BrandModel } from '../Brand/brand.model';

type ProductSort = Record<string, 1 | -1>;

const DEFAULT_PRODUCTS_LIMIT = 100;

const normalizeSlug = (value: string) =>
    value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/["'’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

const parsePositiveInteger = (value: unknown, fallback: number) => {
    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const csv = (value: unknown) =>
    getString(value)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

const pickSort = (value: unknown): ProductSort => {
    switch (getString(value)) {
        case 'price-asc':
            return { price: 1, createdAt: -1 };
        case 'price-desc':
            return { price: -1, createdAt: -1 };
        case 'oldest':
            return { createdAt: 1 };
        case 'latest':
        default:
            return { createdAt: -1 };
    }
};

const buildProductFilters = async (query: Record<string, unknown>) => {
    const filter: Record<string, unknown> = {};
    const and: Record<string, unknown>[] = [];
    const searchTerm = getString(query.searchTerm);
    const categorySlug = getString(query.category || query.c);
    const subCategorySlug = getString(query.subCategorySlug || query.subCategory);
    const stock = getString(query.stock || query.s);
    const tag = getString(query.tag);
    const price = getString(query.price || query.p);
    const brandValues = csv(query.brand || query.b);
    const excludeSlug = getString(query.excludeSlug);

    filter.isActive = query.includeInactive === 'true' ? undefined : true;
    if (filter.isActive === undefined) delete filter.isActive;

    if (searchTerm) {
        and.push({
            $or: ['title', 'sku', 'slug', 'badge'].map(field => ({
                [field]: { $regex: escapeRegExp(searchTerm), $options: 'i' },
            })),
        });
    }

    if (categorySlug) {
        const category = await CategoryModel.findOne({
            $or: [
                { slug: categorySlug },
                { name: { $regex: `^${escapeRegExp(categorySlug)}$`, $options: 'i' } },
            ],
        })
            .select('_id')
            .lean();
        if (!category) {
            filter.category = null;
        } else {
            filter.category = category._id;
        }
    }

    if (subCategorySlug) {
        filter.subCategorySlug = subCategorySlug;
    }

    if (brandValues.length > 0) {
        const brands = await BrandModel.find({
            $or: [
                { slug: { $in: brandValues } },
                { name: { $in: brandValues } },
                ...brandValues.map(value => ({
                    name: { $regex: `^${escapeRegExp(value)}$`, $options: 'i' },
                })),
            ],
        })
            .select('_id')
            .lean();

        filter.brand = brands.length ? { $in: brands.map(brand => brand._id) } : null;
    }

    if (stock === 'in-stock') {
        filter.stock = { $gt: 0 };
    }

    if (price === 'under-10000') {
        filter.price = { $lt: 10000 };
    } else if (price === '10000-50000') {
        filter.price = { $gte: 10000, $lt: 50000 };
    } else if (price === '50000-plus') {
        filter.price = { $gte: 50000 };
    }

    if (stock === 'featured' || tag === 'featured') {
        and.push({
            $or: [{ isFeatured: true }, { badge: { $regex: 'featured', $options: 'i' } }],
        });
    }

    if (stock === 'sale' || tag === 'sale') {
        and.push({
            $or: [{ oldPrice: { $exists: true, $ne: null } }, { badge: { $regex: 'sale|%', $options: 'i' } }],
        });
    }

    if (tag === 'latest') {
        and.push({
            $or: [{ badge: { $exists: false } }, { badge: { $not: /old/i } }],
        });
    }

    if (tag === 'industrial' || tag === 'home') {
        const pattern =
            tag === 'industrial' ? /tool|machine|industrial|welding|cutting/i : /home|fan|cleaning|cooler/i;
        if (!filter.category) {
            const categories = await CategoryModel.find({ name: pattern }).select('_id').lean();
            filter.category = { $in: categories.map(category => category._id) };
        }
    }

    if (and.length > 0) {
        filter.$and = and;
    }

    if (excludeSlug) {
        filter.slug = { $ne: excludeSlug };
    }

    return filter;
};

// 1. createProductIntoDB
const createProductIntoDB = async (payload: Partial<IProduct>, imageFile?: MulterFile) => {
    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        return ProductModel.create({
            ...payload,
            slug: normalizeSlug(String(payload.slug ?? payload.title ?? '')),
            image: uploadedImage ?? payload.image,
        });
    } catch (error) {
        if (uploadedImage) {
            await deleteImageFromCloudinary(uploadedImage);
        }

        throw error;
    }
};

// 2. getAllProductsFromDB
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
    const page = parsePositiveInteger(query.page, 1);
    const limit = parsePositiveInteger(query.limit, DEFAULT_PRODUCTS_LIMIT);
    const skip = (page - 1) * limit;
    const filter = await buildProductFilters(query);
    const sort = pickSort(query.sort);

    const [data, total] = await Promise.all([
        ProductModel.find(filter)
            .populate('brand')
            .populate('category')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        ProductModel.countDocuments(filter),
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

// 3. getAllActiveProductsFromDB
const getAllActiveProductsFromDB = async (query: Record<string, unknown>) =>
    getAllProductsFromDB({ ...query, includeInactive: undefined });

// 4. getProductBySlugFromDB
const getProductBySlugFromDB = async (slug: string) => {
    const doc = await ProductModel.findOne({ slug }).populate('brand').populate('category').lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    return doc;
};

// 5. getActiveProductBySlugFromDB
const getActiveProductBySlugFromDB = async (slug: string) => {
    const doc = await ProductModel.findOne({ slug, isActive: true }).populate('brand').populate('category').lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    return doc;
};

// 4. updateProductIntoDB
const updateProductIntoDB = async (slug: string, payload: Partial<IProduct>, imageFile?: MulterFile) => {
    const existingProduct = await ProductModel.findOne({ slug }).select('image');

    if (!existingProduct) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    }

    let uploadedImage: string | undefined;

    try {
        if (imageFile) {
            const { secure_url } = await sendImageToCloudinary(imageFile);
            uploadedImage = secure_url;
        }

        const updated = await ProductModel.findOneAndUpdate(
            { slug },
            {
                ...payload,
                slug: payload.slug ? normalizeSlug(String(payload.slug)) : payload.slug,
                ...(uploadedImage ? { image: uploadedImage } : {}),
            },
            { returnDocument: 'after', runValidators: true },
        );

        if (!updated) {
            if (uploadedImage) {
                await deleteImageFromCloudinary(uploadedImage);
            }
            throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
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

// 5. deleteProductFromDB
const deleteProductFromDB = async (slug: string) => {
    const product = await ProductModel.findOneAndDelete({ slug });
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    }
    return product;
};

// 6. getProductsByCategorySlugFromDB
const getProductsByCategorySlugFromDB = async (slug: string, query: Record<string, unknown> = {}) => {
    const category = await CategoryModel.findOne({ slug, isActive: true }).lean();
    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
    }
    return getAllProductsFromDB({ ...query, c: slug });
};

// 7. getProductsBySubCategorySlugFromDB
const getProductsBySubCategorySlugFromDB = async (
    subCategorySlug: string,
    query: Record<string, unknown> = {},
) => getAllProductsFromDB({ ...query, subCategorySlug });

// // 7. getProductsBySubCategorySlugFromDB
// const getProductsBySubCategorySlugFromDB = async (subCategorySlug: string) => {
//     // find category that contains this subcategory
//     const category = await CategoryModel.findOne({
//         'subCategories.slug': subCategorySlug,
//         isActive: true,
//     }).lean();

//     if (!category) {
//         throw new AppError(httpStatus.NOT_FOUND, 'SubCategory not found!');
//     }

//     // find the exact subcategory object
//     const subCategory = category.subCategories.find(sc => sc.slug === subCategorySlug && sc.isActive);

//     if (!subCategory) {
//         throw new AppError(httpStatus.NOT_FOUND, 'SubCategory not active!');
//     }

//     // now query products using slug (NOT _id)
//     return ProductModel.find({ subCategorySlug, isActive: true })
//         .populate('brand')
//         .populate('category')
//         .lean();
// };

export const ProductService = {
    createProductIntoDB,
    getAllProductsFromDB,
    getAllActiveProductsFromDB,
    getProductBySlugFromDB,
    getActiveProductBySlugFromDB,
    updateProductIntoDB,
    deleteProductFromDB,
    getProductsByCategorySlugFromDB,
    getProductsBySubCategorySlugFromDB,
};
