import { siteConfig } from '@/lib/seo';
import { allProducts, categoryPages } from '@/lib/malamal-content';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = (siteConfig.url ?? '').replace(/\/+$/, '');

    if (!baseUrl) {
        return [];
    }

    const toAbsoluteUrl = (path: string) => new URL(path, baseUrl).toString();
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: toAbsoluteUrl('/'),
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: toAbsoluteUrl('/shop'),
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: toAbsoluteUrl('/main-categories'),
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: toAbsoluteUrl('/shop-by-brands'),
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: toAbsoluteUrl('/promotions'),
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: toAbsoluteUrl('/our-contacts'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: toAbsoluteUrl('/quotation-request'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: toAbsoluteUrl('/about-us'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: toAbsoluteUrl('/terms-and-conditions'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: toAbsoluteUrl('/privacy-policy'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: toAbsoluteUrl('/return-policy'),
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = categoryPages.map(category => ({
        url: toAbsoluteUrl(`/category/${category.slug}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const productRoutes: MetadataRoute.Sitemap = allProducts.map(product => ({
        url: toAbsoluteUrl(`/product/${product.slug}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
