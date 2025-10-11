'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitCommentAction, type CommentActionState } from '@/actions/public-comments';

const initialState: CommentActionState = { status: 'idle' };

export function CommentForm({ postId, slug }: { postId: string; slug: string }) {
  const [state, formAction] = useActionState(submitCommentAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="slug" value={slug} />
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        Name
        <input
          type="text"
          name="authorName"
          required
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-[var(--color-ink)]"
          placeholder="Your name"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
        Comment
        <textarea
          name="body"
          rows={4}
          required
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-[var(--color-ink)]"
          placeholder="Share your thoughts"
        />
      </label>
      {state.status === 'success' ? (
        <p className="rounded-full border border-[var(--color-muted)]/30 bg-[rgba(255,255,255,0.7)] px-4 py-2 text-xs text-[var(--color-muted)]">
          {state.message}
        </p>
      ) : state.status === 'error' ? (
        <p className="text-xs text-red-600">{state.message}</p>
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
      className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)] disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Submit comment'}
    </button>
  );
}
