import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { createAlovaMockAdapter } from '@alova/mock';
import { usersMock } from '@/features/users/mocks/users.mock';
import { transactionsMock } from '@/features/transactions/mocks/transactions.mock';
import { statisticsMock } from '@/features/statistics/mocks/statistics.mock';
import { authMock } from '@/features/auth/mocks/auth.mock';
import {
  authRequestInterceptor,
  authResponseInterceptor,
} from '@/shared/interceptors';
import { toast } from '@/shared/components/common/Toast';

export const MOCK_STORAGE_KEY = 'ENABLE_MOCKS';

export function isMockEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_MOCKS !== undefined) {
    return process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';
  }
  if (typeof window === 'undefined') {
    return true;
  }
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return true;
  } catch {
    return true;
  }
}

export function setMockEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(MOCK_STORAGE_KEY, String(enabled));
    } catch { }
  }
}

if (typeof window !== 'undefined') {
  (window as unknown as { __FINKING_MOCKS__: { isEnabled: typeof isMockEnabled; setEnabled: typeof setMockEnabled } }).__FINKING_MOCKS__ = {
    isEnabled: isMockEnabled,
    setEnabled: setMockEnabled,
  };
}

const fetchAdapter = adapterFetch();

const mockAdapter = createAlovaMockAdapter(
  [authMock, usersMock, transactionsMock, statisticsMock],
  {
    delay: 80,
    httpAdapter: fetchAdapter,
    enable: true,
  }
);

const dynamicAdapter: ReturnType<typeof adapterFetch> = (elements, method) => {
  if (isMockEnabled()) {
    return mockAdapter(elements, method);
  }
  return fetchAdapter(elements, method);
};

export const alovaInstance = createAlova({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  requestAdapter: dynamicAdapter,
  beforeRequest: authRequestInterceptor,
  responded: {
    onSuccess: authResponseInterceptor,
    onError: (error) => {
      toast.error('Something went wrong');
      throw error;
    },
  },
});
