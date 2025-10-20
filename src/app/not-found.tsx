import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-8 text-center">
      <div className="inline-block border-2 border-black bg-[var(--color-accent-secondary)] px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <p className="text-6xl font-bold uppercase text-white">404</p>
      </div>
      <h1 className="text-4xl font-bold text-black md:text-5xl">Page Not Found</h1>
      <p className="max-w-xl text-base leading-relaxed text-black">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Use the buttons below to continue your literary journey.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="border-2 border-black bg-[var(--color-accent-primary)] px-6 py-3 text-sm font-bold uppercase text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        >
          Return Home
        </Link>
        <Link
          href="/posts"
          className="border-2 border-black bg-[var(--color-accent-tertiary)] px-6 py-3 text-sm font-bold uppercase text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-success)] hover:text-white hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        >
          Browse Archive
        </Link>
      </div>
    </div>
  );
}
