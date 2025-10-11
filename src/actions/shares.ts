'use server';

import { getVisitorFingerprint } from '@/lib/fingerprint';
import { recordShare } from '@/lib/analytics';
import type { ShareNetwork } from '@/generated/prisma';

export async function logShare(postId: string, network: ShareNetwork) {
  const { fingerprint } = await getVisitorFingerprint({ persist: true });
  await recordShare(postId, network, fingerprint);
  return { ok: true };
}
