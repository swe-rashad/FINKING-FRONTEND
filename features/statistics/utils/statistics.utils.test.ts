import { describe, it, expect } from 'vitest';
import {
  getFormattedRangePill,
  formatCurrency,
  formatCompactCurrency,
  formatTransactionDate,
  CATEGORY_DISPLAY_NAMES,
} from './statistics.utils';

describe('statistics utilities', () => {
  describe('getFormattedRangePill', () => {
    it('returns single year if start and end are in the same year', () => {
      expect(getFormattedRangePill('2024-01-01', '2024-12-31')).toBe('2024');
    });

    it('returns year range if start and end are in different years', () => {
      expect(getFormattedRangePill('2023-01-01', '2024-12-31')).toBe('2023 – 2024');
    });

    it('handles empty dates by returning current year', () => {
      const currentYear = `${new Date().getFullYear()}`;
      expect(getFormattedRangePill('', '')).toBe(currentYear);
    });
  });

  describe('formatCurrency', () => {
    it('formats EUR currency by default', () => {
      const result = formatCurrency(1250.5);
      expect(result).toBe('€1,250.50');
    });

    it('formats USD correctly', () => {
      const result = formatCurrency(2500, 'usd');
      expect(result).toBe('$2,500.00');
    });

    it('formats GBP correctly', () => {
      const result = formatCurrency(99.9, 'gbp');
      expect(result).toBe('£99.90');
    });
  });

  describe('formatCompactCurrency', () => {
    it('formats numbers >= 1000 with k suffix', () => {
      expect(formatCompactCurrency(1500, 'eur')).toBe('€1.5k');
      expect(formatCompactCurrency(25000, 'usd')).toBe('$25.0k');
    });

    it('formats numbers < 1000 with 2 decimal places', () => {
      expect(formatCompactCurrency(450.5, 'eur')).toBe('€450.50');
    });
  });

  describe('formatTransactionDate', () => {
    it('returns "-" for falsy dates', () => {
      expect(formatTransactionDate('')).toBe('-');
    });

    it('formats valid ISO date strings properly', () => {
      const formatted = formatTransactionDate('2025-05-15T14:30:00Z', 'en-US');
      expect(formatted).toMatch(/May/);
      expect(formatted).toMatch(/2025/);
    });

    it('handles invalid date input gracefully', () => {
      expect(formatTransactionDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('CATEGORY_DISPLAY_NAMES', () => {
    it('has mapping for transfer, payment, topup', () => {
      expect(CATEGORY_DISPLAY_NAMES.transfer).toBe('Bank Transfers');
      expect(CATEGORY_DISPLAY_NAMES.payment).toBe('Merchant Payments');
      expect(CATEGORY_DISPLAY_NAMES.topup).toBe('Account Top-ups');
    });
  });
});
