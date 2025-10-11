import { PostEditorForm } from '@/components/admin/post-editor-form';

export const metadata = {
  title: 'Create Post',
};

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-[var(--color-ink)]">Create new post</h1>
      <PostEditorForm initialValues={{ status: 'draft', isFeatured: false, tags: [], tagsText: '' }} />
    </div>
  );
}
