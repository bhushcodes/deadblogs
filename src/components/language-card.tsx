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
      className="group block border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
    >
      <p className="text-xs font-bold uppercase tracking-wide text-black">Language</p>
      <p className="mt-2 text-2xl font-bold text-black">{config.label}</p>
      <p className="mt-3 text-sm leading-relaxed text-black">{config.description}</p>
    </Link>
  );
}
