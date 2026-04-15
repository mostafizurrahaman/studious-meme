import { model, Schema } from 'mongoose';

type ComparisonProductSnapshot = {
    title: string;
    brand: string;
    sku: string;
    stock: string;
    rating: string;
    oldPrice?: string;
};

type ComparisonHistoryDoc = {
    skus: string[];
    products: ComparisonProductSnapshot[];
    createdAt?: Date;
    updatedAt?: Date;
};

const comparisonProductSnapshotSchema = new Schema<ComparisonProductSnapshot>(
    {
        title: { type: String, required: true },
        brand: { type: String, required: true },
        sku: { type: String, required: true },
        stock: { type: String, required: true },
        rating: { type: String, required: true },
        oldPrice: { type: String },
    },
    { _id: false },
);

const comparisonHistorySchema = new Schema<ComparisonHistoryDoc>(
    {
        skus: { type: [String], required: true },
        products: { type: [comparisonProductSnapshotSchema], default: [] },
    },
    { timestamps: true, versionKey: false },
);

export const ComparisonHistoryModel = model<ComparisonHistoryDoc>('ComparisonHistory', comparisonHistorySchema);
