'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, type AuthFormState } from '@/actions/auth';

const initialState: AuthFormState = { status: 'idle' };

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-[24px] border border-black/10 bg-[rgba(255,255,255,0.7)] px-8 py-10 shadow-[var(--shadow-card)]"
    >
      <div>
        <h1 className="font-serif text-3xl text-[var(--color-ink)]">Admin Sign In</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Enter your credentials to access the writing desk.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        Email
        <input
          type="email"
          name="email"
          required
          className="rounded-full border border-black/20 bg-white px-4 py-3 text-sm text-[var(--color-ink)]"
        />
        {state.fieldErrors?.email ? (
          <span className="text-xs text-red-600">{state.fieldErrors.email}</span>
        ) : null}
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        Password
        <input
          type="password"
          name="password"
          required
          className="rounded-full border border-black/20 bg-white px-4 py-3 text-sm text-[var(--color-ink)]"
        />
        {state.fieldErrors?.password ? (
          <span className="text-xs text-red-600">{state.fieldErrors.password}</span>
        ) : null}
      </label>
      {state.status === 'error' && state.message ? (
        <p className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
          {state.message}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)] disabled:opacity-60"
    >
      {pending ? 'Signing in…' : 'Sign In'}
    </button>
  );
}
