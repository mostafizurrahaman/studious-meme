import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required!'],
            unique: [true, 'Category name must be unique!'],
            index: true,
        },
        slug: {
            type: String,
            required: [true, 'Category slug is required!'],
            unique: [true, 'Category slug must be unique!'],
            index: true,
        },
        subCategories: {
            type: [
                new Schema(
                    {
                        name: {
                            type: String,
                            required: [true, 'SubCategory name is required!'],
                        },
                        slug: {
                            type: String,
                            required: [true, 'SubCategory slug is required!'],
                        },
                        image: { type: String },
                        description: { type: String },
                        accent: { type: String },
                        isActive: { type: Boolean, default: true },
                    },
                    { _id: false },
                ),
            ],
            default: [],
            validate: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                validator: function (value: any[]) {
                    const names = value.map(v => v.name);
                    const slugs = value.map(v => v.slug);

                    return new Set(names).size === names.length && new Set(slugs).size === slugs.length;
                },
                message: 'SubCategory name and slug must be unique within a category!',
            },
        },
        image: { type: String },
        description: { type: String },
        accent: { type: String },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true, versionKey: false },
);

export const CategoryModel = model<ICategory>('Category', categorySchema);
