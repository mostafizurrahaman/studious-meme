export { ProductModel, type IProduct } from '../Storefront/Product/product.model';
import { model, Schema } from 'mongoose';

export interface IProductPrice {
    productId?: string;
    productName?: string;
    category?: string;
    unit?: string;
    unitSize?: string;
    currency?: string;
    price?: number;
    unitPrice?: number;
    discount?: number;
    sourceUrl?: string;
    imageUrl?: string;
    shop?: string;
}

export interface IShop {
    name: string;
    website?: string;
    address?: string;
    location?: { type: 'Point'; coordinates: [number, number] };
    createdAt?: Date;
    updatedAt?: Date;
}

const productPriceSchema = new Schema<IProductPrice>(
    {
        productId: { type: String },
        productName: { type: String },
        category: { type: String },
        unit: { type: String },
        unitSize: { type: String },
        currency: { type: String },
        price: { type: Number },
        unitPrice: { type: Number },
        discount: { type: Number },
        sourceUrl: { type: String },
        imageUrl: { type: String },
        shop: { type: String },
    },
    { timestamps: true, versionKey: false },
);

const shopSchema = new Schema<IShop>(
    {
        name: { type: String },
        website: { type: String },
        address: { type: String },
        location: {
            type: {
                type: String,
                default: 'Point',
            },
            coordinates: { type: [Number], default: undefined },
        },
    },
    { timestamps: true, versionKey: false },
);

export const ProductPriceModel = model<IProductPrice>('ProductPrice', productPriceSchema);
export const ShopModel = model<IShop>('Shop', shopSchema);
