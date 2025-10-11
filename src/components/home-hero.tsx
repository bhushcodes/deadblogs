import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-black/10 bg-[rgba(247,239,224,0.92)] px-8 py-12 shadow-[var(--shadow-card)] md:px-14 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(123,63,75,0.08),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(63,107,115,0.08),transparent_55%)]" />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-muted)]/30 bg-[rgba(255,255,255,0.6)] px-4 py-1 text-xs uppercase tracking-[0.3em] text-[var(--color-accent-muted)]">
            Vintage Literary Journal
          </span>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-[var(--color-ink)] md:text-[44px]">
            Words on parchment. Stories in sepia. Poetry that lingers.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
            Wander through DEADPOET&apos;s handpicked poems, short stories, and prose across Marathi,
            Hindi, and English. Every piece is unique—never a translation—curated with care for the
            vintage soul.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/marathi"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.1)] px-6 py-3 text-sm uppercase tracking-[0.3em] text-[var(--color-accent)] transition-colors hover:bg-[rgba(123,63,75,0.18)]"
            >
              Explore Marathi
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-muted)]/40 px-6 py-3 text-sm uppercase tracking-[0.3em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
            >
              Browse All Posts
            </Link>
          </div>
        </div>
        <div className="flex-1 rounded-[24px] border border-black/10 bg-[rgba(255,255,255,0.5)] p-6 text-sm text-[var(--color-muted)] shadow-inner">
          <p className="font-serif text-lg text-[var(--color-ink)]">What&apos;s inside:</p>
          <ul className="mt-4 space-y-3 leading-relaxed">
            <li>• Carefully crafted poems with preserved line breaks.</li>
            <li>• Short stories steeped in nostalgia and vernacular charm.</li>
            <li>• Vintage aesthetics with language-appropriate typography.</li>
            <li>• Likes, shares, and optional comments from fellow readers.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
