'use server';

import { revalidatePath } from 'next/cache';
import { commentSchema } from '@/lib/validation';
import { createComment } from '@/lib/comments';

export type CommentActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function submitCommentAction(_: CommentActionState, formData: FormData): Promise<CommentActionState> {
  const result = commentSchema.safeParse({
    postId: formData.get('postId'),
    authorName: formData.get('authorName'),
    body: formData.get('body'),
  });

  if (!result.success) {
    return { status: 'error', message: 'Please fill in your name and comment.' };
  }

  await createComment(result.data);
  revalidatePath(`/post/${formData.get('slug')}`);
  return { status: 'success', message: 'Thank you! Your comment awaits moderation.' };
}
