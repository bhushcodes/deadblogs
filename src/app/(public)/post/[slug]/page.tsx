import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { LANGUAGES } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { getBodyFontClass, getHeadingFontClass } from '@/lib/typography';
import { PostBody } from '@/components/post-body';
import { PostCard } from '@/components/post-card';
import { getVisitorFingerprint } from '@/lib/fingerprint';
import { recordView } from '@/lib/analytics';
import { getPostLikeState } from '@/actions/likes';
import { PostLikeButton } from '@/components/post-like-button';
import { ShareMenu } from '@/components/share-menu';
import { getAbsoluteUrl } from '@/lib/url';
import { getThemeSettings } from '@/lib/settings';
import { CommentForm } from '@/components/comment-form';

export const dynamic = 'force-dynamic';

type PostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== 'published') {
    return {
      title: 'Post not found',
    };
  }

  const canonical = getAbsoluteUrl(`/post/${params.slug}`);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      locale: post.language === 'english' ? 'en_US' : post.language === 'hindi' ? 'hi_IN' : 'mr_IN',
      url: canonical,
      images: post.coverImageUrl
        ? [
            {
              url: post.coverImageUrl,
              alt: post.title,
            },
          ]
        : undefined,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  const { fingerprint } = await getVisitorFingerprint();
  await recordView(post.id, fingerprint);
  const likeState = await getPostLikeState(post.id, fingerprint);
  let commentsEnabled = true;
  try {
    const theme = await getThemeSettings();
    commentsEnabled = theme.commentsEnabled ?? true;
  } catch (error) {
    console.warn('Using default comment settings due to database error:', error);
  }

  const related = await getRelatedPosts(post);
  const languageMeta = LANGUAGES.find((item) => item.id === post.language);
  const headingFont = getHeadingFontClass(post.language);
  const bodyFont = getBodyFontClass(post.language);
  const readingTime =
    post.readingTimeMinutes ??
    Math.max(1, Math.round(post.body.split(/\s+/).filter(Boolean).length / 180));
  const shareUrl = getAbsoluteUrl(`/post/${post.slug}`);

  return (
    <article className="space-y-12">
      <div className="overflow-hidden rounded-[28px] border border-black/10 bg-[rgba(255,255,255,0.6)] shadow-[var(--shadow-card)]">
        {post.coverImageUrl ? (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}
        <div className="space-y-6 px-8 py-10 md:px-12">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            <span>{languageMeta?.label ?? post.language}</span>
            <span>•</span>
            <span>{post.type.replace('_', ' ')}</span>
            <span>•</span>
            <span>{formatDate(post.publishedAt) ?? 'Unpublished'}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
          <h1 className={`${headingFont} font-serif text-4xl text-[var(--color-ink)] md:text-5xl`}>
            {post.title}
          </h1>
          <p className={`${bodyFont} text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]`}>
            By DEADPOET • Updated {formatDate(post.updatedAt)}
          </p>
          {post.tags.length ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[var(--color-muted)]/30 bg-[rgba(255,255,255,0.6)] px-4 py-1 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="mt-6 flex flex-col gap-4 border-t border-black/10 pt-6 md:flex-row md:items-center md:justify-between">
            <PostLikeButton
              postId={post.id}
              initialLiked={likeState.liked}
              initialCount={likeState.count}
            />
            <ShareMenu
              postId={post.id}
              postTitle={post.title}
              shareUrl={shareUrl}
              initialCount={post._count.shareEvents}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-8 shadow-[var(--shadow-card)] md:p-12">
        <div className="space-y-6 text-lg leading-relaxed text-[var(--color-ink)] drop-cap">
          <PostBody content={post.body} language={post.language} type={post.type} />
        </div>
      </div>

      {related.length ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <h2 className="font-serif text-3xl text-[var(--color-ink)]">Related writings</h2>
            <Link
              href={`/${languageMeta?.slug ?? post.language}`}
              className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
            >
              More in {languageMeta?.label ?? post.language}
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6 rounded-[20px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-6 shadow-[var(--shadow-card)]">
        <div className="border-b border-black/10 pb-4">
          <h2 className="font-serif text-3xl text-[var(--color-ink)]">Comments</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {commentsEnabled
              ? 'Share your reflections. Comments are published after review.'
              : 'Comments are currently closed for this post.'}
          </p>
        </div>
        {commentsEnabled ? (
          <CommentForm postId={post.id} slug={post.slug} />
        ) : null}
        {post.comments.length ? (
          <ul className="space-y-4">
            {post.comments.map((comment) => (
              <li key={comment.id} className="rounded-lg border border-black/10 bg-[rgba(233,223,201,0.4)] px-4 py-3">
                <p className={`${bodyFont} text-[var(--color-ink)]`}>{comment.body}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  {comment.authorName} · {formatDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">No comments yet.</p>
        )}
      </section>
    </article>
  );
}
