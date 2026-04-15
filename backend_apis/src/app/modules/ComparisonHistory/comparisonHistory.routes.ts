import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { ComparisonHistoryController } from './comparisonHistory.controller';
import { ComparisonHistoryValidation } from './comparisonHistory.validation';

const router = Router();

// 1. getComparisonSuggestions
router.route('/').get(ComparisonHistoryController.getComparisonSuggestions);

// 2. compareProducts
router
    .route('/compare')
    .post(
        validateRequest(ComparisonHistoryValidation.compareSchema),
        ComparisonHistoryController.compareProducts,
    );

// 3. getComparisonHistory
router.route('/history').get(ComparisonHistoryController.getComparisonHistory);

// 4. clearComparisonHistory
router.route('/history').delete(ComparisonHistoryController.clearComparisonHistory);

export const ComparisonHistoryRoutes = router;
