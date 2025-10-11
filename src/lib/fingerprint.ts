import { cookies, headers } from 'next/headers';
import { createHash, randomUUID } from 'node:crypto';

const COOKIE_NAME = 'vintage_fp';
const ONE_YEAR = 60 * 60 * 24 * 365;

type FingerprintOptions = {
  persist?: boolean;
};
export async function getVisitorFingerprint(options: FingerprintOptions = {}) {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(COOKIE_NAME)?.value ?? null;
  const headerStore = await headers();
  const forwardedFor = headerStore.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0]?.trim() ?? '' : headerStore.get('x-real-ip') ?? '';
  const userAgent = headerStore.get('user-agent') ?? '';

  if (!visitorId && options.persist) {
    visitorId = randomUUID();
    cookieStore.set({
      name: COOKIE_NAME,
      value: visitorId,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: ONE_YEAR,
      path: '/',
    });
  }

  const base = visitorId ?? `${ip}|${userAgent}`;

  const hash = createHash('sha256')
    .update(base)
    .digest('hex');

  return { visitorId, fingerprint: hash };
}
