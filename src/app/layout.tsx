import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { Playfair_Display, Crimson_Text, Mukta, Noto_Serif_Devanagari } from 'next/font/google';
import './globals.css';
import { getThemeSettings } from '@/lib/settings';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const crimson = Crimson_Text({
  subsets: ['latin'],
  variable: '--font-base',
  weight: ['400', '600', '700'],
  display: 'swap',
});

const mukta = Mukta({
  subsets: ['devanagari'],
  variable: '--font-devanagari-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari-serif',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: {
    template: '%s | DEADPOET',
    default: 'DEADPOET — Vintage Poetry & Stories',
  },
  description:
    'A vintage literary journal featuring Marathi, Hindi, and English poems and short stories by DEADPOET.',
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let theme: Awaited<ReturnType<typeof getThemeSettings>> = {};
  try {
    theme = await getThemeSettings();
  } catch (error) {
    console.warn('Falling back to default theme settings:', error);
    theme = {};
  }
  const bodyStyle: CSSProperties = {
    '--color-parchment': theme.primaryTone ?? '#f4e9d8',
    '--color-parchment-dark': theme.primaryTone ?? '#e9dfc9',
    '--color-accent': theme.accentTone ?? '#7b3f4b',
    '--color-accent-muted': theme.accentTone ? `${theme.accentTone}99` : '#3f6b73',
    '--custom-texture-image': theme.backgroundTextureUrl ? `url(${theme.backgroundTextureUrl})` : 'none',
    '--grain-opacity': theme.showNoise === false ? '0' : '0.14',
  } as React.CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          playfair.variable,
          crimson.variable,
          mukta.variable,
          notoDevanagari.variable,
          'antialiased',
        ].join(' ')}
        style={bodyStyle}
      >
        {children}
      </body>
    </html>
  );
}
