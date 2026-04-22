import type { CategoryPageEntry, StorefrontCategory } from '@/lib/storefront-types';

export type BackendSubCategory = {
    name: string;
    slug: string;
    image?: string;
    description?: string;
    accent?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type BackendCategory = {
    _id?: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    accent?: string;
    isActive?: boolean;
    subCategories?: BackendSubCategory[];
    createdAt?: string;
    updatedAt?: string;
};

const accentPalette = [
    'from-[#0e2f56] to-[#163f77]',
    'from-[#4d6b92] to-[#90a4c8]',
    'from-[#5f2d1f] to-[#c56c47]',
    'from-[#233647] to-[#5a7288]',
    'from-primary to-secondary',
    'from-[#3d5a48] to-[#80a27c]',
] as const;

const categoryImageBySlug: Record<string, string> = {
    'air-cooler-fans': '/category-air-cooler.svg',
    'cleaning-maintenance': '/category-cleaning.svg',
    'construction-machinery': '/category-construction.svg',
    electrical: '/category-electrical.svg',
    'electrical-tools': '/category-electrical.svg',
    'power-tools': '/category-power-tools.svg',
    'welding-cutting': '/category-welding.svg',
    'commercial-packaging': '/category-packaging.svg',
    'commercial-packaging-equipment': '/category-packaging.svg',
    'material-handling': '/category-handling.svg',
    'material-handling-equipment': '/category-handling.svg',
};

function getAccent(slug: string, accent?: string): string {
    if (accent?.trim()) {
        return accent;
    }

    const sum = Array.from(slug).reduce((total, char) => total + char.charCodeAt(0), 0);
    return accentPalette[sum % accentPalette.length];
}

export function mapBackendCategoryToStorefrontCategory(category: BackendCategory): StorefrontCategory {
    return {
        name: category.name,
        slug: category.slug,
        href: `/category/${category.slug}`,
        image: category.image ?? categoryImageBySlug[category.slug] ?? '/globe.svg',
        description: category.description ?? `${category.name} catalog and related hardware listings.`,
        accent: getAccent(category.slug, category.accent),
    };
}

export function mapBackendCategoryToCategoryPageEntry(category: BackendCategory): CategoryPageEntry {
    return mapBackendCategoryToStorefrontCategory(category);
}
