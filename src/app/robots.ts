import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}
