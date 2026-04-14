import { IPagePayload } from './page.interface';
import { Page } from './page.model';

// createOrUpdatePageIntoDB
const createOrUpdatePageIntoDB = async (payload: IPagePayload) => {
    const result = await Page.findOneAndUpdate({ slug: payload.slug }, payload, {
        upsert: true,
        returnDocument: 'after',
    });

    return result;
};

// getAllPagesFromDB
const getAllPagesFromDB = async () => {
    const result = await Page.find();

    return result;
};

// getPageBySlugFromDB
const getPageBySlugFromDB = async (slug: string) => {
    const result = await Page.findOne({ slug });

    return result;
};

export const PageService = {
    createOrUpdatePageIntoDB,
    getAllPagesFromDB,
    getPageBySlugFromDB,
};
