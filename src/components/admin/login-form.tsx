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
      className="mx-auto flex w-full max-w-md flex-col gap-6 border-2 border-black bg-white px-8 py-10 shadow-[6px_6px_0px_rgba(0,0,0,1)]"
    >
      <div>
        <h1 className="text-3xl font-bold text-black">Admin Sign In</h1>
        <p className="mt-2 text-sm text-black">
          Enter your credentials to access the writing desk.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-xs font-bold uppercase text-black">
        Email
        <input
          type="email"
          name="email"
          required
          className="border-2 border-black bg-white px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
        />
        {state.fieldErrors?.email ? (
          <span className="text-xs font-medium text-red-600">{state.fieldErrors.email}</span>
        ) : null}
      </label>
      <label className="flex flex-col gap-2 text-xs font-bold uppercase text-black">
        Password
        <input
          type="password"
          name="password"
          required
          className="border-2 border-black bg-white px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
        />
        {state.fieldErrors?.password ? (
          <span className="text-xs font-medium text-red-600">{state.fieldErrors.password}</span>
        ) : null}
      </label>
      {state.status === 'error' && state.message ? (
        <p className="border-2 border-black bg-[var(--color-accent-secondary)] px-4 py-3 text-xs font-medium text-white">
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
      className="border-2 border-black bg-[var(--color-accent-primary)] px-6 py-3 text-sm font-bold uppercase text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:opacity-60"
    >
      {pending ? 'Signing in…' : 'Sign In'}
    </button>
  );
}
