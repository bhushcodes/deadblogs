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

export default async function PostsArchivePage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
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
        <div className="border-2 border-black bg-[var(--color-accent-tertiary)] p-8 text-center">
          <p className="text-sm font-medium text-black">
            No posts match the current filters. Try adjusting your search.
          </p>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <PaginationLink
            disabled={currentPage <= 1}
            href={buildHref(searchParams, currentPage - 1)}
          >
            Previous
          </PaginationLink>
          <span className="text-xs font-medium uppercase tracking-wide text-black">
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
      <span className="cursor-not-allowed border-2 border-black bg-[var(--color-accent-tertiary)] px-5 py-2 text-xs font-bold uppercase text-black opacity-50">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="border-2 border-black bg-[var(--color-accent-primary)] px-5 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
    >
      {children}
    </Link>
  );
}
