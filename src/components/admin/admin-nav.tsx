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
    <nav className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'rounded-lg px-3 py-2 transition',
              isActive
                ? 'bg-[rgba(123,63,75,0.12)] text-[var(--color-accent)]'
                : 'hover:bg-[rgba(233,223,201,0.7)] hover:text-[var(--color-ink)]',
            ].join(' ')}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
