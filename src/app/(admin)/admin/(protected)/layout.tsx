import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
