import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { Router } from 'express';
import { pageZodValidation } from './page.validation';
import { PageController } from './page.controller';

const router = Router();

// createPageOrUpdate
router
    .route('/create-or-update')
    .put(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(pageZodValidation.createOrUpdatePageSchema),
        PageController.createOrUpdatePage,
    );

// getAllPage
router.route('/retrieve').get(PageController.getAllPages);

// getPageBySlug
router.route('/retrieve/:slug').get(PageController.getPageBySlug);

export const PageRoutes = router;
