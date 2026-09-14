export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function formatDisplayDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parseISODate(value));
}

export type DateRangePresetId =
  | 'thisMonth'
  | 'last30Days'
  | 'last3Months'
  | 'last6Months'
  | 'yearToDate';

export function rangeForPreset(
  id: DateRangePresetId,
  today = new Date()
): {
  start: string;
  end: string;
} {
  const end = toISODate(today);

  switch (id) {
    case 'thisMonth':
      return { start: toISODate(startOfMonth(today)), end };
    case 'last30Days':
      return { start: toISODate(addDays(today, -29)), end };
    case 'last3Months':
      return { start: toISODate(addMonths(startOfMonth(today), -2)), end };
    case 'last6Months':
      return { start: toISODate(addMonths(startOfMonth(today), -5)), end };
    case 'yearToDate':
      return { start: toISODate(new Date(today.getFullYear(), 0, 1)), end };
  }
}
