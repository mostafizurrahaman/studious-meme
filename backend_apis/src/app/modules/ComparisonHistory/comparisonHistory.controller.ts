import httpStatus from 'http-status';
import { asyncHandler, sendResponse } from '../../utils';
import { ComparisonHistoryService } from './comparisonHistory.service';

const getComparisonSuggestions = asyncHandler(async (_req, res) => {
    const result = await ComparisonHistoryService.getComparisonSuggestionsFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Comparison suggestions fetched successfully!', data: result });
});

const compareProducts = asyncHandler(async (req, res) => {
    const { skus } = req.body as { skus: string[] };
    const result = await ComparisonHistoryService.compareProductsFromDB(skus);
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Products compared successfully!', data: result });
});

const getComparisonHistory = asyncHandler(async (_req, res) => {
    const result = await ComparisonHistoryService.getComparisonHistoryFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Comparison history fetched successfully!', data: result });
});

const clearComparisonHistory = asyncHandler(async (_req, res) => {
    await ComparisonHistoryService.clearComparisonHistoryFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Comparison history cleared successfully!', data: null });
});

export const ComparisonHistoryController = {
    getComparisonSuggestions,
    compareProducts,
    getComparisonHistory,
    clearComparisonHistory,
};
