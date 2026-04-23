import { model, Schema, Types } from 'mongoose';

type ComparisonProductSnapshot = {
    title: string;
    brand: string;
    category: string;
    subCategorySlug: string;
    image: string;
    sku: string;
    slug: string;
    price: number;
    stock: number;
    rating: number;
    oldPrice?: number;
    isFeatured: boolean;
    weightKg?: number;
    isNoCOD?: boolean;
};

type ComparisonHistoryDoc = {
    user: Types.ObjectId;
    product: Types.ObjectId;
    productSnapshot: ComparisonProductSnapshot;
    createdAt?: Date;
    updatedAt?: Date;
};

const comparisonProductSnapshotSchema = new Schema<ComparisonProductSnapshot>(
    {
        title: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        subCategorySlug: { type: String, required: true },
        image: { type: String, required: true },
        sku: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        rating: { type: Number, required: true },
        oldPrice: { type: Number },
        isFeatured: { type: Boolean, required: true },
        weightKg: { type: Number },
        isNoCOD: { type: Boolean },
    },
    { _id: false },
);

const comparisonHistorySchema = new Schema<ComparisonHistoryDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productSnapshot: { type: comparisonProductSnapshotSchema, required: true },
    },
    { timestamps: true, versionKey: false },
);

comparisonHistorySchema.index({ user: 1, product: 1 }, { unique: true });
comparisonHistorySchema.index({ user: 1, createdAt: -1 }, { name: 'comparisonHistory_user_createdAt_idx' });
comparisonHistorySchema.index(
    { user: 1, 'productSnapshot.category': 1 },
    { name: 'comparisonHistory_user_category_idx' },
);

export const ComparisonHistoryModel = model<ComparisonHistoryDoc>(
    'ComparisonHistory',
    comparisonHistorySchema,
);
