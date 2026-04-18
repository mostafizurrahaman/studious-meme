import { Types } from 'mongoose';

export interface IProduct {
    title: string;
    slug: string;
    sku: string;
    image: string;
    price: string;
    oldPrice?: string;
    badge?: string;
    brand: Types.ObjectId;
    category: Types.ObjectId;
    subCategorySlug?: string;
    stock: string;
    rating: string;
    isFeatured: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
