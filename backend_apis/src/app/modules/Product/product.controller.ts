import httpStatus from 'http-status';
import { PricingService } from './product.service';
import { asyncHandler, sendResponse } from '../../utils';

// ingestData
const ingestData = asyncHandler(async (_req, res) => {
    const result = await PricingService.ingestOnce();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Ingest completed successfully!',
        data: result,
    });
});

// search
const search = asyncHandler(async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radiusKm || 5);
    const query = (req.query.q || req.query.query || '') as string;
    const category = (req.query.category || '') as string;

    if (!lat || !lng || !radiusKm) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: 'lat, lng and radiusKm are required numeric query params',
        });
    }

    const result = await PricingService.searchPrices({
        lat,
        lng,
        radiusKm,
        query: query || undefined,
        category: category || undefined,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Search completed successfully!',
        data: result,
    });
});

// getTop6PriceDrops
const getTop6PriceDrops = asyncHandler(async (_req, res) => {
    const result = await PricingService.getPriceDrops(6);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Price drops retrieved successfully!',
        data: result,
    });
});

// getAllPriceDrops
const getAllPriceDrops = asyncHandler(async (_req, res) => {
    const result = await PricingService.getPriceDrops();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Price drops retrieved successfully!',
        data: result,
    });
});

// searchAggregate
const searchAggregate = asyncHandler(async (req, res) => {
    const searchTerm = (req.query.searchTerm || '') as string;
    const category = (req.query.category || '') as string;
    const productName = (req.query.productName || '') as string;
    const limitRaw = req.query.limit;
    const limit = typeof limitRaw === 'string' && limitRaw.trim() !== '' ? Number(limitRaw) : undefined;

    const result = await PricingService.searchPricesAggregate({
        searchTerm: searchTerm || undefined,
        category: category || undefined,
        productName: productName || undefined,
        limit,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Search completed successfully!',
        data: result,
    });
});

// getAllProducts
const getAllProducts = asyncHandler(async (_req, res) => {
    const result = await PricingService.getAllProductsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'All products retrieved successfully!',
        data: result,
    });
});

// getProductById
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await PricingService.getProductByIdFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Product retrieved successfully!',
        data: result,
    });
});

// getMealSuggestions
const getMealSuggestions = asyncHandler(async (req, res) => {
    const result = await PricingService.getMealSuggestionsFromDB(req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Meal suggestions retrieved successfully!',
        data: result,
    });
});

export const PricingController = {
    ingestData,
    search,
    getTop6PriceDrops,
    getAllPriceDrops,
    searchAggregate,
    getAllProducts,
    getProductById,
    getMealSuggestions,
};
