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
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        <span>
          {selected.length} selected · {total} total
        </span>
        <div className="flex items-center gap-3">
          <select
            value={bulkAction}
            onChange={(event) => setBulkAction(event.target.value)}
            className="border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase text-black"
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
            className="border-2 border-black bg-[var(--color-accent-primary)] px-4 py-2 text-xs font-bold uppercase text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] disabled:opacity-60"
          >
            Apply
          </button>
        </div>
      </div>
      <div className="overflow-x-auto border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <table className="min-w-full divide-y-2 divide-black text-sm">
          <thead className="bg-[var(--color-accent-tertiary)] text-left font-bold uppercase text-black">
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
          <tbody className="divide-y-2 divide-black">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-[var(--color-accent-tertiary)]/20">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(post.id)}
                    onChange={() => toggleOne(post.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-black">{post.title}</span>
                    <span className="text-xs text-black">/{post.slug}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-bold uppercase text-black">
                  {post.status}
                  {post.isFeatured ? <span className="ml-2 border-2 border-black bg-[var(--color-accent-secondary)] px-2 py-1 text-white">Featured</span> : null}
                </td>
                <td className="px-4 py-3 text-xs font-bold uppercase text-black">
                  {post.language} · {post.type.replace('_', ' ')}
                </td>
                <td className="px-4 py-3 text-xs text-black">
                  ❤ {post._count.reactions} · ↗ {post._count.shareEvents} · 💬 {post._count.comments}
                </td>
                <td className="px-4 py-3 text-xs text-black">{post.updatedLabel}</td>
                <td className="px-4 py-3 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase text-black transition-all hover:bg-[var(--color-accent-primary)] hover:text-white hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
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
                      className="border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase text-black transition-all hover:bg-[var(--color-accent-primary)] hover:text-white hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
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
                      className="border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase text-black transition-all hover:bg-[var(--color-accent-primary)] hover:text-white hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
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
                      className="border-2 border-black bg-red-600 px-3 py-1 text-xs font-bold uppercase text-white transition-all hover:bg-red-700 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
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
        <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase text-black">
          {page > 1 ? (
            <Link
              href={prevHref}
              className="border-2 border-black bg-[var(--color-accent-primary)] px-4 py-2 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              Previous
            </Link>
          ) : (
            <span className="cursor-not-allowed border-2 border-black bg-[var(--color-accent-tertiary)] px-4 py-2 text-black opacity-50">Previous</span>
          )}
          <span className="font-bold">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={nextHref}
              className="border-2 border-black bg-[var(--color-accent-primary)] px-4 py-2 text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              Next
            </Link>
          ) : (
            <span className="cursor-not-allowed border-2 border-black bg-[var(--color-accent-tertiary)] px-4 py-2 text-black opacity-50">Next</span>
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
