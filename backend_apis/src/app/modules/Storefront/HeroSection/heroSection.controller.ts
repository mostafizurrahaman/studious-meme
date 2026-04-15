import httpStatus from 'http-status';
import { AppError, asyncHandler, sendResponse } from '../../../utils';
import { HeroSectionService } from './heroSection.service';

const getParam = (value: string | string[]) => (Array.isArray(value) ? value[0] : value);

const getHomeContent = asyncHandler(async (_req, res) => {
    const result = await HeroSectionService.getHomeContentFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Home content fetched successfully!', data: result });
});

const createHeroSection = asyncHandler(async (req, res) => {
    const result = await HeroSectionService.createHeroSectionIntoDB(req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, message: 'Hero section created successfully!', data: result });
});

const getAllHeroSections = asyncHandler(async (_req, res) => {
    const result = await HeroSectionService.getAllHeroSectionsFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Hero sections fetched successfully!', data: result });
});

const getHeroSection = asyncHandler(async (req, res) => {
    const result = await HeroSectionService.getHeroSectionByIdFromDB(getParam(req.params.heroSectionId));
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Hero section fetched successfully!', data: result });
});

const updateHeroSection = asyncHandler(async (req, res) => {
    const result = await HeroSectionService.updateHeroSectionIntoDB(getParam(req.params.heroSectionId), req.body);
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Hero section not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Hero section updated successfully!', data: result });
});

const deleteHeroSection = asyncHandler(async (req, res) => {
    const result = await HeroSectionService.deleteHeroSectionFromDB(getParam(req.params.heroSectionId));
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Hero section not found!');
    sendResponse(res, { statusCode: httpStatus.OK, message: 'Hero section deleted successfully!', data: result });
});

export const HeroSectionController = {
    getHomeContent,
    createHeroSection,
    getAllHeroSections,
    getHeroSection,
    updateHeroSection,
    deleteHeroSection,
};
