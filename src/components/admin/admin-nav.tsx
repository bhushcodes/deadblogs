'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/comments', label: 'Comments' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 text-sm">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'border-2 border-black px-3 py-2 font-bold uppercase transition-all',
              isActive
                ? 'bg-[var(--color-accent-primary)] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
            ].join(' ')}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
