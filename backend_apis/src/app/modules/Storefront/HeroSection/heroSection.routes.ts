import { Router } from 'express';
import { auth, validateRequest } from '../../../middlewares';
import { ROLE } from '../../User/user.constant';
import { HeroSectionController } from './heroSection.controller';
import { StorefrontValidation } from '../storefront.validation';

const router = Router();

router.route('/home').get(HeroSectionController.getHomeContent);

router
    .route('/heroes')
    .post(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(StorefrontValidation.heroSectionCreateSchema), HeroSectionController.createHeroSection)
    .get(HeroSectionController.getAllHeroSections);

router
    .route('/heroes/:heroSectionId')
    .get(HeroSectionController.getHeroSection)
    .patch(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(StorefrontValidation.heroSectionUpdateSchema), HeroSectionController.updateHeroSection)
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), HeroSectionController.deleteHeroSection);

export const HeroSectionRoutes = router;
