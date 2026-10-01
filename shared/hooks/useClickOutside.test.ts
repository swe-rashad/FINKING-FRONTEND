import { describe, it, expect, vi } from 'vitest';
import { renderHook, fireEvent } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('calls handler when clicking outside of the referenced element', () => {
    const handler = vi.fn();
    const targetElement = document.createElement('div');
    const outsideElement = document.createElement('button');
    document.body.appendChild(targetElement);
    document.body.appendChild(outsideElement);

    const ref = { current: targetElement };
    renderHook(() => useClickOutside(ref, handler));

    fireEvent.mouseDown(outsideElement);
    expect(handler).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(targetElement);
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(targetElement);
    document.body.removeChild(outsideElement);
  });
});
