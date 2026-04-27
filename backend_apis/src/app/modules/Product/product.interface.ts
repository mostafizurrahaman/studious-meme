import { Types } from "mongoose";

export interface IProduct {
  title: string;
  slug: string;
  sku: string;
  images: string[];
  features: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  subCategorySlug?: string;
  weightKg: number;
  stock?: number | null;
  rating: number;
  isFeatured: boolean;
  isNoCOD: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
