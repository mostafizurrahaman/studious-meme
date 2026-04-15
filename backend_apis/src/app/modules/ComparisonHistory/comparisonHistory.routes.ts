import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { ComparisonHistoryController } from './comparisonHistory.controller';
import { ComparisonHistoryValidation } from './comparisonHistory.validation';
import { ROLE } from '../User/user.constant';

const router = Router();

// 1. getComparisonSuggestions
router.route('/').get(ComparisonHistoryController.getComparisonSuggestions);

// 2. compareProducts
router
    .route('/compare')
    .post(
        auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(ComparisonHistoryValidation.compareSchema),
        ComparisonHistoryController.compareProducts,
    );

// 3. getMyComparisonHistory
router.route('/history').get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), ComparisonHistoryController.getMyComparisonHistory);

// 4. getAllComparisonHistory
router.route('/admin/history').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), ComparisonHistoryController.getAllComparisonHistory);

// 5. clearComparisonHistory
router.route('/history').delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), ComparisonHistoryController.clearComparisonHistory);

export const ComparisonHistoryRoutes = router;
