'use server';

import { revalidatePath } from 'next/cache';
import { getVisitorFingerprint } from '@/lib/fingerprint';
import { toggleLike, hasLiked, getLikeCount } from '@/lib/analytics';
import { getCurrentUser } from '@/lib/auth';

export async function togglePostLike(postId: string, revalidate?: string) {
  const { fingerprint } = await getVisitorFingerprint({ persist: true });
  const user = await getCurrentUser();
  const result = await toggleLike(postId, fingerprint, user?.id);

  if (revalidate) {
    revalidatePath(revalidate);
  }

  return result;
}

export async function getPostLikeState(postId: string, fingerprintOverride?: string) {
  const { fingerprint } = fingerprintOverride
    ? { fingerprint: fingerprintOverride }
    : await getVisitorFingerprint();
  const user = await getCurrentUser();
  const liked = await hasLiked(postId, fingerprint, user?.id);
  const count = await getLikeCount(postId);
  return { liked, count };
}
