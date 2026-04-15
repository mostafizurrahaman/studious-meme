import httpStatus from 'http-status';
import { AppError } from '../../../utils';
import { BrandModel } from '../Brand/brand.model';
import { CategoryModel } from '../Category/category.model';
import { HeroSectionModel } from './heroSection.model';
import { ProductModel } from '../Product/product.model';
import { IHeroSection } from './heroSection.interface';

const getHomeContentFromDB = async () => {
    const [heroSection, brands, categories, featuredProducts, latestProducts] = await Promise.all([
        HeroSectionModel.findOne({ isActive: true }).lean(),
        BrandModel.find({ isActive: true }).sort({ name: 1 }).lean(),
        CategoryModel.find({ isActive: true }).sort({ name: 1 }).lean(),
        ProductModel.find({ isActive: true, isFeatured: true })
            .populate('brand')
            .populate('category')
            .sort({ createdAt: -1 })
            .limit(12)
            .lean(),
        ProductModel.find({ isActive: true })
            .populate('brand')
            .populate('category')
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(),
    ]);

    return {
        heroSection: heroSection || { slides: [], features: [] },
        brands,
        categories,
        featuredProducts,
        latestProducts,
    };
};

const createHeroSectionIntoDB = async (payload: Partial<IHeroSection>) => HeroSectionModel.create(payload);
const getAllHeroSectionsFromDB = async () => HeroSectionModel.find({}).sort({ createdAt: -1 }).lean();
const getHeroSectionByIdFromDB = async (id: string) => {
    const doc = await HeroSectionModel.findById(id).lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Hero section not found!');
    return doc;
};
const updateHeroSectionIntoDB = async (id: string, payload: Partial<IHeroSection>) =>
    HeroSectionModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
const deleteHeroSectionFromDB = async (id: string) => HeroSectionModel.findByIdAndDelete(id);

export const HeroSectionService = {
    getHomeContentFromDB,
    createHeroSectionIntoDB,
    getAllHeroSectionsFromDB,
    getHeroSectionByIdFromDB,
    updateHeroSectionIntoDB,
    deleteHeroSectionFromDB,
};
