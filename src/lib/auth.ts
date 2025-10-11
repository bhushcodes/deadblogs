import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { compare, hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  sub: string;
  email: string;
  role: 'admin';
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getAuthSecret());
}

async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret());
  return payload as SessionPayload;
}

export async function createAdminAccount(email: string, password: string) {
  const passwordHash = await hash(password, 12);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: 'admin',
    },
  });
}

export async function attemptLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = await verifySessionToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });
    return user;
  } catch {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
}
