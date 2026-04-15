import httpStatus from 'http-status';
import { asyncHandler, sendResponse } from '../../utils';
import { ComparisonHistoryService } from './comparisonHistory.service';

// 1. getComparisonSuggestions
const getComparisonSuggestions = asyncHandler(async (_req, res) => {
    const result = await ComparisonHistoryService.getComparisonSuggestionsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Comparison suggestions fetched successfully!',
        data: result,
    });
});

// 2. compareProducts
const compareProducts = asyncHandler(async (req, res) => {
    const { IDs } = req.body as { IDs: string[] };
    const result = await ComparisonHistoryService.compareProductsFromDB(req.user, IDs);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Products compared successfully!',
        data: result,
    });
});

// 3. getMyComparisonHistory
const getMyComparisonHistory = asyncHandler(async (req, res) => {
    const result = await ComparisonHistoryService.getMyComparisonHistoryFromDB(req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Comparison history fetched successfully!',
        data: result,
    });
});

// 4. getAllComparisonHistory
const getAllComparisonHistory = asyncHandler(async (_req, res) => {
    const result = await ComparisonHistoryService.getAllComparisonHistoryFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Comparison history fetched successfully!',
        data: result,
    });
});

// 5. clearComparisonHistory
const clearComparisonHistory = asyncHandler(async (_req, res) => {
    await ComparisonHistoryService.clearComparisonHistoryFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Comparison history cleared successfully!',
        data: null,
    });
});

export const ComparisonHistoryController = {
    getComparisonSuggestions,
    compareProducts,
    getMyComparisonHistory,
    getAllComparisonHistory,
    clearComparisonHistory,
};
