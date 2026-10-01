import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import UserProfileDropdown from './UserProfileDropdown';
import { renderWithProviders, createMockUser } from '@/test/test-utils';

const mockReplace = vi.fn();
vi.mock('next/router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
    pathname: '/dashboard',
    asPath: '/dashboard',
    query: {},
    events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
  }),
}));

describe('UserProfileDropdown component', () => {
  const currentUser = createMockUser({
    id: 1,
    name: 'Jane',
    lastname: 'Doe',
    email: 'jane.doe@example.com',
    role: 'admin',
    status: 'active',
  });

  it('renders user details from Redux auth state', () => {
    renderWithProviders(<UserProfileDropdown />, {
      preloadedState: {
        auth: {
          currentUser,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
  });

  it('opens menu on button click and displays logout option', () => {
    renderWithProviders(<UserProfileDropdown />, {
      preloadedState: {
        auth: {
          currentUser,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    const triggerButton = screen.getByRole('button', {
      name: /layout.userProfile.menuLabel/i,
    });
    fireEvent.click(triggerButton);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const logoutBtn = screen.getByRole('menuitem', {
      name: /layout.userProfile.logout/i,
    });
    expect(logoutBtn).toBeInTheDocument();
  });

  it('handles logout and redirects to /auth/login', () => {
    renderWithProviders(<UserProfileDropdown />, {
      preloadedState: {
        auth: {
          currentUser,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /layout.userProfile.menuLabel/i })
    );

    const logoutBtn = screen.getByRole('menuitem', {
      name: /layout.userProfile.logout/i,
    });
    fireEvent.click(logoutBtn);

    expect(mockReplace).toHaveBeenCalledWith('/auth/login');
  });
});
