import Link from 'next/link';
import Image from 'next/image';
import type { PublishedPost } from '@/lib/posts';
import { LANGUAGES } from '@/lib/constants';
import { formatDate } from '@/lib/format';

type PostCardProps = {
  post: PublishedPost;
};

const fallbackColors = [
  'bg-white',
  'bg-white',
  'bg-white',
  'bg-white',
];

export function PostCard({ post }: PostCardProps) {
  const languageMeta = LANGUAGES.find((item) => item.id === post.language);
  const likeCount = post._count?.reactions ?? 0;
  const readingTime =
    post.readingTimeMinutes ??
    Math.max(1, Math.round(post.excerpt.split(/\s+/).filter(Boolean).length / 180));
  const fallbackBg = fallbackColors[post.title.length % fallbackColors.length];

  return (
    <article className="group flex h-full flex-col overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]">
      <Link href={`/post/${post.slug}`} className={`relative block aspect-[4/3] w-full overflow-hidden ${!post.coverImageUrl ? fallbackBg : 'bg-white'}`}>
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 45vw, 90vw"
            priority={post.isFeatured}
          />
        ) : null}
        <span className="absolute left-3 top-3 border-2 border-black bg-[var(--color-accent-tertiary)] px-2.5 py-1 text-xs font-bold uppercase text-black">
          {languageMeta?.label ?? post.language}
        </span>
        {post.isFeatured ? (
          <span className="absolute right-3 top-3 border-2 border-black bg-[var(--color-accent-secondary)] px-2.5 py-1 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Featured
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-black">
            {formatDate(post.publishedAt) ?? 'Draft'}
          </p>
          <Link href={`/post/${post.slug}`} className="mt-2 block text-xl font-bold leading-tight text-black hover:text-[var(--color-accent)]">
            {post.title}
          </Link>
        </div>
        <p className="clamp-3 text-sm leading-relaxed text-black">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between border-t-2 border-black pt-3 text-xs font-medium uppercase tracking-wide text-black">
          <span>{readingTime} min read</span>
          <span className="flex items-center gap-1">
            <span>❤</span>
            <span>{likeCount}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
