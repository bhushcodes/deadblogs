import type { ReactNode } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { LogoutButton } from '@/components/admin/logout-button';

export function AdminShell({
  user,
  children,
}: {
  user: { id: string; email: string };
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[rgba(244,233,216,0.6)]">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-black/10 bg-[rgba(233,223,201,0.7)] px-6 py-8 lg:flex">
        <Link href="/admin" className="text-lg font-semibold uppercase tracking-[0.35em] text-[var(--color-muted)]">
          Writing Desk
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Navigation</p>
        <div className="mt-3 flex-1">
          <AdminNav />
        </div>
        <div className="mt-auto space-y-2 text-xs text-[var(--color-muted)]">
          <p className="break-all">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/10 bg-[rgba(255,255,255,0.7)] px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Admin Dashboard</p>
            <h1 className="font-serif text-2xl text-[var(--color-ink)]">DEADPOET</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-[var(--color-muted)]/30 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
            >
              View site
            </Link>
            <Link
              href="/admin/posts/new"
              className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)]"
            >
              New post
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[rgba(244,233,216,0.2)] px-6 py-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
