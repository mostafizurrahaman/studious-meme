import { Types } from 'mongoose';

export interface IProduct {
    title: string;
    slug: string;
    sku: string;
    image: string;
    price: number;
    oldPrice?: number;
    badge?: string;
    brand: Types.ObjectId;
    category: Types.ObjectId;
    subCategorySlug?: string;
    stock: number;
    rating: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
