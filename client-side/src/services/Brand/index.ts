import { requestBackendJson } from '@/lib/backend-api';
import type { Brand as StorefrontBrand } from '@/lib/malamal-content';

type BackendEnvelope<T> = {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
};

export type BackendBrand = {
    name: string;
    slug: string;
    image?: string;
    description?: string;
    isActive: boolean;
};

export function mapBackendBrandToStorefrontBrand(brand: BackendBrand): StorefrontBrand {
    return {
        name: brand.name,
        href: '/shop-by-brands',
        image: brand.image ?? '/placeholder-brand.svg',
    };
}

export const getAllBrands = async (): Promise<BackendEnvelope<BackendBrand[]>> => {
    return requestBackendJson<BackendEnvelope<BackendBrand[]>>('/brand/brands', { method: 'GET' });
};

export const getBrandBySlug = async (slug: string): Promise<BackendEnvelope<BackendBrand>> => {
    return requestBackendJson<BackendEnvelope<BackendBrand>>(`/brand/brands/${slug}`, { method: 'GET' });
};
