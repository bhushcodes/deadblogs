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
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold text-black">Language breakdown</h2>
          <div className="mt-4 space-y-3 text-sm text-black">
            {LANGUAGES.map((language) => {
              const match = languagesBreakdown.find((item) => item.language === language.id);
              const count = match?._count._all ?? 0;
              const percent = totalPosts ? Math.round((count / totalPosts) * 100) : 0;
              return (
                <div key={language.id} className="flex items-center justify-between border-2 border-black bg-[var(--color-accent-tertiary)] px-4 py-3 font-bold">
                  <span>{language.label}</span>
                  <span>
                    {count} posts · {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold text-black">Recent updates</h2>
          <div className="mt-4 space-y-3 text-sm text-black">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between border-2 border-black bg-white px-4 py-3 transition-all hover:bg-[var(--color-accent-tertiary)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                <div>
                  <p className="font-bold text-black">{post.title}</p>
                  <p className="text-xs font-bold uppercase text-black">
                    {post.language} · {post.status} · Updated {formatDate(post.updatedAt)}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase text-black">Edit</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold text-black">Top posts by language</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {topPosts.map((group) => (
            <div key={group.language} className="border-2 border-black bg-[var(--color-accent-tertiary)] p-4">
              <p className="text-xs font-bold uppercase text-black">{group.language}</p>
              <ul className="mt-3 space-y-2 text-sm text-black">
                {group.posts.map((post) => (
                  <li key={post.id} className="flex justify-between gap-3">
                    <Link href={`/admin/posts/${post.id}/edit`} className="flex-1 truncate font-bold text-black hover:text-[var(--color-accent-primary)]">
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
    <div className="border-2 border-black bg-white p-5 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
      <p className="text-xs font-bold uppercase text-black">{label}</p>
      <p className="mt-2 text-3xl font-bold text-black">{value}</p>
      {footer ? <p className="mt-1 text-xs text-black">{footer}</p> : null}
    </div>
  );
}
