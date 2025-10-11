import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/post-card';
import { SectionHeading } from '@/components/section-heading';
import { LANGUAGES, POSTS_PER_PAGE, SORT_OPTIONS, SortOption } from '@/lib/constants';
import { getPublishedPosts } from '@/lib/posts';
import { getAbsoluteUrl } from '@/lib/url';

export const dynamic = 'force-dynamic';

type TagPageProps = {
  params: { tag: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ params }: TagPageProps): Metadata {
  const titleTag = decodeURIComponent(params.tag);
  return {
    title: `Posts tagged “${titleTag}”`,
    description: `Explore poems and stories tagged with ${titleTag}.`,
    alternates: {
      canonical: getAbsoluteUrl(`/tags/${encodeURIComponent(params.tag)}`),
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  if (!tag) {
    notFound();
  }

  const languageSlug = typeof searchParams.language === 'string' ? searchParams.language : undefined;
  const languageEntry = LANGUAGES.find((item) => item.slug === languageSlug);
  const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  const sort = SORT_OPTIONS.some((option) => option.id === sortParam)
    ? (sortParam as SortOption)
    : 'newest';
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const skip = Math.max(0, (page - 1) * POSTS_PER_PAGE);

  const { posts, total } = await getPublishedPosts({
    tags: [tag],
    language: languageEntry?.id,
    sort,
    skip,
    take: POSTS_PER_PAGE,
  });

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Tag"
        title={`Posts tagged “${tag}”`}
        description={
          <p>
            Showing {total} post{total === 1 ? '' : 's'} {languageEntry ? `in ${languageEntry.label}` : 'across all languages'}.
          </p>
        }
        actions={
          <Link
            href="/tags"
            className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
          >
            All tags
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        <span>Filter by language:</span>
        {LANGUAGES.map((language) => {
          const isActive = languageEntry?.id === language.id;
          const params = new URLSearchParams();
          params.set('language', language.slug);
          if (sort !== 'newest') params.set('sort', sort);
          return (
            <Link
              key={language.id}
              href={`/tags/${encodeURIComponent(tag)}?${params.toString()}`}
              className={[
                'rounded-full border px-4 py-2 transition',
                isActive
                  ? 'border-[var(--color-accent)] bg-[rgba(123,63,75,0.15)] text-[var(--color-accent)]'
                  : 'border-[var(--color-muted)]/40 bg-[rgba(255,255,255,0.6)] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]',
              ].join(' ')}
            >
              {language.label}
            </Link>
          );
        })}
        <Link
          href={`/tags/${encodeURIComponent(tag)}`}
          className={[
            'rounded-full border px-4 py-2 transition',
            !languageEntry
              ? 'border-[var(--color-accent)] bg-[rgba(123,63,75,0.15)] text-[var(--color-accent)]'
              : 'border-[var(--color-muted)]/40 bg-[rgba(255,255,255,0.6)] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]',
          ].join(' ')}
        >
          All languages
        </Link>
      </div>

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-[18px] border border-dashed border-black/20 bg-[rgba(255,255,255,0.45)] p-8 text-center text-sm text-[var(--color-muted)]">
          No posts found with this tag yet.
        </p>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <PaginationLink
            disabled={page <= 1}
            href={buildHref(tag, languageEntry?.slug, sort, page - 1)}
          >
            Previous
          </PaginationLink>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Page {page} of {totalPages}
          </span>
          <PaginationLink
            disabled={page >= totalPages}
            href={buildHref(tag, languageEntry?.slug, sort, page + 1)}
          >
            Next
          </PaginationLink>
        </div>
      ) : null}
    </div>
  );
}

function buildHref(tag: string, language?: string, sort?: SortOption, page?: number) {
  const params = new URLSearchParams();
  if (language) params.set('language', language);
  if (sort && sort !== 'newest') params.set('sort', sort);
  if (page && page > 1) params.set('page', String(page));

  const query = params.toString();
  return `/tags/${encodeURIComponent(tag)}${query ? `?${query}` : ''}`;
}

function PaginationLink({
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
