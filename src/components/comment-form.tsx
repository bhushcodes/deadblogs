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
      <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
        Name
        <input
          type="text"
          name="authorName"
          required
          className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="Your name"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
        Comment
        <textarea
          name="body"
          rows={4}
          required
          className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="Share your thoughts"
        />
      </label>
      {state.status === 'success' ? (
        <p className="border-2 border-black bg-[var(--color-accent-success)] px-4 py-2 text-xs font-medium text-black">
          {state.message}
        </p>
      ) : state.status === 'error' ? (
        <p className="border-2 border-black bg-[var(--color-accent-secondary)] px-4 py-2 text-xs font-medium text-black">{state.message}</p>
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
      className="border-2 border-black bg-[var(--color-accent-secondary)] px-6 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-primary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Sending…' : 'Submit comment'}
    </button>
  );
}
