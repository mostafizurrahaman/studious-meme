import { siteUrl } from '@/constants';
import { getLastTwoDaysNews } from '@/services/News';
import { TNews } from '@/types';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (siteUrl ?? '').replace(/\/+$/, '');

  if (!baseUrl) {
    return [];
  }

  const toAbsoluteUrl = (path: string) => new URL(path, baseUrl).toString();

  const { data } = await getLastTwoDaysNews();
  const news = Array.isArray(data) ? (data as TNews[]) : [];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: toAbsoluteUrl('/about-us'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: toAbsoluteUrl('/business'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl('/crime'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl('/donation'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: toAbsoluteUrl('/editorial'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: toAbsoluteUrl('/elections-2026'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: toAbsoluteUrl('/local'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl('/national'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl('/real-estate'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: toAbsoluteUrl('/state'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl('/weather'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: toAbsoluteUrl('/terms-and-conditions'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: toAbsoluteUrl('/privacy-policy'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: toAbsoluteUrl('/news'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl('/feed'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: toAbsoluteUrl('/google-news-sitemap.xml'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const newsRoutes: MetadataRoute.Sitemap = news
    .filter(item => Boolean(item?.slug))
    .map(item => ({
      url: toAbsoluteUrl(`/news/${item.slug}`),
      lastModified: item?.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

  return [...staticRoutes, ...newsRoutes];
}
