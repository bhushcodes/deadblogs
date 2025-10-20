import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Simple session token (just a random string, not JWT)
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function attemptLogin(email: string, password: string) {
  // Simple environment variable check
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

  if (email === adminEmail && password === adminPassword) {
    const token = generateSessionToken();
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
      id: 'admin',
      email: adminEmail,
      role: 'admin' as const,
    };
  }

  return null;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!token) return null;

  // If session cookie exists, user is authenticated
  return {
    id: 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    role: 'admin' as const,
  };
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
