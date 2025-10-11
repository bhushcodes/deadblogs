import { z } from 'zod';
import type { Language, PostStatus, PostType, ShareNetwork } from '@/generated/prisma';

export const languageValues = ['marathi', 'hindi', 'english'] as const satisfies Readonly<
  [Language, ...Language[]]
>;
export const postTypeValues = ['poem', 'short_story', 'prose', 'other'] as const satisfies Readonly<
  [PostType, ...PostType[]]
>;
export const postStatusValues = ['draft', 'published'] as const satisfies Readonly<
  [PostStatus, ...PostStatus[]]
>;
export const shareNetworkValues = ['whatsapp', 'twitter', 'facebook', 'telegram', 'copy'] as const satisfies Readonly<
  [ShareNetwork, ...ShareNetwork[]]
>;

export const languageEnum = z.enum(languageValues);
export const postTypeEnum = z.enum(postTypeValues);
export const postStatusEnum = z.enum(postStatusValues);
export const shareNetworkEnum = z.enum(shareNetworkValues);

export const postEditorSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(160),
  slug: z
    .string()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  language: languageEnum,
  type: postTypeEnum,
  excerpt: z.string().min(10).max(320),
  body: z.string().min(50),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  tags: z
    .array(z.string().min(1).max(64))
    .max(10)
    .default([]),
  status: postStatusEnum,
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
});

export type PostEditorInput = z.infer<typeof postEditorSchema>;

export const postFiltersSchema = z.object({
  language: languageEnum.optional(),
  type: postTypeEnum.optional(),
  tags: z.array(z.string()).optional(),
  year: z.number().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'mostLiked']).optional(),
  page: z.number().int().min(1).default(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  authorName: z.string().min(2).max(80),
  body: z.string().min(2).max(500),
});

export const shareSchema = z.object({
  postId: z.string().min(1),
  network: shareNetworkEnum,
});
