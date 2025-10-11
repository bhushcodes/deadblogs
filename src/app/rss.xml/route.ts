import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAbsoluteUrl } from '@/lib/url';

export async function GET() {
  let posts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: Date | null;
    updatedAt: Date;
  }> = [];

  try {
    posts = await prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.warn('RSS generation skipped post fetch due to database error:', error);
  }

  const items = posts
    .map((post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${getAbsoluteUrl(`/post/${post.slug}`)}</link>
        <guid>${getAbsoluteUrl(`/post/${post.slug}`)}</guid>
        <description><![CDATA[${post.excerpt}]]></description>
        <pubDate>${(post.publishedAt ?? post.updatedAt).toUTCString()}</pubDate>
      </item>
    `)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>DEADPOET</title>
      <link>${getAbsoluteUrl('/')}</link>
      <description>Vintage poetry and stories by DEADPOET.</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
