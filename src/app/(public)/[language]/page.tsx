import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LanguageFilters } from '@/components/language-filters';
import { PostCard } from '@/components/post-card';
import { SectionHeading } from '@/components/section-heading';
import { POSTS_PER_PAGE, LANGUAGES, SortOption, SORT_OPTIONS } from '@/lib/constants';
import {
  getAllTags,
  getAvailableYears,
  getFeaturedPosts,
  getPublishedPosts,
  PublishedPost,
} from '@/lib/posts';
import { formatDate } from '@/lib/format';
import { languageValues, postTypeValues } from '@/lib/validation';
import { getAbsoluteUrl } from '@/lib/url';

type LanguagePageProps = {
  params: { language: string };
  searchParams: Record<string, string | string[] | undefined>;
};

const languageSlugMap = new Map(LANGUAGES.map((lang) => [lang.slug, lang.id]));

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: LanguagePageProps): Metadata {
  const languageId = languageSlugMap.get(params.language);
  const languageMeta = LANGUAGES.find((lang) => lang.id === languageId);
  if (!languageMeta) return {};

  return {
    title: `${languageMeta.label} Collection`,
    description: `Browse ${languageMeta.label} poems, short stories, and prose by DEADPOET.`,
    alternates: {
      canonical: getAbsoluteUrl(`/${params.language}`),
    },
  };
}

export default async function LanguagePage({ params, searchParams }: LanguagePageProps) {
  const languageId = languageSlugMap.get(params.language);
  if (!languageId || !languageValues.includes(languageId)) {
    notFound();
  }

  const rawTags = typeof searchParams.tags === 'string' ? searchParams.tags.split(',') : [];
  const rawType = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const rawYear = typeof searchParams.year === 'string' ? Number(searchParams.year) : undefined;
  const rawSort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const isFeaturedOnly = searchParams.featured === 'true';

  const typeFilter =
    rawType && postTypeValues.includes(rawType as (typeof postTypeValues)[number])
      ? (rawType as (typeof postTypeValues)[number])
      : undefined;

  const sortFilter =
    rawSort && SORT_OPTIONS.some((option) => option.id === rawSort)
      ? (rawSort as SortOption)
      : 'newest';

  const tags = rawTags.filter(Boolean);
  const yearFilter = Number.isFinite(rawYear ?? NaN) ? rawYear : undefined;
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const [postsResult, tagsList, years, featured] = await Promise.all([
    getPublishedPosts({
      language: languageId,
      type: typeFilter,
      tags: tags.length ? tags : undefined,
      year: yearFilter,
      sort: sortFilter,
      skip,
      take: POSTS_PER_PAGE,
    }),
    getAllTags(languageId),
    getAvailableYears(languageId),
    isFeaturedOnly ? getFeaturedPosts(languageId) : Promise.resolve([]),
  ]);

  const posts = isFeaturedOnly ? featured : postsResult.posts;
  const totalItems = isFeaturedOnly ? featured.length : postsResult.total;
  const totalPages = Math.max(1, Math.ceil(totalItems / POSTS_PER_PAGE));

  const languageMeta = LANGUAGES.find((lang) => lang.id === languageId);

  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow={`${languageMeta?.label ?? ''} collection`}
        title={`${languageMeta?.label ?? languageId} writings`}
        description={
          <p>
            {languageMeta?.description}{' '}
            {languageMeta
              ? `Published entries: ${totalItems}. Updated ${formatDate(new Date())}.`
              : null}
          </p>
        }
        actions={
          !isFeaturedOnly ? (
            <Link
              href={`/posts?language=${params.language}`}
              className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
            >
              Browse Archive
            </Link>
          ) : (
            <Link
              href={`/${params.language}`}
              className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
            >
              All posts
            </Link>
          )
        }
      />
      <LanguageFilters
        language={languageId}
        selectedType={typeFilter}
        selectedYear={yearFilter}
        selectedSort={sortFilter}
        selectedTags={tags}
        availableTags={tagsList}
        availableYears={years}
      />
      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post: PublishedPost) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-[18px] border border-dashed border-black/20 bg-[rgba(255,255,255,0.45)] p-8 text-center text-sm text-[var(--color-muted)]">
          No posts match the selected filters yet. Adjust filters or check back soon.
        </p>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <PaginationButton
            disabled={currentPage <= 1}
            href={buildPageHref(params.language, searchParams, currentPage - 1)}
          >
            Previous
          </PaginationButton>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Page {currentPage} of {totalPages}
          </span>
          <PaginationButton
            disabled={currentPage >= totalPages}
            href={buildPageHref(params.language, searchParams, currentPage + 1)}
          >
            Next
          </PaginationButton>
        </div>
      ) : null}
    </div>
  );
}

function buildPageHref(
  language: string,
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else if (key !== 'page') {
      params.set(key, value);
    }
  });
  params.set('page', String(page));
  return `/${language}?${params.toString()}`;
}

function PaginationButton({
  children,
  href,
  disabled,
}: {
  children: React.ReactNode;
  href: string;
  disabled?: boolean;
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
