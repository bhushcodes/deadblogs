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
      className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
          Search
          <input
            type="search"
            name="search"
            defaultValue={values.search ?? ''}
            placeholder="Title, tag, or keyword"
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
          Language
          <select
            name="language"
            defaultValue={values.language ?? 'all'}
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="all">All</option>
            {LANGUAGES.map((language) => (
              <option key={language.slug} value={language.slug}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs font-medium uppercase text-black">
          Genre
          <select
            name="type"
            defaultValue={values.type ?? 'all'}
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
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
            name="year"
            defaultValue={values.year ?? 'all'}
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
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
            name="sort"
            defaultValue={values.sort ?? 'newest'}
            className="border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-medium uppercase text-black">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={values.featured}
            className="h-4 w-4 border-2 border-black accent-[var(--color-accent)]"
          />
          Featured only
        </label>
      </div>

      {availableTags.length ? (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase text-black">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <label
                key={tag}
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5 text-xs font-medium uppercase"
              >
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  defaultChecked={selectedTags.has(tag)}
                  className="h-4 w-4 border-2 border-black accent-[var(--color-accent)]"
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
          className="border-2 border-black bg-[var(--color-accent-tertiary)] px-5 py-2 text-xs font-bold uppercase text-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:text-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          Reset
        </Link>
        <button
          type="submit"
          className="border-2 border-black bg-[var(--color-accent-primary)] px-6 py-2 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-success)] hover:text-black hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
