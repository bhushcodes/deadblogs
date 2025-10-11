import { prisma } from '@/lib/prisma';
import { LANGUAGES, POSTS_PER_PAGE, POST_TYPES } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { PostsTable } from '@/components/admin/posts-table';

export const metadata = {
  title: 'Manage Posts',
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const languageSlug = typeof searchParams.language === 'string' ? searchParams.language : undefined;
  const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const featured = searchParams.featured === 'true';
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

  const language = LANGUAGES.find((lang) => lang.slug === languageSlug)?.id;
  const skip = (Math.max(page, 1) - 1) * POSTS_PER_PAGE;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ];
  }
  if (status === 'published' || status === 'draft') where.status = status;
  if (language) where.language = language;
  if (type && ['poem', 'short_story', 'prose', 'other'].includes(type)) where.type = type;
  if (featured) where.isFeatured = true;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        language: true,
        type: true,
        status: true,
        isFeatured: true,
        publishedAt: true,
        updatedAt: true,
        _count: {
          select: {
            reactions: true,
            shareEvents: true,
            comments: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-6 shadow-[var(--shadow-card)]">
        <h1 className="font-serif text-3xl text-[var(--color-ink)]">Posts</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Manage drafts, publishing, and featured selections.</p>
        <Filters search={search} status={status} language={languageSlug} type={type} featured={featured} />
      </div>
      <PostsTable
        posts={posts.map((post) => ({
          ...post,
          publishedLabel: post.publishedAt ? formatDate(post.publishedAt) ?? '—' : '—',
          updatedLabel: formatDate(post.updatedAt) ?? '—',
        }))}
        total={total}
        page={Math.max(page, 1)}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </div>
  );
}

function Filters({
  search,
  status,
  language,
  type,
  featured,
}: {
  search?: string;
  status?: string;
  language?: string;
  type?: string;
  featured?: boolean;
}) {
  return (
    <form method="get" className="mt-6 grid gap-4 md:grid-cols-5">
      <input
        type="search"
        name="search"
        placeholder="Search"
        defaultValue={search ?? ''}
        className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
      />
      <select
        name="status"
        defaultValue={status ?? 'all'}
        className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
      >
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <select
        name="language"
        defaultValue={language ?? 'all'}
        className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
      >
        <option value="all">All languages</option>
        {LANGUAGES.map((lang) => (
          <option key={lang.slug} value={lang.slug}>
            {lang.label}
          </option>
        ))}
      </select>
      <select
        name="type"
        defaultValue={type ?? 'all'}
        className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
      >
        <option value="all">All genres</option>
        {POST_TYPES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        <input type="checkbox" name="featured" value="true" defaultChecked={featured} className="h-4 w-4" />
        Featured only
      </label>
      <div className="md:col-span-5">
        <button
          type="submit"
          className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)]"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
