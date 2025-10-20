import { LoginForm } from '@/components/admin/login-form';
import { getCurrentUser } from '@/lib/simple-auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Login',
};

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <LoginForm />
    </div>
  );
}
