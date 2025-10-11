import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-muted)]">404</p>
      <h1 className="font-serif text-4xl text-[var(--color-ink)]">The page you seek is lost in the archives</h1>
      <p className="max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
        Perhaps the post has been unpublished, or the link has aged beyond recognition. Use the
        archive or language pages to continue your literary journey.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.1)] px-6 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)]"
        >
          Return Home
        </Link>
        <Link
          href="/posts"
          className="rounded-full border border-[var(--color-muted)]/40 px-6 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
        >
          Browse Archive
        </Link>
      </div>
    </div>
  );
}
