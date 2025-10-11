import Link from 'next/link';
import { LANGUAGES } from '@/lib/constants';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/tags', label: 'Tags' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[rgba(244,233,216,0.96)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex flex-col text-xl font-semibold uppercase tracking-[0.35em] text-[var(--color-muted)]">
            <span className="font-serif text-2xl text-[var(--color-ink)]">DEADPOET</span>
            <span className="text-xs font-light uppercase tracking-[0.6em] text-[var(--color-muted)]">
              Poems & Stories
            </span>
          </Link>
        </div>
        <nav className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)] md:text-xs">
          {LANGUAGES.map((language) => (
            <Link
              key={language.id}
              href={`/${language.slug}`}
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              {language.label}
            </Link>
          ))}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action="/posts" className="flex h-10 items-center rounded-full border border-black/10 bg-[rgba(255,255,255,0.7)] px-3">
          <input
            type="search"
            name="search"
            placeholder="Search the archive"
            className="w-40 bg-transparent text-sm text-[var(--color-muted)] outline-none placeholder:text-[var(--color-muted)]/60"
          />
        </form>
      </div>
    </header>
  );
}
