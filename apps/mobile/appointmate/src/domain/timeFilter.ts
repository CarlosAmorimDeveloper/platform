export type TimeFilterPreset = 'todos' | 'ultimos_7_dias' | 'ultimos_30_dias' | 'personalizado';

export const TIME_FILTER_PRESETS: { value: TimeFilterPreset; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'ultimos_7_dias', label: 'Últimos 7 dias' },
  { value: 'ultimos_30_dias', label: 'Últimos 30 dias' },
  { value: 'personalizado', label: 'Personalizado' },
];

export interface TimeFilter {
  preset: TimeFilterPreset;
  customStart: string;
  customEnd: string;
}

export const DEFAULT_TIME_FILTER: TimeFilter = {
  preset: 'todos',
  customStart: '',
  customEnd: '',
};

export function parseDateInput(text: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isValid =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return isValid ? date : null;
}

export function isWithinTimeFilter(
  date: Date | null,
  filter: TimeFilter,
  now = new Date(),
): boolean {
  if (filter.preset === 'todos') return true;
  if (!date) return false;

  if (filter.preset === 'ultimos_7_dias' || filter.preset === 'ultimos_30_dias') {
    const days = filter.preset === 'ultimos_7_dias' ? 7 : 30;
    const threshold = new Date(now);
    threshold.setDate(threshold.getDate() - days);
    return date >= threshold;
  }

  const start = parseDateInput(filter.customStart);
  const end = parseDateInput(filter.customEnd);

  if (start && date < start) return false;
  if (end) {
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);
    if (date > endOfDay) return false;
  }
  return true;
}
