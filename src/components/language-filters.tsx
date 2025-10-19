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
    <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <div className="grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
          Genre
          <select
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
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
        <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
          Year
          <select
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
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
        <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
          Sort
          <select
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
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
          className="self-end border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          Clear Filters
        </button>
      </div>
      {availableTags.length ? (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase text-black">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={[
                    'border-2 border-black px-3 py-1.5 text-xs font-medium uppercase transition-all',
                    active
                      ? 'bg-[var(--color-accent-primary)] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[var(--color-accent-secondary)]'
                      : 'bg-[var(--color-accent-tertiary)] text-black hover:bg-[var(--color-accent-primary)]',
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
