import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { ComparisonHistoryController } from './comparisonHistory.controller';
import { ComparisonHistoryValidation } from './comparisonHistory.validation';

const router = Router();

router.route('/').get(ComparisonHistoryController.getComparisonSuggestions);
router.route('/compare').post(validateRequest(ComparisonHistoryValidation.compareSchema), ComparisonHistoryController.compareProducts);
router.route('/history').get(ComparisonHistoryController.getComparisonHistory);
router.route('/history').delete(ComparisonHistoryController.clearComparisonHistory);

export const ComparisonHistoryRoutes = router;
