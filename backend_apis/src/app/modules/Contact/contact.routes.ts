import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../User/user.constant';
import { ContactValidation } from './contact.validation';
import { ContactController } from './contact.controller';

const router = Router();

// adminGetAllContacts
router.route('/').get(auth(ROLE.ADMIN, ROLE.SUPER_ADMIN), ContactController.adminGetAllContacts);

// createContact
router
    .route('/')
    .post(
        auth(ROLE.USER, ROLE.ADMIN, ROLE.SUPER_ADMIN),
        validateRequest(ContactValidation.createContactValidation),
        ContactController.createContact,
    );

export const ContactRoutes = router;
