'use server';

import { revalidatePath } from 'next/cache';
import { setCommentStatus, deleteComment } from '@/lib/comments';

export async function moderateCommentAction(commentId: string, action: 'approve' | 'reject' | 'delete') {
  if (action === 'approve' || action === 'reject') {
    await setCommentStatus(commentId, action === 'approve' ? 'approved' : 'rejected');
  } else if (action === 'delete') {
    await deleteComment(commentId);
  }

  revalidatePath('/admin/comments');
}
