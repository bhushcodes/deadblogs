'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/actions/auth';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => logoutAction())}
      className="border-2 border-black bg-[var(--color-accent-secondary)] px-4 py-2 text-xs font-bold uppercase text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-primary)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] disabled:opacity-60"
      disabled={isPending}
    >
      {isPending ? 'Signing out…' : 'Sign Out'}
    </button>
  );
}
