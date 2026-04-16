'use server';

import { requestBackendJson } from '@/lib/backend-api';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export type BackendHeroCard = {
    image: string;
    imageAlt: string;
    title: string;
    description: string;
    clickUrl: string;
};

export type BackendHeroSection = {
    slides: BackendHeroCard[];
    features: BackendHeroCard[];
    isActive: boolean;
};

export const getHomeContent = async (): Promise<
    BackendEnvelope<{
        heroSection: BackendHeroSection;
        brands: unknown[];
        categories: unknown[];
        featuredProducts: unknown[];
        latestProducts: unknown[];
    }>
> => {
    return requestBackendJson<
        BackendEnvelope<{
            heroSection: BackendHeroSection;
            brands: unknown[];
            categories: unknown[];
            featuredProducts: unknown[];
            latestProducts: unknown[];
        }>
    >('/hero/home', { method: 'GET' });
};

export const getAllHeroSections = async (): Promise<BackendEnvelope<BackendHeroSection[]>> => {
    return requestBackendJson<BackendEnvelope<BackendHeroSection[]>>('/hero/heroes', { method: 'GET' });
};

export const getHeroSectionById = async (id: string): Promise<BackendEnvelope<BackendHeroSection>> => {
    return requestBackendJson<BackendEnvelope<BackendHeroSection>>(`/hero/heroes/${id}`, { method: 'GET' });
};
