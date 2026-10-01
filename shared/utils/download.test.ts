import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadFile } from './download';

describe('downloadFile utility', () => {
  beforeEach(() => {
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-uuid');
    window.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates blob, triggers link click with correct attributes and cleans up', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        element.click = clickSpy;
      }
      return element;
    });

    downloadFile('id,name\n1,Alice', 'users.csv', 'text/csv');

    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/mock-uuid');
  });
});
