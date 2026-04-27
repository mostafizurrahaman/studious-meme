import httpStatus from "http-status";
import { AppError } from "../../utils";
import { BrandModel } from "../Brand/brand.model";
import { CategoryModel } from "../Category/category.model";
import { HeroSectionModel } from "./heroSection.model";
import { ProductModel } from "../Product/product.model";
import { IHeroSection } from "./heroSection.interface";
import { deleteImageFromCloudinary, uploadFilesAndInjectUrls } from "../../lib";
import { MulterFile } from "../../lib/upload";

const getHeroSectionImages = (
  heroSection: Pick<IHeroSection, "slides" | "features">,
) =>
  [...(heroSection.slides || []), ...(heroSection.features || [])]
    .map((card) => card.image)
    .filter(Boolean);

const deleteHeroSectionImages = async (
  heroSection: Pick<IHeroSection, "slides" | "features">,
) => {
  await Promise.all(
    getHeroSectionImages(heroSection).map((image) =>
      deleteImageFromCloudinary(image),
    ),
  );
};

const keepOnlyLatestHeroSection = async () => {
  const heroSections = await HeroSectionModel.find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .lean();

  if (heroSections.length <= 1) {
    return heroSections[0] ?? null;
  }

  const [latest, ...duplicates] = heroSections;

  await Promise.all(
    duplicates.map((heroSection) => deleteHeroSectionImages(heroSection)),
  );
  await HeroSectionModel.deleteMany({
    _id: { $in: duplicates.map((heroSection) => heroSection._id) },
  });

  return latest;
};

// 1. ensureHeroSectionImages
const ensureHeroSectionImages = (payload: Partial<IHeroSection>) => {
  const cards = [...(payload.slides || []), ...(payload.features || [])];

  const missing = cards.some((card) => !card.image);

  if (missing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Hero section image is required for every slide and feature card!",
    );
  }
};

// 2. getHomeContentFromDB
const getHomeContentFromDB = async () => {
  const [activeBrandIds, activeCategoryIds] = await Promise.all([
    BrandModel.find({ isActive: true }).distinct("_id"),
    CategoryModel.find({ isActive: true }).distinct("_id"),
  ]);
  const activeProductFilter = {
    isActive: true,
    brand: { $in: activeBrandIds },
    category: { $in: activeCategoryIds },
  };

  const [heroSection, brands, categories, featuredProducts, latestProducts] =
    await Promise.all([
      HeroSectionModel.findOne({ isActive: true }).lean(),
      BrandModel.find({ isActive: true }).sort({ name: 1 }).lean(),
      CategoryModel.find({ isActive: true }).sort({ name: 1 }).lean(),
      ProductModel.find({ ...activeProductFilter, isFeatured: true })
        .populate("brand")
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      ProductModel.find(activeProductFilter)
        .populate("brand")
        .populate("category")
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
const createHeroSectionIntoDB = async (
  payload: Partial<IHeroSection>,
  files?: MulterFile[] | unknown,
) => {
  const nextPayload = await uploadFilesAndInjectUrls(
    payload,
    Array.isArray(files) ? files : [],
  );
  ensureHeroSectionImages(nextPayload);

  const existing = await HeroSectionModel.findOne({}).sort({
    updatedAt: -1,
    createdAt: -1,
  });

  if (!existing) {
    const created = await HeroSectionModel.findOneAndUpdate({}, nextPayload, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    if (!created) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create hero section!",
      );
    }

    await keepOnlyLatestHeroSection();
    return created;
  }

  const previousImages = getHeroSectionImages(existing.toObject());
  const updated = await HeroSectionModel.findByIdAndUpdate(
    existing._id,
    nextPayload,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Hero section not found!");
  }

  await Promise.all(
    previousImages
      .filter(
        (image) => !getHeroSectionImages(updated.toObject()).includes(image),
      )
      .map((image) => deleteImageFromCloudinary(image)),
  );
  await keepOnlyLatestHeroSection();

  return updated;
};

// 4. getAllHeroSectionsFromDB
const getAllHeroSectionsFromDB = async () => {
  await keepOnlyLatestHeroSection();
  return HeroSectionModel.find({}).sort({ createdAt: -1 }).lean();
};

// 5. getHeroSectionByIdFromDB
const getHeroSectionByIdFromDB = async (id: string) => {
  const doc = await HeroSectionModel.findById(id).lean();
  if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Hero section not found!");
  return doc;
};

// 6. updateHeroSectionIntoDB
const updateHeroSectionIntoDB = async (
  id: string,
  payload: Partial<IHeroSection>,
  files?: MulterFile[] | unknown,
) => {
  const singleton = await HeroSectionModel.findOne({}).sort({
    updatedAt: -1,
    createdAt: -1,
  });

  if (!singleton) {
    throw new AppError(httpStatus.NOT_FOUND, "Hero section not found!");
  }

  const targetId = singleton._id.toString() || id;
  const previousImages = getHeroSectionImages(singleton.toObject());
  let updatedPayload: Partial<IHeroSection> | undefined;

  try {
    updatedPayload = await uploadFilesAndInjectUrls(
      payload,
      Array.isArray(files) ? files : [],
    );
    ensureHeroSectionImages(updatedPayload);

    const updated = await HeroSectionModel.findByIdAndUpdate(
      targetId,
      updatedPayload,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updated) {
      throw new AppError(httpStatus.NOT_FOUND, "Hero section not found!");
    }

    const nextImages = getHeroSectionImages(updated.toObject());
    await Promise.all(
      previousImages
        .filter((image) => !nextImages.includes(image))
        .map((image) => deleteImageFromCloudinary(image)),
    );

    await keepOnlyLatestHeroSection();

    return updated;
  } catch (error) {
    if (updatedPayload) {
      const nextImages = [
        ...(updatedPayload.slides || []),
        ...(updatedPayload.features || []),
      ]
        .map((card) => card.image)
        .filter(Boolean);
      const newImages = nextImages.filter(
        (image) => !previousImages.includes(image),
      );
      await Promise.all(
        newImages.map((image) => deleteImageFromCloudinary(image)),
      );
    }

    throw error;
  }
};

// 7. deleteHeroSectionFromDB
const deleteHeroSectionFromDB = async (id: string) =>
  HeroSectionModel.findByIdAndDelete(id);

export const HeroSectionService = {
  getHomeContentFromDB,
  createHeroSectionIntoDB,
  getAllHeroSectionsFromDB,
  getHeroSectionByIdFromDB,
  updateHeroSectionIntoDB,
  deleteHeroSectionFromDB,
};
