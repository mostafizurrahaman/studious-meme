import { Router } from 'express';
import { PricingController } from './product.controller';
import auth from '../../middlewares/auth';
import { ROLE } from '../User/user.constant';

const router = Router();

// Trigger ingestion (manual)
router.route('/ingest').post(PricingController.ingestData);

// Search cheapest prices within radius
router.route('/search').get(PricingController.search);

// Price drops
router.route('/top6-price-drops').get(PricingController.getTop6PriceDrops);
router.route('/all-price-drops').get(PricingController.getAllPriceDrops);

// Aggregation based search
router.route('/search-aggregate').get(PricingController.searchAggregate);

// getAllProducts
router.route('/all').get(PricingController.getAllProducts);

// getMealSuggestions
router
    .route('/meal-suggestions')
    .get(auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN), PricingController.getMealSuggestions);

// getProductById
router.route('/:id').get(PricingController.getProductById);

export const PricingRoutes = router;
