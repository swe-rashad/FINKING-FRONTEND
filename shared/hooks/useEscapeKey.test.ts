import { describe, it, expect, vi } from 'vitest';
import { renderHook, fireEvent } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
  it('calls callback when Escape is pressed and enabled is true', () => {
    const handleEscape = vi.fn();
    renderHook(() => useEscapeKey(handleEscape, true));

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleEscape).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when enabled is false', () => {
    const handleEscape = vi.fn();
    renderHook(() => useEscapeKey(handleEscape, false));

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleEscape).not.toHaveBeenCalled();
  });

  it('ignores other keys', () => {
    const handleEscape = vi.fn();
    renderHook(() => useEscapeKey(handleEscape, true));

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(handleEscape).not.toHaveBeenCalled();
  });
});
