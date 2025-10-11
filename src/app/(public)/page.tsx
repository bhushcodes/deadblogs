import Link from 'next/link';
import { HomeHero } from '@/components/home-hero';
import { LanguageCard } from '@/components/language-card';
import { PostCard } from '@/components/post-card';
import { SectionHeading } from '@/components/section-heading';
import { FEATURED_LIMIT, LANGUAGES } from '@/lib/constants';
import { getFeaturedPosts, getPublishedPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedPosts(),
    getPublishedPosts({ take: 6 }),
  ]);

  return (
    <div className="space-y-16">
      <HomeHero />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Languages"
          title="Choose your literary journey"
          description="Browse unique collections per language. These are original works and not translations."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {LANGUAGES.map((language) => (
            <LanguageCard key={language.id} language={language.id} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Featured"
          title="Editor’s treasured picks"
          description={
            <p>
              Handpicked poems and stories that set the mood for the season. Curated manually—just as
              a vintage editor would.
            </p>
          }
          actions={
            featured.length > FEATURED_LIMIT ? (
              <Link
                href="/posts?featured=true"
                className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
              >
                View all featured
              </Link>
            ) : null
          }
        />
        {featured.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {featured.slice(0, FEATURED_LIMIT).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-[18px] border border-dashed border-black/20 bg-[rgba(255,255,255,0.45)] p-8 text-center text-sm text-[var(--color-muted)]">
            Featured selections will appear here once you mark posts as featured.
          </p>
        )}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Latest"
          title="Fresh from the writing desk"
          actions={
            <Link
              href="/posts"
              className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.1)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)]"
            >
              Browse archive
            </Link>
          }
        />
        {latest.posts.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {latest.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-[18px] border border-dashed border-black/20 bg-[rgba(255,255,255,0.45)] p-8 text-center text-sm text-[var(--color-muted)]">
            No published posts yet. Once you publish a post it will appear here.
          </p>
        )}
      </section>
    </div>
  );
}
