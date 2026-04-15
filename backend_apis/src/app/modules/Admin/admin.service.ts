import httpStatus from 'http-status';
import { AppError, sendOtpEmail } from '../../utils';
import { generateOtp } from '../../lib';
import { OTP_EXPIRY_MINUTES, ROLE } from '../User/user.constant';
import UserModel from '../User/user.model';
import { IAdminCreatePayload } from './admin.interface';

const createAdminIntoDB = async (payload: IAdminCreatePayload) => {
    const existing = await UserModel.isUserExistsByEmailWithPassword(payload.email);

    if (existing) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists!');
    }

    const otp = generateOtp();
    await sendOtpEmail({ email: payload.email, otp, name: payload.name });

    const admin = await UserModel.create({
        ...payload,
        role: ROLE.ADMIN,
        otp,
        otpExpiry: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        isVerifiedByOTP: false,
    });

    return {
        userId: admin._id,
        email: admin.email,
        role: admin.role,
    };
};

const getAllAdminsFromDB = async () => {
    return UserModel.find({ role: ROLE.ADMIN })
        .select('name email phone image role isActive createdAt updatedAt')
        .sort({ createdAt: -1 })
        .lean();
};

const getAdminByIdFromDB = async (userId: string) => {
    const admin = await UserModel.findOne({ _id: userId, role: ROLE.ADMIN })
        .select('name email phone image role isActive createdAt updatedAt')
        .lean();

    if (!admin) {
        throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
    }

    return admin;
};

const updateAdminIntoDB = async (
    userId: string,
    payload: Partial<IAdminCreatePayload> & { isActive?: boolean },
) => {
    const admin = await UserModel.findOneAndUpdate({ _id: userId, role: ROLE.ADMIN }, payload, {
        new: true,
        runValidators: true,
    }).select('name email phone image role isActive createdAt updatedAt');

    if (!admin) {
        throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
    }

    return admin;
};

const deleteAdminFromDB = async (userId: string) => {
    const admin = await UserModel.findOneAndUpdate(
        { _id: userId, role: ROLE.ADMIN },
        { isDeleted: true, isActive: false },
        { new: true },
    ).select('name email phone image role isActive isDeleted createdAt updatedAt');

    if (!admin) {
        throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
    }

    return admin;
};

export const AdminService = {
    createAdminIntoDB,
    getAllAdminsFromDB,
    getAdminByIdFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
};
