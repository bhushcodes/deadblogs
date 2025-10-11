'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import type { Language, PostStatus, PostType } from '@/generated/prisma';
import { bulkPostAction, deletePostAction } from '@/actions/posts';

type PostRow = {
  id: string;
  title: string;
  slug: string;
  language: Language;
  type: PostType;
  status: PostStatus;
  isFeatured: boolean;
  publishedLabel: string;
  updatedLabel: string | null;
  _count: {
    reactions: number;
    shareEvents: number;
    comments: number;
  };
};

export function PostsTable({
  posts,
  total,
  page,
  totalPages,
  searchParams,
}: {
  posts: PostRow[];
  total: number;
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const allSelected = selected.length === posts.length && posts.length > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(posts.map((post) => post.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulk = () => {
    if (!bulkAction || selected.length === 0) return;
    startTransition(async () => {
      await bulkPostAction({ ids: selected, action: bulkAction });
      setSelected([]);
      setBulkAction('');
    });
  };

  const nextHref = useMemo(() => buildHref(searchParams, page + 1), [searchParams, page]);
  const prevHref = useMemo(() => buildHref(searchParams, page - 1), [searchParams, page]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.7)] px-4 py-3 text-sm text-[var(--color-muted)]">
        <span>
          {selected.length} selected · {total} total
        </span>
        <div className="flex items-center gap-3">
          <select
            value={bulkAction}
            onChange={(event) => setBulkAction(event.target.value)}
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em]"
          >
            <option value="">Bulk action…</option>
            <option value="publish">Publish</option>
            <option value="unpublish">Unpublish</option>
            <option value="feature">Mark featured</option>
            <option value="unfeature">Remove featured</option>
            <option value="delete">Delete</option>
          </select>
          <button
            type="button"
            onClick={handleBulk}
            disabled={!bulkAction || selected.length === 0 || isPending}
            className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)] disabled:opacity-60"
          >
            Apply
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.8)] shadow-[var(--shadow-card)]">
        <table className="min-w-full divide-y divide-black/10 text-sm">
          <thead className="bg-[rgba(233,223,201,0.6)] text-left uppercase tracking-[0.25em] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">Stats</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-[rgba(233,223,201,0.25)]">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(post.id)}
                    onChange={() => toggleOne(post.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-[var(--color-ink)]">{post.title}</span>
                    <span className="text-xs text-[var(--color-muted)]">/{post.slug}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
                  {post.status}
                  {post.isFeatured ? <span className="ml-2 rounded-full bg-[rgba(123,63,75,0.15)] px-2 py-1">Featured</span> : null}
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
                  {post.language} · {post.type.replace('_', ' ')}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-muted)]">
                  ❤ {post._count.reactions} · ↗ {post._count.shareEvents} · 💬 {post._count.comments}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-muted)]">{post.updatedLabel}</td>
                <td className="px-4 py-3 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="rounded-full border border-[var(--color-muted)]/40 px-3 py-1 uppercase tracking-[0.25em] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(async () =>
                          bulkPostAction({ ids: [post.id], action: post.status === 'published' ? 'unpublish' : 'publish' }),
                        )
                      }
                      className="rounded-full border border-[var(--color-muted)]/40 px-3 py-1 uppercase tracking-[0.25em] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
                    >
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(async () =>
                          bulkPostAction({ ids: [post.id], action: post.isFeatured ? 'unfeature' : 'feature' }),
                        )
                      }
                      className="rounded-full border border-[var(--color-muted)]/40 px-3 py-1 uppercase tracking-[0.25em] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
                    >
                      {post.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(async () => {
                          await deletePostAction(post.id);
                        })
                      }
                      className="rounded-full border border-red-200 px-3 py-1 uppercase tracking-[0.25em] text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">
          {page > 1 ? (
            <Link
              href={prevHref}
              className="rounded-full border border-[var(--color-muted)]/40 px-3 py-1 hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-full border border-black/10 px-3 py-1 text-black/30">Previous</span>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={nextHref}
              className="rounded-full border border-[var(--color-muted)]/40 px-3 py-1 hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-full border border-black/10 px-3 py-1 text-black/30">Next</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

function buildHref(searchParams: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    } else if (key !== 'page') {
      params.set(key, value);
    }
  });
  params.set('page', String(Math.max(page, 1)));
  return `/admin/posts?${params.toString()}`;
}
