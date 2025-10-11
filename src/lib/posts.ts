import type {
  CommentStatus,
  Language,
  Post,
  PostStatus,
  PostType,
  Prisma,
} from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { POSTS_PER_PAGE, SortOption } from '@/lib/constants';

type BasePostWhere = Prisma.PostWhereInput;

type PublishedPostFilters = {
  language?: Language;
  type?: PostType;
  tags?: string[];
  year?: number;
  search?: string;
  sort?: SortOption;
  skip?: number;
  take?: number;
  featured?: boolean;
};

const publishedSelection = {
  id: true,
  title: true,
  slug: true,
  language: true,
  type: true,
  excerpt: true,
  coverImageUrl: true,
  readingTimeMinutes: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  tags: true,
  isFeatured: true,
  status: true,
  _count: {
    select: {
      reactions: true,
      views: true,
      shareEvents: true,
    },
  },
} satisfies Prisma.PostSelect;

export type PublishedPost = Prisma.PostGetPayload<{
  select: typeof publishedSelection;
}>;

function buildPublishedWhere(filters: PublishedPostFilters = {}) {
  const { language, type, tags, year, search, featured } = filters;
  const where: BasePostWhere = {
    status: 'published' satisfies PostStatus,
  };

  if (language) where.language = language;
  if (type) where.type = type;
  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }
  if (featured) {
    where.isFeatured = true;
  }
  if (year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    where.publishedAt = { gte: start, lt: end };
  }
  if (search && search.trim().length > 0) {
    const term = search.trim();
    const existingAnd = Array.isArray(where.AND)
      ? where.AND
      : where.AND
        ? [where.AND]
        : [];
    where.AND = [
      ...existingAnd,
      {
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { excerpt: { contains: term, mode: 'insensitive' } },
          { body: { contains: term, mode: 'insensitive' } },
          { tags: { has: term.toLowerCase() } },
        ],
      },
    ];
  }

  return where;
}

function resolveOrder(sort?: SortOption): Prisma.PostOrderByWithRelationInput[] {
  if (sort === 'mostLiked') {
    return [
      { reactions: { _count: 'desc' } },
      { publishedAt: 'desc' },
    ];
  }

  return [{ publishedAt: 'desc' }];
}

export async function getPublishedPosts(filters: PublishedPostFilters = {}) {
  const { skip = 0, take = POSTS_PER_PAGE, sort } = filters;
  const where = buildPublishedWhere(filters);

  try {
    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        select: publishedSelection,
        orderBy: resolveOrder(sort),
        skip,
        take,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  } catch (error) {
    console.warn('Failed to fetch published posts; returning fallback.', error);
    return { posts: [], total: 0 };
  }
}

export async function getFeaturedPosts(language?: Language) {
  const where: BasePostWhere = {
    status: 'published',
    isFeatured: true,
  };

  if (language) {
    where.language = language;
  }

  try {
    return await prisma.post.findMany({
      where,
      select: publishedSelection,
      orderBy: [{ publishedAt: 'desc' }],
      take: 6,
    });
  } catch (error) {
    console.warn('Failed to fetch featured posts; returning empty list.', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            reactions: true,
            views: true,
            shareEvents: true,
            comments: {
              where: { status: 'approved' satisfies CommentStatus },
            },
          },
        },
        comments: {
          where: { status: 'approved' satisfies CommentStatus },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  } catch (error) {
    console.warn(`Failed to fetch post by slug "${slug}".`, error);
    return null;
  }
}

export async function getRelatedPosts(post: Post, limit = 3) {
  try {
    if (!post.tags.length) {
      return await prisma.post.findMany({
        where: {
          id: { not: post.id },
          status: 'published',
          language: post.language,
        },
        select: publishedSelection,
        orderBy: [{ publishedAt: 'desc' }],
        take: limit,
      });
    }

    return await prisma.post.findMany({
      where: {
        id: { not: post.id },
        status: 'published',
        language: post.language,
        tags: { hasSome: post.tags },
      },
      select: publishedSelection,
      orderBy: [{ reactions: { _count: 'desc' } }, { publishedAt: 'desc' }],
      take: limit,
    });
  } catch (error) {
    console.warn('Failed to fetch related posts; returning empty list.', error);
    return [];
  }
}

export async function getAvailableYears(language?: Language) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'published',
        publishedAt: { not: null },
        ...(language ? { language } : {}),
      },
      select: { publishedAt: true },
    });

    const years = new Set<number>();
    posts.forEach((item) => {
      if (item.publishedAt) {
        years.add(item.publishedAt.getFullYear());
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  } catch (error) {
    console.warn('Failed to fetch available years; returning empty list.', error);
    return [];
  }
}

export async function getAllTags(language?: Language) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'published',
        ...(language ? { language } : {}),
      },
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.warn('Failed to fetch tags; returning empty list.', error);
    return [];
  }
}

export async function getAdminPostById(id: string) {
  try {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        comments: true,
        reactions: true,
        shareEvents: true,
        views: true,
      },
    });
  } catch (error) {
    console.warn(`Failed to fetch admin post by id "${id}".`, error);
    return null;
  }
}

export async function searchSlugs(slug: string, excludeId?: string) {
  try {
    const results = await prisma.post.findMany({
      where: {
        slug: { startsWith: slug },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { slug: true },
    });

    return results.map((item) => item.slug);
  } catch (error) {
    console.warn('Failed to search slugs; returning empty list.', error);
    return [];
  }
}

export async function upsertPost(
  data: Prisma.PostUncheckedCreateInput & { tags: string[] },
  postId?: string,
) {
  if (postId) {
    return prisma.post.update({
      where: { id: postId },
      data,
    });
  }

  return prisma.post.create({
    data,
  });
}

export async function deletePost(postId: string) {
  await prisma.post.delete({
    where: { id: postId },
  });
}
