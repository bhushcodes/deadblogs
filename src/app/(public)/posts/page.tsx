import Link from 'next/link';
import type { Metadata } from 'next';
import { ArchiveFilters, ArchiveFilterValues } from '@/components/archive-filters';
import { PostCard } from '@/components/post-card';
import { SectionHeading } from '@/components/section-heading';
import { LANGUAGES, POSTS_PER_PAGE, SORT_OPTIONS, SortOption } from '@/lib/constants';
import { getAllTags, getAvailableYears, getPublishedPosts } from '@/lib/posts';
import { postTypeValues } from '@/lib/validation';
import { getAbsoluteUrl } from '@/lib/url';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse every poem, short story, and prose entry across all languages.',
  alternates: {
    canonical: getAbsoluteUrl('/posts'),
  },
};

export const dynamic = 'force-dynamic';

export default async function PostsArchivePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const languageSlug = typeof searchParams.language === 'string' ? searchParams.language : undefined;
  const languageEntry = LANGUAGES.find((item) => item.slug === languageSlug);
  const typeParam = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const yearParam = typeof searchParams.year === 'string' ? Number(searchParams.year) : undefined;
  const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  const searchTerm = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const featured = searchParams.featured === 'true';
  const pageParam = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

  const tagsParam = searchParams.tags;
  const tags = Array.isArray(tagsParam)
    ? tagsParam
    : typeof tagsParam === 'string'
      ? [tagsParam]
      : [];

  const sort = SORT_OPTIONS.some((option) => option.id === sortParam)
    ? (sortParam as SortOption)
    : 'newest';
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const typeFilter =
    typeParam && postTypeValues.includes(typeParam as (typeof postTypeValues)[number])
      ? (typeParam as (typeof postTypeValues)[number])
      : undefined;

  const [{ posts, total }, tagsList, years] = await Promise.all([
    getPublishedPosts({
      language: languageEntry?.id,
      type: typeFilter,
      tags,
      year: Number.isFinite(yearParam ?? NaN) ? yearParam : undefined,
      sort,
      search: searchTerm,
      skip,
      take: POSTS_PER_PAGE,
      featured: featured || undefined,
    }),
    getAllTags(languageEntry?.id),
    getAvailableYears(languageEntry?.id),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  const filterValues: ArchiveFilterValues = {
    language: languageSlug,
    type: typeFilter,
    year: Number.isFinite(yearParam ?? NaN) ? yearParam : undefined,
    sort,
    search: searchTerm,
    tags,
    featured,
  };

  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Archive"
        title="All writings"
        description={<p>Search and filter the complete archive across Marathi, Hindi, and English.</p>}
      />

      <ArchiveFilters values={filterValues} availableTags={tagsList} availableYears={years} />

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-[18px] border border-dashed border-black/20 bg-[rgba(255,255,255,0.45)] p-8 text-center text-sm text-[var(--color-muted)]">
          No posts match the current filters. Try adjusting your search.
        </p>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <PaginationLink
            disabled={currentPage <= 1}
            href={buildHref(searchParams, currentPage - 1)}
          >
            Previous
          </PaginationLink>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Page {currentPage} of {totalPages}
          </span>
          <PaginationLink
            disabled={currentPage >= totalPages}
            href={buildHref(searchParams, currentPage + 1)}
          >
            Next
          </PaginationLink>
        </div>
      ) : null}
    </div>
  );
}

function buildHref(
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    } else if (key !== 'page') {
      params.set(key, value);
    }
  });
  params.set('page', String(page));
  return `/posts?${params.toString()}`;
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-black/30">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
    >
      {children}
    </Link>
  );
}
