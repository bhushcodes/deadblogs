import type { CommentStatus, Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

export type CreateCommentInput = {
  postId: string;
  authorName: string;
  body: string;
};

export async function createComment(input: CreateCommentInput) {
  const { postId, authorName, body } = input;

  return prisma.comment.create({
    data: {
      postId,
      authorName,
      body,
      status: 'pending',
    },
  });
}

export async function listComments(
  status: CommentStatus = 'pending',
  take = 20,
  cursor?: string,
) {
  const where: Prisma.CommentWhereInput = { status };

  const comments = await prisma.comment.findMany({
    where,
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  const nextCursor = comments.length === take ? comments[comments.length - 1].id : null;
  return { comments, nextCursor };
}

export async function setCommentStatus(commentId: string, status: CommentStatus) {
  return prisma.comment.update({
    where: { id: commentId },
    data: { status },
  });
}

export async function deleteComment(commentId: string) {
  await prisma.comment.delete({
    where: { id: commentId },
  });
}
