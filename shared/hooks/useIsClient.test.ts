import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsClient } from './useIsClient';

describe('useIsClient', () => {
  it('returns true when running in client browser environment', () => {
    const { result } = renderHook(() => useIsClient());
    expect(result.current).toBe(true);
  });
});
