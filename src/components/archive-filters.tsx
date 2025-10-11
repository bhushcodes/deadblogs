import Link from 'next/link';
import { LANGUAGES, POST_TYPES, SORT_OPTIONS } from '@/lib/constants';

export type ArchiveFilterValues = {
  language?: string;
  type?: string;
  year?: number;
  sort?: string;
  search?: string;
  tags?: string[];
  featured?: boolean;
};

export function ArchiveFilters({ values, availableTags, availableYears }: {
  values: ArchiveFilterValues;
  availableTags: string[];
  availableYears: number[];
}) {
  const selectedTags = new Set(values.tags ?? []);

  return (
    <form
      method="get"
      className="rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.6)] p-6 shadow-[var(--shadow-card)]"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Search
          <input
            type="search"
            name="search"
            defaultValue={values.search ?? ''}
            placeholder="Title, tag, or keyword"
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Language
          <select
            name="language"
            defaultValue={values.language ?? 'all'}
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value="all">All</option>
            {LANGUAGES.map((language) => (
              <option key={language.slug} value={language.slug}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Genre
          <select
            name="type"
            defaultValue={values.type ?? 'all'}
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
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
            name="year"
            defaultValue={values.year ?? 'all'}
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
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
            name="sort"
            defaultValue={values.sort ?? 'newest'}
            className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-[var(--color-ink)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={values.featured}
            className="h-4 w-4 rounded border border-black/30"
          />
          Featured only
        </label>
      </div>

      {availableTags.length ? (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <label
                key={tag}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-muted)]/30 bg-[rgba(255,255,255,0.6)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]"
              >
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  defaultChecked={selectedTags.has(tag)}
                  className="h-4 w-4 rounded border border-black/30"
                />
                #{tag}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-end gap-3">
        <Link
          href="/posts"
          className="rounded-full border border-[var(--color-muted)]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition hover:border-[var(--color-accent-muted)] hover:text-[var(--color-accent-muted)]"
        >
          Reset
        </Link>
        <button
          type="submit"
          className="rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] px-6 py-2 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)]"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
