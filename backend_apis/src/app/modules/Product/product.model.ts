import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IShop extends Document {
    name: string;
    website?: string;

    address?: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductPrice extends Document {
    productId?: string;
    productName: string;
    category?: string;
    price: number;
    unitPrice: number;
    currency: string;
    unit: string; // e.g., kg, L, piece
    unitSize: string;
    discount?: number;
    shop: Types.ObjectId;
    // raw source refs to help debug
    sourceActor?: string;
    sourceUrl?: string;
    imageUrl?: string;
    updatedAt: Date;
    createdAt: Date;
}

const ShopSchema = new Schema<IShop>(
    {
        name: { type: String, required: true, index: true },
        website: { type: String },

        address: { type: String },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], index: '2dsphere' },
        },
    },
    { timestamps: true, versionKey: false },
);

const ProductPriceSchema = new Schema<IProductPrice>(
    {
        productId: { type: String, index: true },
        productName: { type: String, required: true, index: true },
        category: { type: String, index: true },
        price: { type: Number, required: true, index: true },
        unitPrice: { type: Number, required: true, index: true },
        currency: { type: String, required: true, default: 'EUR' },
        unit: { type: String },
        unitSize: { type: String },
        discount: { type: Number },
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
            index: true,
        },
        sourceActor: { type: String },
        sourceUrl: { type: String },
        imageUrl: { type: String },
    },
    { timestamps: true, versionKey: false },
);

// Useful compound index to avoid duplicates on periodic runs
ProductPriceSchema.index({ productName: 1, unit: 1, shop: 1 }, { name: 'uniq_product_shop', unique: false });

// TTL (Time To Live) index... this will remove a document after 7 days
// ProductPriceSchema.index(
//   { createdAt: 1 },
//   { expireAfterSeconds: 7 * 24 * 60 * 60 },
// );

export const ShopModel = mongoose.model<IShop>('Shop', ShopSchema);

export const ProductPriceModel = mongoose.model<IProductPrice>('ProductPrice', ProductPriceSchema);
