import { format, parseISO } from 'date-fns';

export function formatDate(value?: string | Date | null, pattern = 'MMMM d, yyyy') {
  if (!value) return null;
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, pattern);
}
