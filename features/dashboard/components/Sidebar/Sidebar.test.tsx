import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { renderWithProviders, createMockUser } from '@/test/test-utils';

vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/dashboard/statistics',
    asPath: '/dashboard/statistics',
  }),
}));

describe('Sidebar component', () => {
  const adminUser = createMockUser({
    id: 1,
    name: 'Admin',
    email: 'admin@finking.com',
    role: 'admin',
    status: 'active',
  });

  const employeeUser = createMockUser({
    id: 2,
    name: 'Employee',
    email: 'employee@finking.com',
    role: 'employee',
    status: 'active',
  });

  it('renders all nav items for admin user', () => {
    renderWithProviders(<Sidebar collapsed={false} onToggle={vi.fn()} />, {
      preloadedState: {
        auth: {
          currentUser: adminUser,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('layout.navs.statistics')).toBeInTheDocument();
    expect(screen.getByText('layout.navs.users')).toBeInTheDocument();
    expect(screen.getByText('layout.navs.transactions')).toBeInTheDocument();
  });

  it('filters out statistics nav item for employee user', () => {
    renderWithProviders(<Sidebar collapsed={false} onToggle={vi.fn()} />, {
      preloadedState: {
        auth: {
          currentUser: employeeUser,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.queryByText('layout.navs.statistics')).not.toBeInTheDocument();
    expect(screen.getByText('layout.navs.users')).toBeInTheDocument();
    expect(screen.getByText('layout.navs.transactions')).toBeInTheDocument();
  });

  it('calls onToggle when collapse toggle button is clicked', () => {
    const handleToggle = vi.fn();
    renderWithProviders(<Sidebar collapsed={false} onToggle={handleToggle} />, {
      preloadedState: {
        auth: {
          currentUser: adminUser,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    const toggleButton = screen.getByRole('button', {
      name: /layout.sidebar.collapse/i,
    });
    fireEvent.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
