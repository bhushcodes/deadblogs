'use server';

import { redirect } from 'next/navigation';
import { loginSchema } from '@/lib/validation';
import { attemptLogin, logout as destroySession } from '@/lib/auth';

export type AuthFormState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Record<string, string | undefined>;
};

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      status: 'error',
      fieldErrors: {
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
      message: 'Please fix the highlighted fields.',
    };
  }

  const user = await attemptLogin(parsed.data.email, parsed.data.password);
  if (!user) {
    return {
      status: 'error',
      message: 'Invalid credentials.',
    };
  }

  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}
