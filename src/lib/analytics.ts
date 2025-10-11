import type { Language, ShareNetwork } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { subHours } from 'date-fns';

const VIEW_DEDUP_HOURS = 6;

export async function recordView(postId: string, fingerprint?: string | null) {
  if (fingerprint) {
    const recentView = await prisma.view.findFirst({
      where: {
        postId,
        fingerprint,
        createdAt: { gte: subHours(new Date(), VIEW_DEDUP_HOURS) },
      },
    });

    if (recentView) {
      return recentView;
    }
  }

  return prisma.view.create({
    data: {
      postId,
      fingerprint: fingerprint ?? null,
    },
  });
}

export async function recordShare(
  postId: string,
  network: ShareNetwork,
  fingerprint?: string | null,
) {
  await prisma.shareEvent.create({
    data: {
      postId,
      network,
    },
  });

  // Shares double as views for analytics if user triggered from post page.
  if (fingerprint) {
    await recordView(postId, fingerprint);
  }
}

export async function getLikeCount(postId: string) {
  const count = await prisma.reaction.count({
    where: { postId, type: 'like' },
  });
  return count;
}

export async function hasLiked(
  postId: string,
  fingerprint?: string | null,
  userId?: string | null,
) {
  if (!fingerprint && !userId) return false;

  const existing = await prisma.reaction.findFirst({
    where: {
      postId,
      type: 'like',
      OR: [
        ...(fingerprint ? [{ fingerprint }] : []),
        ...(userId ? [{ userId }] : []),
      ],
    },
  });

  return Boolean(existing);
}

export async function toggleLike(
  postId: string,
  fingerprint: string,
  userId?: string,
) {
  const existing = await prisma.reaction.findFirst({
    where: {
      postId,
      type: 'like',
      OR: [
        { fingerprint },
        ...(userId ? [{ userId }] : []),
      ],
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    const count = await getLikeCount(postId);
    return { liked: false, count };
  }

  await prisma.reaction.create({
    data: {
      postId,
      type: 'like',
      fingerprint,
      userId: userId ?? null,
    },
  });
  const count = await getLikeCount(postId);
  return { liked: true, count };
}

export async function getPostMetrics(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      language: true,
      status: true,
      publishedAt: true,
      _count: {
        select: {
          reactions: true,
          shareEvents: true,
          views: true,
          comments: true,
        },
      },
    },
  });

  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    language: post.language,
    status: post.status,
    publishedAt: post.publishedAt,
    likes: post._count.reactions,
    shares: post._count.shareEvents,
    views: post._count.views,
    comments: post._count.comments,
  };
}

export async function getSiteAnalytics(language?: Language, days = 30) {
  const since = subHours(new Date(), days * 24);

  const [totals, reactions, shares, views] = await Promise.all([
    prisma.post.count({
      where: {
        status: 'published',
        ...(language ? { language } : {}),
      },
    }),
    prisma.reaction.count({
      where: {
        type: 'like',
        ...(language ? { post: { language } } : {}),
        createdAt: { gte: since },
      },
    }),
    prisma.shareEvent.count({
      where: {
        ...(language ? { post: { language } } : {}),
        createdAt: { gte: since },
      },
    }),
    prisma.view.count({
      where: {
        ...(language ? { post: { language } } : {}),
        createdAt: { gte: since },
      },
    }),
  ]);

  return {
    posts: totals,
    likes: reactions,
    shares,
    views,
    since,
  };
}

export async function getTopPostsByLanguage(limit = 5) {
  const languages = ['marathi', 'hindi', 'english'] as const;

  const results = await Promise.all(
    languages.map(async (language) => {
      const posts = await prisma.post.findMany({
        where: {
          language,
          status: 'published',
        },
        select: {
          id: true,
          title: true,
          slug: true,
          language: true,
          publishedAt: true,
          _count: {
            select: {
              reactions: true,
              views: true,
              shareEvents: true,
            },
          },
        },
        orderBy: [{ reactions: { _count: 'desc' } }, { publishedAt: 'desc' }],
        take: limit,
      });
      return { language, posts };
    }),
  );

  return results;
}
