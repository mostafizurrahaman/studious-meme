export type StorefrontProduct = {
    title: string;
    slug: string;
    href: '/shop';
    image: string;
    price: string;
    oldPrice?: string;
    badge?: string;
    brand: string;
    sku: string;
    stock: string;
    rating: string;
    category: string;
    categorySlug?: string;
    isFeatured?: boolean;
    createdAt?: string;
};

export type Product = StorefrontProduct;

export type StorefrontCategory = {
    name: string;
    slug: string;
    href: `/category/${string}`;
    image?: string;
    description: string;
    accent: string;
};

export type Category = StorefrontCategory;

export type StorefrontBrand = {
    name: string;
    slug: string;
    href: `/shop?b=${string}`;
    image?: string;
};

export type Brand = StorefrontBrand;

export type CategoryShowcaseEntry = {
    title: string;
    slug: string;
    href: `/category/${string}`;
    description: string;
    accent: string;
};

export type CategoryPageEntry = StorefrontCategory | CategoryShowcaseEntry;
