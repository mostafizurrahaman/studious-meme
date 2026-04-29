"use server";

import { revalidateTag } from "next/cache";
import { requestBackendJson } from "@/lib/backend-api";
import { CACHE_REVALIDATE } from "@/lib/cache-revalidate";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getValidAccessTokenForServerActions } from "@/lib/getValidAccessToken";
import type { BackendBrand } from "@/services/Brand";
import type { BackendCategory } from "@/services/Category/mappers";
import type { BackendProduct } from "@/services/Product";

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

export type HeroSectionFormCard = {
  image: string | File | null;
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
  >("/hero/home", {
    method: "GET",
    next: {
      revalidate: CACHE_REVALIDATE.LONG,
      tags: [
        CACHE_TAGS.HOME_CONTENT,
        CACHE_TAGS.MARKETING_CONTENT,
        CACHE_TAGS.PRODUCTS,
        CACHE_TAGS.FEATURED_PRODUCTS,
        CACHE_TAGS.LATEST_PRODUCTS,
        CACHE_TAGS.BRANDS,
        CACHE_TAGS.CATEGORIES,
      ],
    },
  });
};

export const getAllHeroSections = async (): Promise<
  BackendEnvelope<BackendHeroSection[]>
> => {
  return requestBackendJson<BackendEnvelope<BackendHeroSection[]>>(
    "/hero/heroes",
    {
      method: "GET",
      next: { revalidate: CACHE_REVALIDATE.LONG, tags: [CACHE_TAGS.HERO, CACHE_TAGS.MARKETING_CONTENT] },
    },
  );
};

export const getHeroSectionById = async (
  id: string,
): Promise<BackendEnvelope<BackendHeroSection>> => {
  return requestBackendJson<BackendEnvelope<BackendHeroSection>>(
    `/hero/heroes/${id}`,
    {
      method: "GET",
      next: { revalidate: CACHE_REVALIDATE.LONG, tags: [CACHE_TAGS.HERO, CACHE_TAGS.MARKETING_CONTENT] },
    },
  );
};

type HeroMutationPayload = {
  slides: HeroSectionFormCard[];
  features: HeroSectionFormCard[];
  isActive?: boolean;
};

function toFormData(payload: Partial<HeroMutationPayload>) {
  const formData = new FormData();
  const slides = payload.slides ?? [];
  const features = payload.features ?? [];

  const normalizedPayload = {
    ...payload,
    slides: slides.map(({ image, ...slide }) => ({
      ...slide,
      ...(typeof image === "string" && image ? { image } : {}),
    })),
    features: features.map(({ image, ...feature }) => ({
      ...feature,
      ...(typeof image === "string" && image ? { image } : {}),
    })),
  };

  formData.set("data", JSON.stringify(normalizedPayload));

  slides.forEach((card, index) => {
    if (card.image instanceof File) {
      formData.append(`slides.${index}.image`, card.image);
    }
  });

  features.forEach((card, index) => {
    if (card.image instanceof File) {
      formData.append(`features.${index}.image`, card.image);
    }
  });

  return formData;
}

export const createHeroSection = async (
  payload: HeroMutationPayload,
): Promise<BackendEnvelope<BackendHeroSection>> => {
  const accessToken = await getValidAccessTokenForServerActions();
  const result = await requestBackendJson<BackendEnvelope<BackendHeroSection>>(
    "/hero/heroes",
    {
      method: "POST",
      body: toFormData(payload),
      token: accessToken ?? undefined,
    },
  );

  revalidateTag(CACHE_TAGS.HERO, 'max');
  revalidateTag(CACHE_TAGS.HOME_CONTENT, 'max');
  revalidateTag(CACHE_TAGS.MARKETING_CONTENT, 'max');
  return result;
};

export const updateHeroSection = async (
  id: string,
  payload: Partial<HeroMutationPayload>,
): Promise<BackendEnvelope<BackendHeroSection>> => {
  const accessToken = await getValidAccessTokenForServerActions();
  const result = await requestBackendJson<BackendEnvelope<BackendHeroSection>>(
    `/hero/heroes/${id}`,
    {
      method: "PATCH",
      body: toFormData(payload),
      token: accessToken ?? undefined,
    },
  );

  revalidateTag(CACHE_TAGS.HERO, 'max');
  revalidateTag(CACHE_TAGS.HOME_CONTENT, 'max');
  revalidateTag(CACHE_TAGS.MARKETING_CONTENT, 'max');
  return result;
};

export const deleteHeroSection = async (
  id: string,
): Promise<BackendEnvelope<BackendHeroSection>> => {
  const accessToken = await getValidAccessTokenForServerActions();
  const result = await requestBackendJson<BackendEnvelope<BackendHeroSection>>(
    `/hero/heroes/${id}`,
    {
      method: "DELETE",
      token: accessToken ?? undefined,
    },
  );

  revalidateTag(CACHE_TAGS.HERO, 'max');
  revalidateTag(CACHE_TAGS.HOME_CONTENT, 'max');
  revalidateTag(CACHE_TAGS.MARKETING_CONTENT, 'max');
  return result;
};
