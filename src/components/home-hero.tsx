import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-2 border-black bg-white p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] md:p-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        <div className="flex-1">
          <span className="inline-block border-2 border-black bg-[var(--color-accent-tertiary)] px-3 py-1.5 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Literary Journal
          </span>
          <h1 className="mt-6 text-3xl font-bold leading-tight text-black md:text-4xl lg:text-5xl">
            Words that resonate.<br />
            Stories that stay.<br />
            Poetry that moves.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-black md:text-lg">
            Discover DEADPOET&apos;s curated collection of poems, short stories, and prose across Marathi,
            Hindi, and English. Every piece is unique, never translated, crafted with care.
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/marathi"
              className="inline-flex items-center justify-center border-2 border-black bg-[var(--color-accent-primary)] px-6 py-3 text-sm font-bold uppercase text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:text-white hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              Explore Marathi
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center justify-center border-2 border-black bg-[var(--color-accent-tertiary)] px-6 py-3 text-sm font-bold uppercase text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-success)] hover:text-white hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              Browse All Posts
            </Link>
          </div>
        </div>
        <div className="flex-1 border-2 border-black bg-white p-6">
          <p className="text-lg font-bold text-black">What&apos;s inside:</p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-black">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-black">▸</span>
              <span>Carefully crafted poems with preserved line breaks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-black">▸</span>
              <span>Short stories steeped in nostalgia and vernacular charm</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-black">▸</span>
              <span>Clean design with language-appropriate typography</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-black">▸</span>
              <span>Likes, shares, and optional comments from readers</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
