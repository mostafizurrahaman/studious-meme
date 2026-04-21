import { model, Schema, Types } from 'mongoose';

type ComparisonProductSnapshot = {
    title: string;
    brand: string;
    category: string;
    subCategorySlug: string;
    image: string;
    sku: string;
    slug: string;
    stock: number;
    rating: number;
    oldPrice?: number;
    isFeatured: boolean;
};

type ComparisonHistoryDoc = {
    user: Types.ObjectId;
    IDs: string[];
    products: ComparisonProductSnapshot[];
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
        stock: { type: Number, required: true },
        rating: { type: Number, required: true },
        oldPrice: { type: Number },
        isFeatured: { type: Boolean, required: true },
    },
    { _id: false },
);

const comparisonHistorySchema = new Schema<ComparisonHistoryDoc>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        IDs: { type: [String], required: true },
        products: { type: [comparisonProductSnapshotSchema], default: [] },
    },
    { timestamps: true, versionKey: false },
);

export const ComparisonHistoryModel = model<ComparisonHistoryDoc>('ComparisonHistory', comparisonHistorySchema);
