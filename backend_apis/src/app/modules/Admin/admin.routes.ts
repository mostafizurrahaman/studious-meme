import { Router } from 'express';
import { auth, validateRequestFromFormData } from '../../middlewares';
import { multerUpload } from '../../lib';
import { ROLE } from '../User/user.constant';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = Router();

// 1. createAdmin
router
    .route('/admins')
    .post(
        auth(ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(AdminValidation.adminCreateSchema),
        AdminController.createAdmin,
    )
    .get(auth(ROLE.SUPER_ADMIN), AdminController.getAllAdmins);

// 2. getAdmin, updateAdmin, deleteAdmin
router
    .route('/admins/:userId')
    .get(auth(ROLE.SUPER_ADMIN), AdminController.getAdmin)
    .patch(
        auth(ROLE.SUPER_ADMIN),
        multerUpload.single('image'),
        validateRequestFromFormData(AdminValidation.adminUpdateSchema),
        AdminController.updateAdmin,
    )
    .delete(auth(ROLE.SUPER_ADMIN), AdminController.deleteAdmin);

export const AdminRoutes = router;
