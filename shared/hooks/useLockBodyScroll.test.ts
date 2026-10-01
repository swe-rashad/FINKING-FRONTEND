import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLockBodyScroll } from './useLockBodyScroll';

describe('useLockBodyScroll', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('sets body overflow to hidden when locked is true', () => {
    const { unmount } = renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('leaves body overflow untouched when locked is false', () => {
    document.body.style.overflow = 'auto';
    renderHook(() => useLockBodyScroll(false));
    expect(document.body.style.overflow).toBe('auto');
  });
});
