import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PostEditorForm } from '@/components/admin/post-editor-form';
import { getPostMetrics } from '@/lib/analytics';

export const metadata = {
  title: 'Edit Post',
};

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      slug: true,
      language: true,
      type: true,
      excerpt: true,
      body: true,
      coverImageUrl: true,
      tags: true,
      status: true,
      isFeatured: true,
      publishedAt: true,
      readingTimeMinutes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post) {
    notFound();
  }

  const metrics = await getPostMetrics(post.id);

  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-6 shadow-[var(--shadow-card)]">
        <h1 className="font-serif text-3xl text-[var(--color-ink)]">Edit post</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Created {post.createdAt.toLocaleString()} · Updated {post.updatedAt.toLocaleString()} · Reading time {post.readingTimeMinutes ?? '—'} min
        </p>
        {metrics ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-4 text-xs text-[var(--color-muted)]">
            <span>Likes: {metrics.likes}</span>
            <span>Views: {metrics.views}</span>
            <span>Shares: {metrics.shares}</span>
            <span>Comments: {metrics.comments}</span>
          </div>
        ) : null}
      </div>
      <PostEditorForm
        initialValues={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          language: post.language,
          type: post.type,
          excerpt: post.excerpt,
          body: post.body,
          coverImageUrl: post.coverImageUrl ?? '',
          tags: post.tags,
          tagsText: post.tags.join(', '),
          status: post.status,
          isFeatured: post.isFeatured,
          publishedAt: post.publishedAt ? post.publishedAt.toISOString().slice(0, 16) : undefined,
        }}
      />
    </div>
  );
}
