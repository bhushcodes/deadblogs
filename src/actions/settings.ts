'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getThemeSettings, updateThemeSettings } from '@/lib/settings';

const themeSchema = z.object({
  backgroundTextureUrl: z.string().url().optional().or(z.literal('')),
  primaryTone: z.string().optional(),
  accentTone: z.string().optional(),
  showNoise: z.boolean().optional(),
  commentsEnabled: z.boolean().optional(),
});

export async function saveThemeSettings(formData: FormData) {
  const current = await getThemeSettings();
  const parsed = themeSchema.safeParse({
    backgroundTextureUrl: formData.get('backgroundTextureUrl')?.toString() ?? '',
    primaryTone: formData.get('primaryTone')?.toString() ?? current.primaryTone,
    accentTone: formData.get('accentTone')?.toString() ?? current.accentTone,
    showNoise: formData.get('showNoise') === 'on',
    commentsEnabled: formData.get('commentsEnabled') === 'on',
  });

  if (!parsed.success) {
    throw new Error('Invalid theme settings');
  }

  const normalized = {
    ...current,
    ...parsed.data,
  };
  if (!normalized.backgroundTextureUrl) delete normalized.backgroundTextureUrl;

  await updateThemeSettings(normalized);
  revalidatePath('/');
  revalidatePath('/admin/comments');
}
