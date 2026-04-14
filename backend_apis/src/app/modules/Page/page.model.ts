import { model, Schema } from 'mongoose';
import { IPage } from './page.interface';
import { PageSlugs } from './page.constant';

const pageSchema = new Schema<IPage>(
    {
        slug: {
            type: String,
            enum: Object.values(PageSlugs),
            required: [true, 'Slug is required!'],
        },
        title: {
            type: String,
            required: [true, 'Title is required!'],
        },
        content: {
            type: String,
            required: [true, 'Content is required!'],
        },
    },
    { timestamps: true, versionKey: false },
);

export const Page = model<IPage>('Page', pageSchema);
