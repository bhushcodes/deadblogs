import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteAnalytics, getTopPostsByLanguage } from '@/lib/analytics';
import { LANGUAGES } from '@/lib/constants';
import { formatDate } from '@/lib/format';

export const metadata = {
  title: 'Admin Overview',
};

export default async function AdminOverviewPage() {
  const [publishedCount, draftCount, reactions, shares, views, languagesBreakdown, topPosts, recentPosts] =
    await Promise.all([
      prisma.post.count({ where: { status: 'published' } }),
      prisma.post.count({ where: { status: 'draft' } }),
      prisma.reaction.count({ where: { type: 'like' } }),
      prisma.shareEvent.count(),
      prisma.view.count(),
      prisma.post.groupBy({
        by: ['language'],
        _count: { _all: true },
      }),
      getTopPostsByLanguage(3),
      prisma.post.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          language: true,
          updatedAt: true,
          publishedAt: true,
        },
      }),
    ]);

  const totalPosts = publishedCount + draftCount;
  const analytics = await getSiteAnalytics(undefined, 30);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total posts" value={totalPosts} footer={`${publishedCount} published / ${draftCount} draft`} />
        <StatCard label="Likes" value={reactions} footer="All-time likes" />
        <StatCard label="Shares" value={shares} footer="Across social networks" />
        <StatCard label="Views" value={views} footer={`Since ${formatDate(analytics.since)}`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[20px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">Language breakdown</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
            {LANGUAGES.map((language) => {
              const match = languagesBreakdown.find((item) => item.language === language.id);
              const count = match?._count._all ?? 0;
              const percent = totalPosts ? Math.round((count / totalPosts) * 100) : 0;
              return (
                <div key={language.id} className="flex items-center justify-between rounded-lg bg-[rgba(233,223,201,0.6)] px-4 py-3">
                  <span>{language.label}</span>
                  <span>
                    {count} posts · {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-[20px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">Recent updates</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between rounded-lg bg-[rgba(233,223,201,0.45)] px-4 py-3 transition hover:bg-[rgba(233,223,201,0.7)]"
              >
                <div>
                  <p className="font-medium text-[var(--color-ink)]">{post.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                    {post.language} · {post.status} · Updated {formatDate(post.updatedAt)}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Edit</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-serif text-2xl text-[var(--color-ink)]">Top posts by language</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {topPosts.map((group) => (
            <div key={group.language} className="rounded-[18px] border border-black/10 bg-[rgba(233,223,201,0.5)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">{group.language}</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
                {group.posts.map((post) => (
                  <li key={post.id} className="flex justify-between gap-3">
                    <Link href={`/admin/posts/${post.id}/edit`} className="flex-1 truncate text-[var(--color-ink)] hover:text-[var(--color-accent)]">
                      {post.title}
                    </Link>
                    <span>{post._count.reactions} ❤</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, footer }: { label: string; value: number | string; footer?: string }) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 font-serif text-3xl text-[var(--color-ink)]">{value}</p>
      {footer ? <p className="mt-1 text-xs text-[var(--color-muted)]">{footer}</p> : null}
    </div>
  );
}
