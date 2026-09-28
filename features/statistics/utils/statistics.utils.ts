import type { CurrencyEnumType, TransactionTypeEnumType } from '../interfaces/statistics.interface';

export function getFormattedRangePill(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return `${new Date().getFullYear()}`;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startYear = isNaN(start.getFullYear()) ? new Date().getFullYear() : start.getFullYear();
  const endYear = isNaN(end.getFullYear()) ? new Date().getFullYear() : end.getFullYear();

  if (startYear === endYear) {
    return `${startYear}`;
  }
  return `${startYear} – ${endYear}`;
}

export function formatCurrency(amount: number, currency: CurrencyEnumType | string = 'eur'): string {
  const code = (currency || 'eur').toLowerCase();
  let symbol = '€';
  if (code === 'usd') symbol = '$';
  if (code === 'gbp') symbol = '£';

  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactCurrency(amount: number, currency: CurrencyEnumType | string = 'eur'): string {
  const code = (currency || 'eur').toLowerCase();
  let symbol = '€';
  if (code === 'usd') symbol = '$';
  if (code === 'gbp') symbol = '£';

  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatTransactionDate(dateInput: string | Date, locale = 'en-US'): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export const CATEGORY_DISPLAY_NAMES: Record<TransactionTypeEnumType, string> = {
  transfer: 'Bank Transfers',
  payment: 'Merchant Payments',
  topup: 'Account Top-ups',
};
