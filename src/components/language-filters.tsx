'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Language, PostType } from '@/generated/prisma';
import { POST_TYPES, SortOption, SORT_OPTIONS } from '@/lib/constants';

type LanguageFiltersProps = {
  language: Language;
  selectedType?: PostType;
  selectedYear?: number;
  selectedSort?: SortOption;
  selectedTags: string[];
  availableTags: string[];
  availableYears: number[];
};

export function LanguageFilters(props: LanguageFiltersProps) {
  const {
    selectedSort = 'newest',
    selectedTags,
    selectedType,
    selectedYear,
    availableTags,
    availableYears,
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const updateQuery = useCallback(
    (key: string, value?: string | number | null) => {
      if (value === undefined || value === null || value === '' || value === 'all') {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
      query.delete('page');
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    },
    [pathname, query, router],
  );

  const toggleTag = useCallback(
    (tag: string) => {
      const current = new Set(selectedTags);
      if (current.has(tag)) {
        current.delete(tag);
      } else {
        current.add(tag);
      }

      if (current.size === 0) {
        query.delete('tags');
      } else {
        query.set('tags', Array.from(current).join(','));
      }
      query.delete('page');
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    },
    [pathname, query, router, selectedTags],
  );

  const clearFilters = useCallback(() => {
    const keepKeys = ['featured'];
    Array.from(query.keys()).forEach((key) => {
      if (!keepKeys.includes(key)) {
        query.delete(key);
      }
    });
    router.push(`${pathname}`, { scroll: false });
  }, [pathname, query, router]);

  return (
    <div className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.6)] p-6 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Genre
          <select
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
            value={selectedType ?? 'all'}
            onChange={(event) => updateQuery('type', event.target.value === 'all' ? null : event.target.value)}
          >
            <option value="all">All</option>
            {POST_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Year
          <select
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
            value={selectedYear ?? 'all'}
            onChange={(event) => updateQuery('year', event.target.value === 'all' ? null : event.target.value)}
          >
            <option value="all">All</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Sort
          <select
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
            value={selectedSort}
            onChange={(event) => updateQuery('sort', event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={clearFilters}
          className="self-end rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
        >
          Clear Filters
        </button>
      </div>
      {availableTags.length ? (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={[
                    'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition',
                    active
                      ? 'border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] text-[var(--color-accent)]'
                      : 'border-[var(--color-muted)]/30 bg-[rgba(255,255,255,0.6)] text-[var(--color-muted)] hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]',
                  ].join(' ')}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
