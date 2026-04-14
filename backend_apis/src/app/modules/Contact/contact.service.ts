import ContactModel from './contact.model';
import { IContact } from './contact.interface';
import { AppError } from '../../utils';
import httpStatus from 'http-status';
import { IUser } from '../User/user.interface';
import { IMeta } from '../../types';

// adminGetAllContactsFromDB
const adminGetAllContactsFromDB = async (
    query: Record<string, unknown>,
): Promise<{ data: IContact[]; meta: IMeta }> => {
    const { page, limit, searchTerm } = query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const filters: Record<string, unknown> = {};

    if (searchTerm) {
        filters.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { subject: { $regex: searchTerm, $options: 'i' } },
            { message: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    const [contacts, total] = await Promise.all([
        ContactModel.find(filters).select('-updatedAt').sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
        ContactModel.countDocuments(filters),
    ]);

    const meta: IMeta = {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPage: Math.ceil(total / limitNumber) || 0,
    };

    return { data: contacts, meta };
};

// createContactInDB
const createContactInDB = async (userData: IUser, contactData: IContact) => {
    contactData.name = userData?.name;
    contactData.email = userData?.email;
    contactData.phone = userData?.phone;

    const contact = await ContactModel.create(contactData);

    if (!contact) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create message!');
    }

    return null;
};

export const ContactService = {
    adminGetAllContactsFromDB,
    createContactInDB,
};
