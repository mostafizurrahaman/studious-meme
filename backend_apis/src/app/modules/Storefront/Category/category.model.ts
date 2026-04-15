import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: [true, 'Category name is required!'], index: true },
        slug: { type: String, required: [true, 'Category slug is required!'], unique: true, index: true },
        subCategories: {
            type: [
                new Schema(
                    {
                        name: { type: String, required: true },
                        slug: { type: String, required: true },
                        image: { type: String },
                        description: { type: String },
                        accent: { type: String },
                        isActive: { type: Boolean, default: true },
                    },
                    { _id: false },
                ),
            ],
            default: [],
        },
        image: { type: String },
        description: { type: String },
        accent: { type: String },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true, versionKey: false },
);

export const CategoryModel = model<ICategory>('Category', categorySchema);
