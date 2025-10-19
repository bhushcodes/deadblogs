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
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r-2 border-black bg-white px-6 py-8 lg:flex">
        <Link href="/admin" className="text-lg font-bold uppercase tracking-tight text-black">
          Writing Desk
        </Link>
        <p className="mt-6 text-xs font-bold uppercase tracking-wide text-black">Navigation</p>
        <div className="mt-3 flex-1">
          <AdminNav />
        </div>
        <div className="mt-auto space-y-2 text-xs text-black">
          <p className="break-all font-medium">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b-2 border-black bg-white px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-black">Admin Dashboard</p>
            <h1 className="text-2xl font-bold text-black">DEADPOET</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              View site
            </Link>
            <Link
              href="/admin/posts/new"
              className="border-2 border-black bg-[var(--color-accent-primary)] px-4 py-2 text-xs font-bold uppercase text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              New post
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-white px-6 py-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
