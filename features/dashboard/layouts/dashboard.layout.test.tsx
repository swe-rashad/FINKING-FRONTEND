import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import DashboardLayout from './dashboard.layout';
import { renderWithProviders, createMockUser } from '@/test/test-utils';
import { tokenService } from '@/core/auth/token.service';

const mockPush = vi.fn();
const mockReplace = vi.fn();
let currentPathname = '/dashboard/statistics';

vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: currentPathname,
    asPath: currentPathname,
    push: mockPush,
    replace: mockReplace,
    isReady: true,
    query: {},
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

describe('DashboardLayout', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(tokenService, 'isAuthenticated').mockReturnValue(true);
    currentPathname = '/dashboard/statistics';
  });

  it('renders children content when user has access to route', () => {
    currentPathname = '/dashboard/statistics';

    renderWithProviders(
      <DashboardLayout>
        <div data-testid="dashboard-content">Statistics View</div>
      </DashboardLayout>,
      {
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
      }
    );

    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
    expect(screen.getByText('Statistics View')).toBeInTheDocument();
  });

  it('renders Access Denied view when employee attempts to visit admin route', () => {
    currentPathname = '/dashboard/statistics';

    renderWithProviders(
      <DashboardLayout>
        <div data-testid="dashboard-content">Protected Content</div>
      </DashboardLayout>,
      {
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
      }
    );

    expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Return to Available Dashboard/i })
    ).toBeInTheDocument();
  });

  it('toggles mobile sidebar menu button', () => {
    currentPathname = '/dashboard/statistics';

    renderWithProviders(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
      {
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
      }
    );

    const mobileMenuButton = screen.getByRole('button', {
      name: /layout.sidebar.open/i,
    });
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(mobileMenuButton);
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
