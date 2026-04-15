import httpStatus from 'http-status';
import { AppError } from '../../utils';
import { BrandModel } from '../Brand/brand.model';
import { CategoryModel } from '../Category/category.model';
import { HeroSectionModel } from './heroSection.model';
import { ProductModel } from '../Product/product.model';
import { IHeroSection } from './heroSection.interface';
import { deleteImageFromCloudinary, uploadFilesAndInjectUrls } from '../../lib';
import { MulterFile } from '../../lib/upload';

// 1. ensureHeroSectionImages
const ensureHeroSectionImages = (payload: Partial<IHeroSection>) => {
    const cards = [...(payload.slides || []), ...(payload.features || [])];

    const missing = cards.some(card => !card.image);

    if (missing) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Hero section image is required for every slide and feature card!',
        );
    }
};

// 2. getHomeContentFromDB
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

// 3. createHeroSectionIntoDB
const createHeroSectionIntoDB = async (payload: Partial<IHeroSection>, files?: MulterFile[] | unknown) => {
    const nextPayload = await uploadFilesAndInjectUrls(payload, Array.isArray(files) ? files : []);
    ensureHeroSectionImages(nextPayload);
    return HeroSectionModel.create(nextPayload);
};

// 4. getAllHeroSectionsFromDB
const getAllHeroSectionsFromDB = async () => HeroSectionModel.find({}).sort({ createdAt: -1 }).lean();

// 5. getHeroSectionByIdFromDB
const getHeroSectionByIdFromDB = async (id: string) => {
    const doc = await HeroSectionModel.findById(id).lean();
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Hero section not found!');
    return doc;
};

// 6. updateHeroSectionIntoDB
const updateHeroSectionIntoDB = async (
    id: string,
    payload: Partial<IHeroSection>,
    files?: MulterFile[] | unknown,
) => {
    const existing = await HeroSectionModel.findById(id);

    if (!existing) {
        return null;
    }

    const previousImages = [...existing.slides, ...existing.features].map(card => card.image).filter(Boolean);
    let updatedPayload: Partial<IHeroSection> | undefined;

    try {
        updatedPayload = await uploadFilesAndInjectUrls(payload, Array.isArray(files) ? files : []);
        ensureHeroSectionImages(updatedPayload);

        const updated = await HeroSectionModel.findByIdAndUpdate(id, updatedPayload, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return null;
        }

        const nextImages = [...updated.slides, ...updated.features].map(card => card.image).filter(Boolean);
        await Promise.all(
            previousImages
                .filter(image => !nextImages.includes(image))
                .map(image => deleteImageFromCloudinary(image)),
        );

        return updated;
    } catch (error) {
        if (updatedPayload) {
            const nextImages = [...(updatedPayload.slides || []), ...(updatedPayload.features || [])]
                .map(card => card.image)
                .filter(Boolean);
            const newImages = nextImages.filter(image => !previousImages.includes(image));
            await Promise.all(newImages.map(image => deleteImageFromCloudinary(image)));
        }

        throw error;
    }
};

// 7. deleteHeroSectionFromDB
const deleteHeroSectionFromDB = async (id: string) => HeroSectionModel.findByIdAndDelete(id);

export const HeroSectionService = {
    getHomeContentFromDB,
    createHeroSectionIntoDB,
    getAllHeroSectionsFromDB,
    getHeroSectionByIdFromDB,
    updateHeroSectionIntoDB,
    deleteHeroSectionFromDB,
};
