import { Router } from 'express';
import { auth, validateRequestFromFormData } from '../../../middlewares';
import { multerUpload } from '../../../lib';
import { ROLE } from '../../User/user.constant';
import { HeroSectionController } from './heroSection.controller';
import { HeroSectionValidation } from './heroSection.validation';

const router = Router();

router.route('/home').get(HeroSectionController.getHomeContent);

router
    .route('/heroes')
    .post(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.any(),
        validateRequestFromFormData(HeroSectionValidation.heroSectionCreateSchema),
        HeroSectionController.createHeroSection,
    )
    .get(HeroSectionController.getAllHeroSections);

router
    .route('/heroes/:heroSectionId')
    .get(HeroSectionController.getHeroSection)
    .patch(
        auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
        multerUpload.any(),
        validateRequestFromFormData(HeroSectionValidation.heroSectionUpdateSchema),
        HeroSectionController.updateHeroSection,
    )
    .delete(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), HeroSectionController.deleteHeroSection);

export const HeroSectionRoutes = router;
