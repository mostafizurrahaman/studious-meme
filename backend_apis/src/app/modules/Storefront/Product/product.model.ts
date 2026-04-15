import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
    {
        title: { type: String, required: [true, 'Product title is required!'], index: true },
        slug: { type: String, required: [true, 'Product slug is required!'], unique: true, index: true },
        sku: { type: String, required: [true, 'SKU is required!'], unique: true, index: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
        oldPrice: { type: String },
        badge: { type: String },
        brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
        subCategorySlug: { type: String, index: true },
        stock: { type: String, required: true },
        rating: { type: String, required: true },
        isFeatured: { type: Boolean, default: false, index: true },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true, versionKey: false },
);

productSchema.index({ category: 1, subCategorySlug: 1, isFeatured: 1 }, { name: 'product_category_index' });

export const ProductModel = model<IProduct>('Product', productSchema);
