import { model, Schema } from 'mongoose';
import { IBrand } from './brand.interface';

const brandSchema = new Schema<IBrand>(
    {
        name: { type: String, required: [true, 'Brand name is required!'], index: true },
        slug: { type: String, required: [true, 'Brand slug is required!'], unique: true, index: true },
        image: { type: String },
        description: { type: String },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true, versionKey: false },
);

export const BrandModel = model<IBrand>('Brand', brandSchema);
