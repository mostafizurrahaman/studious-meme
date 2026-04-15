import { siteUrl } from '@/constants';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/reporter/', // disallowed all paths under /reporter/
        '/editor/', // disallowed all paths under /editor/
        '/publisher/', // disallowed all paths under /publisher/
        '/login',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`, // sitemap URL
  };
}
