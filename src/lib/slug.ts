import { searchSlugs } from '@/lib/posts';

const SLUG_MAX_LENGTH = 160;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH);
}

export async function generateUniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title);
  const existing = await searchSlugs(base, excludeId);
  if (!existing.includes(base)) {
    return base;
  }

  let counter = 2;
  let candidate = `${base}-${counter}`;
  while (existing.includes(candidate)) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}
