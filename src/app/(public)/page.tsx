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
                className="border-2 border-black bg-[var(--color-accent-primary)] px-5 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
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
          <div className="border-2 border-black bg-[var(--color-accent-tertiary)] p-8 text-center">
            <p className="text-sm font-medium text-black">
              Featured selections will appear here once you mark posts as featured.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Latest"
          title="Fresh from the writing desk"
          actions={
            <Link
              href="/posts"
              className="border-2 border-black bg-[var(--color-accent-secondary)] px-5 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-primary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
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
          <div className="border-2 border-black bg-[var(--color-accent-tertiary)] p-8 text-center">
            <p className="text-sm font-medium text-black">
              No published posts yet. Once you publish a post it will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
