import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { LANGUAGES } from '@/lib/constants';
import { getAbsoluteUrl } from '@/lib/url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.warn('Skipping post entries in sitemap due to database error:', error);
  }

  const baseEntries = [
    '',
    '/posts',
    '/tags',
    '/about',
    ...LANGUAGES.map((language) => `/${language.slug}`),
  ].map((path) => ({
    url: getAbsoluteUrl(path),
    lastModified: new Date(),
  }));

  const postEntries = posts.map((post) => ({
    url: getAbsoluteUrl(`/post/${post.slug}`),
    lastModified: post.updatedAt,
  }));

  return [...baseEntries, ...postEntries];
}
