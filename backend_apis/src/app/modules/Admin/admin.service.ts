import { AppError } from '../../utils';
import { ROLE } from '../User/user.constant';
import { OTP_EXPIRY_MINUTES } from '../User/user.constant';
import UserModel from '../User/user.model';
import httpStatus from 'http-status';
import { ProductPriceModel, ShopModel } from '../Product/product.model';
import { deleteImageFromCloudinary, sendImageToCloudinary } from '../../lib';
import { generateOtp } from '../../lib';
import { MulterFile } from '../../lib/upload';
import { PipelineStage } from 'mongoose';

// 1. adminGetAllDashboardMetaDataFromDB (dashboard meta aggregation)
// const adminGetAllDashboardMetaDataFromDB = async () => {
//   const now = new Date();
//   const last30Start = new Date(now);
//   last30Start.setDate(now.getDate() - 30);
//   const prev30Start = new Date(last30Start);
//   prev30Start.setDate(prev30Start.getDate() - 30);

//   const [totalVisitorAgg, visitorAgg, visitorLast30Agg, visitorPrev30Agg] =
//     await Promise.all([
//       // total visitors (tracked visits, summed by visitCount)
//       VisitorModel.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalVisits: { $sum: '$visitCount' },
//           },
//         },
//       ]),

//       // month-based visitor overview
//       VisitorModel.aggregate([
//         {
//           $group: {
//             _id: {
//               year: { $year: '$createdAt' },
//               month: { $month: '$createdAt' },
//             },
//             // sum visitCount to reflect total visits for that month
//             count: { $sum: '$visitCount' },
//           },
//         },
//         { $sort: { '_id.year': 1, '_id.month': 1 } },
//       ]),

//       // visitors: last 30 days total visits
//       VisitorModel.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: last30Start, $lt: now },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalVisits: { $sum: '$visitCount' },
//           },
//         },
//       ]),

//       // visitors: previous 30 days total visits
//       VisitorModel.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: prev30Start, $lt: last30Start },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalVisits: { $sum: '$visitCount' },
//           },
//         },
//       ]),
//     ]);

//   const MONTH_LABELS = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sep',
//     'Oct',
//     'Nov',
//     'Dec',
//   ];

//   const totalVisitor =
//     (totalVisitorAgg[0] && totalVisitorAgg[0].totalVisits) || 0;

//   const visitorLast30 =
//     (visitorLast30Agg[0] && visitorLast30Agg[0].totalVisits) || 0;
//   const visitorPrev30 =
//     (visitorPrev30Agg[0] && visitorPrev30Agg[0].totalVisits) || 0;

//   const visitorGrowthPercentChange =
//     visitorPrev30 === 0
//       ? visitorLast30 > 0
//         ? 100
//         : 0
//       : ((visitorLast30 - visitorPrev30) / visitorPrev30) * 100;

//   const visitorMonthBasedOverview = visitorAgg.map((item) => {
//     const year = item._id.year as number;
//     const monthIndex = (item._id.month as number) - 1;
//     const month = MONTH_LABELS[monthIndex] || `${item._id.month}`;

//     return {
//       year,
//       month,
//       count: item.count as number,
//     };
//   });

//   return {
//     visitorData: {
//       totalVisitor,
//       visitorGrowthPercentChange,
//     },

//     visitorMonthBasedOverview,
//   };
// };

// 2. updateNewsStatusFromDB
// const updateNewsStatusFromDB = async (
//   payload: {
//     newsId: string;
//     isActive: boolean;
//   },
//   userData: IUser,
// ) => {
//   const { newsId, isActive } = payload;

//   const news = await NewsModel.findById(newsId);

//   if (!news) {
//     throw new AppError(httpStatus.NOT_FOUND, 'News not found!');
//   }

//   if (
//     userData.role === ROLE.USER &&
//     userData._id.toString() !== news.owner.toString()
//   ) {
//     throw new AppError(httpStatus.BAD_REQUEST, "You don't have the access to edit the news!");
//   }

//   const updateNews = await NewsModel.findByIdAndUpdate(newsId, { isActive });

//   return updateNews;
// };

// 3. getAllAdminsFromDB
const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
    const {
        searchTerm,
        page: pageQuery,
        limit: limitQuery,
        sort: sortQuery,
        ...rawFilters
    } = query as Record<string, unknown>;

    if (rawFilters.isActive !== undefined) {
        rawFilters.isActive = rawFilters.isActive === 'true' || rawFilters.isActive === true;
    }

    const page = Number(pageQuery) || 1;
    const limit = Number(limitQuery) || 10;
    const skip = (page - 1) * limit;

    // Initialize the match stage with the basic filter for admins
    const matchStage: Record<string, unknown> = {
        role: { $ne: ROLE.SUPER_ADMIN },
        ...rawFilters,
    };

    const pipeline: PipelineStage[] = [{ $match: matchStage }];

    if (searchTerm) {
        pipeline.push({
            $match: {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                    { phone: { $regex: searchTerm, $options: 'i' } },
                ],
            },
        });
    }

    const sortStage: Record<string, 1 | -1> = {};
    const sortString = (sortQuery as string) || '-createdAt';
    sortString
        .split(',')
        .filter(Boolean)
        .forEach((field: string) => {
            if (field.startsWith('-')) {
                sortStage[field.substring(1)] = -1;
            } else {
                sortStage[field] = 1;
            }
        });

    if (Object.keys(sortStage).length) {
        pipeline.push({ $sort: sortStage });
    }

    pipeline.push({
        $facet: {
            data: [
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        phone: 1,
                        image: 1,
                        isActive: 1,
                        role: 1,
                        plan: 1,
                        premiumUntil: 1,
                        createdAt: 1,
                    },
                },
            ],
            meta: [{ $count: 'total' }],
        },
    });

    const result = await UserModel.aggregate(pipeline);
    const facetResult = result[0] || { data: [], meta: [] };

    const total = facetResult.meta[0]?.total || 0;
    const totalPage = Math.ceil(total / limit) || 1;

    const meta = {
        page,
        limit,
        total,
        totalPage,
    };

    return { data: facetResult.data, meta };
};

// 3.1 adminCreateAccountIntoDB
const adminCreateAccountIntoDB = async (
    creator: { role: string },
    payload: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        role?: string;
        plan?: string;
        premiumUntil?: Date;
    },
) => {
    const requestedRole = (payload.role || ROLE.USER) as string;
    const requestedPlan = (payload.plan || 'FREE') as string;

    if (creator.role === ROLE.ADMIN && requestedRole !== ROLE.USER) {
        throw new AppError(httpStatus.FORBIDDEN, 'Admin can create user accounts only!');
    }

    const otp = generateOtp();
    const now = new Date();

    const created = await UserModel.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        role: requestedRole,
        plan: requestedPlan,
        premiumUntil: requestedPlan === 'PREMIUM' ? payload.premiumUntil : undefined,
        otp,
        otpExpiry: new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000),
        isVerifiedByOTP: true,
        isActive: true,
        isDeleted: false,
    });

    return UserModel.findById(created._id).select(
        'name email phone image role plan premiumUntil isActive createdAt updatedAt',
    );
};

// 3.2 adminUpdateAccountIntoDB
const adminUpdateAccountIntoDB = async (
    updater: { role: string },
    userId: string,
    payload: {
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        role?: string;
        plan?: string;
        premiumUntil?: Date;
    },
) => {
    const user = await UserModel.findById(userId).select('+password');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (updater.role === ROLE.ADMIN && user.role !== ROLE.USER) {
        throw new AppError(httpStatus.FORBIDDEN, 'Admin can update user accounts only!');
    }

    if (payload.email && payload.email !== user.email) {
        const emailExists = await UserModel.findOne({ email: payload.email, _id: { $ne: userId } });

        if (emailExists) {
            throw new AppError(httpStatus.BAD_REQUEST, 'This email is already used!');
        }
    }

    if (payload.role && updater.role === ROLE.ADMIN && payload.role !== ROLE.USER) {
        throw new AppError(httpStatus.FORBIDDEN, 'Admin can update user accounts only!');
    }

    if (payload.name) user.name = payload.name;
    if (payload.email) user.email = payload.email;
    if (payload.phone !== undefined) user.phone = payload.phone;
    if (payload.role) user.role = payload.role as typeof user.role;
    if (payload.plan) user.plan = payload.plan as 'FREE' | 'PREMIUM';
    if (payload.plan === 'FREE') {
        user.premiumUntil = undefined;
    }
    if (payload.plan === 'PREMIUM' && payload.premiumUntil) {
        user.premiumUntil = payload.premiumUntil;
    }
    if (!payload.plan && payload.premiumUntil) {
        user.premiumUntil = payload.premiumUntil;
    }
    if (payload.password) {
        user.password = payload.password;
        user.passwordChangedAt = new Date(Date.now() - 5000);
    }

    await user.save();

    return UserModel.findById(userId).select('name email phone image role plan premiumUntil isActive createdAt updatedAt');
};

// 4. changeSpecificUserIsActiveStatusIntoDB
const changeSpecificUserIsActiveStatusIntoDB = async (id: string) => {
    const user = await UserModel.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const result = await UserModel.findByIdAndUpdate(
        user._id,
        {
            isActive: !user.isActive,
        },
        { returnDocument: 'after', select: 'name email phone image role isActive' },
    );

    return result;
};

// 5. getUniqueProductCategoriesFromDB
const getUniqueProductCategoriesFromDB = async (): Promise<string[]> => {
    const filter: Record<string, unknown> = {
        category: { $nin: [null, ''] },
    };

    const categories = await ProductPriceModel.distinct('category', filter);

    return categories
        .map((c: unknown) => String(c).trim())
        .filter(Boolean)
        .sort((a: string, b: string) => a.localeCompare(b));
};

// 6. getUniqueProductNamesFromDB
const getUniqueProductNamesFromDB = async (): Promise<string[]> => {
    const filter: Record<string, unknown> = {
        productName: { $nin: [null, ''] },
    };

    const names = await ProductPriceModel.distinct('productName', filter);

    return names
        .map((n: unknown) => String(n).trim())
        .filter(Boolean)
        .sort((a: string, b: string) => a.localeCompare(b));
};

// 7. getUniqueProductCategoriesAndNamesFromDB
const getUniqueProductCategoriesAndNamesFromDB = async (): Promise<string[]> => {
    const filter: Record<string, unknown> = {
        category: { $nin: [null, ''] },
        productName: { $nin: [null, ''] }, // As per the interface, productName is used
    };

    const result = await ProductPriceModel.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$category',
                names: { $addToSet: '$productName' },
            },
        },
        { $sort: { _id: 1 } }, // sort by category (A-Z)
    ]);

    // flatMap to get a single array of category and names
    return result.flatMap((item: { _id: string; names: string[] }) => {
        const sortedNames = item.names.sort((a: string, b: string) => a.localeCompare(b));
        return [item._id, ...sortedNames]; // First category, then its names
    });
};

// 8. getProductsAvailableInAtLeastTwoShopsFromDB
const getProductsAvailableInAtLeastTwoShopsFromDB = async () => {
    const result = await ProductPriceModel.aggregate([
        {
            $match: {
                productName: { $nin: [null, ''] },
                shop: { $exists: true, $ne: null },
            },
        },
        {
            $group: {
                _id: {
                    productName: '$productName',
                    category: '$category',
                    unit: '$unit',
                    unitSize: '$unitSize',
                    currency: '$currency',
                },
                shopIds: { $addToSet: '$shop' },
                offers: {
                    $push: {
                        productId: '$productId',
                        price: '$price',
                        unitPrice: '$unitPrice',
                        discount: '$discount',
                        sourceUrl: '$sourceUrl',
                        imageUrl: '$imageUrl',
                        shop: '$shop',
                    },
                },
            },
        },
        {
            $addFields: {
                shopCount: { $size: '$shopIds' },
            },
        },
        {
            $match: {
                shopCount: { $gte: 2 },
            },
        },
        {
            $sort: {
                '_id.productName': 1,
            },
        },
    ]);

    return result.map((item: {
        _id: {
            productName?: string;
            category?: string;
            unit?: string;
            unitSize?: string;
            currency?: string;
        };
        shopCount?: number;
        offers?: Array<Record<string, unknown>>;
    }) => ({
        productName: item?._id?.productName,
        category: item?._id?.category,
        unit: item?._id?.unit,
        unitSize: item?._id?.unitSize,
        currency: item?._id?.currency || 'EUR',
        shopCount: item?.shopCount || 0,
        offers: (item?.offers || []).map((offer: Record<string, unknown>) => ({
            productId: offer?.productId,
            price: offer?.price,
            unitPrice: offer?.unitPrice,
            discount: offer?.discount,
            sourceUrl: offer?.sourceUrl,
            imageUrl: offer?.imageUrl,
            shopId: offer?.shop,
        })),
    }));
};

// 8. updateProductCategoryImageFromDB
const updateProductCategoryImageFromDB = async (category: string, imageFile: MulterFile | undefined) => {
    // 1. Validation: Ensure an image file is provided
    if (!imageFile) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
    }

    // 2. Upload the new profile photo to Cloudinary
    const { secure_url } = await sendImageToCloudinary(imageFile);

    // 3. Update the products image URL in the database
    const result = await ProductPriceModel.updateMany({ category }, { $set: { imageUrl: secure_url } });

    const updateResult = result as {
        matchedCount?: number;
        modifiedCount?: number;
        n?: number;
        nModified?: number;
    };

    const matchedCount = updateResult.matchedCount ?? updateResult.n ?? 0;

    const modifiedCount = updateResult.modifiedCount ?? updateResult.nModified ?? 0;

    // 4. Rollback Logic: If DB update fails, delete the newly uploaded image from Cloudinary
    if (matchedCount === 0) {
        // Use secure_url to delete from Cloudinary, not the local path
        await deleteImageFromCloudinary(secure_url);
        throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }

    return {
        category,
        imageUrl: secure_url,
        matchedCount,
        modifiedCount,
    };
};

// 9. getAllShopsFromDB
const getAllShopsFromDB = async () => {
    const shops = await ShopModel.find({})
        .select({ name: 1, website: 1, address: 1, location: 1, createdAt: 1, updatedAt: 1 })
        .sort({ name: 1 })
        .lean();

    return shops.map((shop: {
        _id: unknown;
        name: string;
        website?: string;
        address?: string;
        location?: { coordinates?: [number, number] };
        createdAt?: Date;
        updatedAt?: Date;
    }) => ({
        id: String(shop._id),
        name: shop.name,
        website: shop.website,
        address: shop.address,
        location: shop.location?.coordinates
            ? {
                  latitude: shop.location.coordinates[1],
                  longitude: shop.location.coordinates[0],
              }
            : null,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
    }));
};

// 10. updateShopLocationIntoDB
const updateShopLocationIntoDB = async (
    shopId: string,
    payload: { latitude?: number; longitude?: number; address?: string },
) => {
    const shop = await ShopModel.findById(shopId);

    if (!shop) {
        throw new AppError(httpStatus.NOT_FOUND, 'Shop not found!');
    }

    if (typeof payload.address === 'string') {
        shop.address = payload.address.trim();
    }

    if (typeof payload.latitude === 'number' && typeof payload.longitude === 'number') {
        shop.location = {
            type: 'Point',
            coordinates: [payload.longitude, payload.latitude],
        };
    }

    await shop.save();

    return {
        id: String(shop._id),
        name: shop.name,
        website: shop.website,
        address: shop.address,
        location: shop.location?.coordinates
            ? {
                  latitude: shop.location.coordinates[1],
                  longitude: shop.location.coordinates[0],
              }
            : null,
    };
};

export const AdminService = {
    // adminGetAllDashboardMetaDataFromDB,
    // updateNewsStatusFromDB,
    adminCreateAccountIntoDB,
    adminUpdateAccountIntoDB,
    getAllAdminsFromDB,
    changeSpecificUserIsActiveStatusIntoDB,
    getUniqueProductCategoriesFromDB,
    getUniqueProductNamesFromDB,
    getUniqueProductCategoriesAndNamesFromDB,
    getProductsAvailableInAtLeastTwoShopsFromDB,
    updateProductCategoryImageFromDB,
    getAllShopsFromDB,
    updateShopLocationIntoDB,
};
