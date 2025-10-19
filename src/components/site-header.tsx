import Link from 'next/link';
import { LANGUAGES } from '@/lib/constants';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/tags', label: 'Tags' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-bold uppercase tracking-tight text-black sm:text-3xl">
              DEADPOET
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-black">
              Poetry & Stories
            </span>
          </Link>
        </div>
        <nav className="flex flex-wrap items-center justify-start gap-x-5 gap-y-3 text-sm font-medium uppercase">
          {LANGUAGES.map((language) => (
            <Link
              key={language.id}
              href={`/${language.slug}`}
              className="border-b-2 border-transparent transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {language.label}
            </Link>
          ))}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b-2 border-transparent transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action="/posts" className="flex h-11 items-center border-2 border-black bg-white px-4 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <input
            type="search"
            name="search"
            placeholder="Search..."
            className="w-36 bg-transparent text-sm font-medium outline-none placeholder:text-black/50 sm:w-44"
          />
        </form>
      </div>
    </header>
  );
}
