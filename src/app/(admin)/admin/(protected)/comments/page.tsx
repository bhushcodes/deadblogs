import Link from 'next/link';
import { listComments } from '@/lib/comments';
import { moderateCommentAction } from '@/actions/comments';

export const metadata = {
  title: 'Comment Moderation',
};

export default async function AdminCommentsPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const statusParam = typeof searchParams.status === 'string' ? searchParams.status : 'pending';
  const status: 'pending' | 'approved' | 'rejected' =
    statusParam === 'approved' ? 'approved' : statusParam === 'rejected' ? 'rejected' : 'pending';
  const { comments } = await listComments(status, 50);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <FilterLink label="Pending" status="pending" active={status === 'pending'} />
        <FilterLink label="Approved" status="approved" active={status === 'approved'} />
        <FilterLink label="Rejected" status="rejected" active={status === 'rejected'} />
      </div>
      {comments.length ? (
        <div className="overflow-x-auto rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.8)] shadow-[var(--shadow-card)]">
          <table className="min-w-full divide-y divide-black/10 text-sm">
            <thead className="bg-[rgba(233,223,201,0.6)] text-left uppercase tracking-[0.25em] text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-[rgba(233,223,201,0.25)]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-ink)]">{comment.body}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">{comment.authorName}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-muted)]">
                    <a
                      href={`/post/${comment.post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--color-accent-muted)] hover:underline"
                    >
                      {comment.post.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap gap-2">
                      <form action={async () => moderateCommentAction(comment.id, 'approve')}>
                        <button type="submit" className="rounded-full border border-[var(--color-muted)]/40 px-3 py-1 uppercase tracking-[0.25em] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]">
                          Approve
                        </button>
                      </form>
                      <form action={async () => moderateCommentAction(comment.id, 'reject')}>
                        <button type="submit" className="rounded-full border border-[var(--color-muted)]/40 px-3 py-1 uppercase tracking-[0.25em] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]">
                          Reject
                        </button>
                      </form>
                      <form action={async () => moderateCommentAction(comment.id, 'delete')}>
                        <button type="submit" className="rounded-full border border-red-200 px-3 py-1 uppercase tracking-[0.25em] text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-[18px] border border-dashed border-black/20 bg-[rgba(255,255,255,0.6)] p-10 text-center text-sm text-[var(--color-muted)]">
          No comments in this queue.
        </p>
      )}
    </div>
  );
}

function FilterLink({ label, status, active }: { label: string; status: string; active: boolean }) {
  return (
    <Link
      href={`/admin/comments?status=${status}`}
      className={[
        'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition',
        active
          ? 'border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] text-[var(--color-accent)]'
          : 'border-[var(--color-muted)]/40 text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}
