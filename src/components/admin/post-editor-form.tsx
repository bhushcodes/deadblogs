'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { PostEditorInput } from '@/lib/validation';
import { LANGUAGES, POST_TYPES } from '@/lib/constants';
import { savePostAction } from '@/actions/posts';
import { slugify } from '@/lib/slug';

export type PostEditorFormValues = PostEditorInput & {
  tagsText: string;
};

export function PostEditorForm({ initialValues }: { initialValues: Partial<PostEditorFormValues> }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PostEditorFormValues>({
    defaultValues: {
      id: initialValues.id,
      title: initialValues.title ?? '',
      slug: initialValues.slug ?? '',
      language: initialValues.language ?? 'marathi',
      type: initialValues.type ?? 'poem',
      excerpt: initialValues.excerpt ?? '',
      body: initialValues.body ?? '',
      coverImageUrl: initialValues.coverImageUrl ?? '',
      tagsText: initialValues.tagsText ?? initialValues.tags?.join(', ') ?? '',
      tags: initialValues.tags ?? [],
      status: initialValues.status ?? 'draft',
      isFeatured: initialValues.isFeatured ?? false,
      publishedAt: initialValues.publishedAt ?? null,
    },
  });

  const { watch, setValue, handleSubmit, formState } = form;
  const watchTitle = watch('title');
  const watchStatus = watch('status');

  useEffect(() => {
    if (!initialValues.slug || initialValues.slug === '') {
      const generated = slugify(watchTitle || '');
      if (generated && !formState.dirtyFields.slug) {
        setValue('slug', generated, { shouldValidate: false });
      }
    }
  }, [watchTitle, setValue, initialValues.slug, formState.dirtyFields.slug]);

  const onSubmit = handleSubmit((values) => {
    const tags = values.tagsText
      ? values.tagsText
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const payload: PostEditorInput = {
      id: values.id,
      title: values.title,
      slug: values.slug,
      language: values.language,
      type: values.type,
      excerpt: values.excerpt,
      body: values.body,
      coverImageUrl: values.coverImageUrl,
      tags,
      status: values.status,
      isFeatured: values.isFeatured,
      publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
    };

    startTransition(async () => {
      const result = await savePostAction(payload);
      if (result.success) {
        setMessage(result.message ?? 'Saved');
        if (!values.id && result.id) {
          router.replace(`/admin/posts/${result.id}/edit`);
        }
      } else if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([key, error]) => {
          if (error) {
            form.setError(key as keyof PostEditorFormValues, { type: 'server', message: error });
          }
        });
        setMessage(result.message ?? 'Unable to save.');
      }
    });
  });

  const statusOptions = useMemo(
    () => [
      { id: 'draft', label: 'Draft' },
      { id: 'published', label: 'Published' },
    ],
    [],
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {message ? (
        <p className="border-2 border-black bg-[var(--color-accent-success)] px-4 py-2 text-xs font-bold text-white">
          {message}
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Field label="Title" error={formState.errors.title?.message}>
            <input
              type="text"
              {...form.register('title')}
              className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              placeholder="Post title"
            />
          </Field>
          <Field label="Slug" error={formState.errors.slug?.message}>
            <input
              type="text"
              {...form.register('slug')}
              className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              placeholder="auto-generated"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Language">
              <select
                {...form.register('language')}
                className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              >
                {LANGUAGES.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Type">
              <select
                {...form.register('type')}
                className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              >
                {POST_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Excerpt" error={formState.errors.excerpt?.message}>
            <textarea
              rows={4}
              {...form.register('excerpt')}
              className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </Field>
          <Field label="Tags (comma separated)">
            <input
              type="text"
              {...form.register('tagsText')}
              className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              placeholder="nostalgia, ghazal, monsoon"
            />
          </Field>
          <Field label="Cover image URL" error={formState.errors.coverImageUrl?.message}>
            <input
              type="url"
              {...form.register('coverImageUrl')}
              className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              placeholder="https://…"
            />
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Body" error={formState.errors.body?.message}>
            <textarea
              rows={20}
              {...form.register('body')}
              className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black font-body-english focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              placeholder="Write using Markdown. Use blank lines to separate stanzas."
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select
                {...form.register('status')}
                className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              >
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Published at">
              <input
                type="datetime-local"
                {...form.register('publishedAt')}
                className="w-full border-2 border-black bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-black">
            <input type="checkbox" {...form.register('isFeatured')} /> Featured on homepage
          </label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="border-2 border-black bg-[var(--color-accent-primary)] px-6 py-3 text-sm font-bold uppercase text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:opacity-60"
        >
          {isPending ? 'Saving…' : watchStatus === 'published' ? 'Save & Publish' : 'Save Draft'}
        </button>
        {initialValues.slug ? (
          <a
            href={`/post/${initialValues.slug}`}
            target="_blank"
            rel="noreferrer"
            className="border-2 border-black bg-white px-6 py-3 text-sm font-bold uppercase text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[var(--color-accent-tertiary)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          >
            View live
          </a>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-bold uppercase text-black">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
