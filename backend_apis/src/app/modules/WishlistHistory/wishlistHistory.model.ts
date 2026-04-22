import { model, Schema, Types } from 'mongoose';

type WishlistProductSnapshot = {
    title: string;
    brand: string;
    category: string;
    image: string;
    sku: string;
    slug: string;
    price: number;
    stock: number;
};

type WishlistHistoryDoc = {
    user: Types.ObjectId;
    product: Types.ObjectId;
    productSnapshot: WishlistProductSnapshot;
    createdAt?: Date;
    updatedAt?: Date;
};

const wishlistProductSnapshotSchema = new Schema<WishlistProductSnapshot>(
    {
        title: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        sku: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
    },
    { _id: false },
);

const wishlistHistorySchema = new Schema<WishlistHistoryDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        productSnapshot: { type: wishlistProductSnapshotSchema, required: true },
    },
    { timestamps: true, versionKey: false },
);

wishlistHistorySchema.index({ user: 1, product: 1 }, { unique: true });

export const WishlistHistoryModel = model<WishlistHistoryDoc>('WishlistHistory', wishlistHistorySchema);
