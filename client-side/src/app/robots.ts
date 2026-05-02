import { absoluteUrl } from '@/lib/seo';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/my-account', '/checkout', '/cart', '/wishlist', '/compare'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
