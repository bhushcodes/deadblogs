'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { postEditorSchema } from '@/lib/validation';
import { generateUniqueSlug } from '@/lib/slug';
import { upsertPost, deletePost } from '@/lib/posts';
import { calculateReadingTime } from '@/lib/reading-time';
import { prisma } from '@/lib/prisma';
import { LANGUAGES } from '@/lib/constants';

const bulkActionSchema = z.object({
  ids: z.array(z.string().min(1)),
  action: z.enum(['publish', 'unpublish', 'feature', 'unfeature', 'delete']),
});

export type PostActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string | undefined>;
  id?: string;
};

export async function savePostAction(data: Record<string, unknown>): Promise<PostActionResult> {
  const parsed = postEditorSchema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'Fix validation errors.',
      fieldErrors: {
        title: errors.title?.[0],
        slug: errors.slug?.[0],
        excerpt: errors.excerpt?.[0],
        body: errors.body?.[0],
        coverImageUrl: errors.coverImageUrl?.[0],
      },
    };
  }

  const input = parsed.data;
  const postId = input.id;

  const slug = postId ? input.slug : await generateUniqueSlug(input.slug);
  const publishedAt =
    input.status === 'published'
      ? input.publishedAt
        ? new Date(input.publishedAt)
        : new Date()
      : null;

  const readingTimeMinutes = calculateReadingTime(input.body);

  const post = await upsertPost(
    {
      title: input.title,
      slug,
      language: input.language,
      type: input.type,
      excerpt: input.excerpt,
      body: input.body,
      coverImageUrl: input.coverImageUrl || null,
      tags: input.tags,
      status: input.status,
      isFeatured: input.isFeatured,
      publishedAt,
      readingTimeMinutes,
    },
    postId,
  );

  revalidatePath('/');
  revalidatePath('/posts');
  const languageSlug = LANGUAGES.find((lang) => lang.id === post.language)?.slug ?? post.language;
  revalidatePath(`/${languageSlug}`);
  revalidatePath(`/post/${post.slug}`);
  revalidatePath('/admin/posts');

  return {
    success: true,
    message: postId ? 'Post updated.' : 'Post created.',
    id: post.id,
  };
}

export async function deletePostAction(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true, language: true } });
  await deletePost(postId);
  revalidatePath('/');
  revalidatePath('/posts');
  if (post?.language) {
    const languageSlug = LANGUAGES.find((lang) => lang.id === post.language)?.slug;
    if (languageSlug) {
      revalidatePath(`/${languageSlug}`);
    }
  } else {
    LANGUAGES.forEach((lang) => revalidatePath(`/${lang.slug}`));
  }
  if (post?.slug) {
    revalidatePath(`/post/${post.slug}`);
  }
  revalidatePath('/admin/posts');
}

export async function bulkPostAction(data: unknown) {
  const parsed = bulkActionSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Invalid bulk action payload');
  }

  const { ids, action } = parsed.data;

  switch (action) {
    case 'publish':
      await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: 'published', publishedAt: new Date() },
      });
      break;
    case 'unpublish':
      await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: 'draft', publishedAt: null },
      });
      break;
    case 'feature':
      await prisma.post.updateMany({ where: { id: { in: ids } }, data: { isFeatured: true } });
      break;
    case 'unfeature':
      await prisma.post.updateMany({ where: { id: { in: ids } }, data: { isFeatured: false } });
      break;
    case 'delete':
      await prisma.post.deleteMany({ where: { id: { in: ids } } });
      break;
    default:
      break;
  }

  revalidatePath('/');
  revalidatePath('/posts');
  revalidatePath('/admin/posts');
}
