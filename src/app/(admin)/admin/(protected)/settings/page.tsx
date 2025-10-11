import { getThemeSettings } from '@/lib/settings';
import { saveThemeSettings } from '@/actions/settings';

export const metadata = {
  title: 'Site Settings',
};

export default async function SettingsPage() {
  const theme = await getThemeSettings();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-[var(--color-ink)]">Theme settings</h1>
      <form
        action={saveThemeSettings}
        className="grid max-w-3xl gap-4 rounded-[18px] border border-black/10 bg-[rgba(255,255,255,0.7)] p-6 shadow-[var(--shadow-card)]"
      >
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Background texture URL
          <input
            type="url"
            name="backgroundTextureUrl"
            defaultValue={theme.backgroundTextureUrl ?? ''}
            placeholder="https://example.com/texture.png"
            className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-[var(--color-ink)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Primary tone (hex)
          <input
            type="text"
            name="primaryTone"
            defaultValue={theme.primaryTone ?? '#f4e9d8'}
            className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-[var(--color-ink)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Accent tone (hex)
          <input
            type="text"
            name="accentTone"
            defaultValue={theme.accentTone ?? '#7b3f4b'}
            className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-[var(--color-ink)]"
          />
        </label>
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          <input type="checkbox" name="showNoise" defaultChecked={theme.showNoise ?? true} />
          Enable grain overlay
        </label>
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
          <input type="checkbox" name="commentsEnabled" defaultChecked={theme.commentsEnabled ?? true} />
          Enable visitor comments
        </label>
        <button
          type="submit"
          className="mt-4 w-max rounded-full border border-[var(--color-accent)] bg-[rgba(123,63,75,0.12)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] transition hover:bg-[rgba(123,63,75,0.18)]"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
