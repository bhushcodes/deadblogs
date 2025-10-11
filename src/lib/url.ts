export function getAbsoluteUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (base) {
    return new URL(normalizedPath, base).toString();
  }
  const fallback = 'http://localhost:3000';
  return new URL(normalizedPath, fallback).toString();
}
