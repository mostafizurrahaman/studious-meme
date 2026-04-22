import ContactModel from './contact.model';
import { IContact } from './contact.interface';
import { AppError } from '../../utils';
import httpStatus from 'http-status';
import { IMeta } from '../../types';

// 1. adminGetAllContactsFromDB
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
            { company: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { subject: { $regex: searchTerm, $options: 'i' } },
            { products: { $regex: searchTerm, $options: 'i' } },
            { brand: { $regex: searchTerm, $options: 'i' } },
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

// 2. createContactInDB
const createContactInDB = async (contactData: IContact) => {
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
