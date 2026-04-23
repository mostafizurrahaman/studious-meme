import { model, Schema, Types } from 'mongoose';

const HISTORY_TTL_SECONDS = 60 * 60 * 24 * 30;

type ComparisonHistoryEventDoc = {
    user: Types.ObjectId;
    product: Types.ObjectId;
    productSnapshot: {
        title: string;
        brand: string;
        category: string;
        subCategorySlug?: string;
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
    action: 'add' | 'remove';
    expireAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

const comparisonHistoryEventSchema = new Schema<ComparisonHistoryEventDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productSnapshot: {
            title: { type: String, required: true },
            brand: { type: String, required: true },
            category: { type: String, required: true },
            subCategorySlug: { type: String },
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
        action: { type: String, enum: ['add', 'remove'], required: true },
        expireAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + HISTORY_TTL_SECONDS * 1000),
        },
    },
    { timestamps: true, versionKey: false },
);

comparisonHistoryEventSchema.index(
    { expireAt: 1 },
    { expireAfterSeconds: 0, name: 'comparisonHistoryEvent_ttl_idx' },
);
comparisonHistoryEventSchema.index(
    { user: 1, createdAt: -1 },
    { name: 'comparisonHistoryEvent_user_createdAt_idx' },
);
comparisonHistoryEventSchema.index(
    { 'productSnapshot.category': 1, createdAt: -1 },
    { name: 'comparisonHistoryEvent_category_createdAt_idx' },
);

export const ComparisonHistoryEventModel = model<ComparisonHistoryEventDoc>(
    'ComparisonHistoryEvent',
    comparisonHistoryEventSchema,
);
