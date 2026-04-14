/* eslint-disable @typescript-eslint/no-explicit-any */
import { PipelineStage } from 'mongoose';
import config from '../../config';
import { ProductPriceModel, ShopModel, IProductPrice } from './product.model';
import { runActorAndGetItems } from './product.utils';
import httpStatus from 'http-status';
import { MealSuggestionUsage } from './mealSuggestionUsage.model';
import { AppError } from '../../utils';
import { IUser } from '../User/user.interface';

export interface IngestResult {
    actorId: string;
    runId: string;
    itemsStored: number;
}

export interface SearchParams {
    lat: number;
    lng: number;
    radiusKm: number;
    query?: string;
    category?: string;
}

export interface AggregatedSearchParams {
    searchTerm?: string;
    category?: string;
    productName?: string;
    limit?: number;
}

export interface PriceResultItem {
    productName: string;
    price: number;
    currency: string;
    unit?: string;
    shop: {
        id: string;
        name: string;
        brand?: string;
        address?: string;
        location: { lat: number; lng: number };
    };
    sourceActor?: string;
    sourceUrl?: string;
    updatedAt: Date;
}

export interface PriceDropItem {
    productName: string;
    category?: string;
    unit?: string;
    unitSize?: string;
    currency: string;
    shopId: string;
    oldPrice: number;
    newPrice: number;
    dropAmount: number;
    dropPercent: number;
    sourceUrl?: string;
    imageUrl?: string;
    todayAt: Date;
    yesterdayAt: Date;
}

// function parseLocation(item: any): { lat?: number; lng?: number } {
//   const rawLat =
//     item?.lat ??
//     item?.latitude ??
//     item?.geo?.lat ??
//     item?.location?.lat ??
//     item?.location?.latitude ??
//     item?.store?.lat ??
//     item?.store?.latitude;

//   const rawLng =
//     item?.lng ??
//     item?.lon ??
//     item?.long ??
//     item?.longitude ??
//     item?.geo?.lng ??
//     item?.geo?.lon ??
//     item?.location?.lng ??
//     item?.location?.lon ??
//     item?.location?.longitude ??
//     item?.store?.lng ??
//     item?.store?.lon ??
//     item?.store?.longitude;

//   let lat = rawLat;
//   let lng = rawLng;

//   // Try coordinate arrays
//   const coords =
//     item?.location?.coordinates ??
//     item?.coordinates ??
//     item?.geo?.coordinates ??
//     item?.store?.location?.coordinates;
//   if (
//     (lat == null || lng == null) &&
//     Array.isArray(coords) &&
//     coords.length >= 2
//   ) {
//     // GeoJSON is typically [lng, lat]
//     lng = coords[0];
//     lat = coords[1];
//   }

//   const latNum = typeof lat === 'string' ? Number(lat) : lat;
//   const lngNum = typeof lng === 'string' ? Number(lng) : lng;

//   return {
//     lat:
//       typeof latNum === 'number' && Number.isFinite(latNum)
//         ? latNum
//         : undefined,
//     lng:
//       typeof lngNum === 'number' && Number.isFinite(lngNum)
//         ? lngNum
//         : undefined,
//   };
// }

// extractShop
function extractShop(item: any) {
    const name = item?.supermarket || 'Unknown';

    const website = new URL(item?.url).origin || undefined;

    return { name, website };
}

function parseFiniteNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') return undefined;

    const parsed = typeof value === 'number' ? value : Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
}

// extractProduct
function extractProduct(item: any) {
    const productName = item?.name || 'Unknown Product';

    const category = item?.query || undefined;

    const price = parseFiniteNumber(item?.price_eur);
    const unitPrice = parseFiniteNumber(item?.unit_price_eur);

    const currency = item?.currency || 'EUR';

    const unit = item?.unit || undefined;
    const unitSize = item?.unit_size || undefined;
    const discount = parseFiniteNumber(item?.discount ?? item?.offer);

    const sourceUrl = item?.url || undefined;

    return {
        productName,
        category,
        price,
        unitPrice,
        currency,
        unit,
        unitSize,
        discount,
        sourceUrl,
    };
}

// ingestOnce
async function ingestOnce(): Promise<IngestResult[]> {
    const results: IngestResult[] = [];
    const actors = config.apify_actors as string[];
    const timeoutMs = Number(config.apify_run_timeout_ms) || 60 * 60 * 1000;

    for (const actorId of actors) {
        console.log('1');
        const { items, runId } = await runActorAndGetItems(actorId, timeoutMs);

        let stored = 0;

        for (const it of items) {
            console.log({ it });
            const shopData = extractShop(it);
            const productData = extractProduct(it);

            console.log({ shopData, productData });

            if (
                !productData.productName ||
                typeof productData.price !== 'number' ||
                !Number.isFinite(productData.price) ||
                productData.price <= 0 ||
                typeof productData.unitPrice !== 'number' ||
                !Number.isFinite(productData.unitPrice)
            ) {
                continue;
            }

            const shop = await ShopModel.findOneAndUpdate(
                {
                    name: shopData.name,
                },
                {
                    website: shopData.website,
                },
                { returnDocument: 'after', upsert: true },
            );

            await ProductPriceModel.create({
                productName: productData.productName,
                category: productData.category,
                price: productData.price,
                unitPrice: productData.unitPrice,
                currency: productData.currency,
                unit: productData.unit,
                unitSize: productData.unitSize,
                discount: productData.discount,
                sourceUrl: productData.sourceUrl,
                shop: shop._id,
                sourceActor: actorId,
            });

            stored += 1;
        }

        results.push({ actorId, runId, itemsStored: stored });
    }

    return results;
}

// searchPrices
async function searchPrices(params: SearchParams): Promise<PriceResultItem[]> {
    const { lat, lng, radiusKm, query, category } = params;
    // Find shops within radius
    const shops = await ShopModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radiusKm / 6378.1],
            },
        },
    }).select({ name: 1, brand: 1, address: 1, location: 1 });

    const shopIds = shops.map(s => s._id);
    if (!shopIds.length) return [];

    const filter: any = { shop: { $in: shopIds } };
    if (query) filter.productName = { $regex: query, $options: 'i' };
    if (category) filter.category = category;

    const prices = await ProductPriceModel.find(filter).sort({ price: 1, updatedAt: -1 }).limit(200).lean();

    const shopMap = new Map<string, any>();
    shops.forEach((s: any) => shopMap.set(String(s._id), s));

    const result: PriceResultItem[] = prices.map((p: any) => {
        const s = shopMap.get(String(p.shop));
        return {
            productName: p.productName,
            price: p.price,
            currency: p.currency,
            unit: p.unit,
            shop: {
                id: String(s._id),
                name: s.name,
                brand: s.brand,
                address: s.address,
                location: {
                    lat: s.location.coordinates[1],
                    lng: s.location.coordinates[0],
                },
            },
            sourceActor: p.sourceActor,
            sourceUrl: p.sourceUrl,
            updatedAt: p.updatedAt,
        };
    });

    return result;
}

// getPriceDrops
async function getPriceDrops(limit?: number): Promise<PriceDropItem[]> {
    const now = new Date();

    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

    const startTomorrow = new Date(startToday);
    startTomorrow.setDate(startTomorrow.getDate() + 1);

    const startYesterday = new Date(startToday);
    startYesterday.setDate(startYesterday.getDate() - 1);

    const pipeline: PipelineStage[] = [
        {
            $match: {
                createdAt: { $gte: startYesterday, $lt: startTomorrow },
                price: { $gt: 0 },
            },
        },
        {
            $addFields: {
                _day: {
                    $cond: [{ $lt: ['$createdAt', startToday] }, 'yesterday', 'today'],
                },
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    productName: '$productName',
                    unit: '$unit',
                    shop: '$shop',
                    day: '$_day',
                },
                doc: { $first: '$$ROOT' },
            },
        },
        {
            $group: {
                _id: {
                    productName: '$_id.productName',
                    unit: '$_id.unit',
                    shop: '$_id.shop',
                },
                docs: { $push: '$doc' },
            },
        },
        {
            $project: {
                _id: 0,
                productName: '$_id.productName',
                unit: '$_id.unit',
                shop: '$_id.shop',
                today: {
                    $first: {
                        $filter: {
                            input: '$docs',
                            as: 'd',
                            cond: { $eq: ['$$d._day', 'today'] },
                        },
                    },
                },
                yesterday: {
                    $first: {
                        $filter: {
                            input: '$docs',
                            as: 'd',
                            cond: { $eq: ['$$d._day', 'yesterday'] },
                        },
                    },
                },
            },
        },
        {
            $match: {
                today: { $ne: null },
                yesterday: { $ne: null },
                $expr: { $lt: ['$today.price', '$yesterday.price'] },
            },
        },
        {
            $addFields: {
                oldPrice: '$yesterday.price',
                newPrice: '$today.price',
                dropAmount: { $subtract: ['$yesterday.price', '$today.price'] },
                dropPercent: {
                    $multiply: [
                        {
                            $divide: [
                                {
                                    $subtract: ['$yesterday.price', '$today.price'],
                                },
                                '$yesterday.price',
                            ],
                        },
                        100,
                    ],
                },
            },
        },
        { $sort: { dropAmount: -1 } },
    ];

    if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
        pipeline.push({ $limit: Math.floor(limit) });
    }

    const rows = await ProductPriceModel.aggregate(pipeline as PipelineStage[]);

    return rows.map((r: any) => {
        const today = r.today;
        const yesterday = r.yesterday;
        return {
            productName: r.productName,
            category: today?.category,
            unit: r.unit,
            unitSize: today?.unitSize,
            currency: today?.currency || 'EUR',
            shopId: String(r.shop),
            oldPrice: Number(r.oldPrice),
            newPrice: Number(r.newPrice),
            dropAmount: Number(r.dropAmount),
            dropPercent: Number(r.dropPercent),
            sourceUrl: today?.sourceUrl,
            imageUrl: today?.imageUrl,
            todayAt: new Date(today?.createdAt),
            yesterdayAt: new Date(yesterday?.createdAt),
        } as PriceDropItem;
    });
}

// Very small in-process daily scheduler
let scheduled = false;
function ensureDailyIngestScheduler() {
    if (scheduled) return;
    scheduled = true;

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const targetHour = 0;
    const targetMinute = 0;

    const scheduleNext = () => {
        const now = new Date();
        const next = new Date(now);
        next.setHours(targetHour, targetMinute, 0, 0);
        if (next.getTime() <= now.getTime()) {
            next.setDate(next.getDate() + 1);
        }

        const delayMs = next.getTime() - now.getTime();

        setTimeout(() => {
            ingestOnce().catch(e => console.error('Daily ingest failed', e));
            setInterval(() => {
                ingestOnce().catch(e => console.error('Daily ingest failed', e));
            }, ONE_DAY);
        }, delayMs);
    };

    scheduleNext();
}

// searchPricesAggregate
async function searchPricesAggregate(params: AggregatedSearchParams): Promise<IProductPrice[]> {
    const searchTerm = String(params.searchTerm || '').trim();
    const category = String(params.category || '').trim();
    const productName = String(params.productName || '').trim();
    const limit =
        typeof params.limit === 'number' && Number.isFinite(params.limit)
            ? Math.min(Math.max(Math.floor(params.limit), 1), 500)
            : 100;

    const match: Record<string, unknown> = {
        price: { $gt: 0 },
    };

    if (searchTerm) {
        match.$or = [
            { productName: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    if (category) {
        match.category = { $regex: category, $options: 'i' };
    }

    if (productName) {
        match.productName = { $regex: productName, $options: 'i' };
    }

    const pipeline: PipelineStage[] = [
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    productName: '$productName',
                    unit: '$unit',
                    shop: '$shop',
                },
                doc: { $first: '$$ROOT' },
            },
        },
        { $replaceRoot: { newRoot: '$doc' } },
        { $limit: limit },
    ];

    return await ProductPriceModel.aggregate(pipeline as PipelineStage[]);
}

// getAllProductsFromDB
async function getAllProductsFromDB(): Promise<any[]> {
    return await ProductPriceModel.find().lean().exec();

    // return [
    //   {
    //     id: '03047643-2802-4c32-a55e-70a65352b5ea',
    //     query: 'Melk',
    //     supermarket: 'Jumbo',
    //     name: 'Jumbo Biologisch Halfvolle Melk 1 L',
    //     url: 'https://www.jumbo.com/producten/jumbo-biologisch-halfvolle-melk-1-l-420592PAK',
    //     price_eur: 1.39,
    //     unit_price_eur: 1.39,
    //     unit: 'l',
    //     unit_size: '1 l',
    //     discount: '',
    //     scrape_timestamp: '2026-03-11 10:10:08',
    //   },
    // ];
}

// getProductByIdFromDB
async function getProductByIdFromDB(id: string): Promise<any | null> {
    return await ProductPriceModel.findById(id)
        .select('-createdAt -updatedAt')
        .populate({ path: 'shop', select: 'name brand address location' })
        .lean()
        .exec();
}

// const mealKeywords: string[] = [
//   'Meal',
//   'Maaltijd',
//   'Spaghetti',
//   'Spaghettini',
//   'Macaroni',
//   'Bolognese',
//   'Brood',
//   'Bruinbrood',
//   'Witbrood',
//   'Roggebrood',
//   'Tarwebrood',
//   'Meergranenbrood',
//   'Crêpes',
//   'Linguine',
//   'Groente',
//   'Courgette',
// ];

const mealKeywords: string[] = [
    // main from productName
    'Meal',

    // Core Meals (Dutch)
    'Maaltijd',
    'Stoommaaltijd',
    'Kant-en-klaar',
    'Ovenschotel',

    // Pasta & Noodles (Dinner)
    'Spaghetti',
    'Spaghettini',
    'Macaroni',
    'Penne',
    'Fusilli',
    'Lasagne',
    'Tagliatelle',
    'Linguine',
    'Bolognese',
    'Carbonara',
    'Tortellini',
    'Ravioli',
    'Noodles',

    // Rice & Grains (Dinner)
    'Risotto',
    'Paella',
    'Couscous',
    'Quinoa',
    'Curry',
    'Poké',

    // Vegetables & Salads (Meal Base)
    'Groente',
    'Salade',
    'Courgette',
    'Bloemkoolrijst',
    'Wokgroente',

    // Bread & Wraps (Lunch/Light Meal)
    'Brood',
    'Bruinbrood',
    'Witbrood',
    'Roggebrood',
    'Tarwebrood',
    'Meergranenbrood',
    'Wrap',
    'Tortilla',
    'Pita',
    'Naan',
    'Focaccia',

    // Meat & Fish Meals
    'Gehakt',
    'Kip',
    'Biefstuk',
    'Zalm',
    'Garnalen',

    // Misc
    'Crêpes',
    'Pannenkoeken',
    'Soep',
    'Quiche',
    'Pizza',
];

// getMealSuggestionsFromDB
async function getMealSuggestionsFromDB(user: IUser): Promise<IProductPrice[]> {
    // 1. Check Plan
    const isPremium =
        user?.plan === 'PREMIUM' && user?.premiumUntil && new Date(user.premiumUntil).getTime() > Date.now();

    const dailyLimit = isPremium ? 10 : 2;

    // 2. Amsterdam Day Key
    const getAmsterdamDayKey = (date: Date): string => {
        const fmt = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Europe/Amsterdam',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        // en-CA with these options yields YYYY-MM-DD
        return fmt.format(date);
    };

    const dayKey = getAmsterdamDayKey(new Date());

    // 3. Usage Check (Pre-check before increment)
    const existingUsage = await MealSuggestionUsage.findOne({
        user: (user as any)._id,
        dayKey,
    })
        .lean()
        .exec();

    if (existingUsage && existingUsage.count >= dailyLimit) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            `Daily meal suggestion limit reached (${dailyLimit}/day). ${user?.plan === 'FREE' ? 'Upgrade to Premium for more!' : ''}`,
        );
    }

    // 4. Data Fetching
    // Array-r shobgulo word ke '|' diye join kore ekta pattern banano hoyeche
    const pattern = mealKeywords.join('|');
    const result = await ProductPriceModel.find({
        productName: { $regex: new RegExp(pattern, 'i') }, // 'i' for case-insensitive
    })
        .lean()
        .exec();

    // no result  no increment
    if (result.length === 0) {
        return [];
    }

    // 5. Atomic Upsert & Increment
    // Only increment when allowed (so failed attempts don't consume the quota)
    await MealSuggestionUsage.updateOne(
        { user: (user as any)._id, dayKey },
        {
            $inc: { count: 1 },
            $setOnInsert: { user: user._id, dayKey },
        },
        { upsert: true },
    );

    return result;
}

export const PricingService = {
    ingestOnce,
    searchPrices,
    ensureDailyIngestScheduler,
    getPriceDrops,
    searchPricesAggregate,
    getAllProductsFromDB,
    getProductByIdFromDB,
    getMealSuggestionsFromDB,
};
