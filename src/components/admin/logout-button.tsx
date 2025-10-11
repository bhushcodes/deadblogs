'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/actions/auth';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => logoutAction())}
      className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)] disabled:opacity-60"
      disabled={isPending}
    >
      {isPending ? 'Signing out…' : 'Sign Out'}
    </button>
  );
}
