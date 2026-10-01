import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn().mockResolvedValue(true),
    replace: vi.fn().mockResolvedValue(true),
    prefetch: vi.fn().mockResolvedValue(true),
    back: vi.fn(),
    pathname: '/dashboard',
    asPath: '/dashboard',
    query: {},
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

vi.mock('next/image', () => ({
  default: (props: {
    src?: string | { src: string };
    alt?: string;
    priority?: boolean;
    fill?: boolean;
    [key: string]: unknown;
  }) => {
    const { src, alt, ...rest } = props;
    delete rest.priority;
    delete rest.fill;
    const resolvedSrc = typeof src === 'object' && src !== null ? src.src || 'test-file-stub' : src;
    return React.createElement('img', { src: resolvedSrc, alt, ...rest });
  },
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode;
    href: string | { pathname: string };
    [key: string]: unknown;
  }) => {
    const resolvedHref = typeof href === 'object' ? href.pathname : href;
    return React.createElement('a', { href: resolvedHref, ...props }, children);
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string | number>) => {
    if (values) {
      return Object.entries(values).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
        key
      );
    }
    return key;
  },
  useLocale: () => 'en',
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
