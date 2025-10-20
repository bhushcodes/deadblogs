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
  params: Promise<{ language: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const languageSlugMap = new Map(LANGUAGES.map((lang) => [lang.slug, lang.id]));

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LanguagePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const languageId = languageSlugMap.get(resolvedParams.language);
  const languageMeta = LANGUAGES.find((lang) => lang.id === languageId);
  if (!languageMeta) return {};

  return {
    title: `${languageMeta.label} Collection`,
    description: `Browse ${languageMeta.label} poems, short stories, and prose by DEADPOET.`,
    alternates: {
      canonical: getAbsoluteUrl(`/${resolvedParams.language}`),
    },
  };
}

export default async function LanguagePage({ params, searchParams }: LanguagePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const languageId = languageSlugMap.get(resolvedParams.language);
  if (!languageId || !languageValues.includes(languageId)) {
    notFound();
  }

  const rawTags = typeof resolvedSearchParams.tags === 'string' ? resolvedSearchParams.tags.split(',') : [];
  const rawType = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : undefined;
  const rawYear = typeof resolvedSearchParams.year === 'string' ? Number(resolvedSearchParams.year) : undefined;
  const rawSort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : undefined;
  const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;
  const isFeaturedOnly = resolvedSearchParams.featured === 'true';

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
              href={`/posts?language=${resolvedParams.language}`}
              className="border-2 border-black bg-[var(--color-accent-primary)] px-5 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-success)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              Browse Archive
            </Link>
          ) : (
            <Link
              href={`/${resolvedParams.language}`}
              className="border-2 border-black bg-[var(--color-accent-primary)] px-5 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-success)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
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
        <div className="border-2 border-black bg-[var(--color-accent-tertiary)] p-8 text-center">
          <p className="text-sm font-medium text-black">
            No posts match the selected filters yet. Adjust filters or check back soon.
          </p>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <PaginationButton
            disabled={currentPage <= 1}
            href={buildPageHref(resolvedParams.language, resolvedSearchParams, currentPage - 1)}
          >
            Previous
          </PaginationButton>
          <span className="text-xs font-medium uppercase tracking-wide text-black">
            Page {currentPage} of {totalPages}
          </span>
          <PaginationButton
            disabled={currentPage >= totalPages}
            href={buildPageHref(resolvedParams.language, resolvedSearchParams, currentPage + 1)}
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
