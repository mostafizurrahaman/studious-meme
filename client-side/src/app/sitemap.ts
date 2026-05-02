import { absoluteUrl } from '@/lib/seo';
import {
  getAllActiveProductsAcrossPages,
  mapBackendProductToStorefrontProduct,
} from '@/services/Product';
import { getActiveCategories } from '@/services/Category';
import {
  mapBackendCategoryToStorefrontCategory,
  type BackendCategory,
} from '@/services/Category/mappers';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const toLastModified = (value?: string) => (value ? new Date(value) : now);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/shop'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/main-categories'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/shop-by-brands'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/promotions'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/our-contacts'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/quotation-request'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/about-us'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/terms-and-conditions'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: absoluteUrl('/privacy-policy'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: absoluteUrl('/return-policy'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const [categoriesResult, productsResult] = await Promise.all([
    getActiveCategories().catch(() => null),
    getAllActiveProductsAcrossPages({ limit: 10000 }).catch(() => null),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = Array.isArray(
    categoriesResult?.data,
  )
    ? categoriesResult.data.map((item) => {
        const category = mapBackendCategoryToStorefrontCategory(
          item as BackendCategory,
        );
        return {
          url: absoluteUrl(`/category/${category.slug}`),
          lastModified: toLastModified(item.updatedAt ?? item.createdAt),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      })
    : [];

  const productRoutes = Array.isArray(productsResult?.data)
    ? productsResult.data.map(async (item) => {
        const product = await mapBackendProductToStorefrontProduct(item);
        return {
          url: absoluteUrl(`/product/${product.slug}`),
          lastModified: toLastModified(item.updatedAt ?? item.createdAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      })
    : [];

  const resolvedProductRoutes =
    productRoutes.length > 0 ? await Promise.all(productRoutes) : [];

  return [...staticRoutes, ...categoryRoutes, ...resolvedProductRoutes];
}
