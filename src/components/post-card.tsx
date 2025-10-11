import Link from 'next/link';
import Image from 'next/image';
import type { PublishedPost } from '@/lib/posts';
import { LANGUAGES } from '@/lib/constants';
import { formatDate } from '@/lib/format';

type PostCardProps = {
  post: PublishedPost;
};

const fallbackImages = [
  'radial-gradient(circle at 10% 20%, rgba(123, 63, 75, 0.18), transparent 60%)',
  'radial-gradient(circle at 90% 10%, rgba(63, 107, 115, 0.18), transparent 55%)',
  'radial-gradient(circle at 30% 70%, rgba(174, 140, 102, 0.22), transparent 60%)',
];

export function PostCard({ post }: PostCardProps) {
  const languageMeta = LANGUAGES.find((item) => item.id === post.language);
  const likeCount = post._count?.reactions ?? 0;
  const readingTime =
    post.readingTimeMinutes ??
    Math.max(1, Math.round(post.excerpt.split(/\s+/).filter(Boolean).length / 180));
  const fallback = fallbackImages[post.title.length % fallbackImages.length];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.6)] shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/post/${post.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[rgba(233,223,201,0.5)]">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 45vw, 90vw"
            priority={post.isFeatured}
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: fallback,
            }}
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[rgba(244,233,216,0.9)] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          {languageMeta?.label ?? post.language}
        </span>
        {post.isFeatured ? (
          <span className="absolute right-4 top-4 rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.15)] px-3 py-1 text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">
            Featured
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
            {formatDate(post.publishedAt) ?? 'Draft'}
          </p>
          <Link href={`/post/${post.slug}`} className="mt-2 block font-serif text-2xl text-[var(--color-ink)] hover:text-[var(--color-accent)]">
            {post.title}
          </Link>
        </div>
        <p className="clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
          <span>{readingTime} min read</span>
          <span>❤ {likeCount}</span>
        </div>
      </div>
    </article>
  );
}
