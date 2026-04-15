import { siteConfig } from '@/lib/seo';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = (siteConfig.url ?? '').replace(/\/+$/, '');

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/my-account', '/checkout', '/cart', '/wishlist', '/compare'],
        },
        sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : undefined,
    };
}
