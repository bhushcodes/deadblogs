import type { Language, PostType } from '@/generated/prisma';

export const LANGUAGES: Array<{
  id: Language;
  label: string;
  description: string;
  slug: string;
}> = [
  {
    id: 'marathi',
    label: 'Marathi',
    description: 'मराठी कवितां व कथा',
    slug: 'marathi',
  },
  {
    id: 'hindi',
    label: 'Hindi',
    description: 'हिंदी साहित्यिक लेखन',
    slug: 'hindi',
  },
  {
    id: 'english',
    label: 'English',
    description: 'English poems and stories',
    slug: 'english',
  },
];

export const POST_TYPES: Array<{ id: PostType; label: string }> = [
  { id: 'poem', label: 'Poem' },
  { id: 'short_story', label: 'Short Story' },
  { id: 'prose', label: 'Prose' },
  { id: 'other', label: 'Other' },
];

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'mostLiked', label: 'Most Liked' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['id'];

export const POSTS_PER_PAGE = 9;
export const FEATURED_LIMIT = 3;
