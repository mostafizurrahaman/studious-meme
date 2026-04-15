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
    const result = await ComparisonHistoryService.compareProductsFromDB(IDs);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Products compared successfully!',
        data: result,
    });
});

// 3. getComparisonHistory
const getComparisonHistory = asyncHandler(async (_req, res) => {
    const result = await ComparisonHistoryService.getComparisonHistoryFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Comparison history fetched successfully!',
        data: result,
    });
});

// 4. clearComparisonHistory
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
    getComparisonHistory,
    clearComparisonHistory,
};
