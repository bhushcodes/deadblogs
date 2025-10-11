'use client';

import { useState, useTransition } from 'react';
import { togglePostLike } from '@/actions/likes';

export function PostLikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isPending) return;
    startTransition(async () => {
      const result = await togglePostLike(postId);
      if (result) {
        setLiked(result.liked);
        setCount(result.count);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={liked}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition',
        liked
          ? 'border-[var(--color-accent)] bg-[rgba(123,63,75,0.15)] text-[var(--color-accent)]'
          : 'border-[var(--color-muted)]/40 bg-[rgba(255,255,255,0.6)] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]',
      ].join(' ')}
    >
      <HeartIcon filled={liked} className={liked ? 'text-[var(--color-accent)]' : ''} />
      {count} {count === 1 ? 'Like' : 'Likes'}
    </button>
  );
}

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 21c-4.2-3.4-6.7-5.7-8.1-7.3C2.7 12.2 2 10.9 2 9.3 2 6.5 4.3 4 7.1 4c1.5 0 3 .7 3.9 1.9C11 4.7 12.5 4 13.9 4 16.7 4 19 6.5 19 9.3c0 1.6-.7 2.9-1.9 4.4-1.4 1.6-3.9 3.9-7.1 7.3z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  );
}
