import { siteConfig } from '@/lib/seo';
import { getAllProducts, mapBackendProductToStorefrontProduct } from '@/services/Product';
import { getAllCategoriesWithTotalNewsCount } from '@/services/Category';
import {
  mapBackendCategoryToStorefrontCategory,
  type BackendCategory,
} from '@/services/Category/mappers';
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

  const [categoriesResult, productsResult] = await Promise.all([
    getAllCategoriesWithTotalNewsCount().catch(() => null),
    getAllProducts({ limit: 10000 }).catch(() => null),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = Array.isArray(categoriesResult?.data)
    ? categoriesResult.data.map(item => {
        const category = mapBackendCategoryToStorefrontCategory(item as BackendCategory);
        return {
          url: toAbsoluteUrl(`/category/${category.slug}`),
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      })
    : [];

  const productRoutes = Array.isArray(productsResult?.data)
    ? productsResult.data.map(async item => {
        const product = await mapBackendProductToStorefrontProduct(item);
        return {
          url: toAbsoluteUrl(`/product/${product.slug}`),
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      })
    : [];

  const resolvedProductRoutes = productRoutes.length > 0 ? await Promise.all(productRoutes) : [];

  return [...staticRoutes, ...categoryRoutes, ...resolvedProductRoutes];
}
