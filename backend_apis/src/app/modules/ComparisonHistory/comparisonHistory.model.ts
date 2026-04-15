import { model, Schema } from 'mongoose';

type ComparisonProductSnapshot = {
    title: string;
    brand: string;
    category: string;
    subCategorySlug: string;
    image: string;
    sku: string;
    slug: string;
    stock: string;
    rating: string;
    oldPrice?: string;
    isFeatured: boolean;
};

type ComparisonHistoryDoc = {
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
        stock: { type: String, required: true },
        rating: { type: String, required: true },
        oldPrice: { type: String },
        isFeatured: { type: Boolean, required: true },
    },
    { _id: false },
);

const comparisonHistorySchema = new Schema<ComparisonHistoryDoc>(
    {
        IDs: { type: [String], required: true },
        products: { type: [comparisonProductSnapshotSchema], default: [] },
    },
    { timestamps: true, versionKey: false },
);

export const ComparisonHistoryModel = model<ComparisonHistoryDoc>('ComparisonHistory', comparisonHistorySchema);
