import { prisma } from '@/lib/prisma';

export type ThemeSettings = {
  backgroundTextureUrl?: string;
  primaryTone?: string;
  accentTone?: string;
  showNoise?: boolean;
  commentsEnabled?: boolean;
};

const THEME_KEY = 'theme';

export async function getThemeSettings(): Promise<ThemeSettings> {
  const record = await prisma.siteSetting.findUnique({ where: { key: THEME_KEY } });
  return (record?.value as ThemeSettings) ?? {};
}

export async function updateThemeSettings(settings: ThemeSettings) {
  await prisma.siteSetting.upsert({
    where: { key: THEME_KEY },
    update: { value: settings },
    create: { key: THEME_KEY, value: settings },
  });
}
