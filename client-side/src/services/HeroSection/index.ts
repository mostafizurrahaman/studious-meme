'use server';

import { updateTag } from 'next/cache';

import { requestBackendJson } from '@/lib/backend-api';
import { getValidAccessTokenForServerActions } from '@/lib/getValidAccessToken';
import type { BackendBrand } from '@/services/Brand';
import type { BackendCategory } from '@/services/Category/mappers';
import type { BackendProduct } from '@/services/Product';

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
    _id?: string;
    slides: BackendHeroCard[];
    features: BackendHeroCard[];
    isActive: boolean;
};

export const getHomeContent = async (): Promise<
    BackendEnvelope<{
        heroSection: BackendHeroSection;
        brands: BackendBrand[];
        categories: BackendCategory[];
        featuredProducts: BackendProduct[];
        latestProducts: BackendProduct[];
    }>
> => {
    return requestBackendJson<
        BackendEnvelope<{
            heroSection: BackendHeroSection;
            brands: BackendBrand[];
            categories: BackendCategory[];
            featuredProducts: BackendProduct[];
            latestProducts: BackendProduct[];
        }>
    >('/hero/home', { method: 'GET' });
};

export const getAllHeroSections = async (): Promise<BackendEnvelope<BackendHeroSection[]>> => {
    return requestBackendJson<BackendEnvelope<BackendHeroSection[]>>('/hero/heroes', { method: 'GET' });
};

export const getHeroSectionById = async (id: string): Promise<BackendEnvelope<BackendHeroSection>> => {
    return requestBackendJson<BackendEnvelope<BackendHeroSection>>(`/hero/heroes/${id}`, { method: 'GET' });
};

type HeroMutationPayload = {
    slides: BackendHeroCard[];
    features: BackendHeroCard[];
    isActive?: boolean;
};

function toFormData(payload: Record<string, unknown>) {
    const formData = new FormData();
    formData.set('data', JSON.stringify(payload));
    return formData;
}

export const createHeroSection = async (payload: HeroMutationPayload): Promise<BackendEnvelope<BackendHeroSection>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendHeroSection>>('/hero/heroes', {
        method: 'POST',
        body: toFormData(payload),
        token: accessToken ?? undefined,
    });

    updateTag('HERO');
    return result;
};

export const updateHeroSection = async (
    id: string,
    payload: Partial<HeroMutationPayload>,
): Promise<BackendEnvelope<BackendHeroSection>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendHeroSection>>(`/hero/heroes/${id}`, {
        method: 'PATCH',
        body: toFormData(payload),
        token: accessToken ?? undefined,
    });

    updateTag('HERO');
    return result;
};

export const deleteHeroSection = async (id: string): Promise<BackendEnvelope<BackendHeroSection>> => {
    const accessToken = await getValidAccessTokenForServerActions();
    const result = await requestBackendJson<BackendEnvelope<BackendHeroSection>>(`/hero/heroes/${id}`, {
        method: 'DELETE',
        token: accessToken ?? undefined,
    });

    updateTag('HERO');
    return result;
};
