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
      <div className="border-b-2 border-black pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-black">Taxonomy</p>
        <h1 className="mt-2 text-4xl font-bold text-black">Browse by tag</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black">
          Tags help readers quickly find poems and stories by theme. Each language collection has its
          own tag set. Select a tag to explore all posts that share it.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {tagsByLanguage.map(({ language, tags }) => (
          <section
            key={language.id}
            className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            <h2 className="text-2xl font-bold text-black">{language.label}</h2>
            {tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}?language=${language.slug}`}
                    className="border-2 border-black bg-white px-3 py-1 text-xs font-medium uppercase transition-all hover:bg-[var(--color-accent-primary)] hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-black">No tags yet.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
