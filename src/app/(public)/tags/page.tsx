import Link from 'next/link';
import { LANGUAGES } from '@/lib/constants';
import { getAllTags } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function TagsIndexPage() {
  const tagsByLanguage = await Promise.all(
    LANGUAGES.map(async (language) => {
      const tags = await getAllTags(language.id);
      return { language, tags };
    }),
  );

  return (
    <div className="space-y-10">
      <div className="border-b border-black/10 pb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">Taxonomy</p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--color-ink)]">Browse by tag</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]">
          Tags help readers quickly find poems and stories by theme. Each language collection has its
          own tag set. Select a tag to explore all posts that share it.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {tagsByLanguage.map(({ language, tags }) => (
          <section
            key={language.id}
            className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.6)] p-6 shadow-[var(--shadow-card)]"
          >
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">{language.label}</h2>
            {tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}?language=${language.slug}`}
                    className="rounded-full border border-[var(--color-muted)]/30 bg-[rgba(255,255,255,0.6)] px-4 py-1 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--color-muted)]">No tags yet.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
