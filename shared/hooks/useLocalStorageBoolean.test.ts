import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageBoolean } from './useLocalStorageBoolean';

describe('useLocalStorageBoolean', () => {
  const TEST_KEY = 'test_bool_key';

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorageBoolean(TEST_KEY, false));
    expect(result.current[0]).toBe(false);

    const { result: resultTrue } = renderHook(() => useLocalStorageBoolean(TEST_KEY + '_2', true));
    expect(resultTrue.current[0]).toBe(true);
  });

  it('updates value and stores in localStorage', () => {
    const { result } = renderHook(() => useLocalStorageBoolean(TEST_KEY, false));

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem(TEST_KEY)).toBe('true');
  });

  it('supports functional updater', () => {
    const { result } = renderHook(() => useLocalStorageBoolean(TEST_KEY, false));

    act(() => {
      result.current[1]((prev) => !prev);
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem(TEST_KEY)).toBe('true');

    act(() => {
      result.current[1]((prev) => !prev);
    });

    expect(result.current[0]).toBe(false);
    expect(localStorage.getItem(TEST_KEY)).toBe('false');
  });
});
