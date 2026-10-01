import React, { PropsWithChildren, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authReducer from '@/features/auth/store/auth.slice';
import usersReducer from '@/features/users/store/users.slice';
import transactionsReducer from '@/features/transactions/store/transactions.slice';
import statisticsReducer from '@/features/statistics/store/statistics.slice';
import type { BackendUser } from '@/features/users/interfaces/user.interface';
import type { RootState } from '@/core/store';

export function createMockUser(overrides: Partial<BackendUser> = {}): BackendUser {
  return {
    id: 1,
    name: 'Test',
    lastname: 'User',
    email: 'test@finking.com',
    role: 'admin',
    status: 'active',
    verificated: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    permissions: null,
    ...overrides,
  };
}

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      transactions: transactionsReducer,
      statistics: statisticsReducer,
    },
    preloadedState: preloadedState as unknown as RootState,
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren): ReactElement {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from '@testing-library/react';
