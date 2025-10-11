import Link from 'next/link';
import type { Language } from '@/generated/prisma';
import { LANGUAGES } from '@/lib/constants';

type LanguageCardProps = {
  language: Language;
};

export function LanguageCard({ language }: LanguageCardProps) {
  const config = LANGUAGES.find((item) => item.id === language);
  if (!config) return null;

  return (
    <Link
      href={`/${config.slug}`}
      className="group block rounded-[18px] border border-black/10 bg-[rgba(244,233,216,0.7)] p-6 shadow-[var(--shadow-card)] transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">Language</p>
      <p className="mt-2 font-serif text-2xl text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">{config.label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{config.description}</p>
    </Link>
  );
}
