import type { Language } from '@/generated/prisma';

export function getHeadingFontClass(language: Language) {
  return language === 'english' ? 'font-heading-english' : 'font-heading-devanagari';
}

export function getBodyFontClass(language: Language) {
  return language === 'english' ? 'font-body-english' : 'font-body-devanagari';
}
