import { describe, it, expect } from 'vitest';
import { paginateMock } from './mock-pagination';

describe('paginateMock', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  it('paginates items with default options (page 1, limit 10)', () => {
    const result = paginateMock(items);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.data).toHaveLength(10);
    expect(result.data[0].id).toBe(1);
    expect(result.data[9].id).toBe(10);
  });

  it('handles query parameters for page and limit', () => {
    const result = paginateMock(items, { page: 2, limit: 5 });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.totalPages).toBe(5);
    expect(result.data).toHaveLength(5);
    expect(result.data[0].id).toBe(6);
    expect(result.data[4].id).toBe(10);
  });

  it('falls back to defaultLimit when specified in options', () => {
    const result = paginateMock(items, {}, { defaultLimit: 8 });
    expect(result.limit).toBe(8);
    expect(result.totalPages).toBe(4);
    expect(result.data).toHaveLength(8);
  });

  it('respects totalOverride in options', () => {
    const result = paginateMock(items, { page: 1, limit: 10 }, { totalOverride: 100 });
    expect(result.total).toBe(100);
    expect(result.totalPages).toBe(10);
  });

  it('handles empty items array gracefully', () => {
    const result = paginateMock([], { page: 1, limit: 10 });
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.data).toEqual([]);
  });
});
