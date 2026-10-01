import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavItem from './NavItem';

describe('NavItem component', () => {
  it('renders link with icon and text', () => {
    render(
      <NavItem
        href="/dashboard/statistics"
        icon={<span data-testid="nav-icon">Icon</span>}
        text="Statistics"
      />
    );

    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard/statistics');
  });

  it('marks active link with aria-current="page"', () => {
    render(
      <NavItem
        href="/dashboard/users"
        icon={<span>Icon</span>}
        text="Users"
        active={true}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('hides text label when collapsed but sets title', () => {
    render(
      <NavItem
        href="/dashboard/transactions"
        icon={<span>Icon</span>}
        text="Transactions"
        collapsed={true}
      />
    );

    expect(screen.queryByText('Transactions')).not.toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('title', 'Transactions');
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <NavItem
        href="/dashboard/users"
        icon={<span>Icon</span>}
        text="Users"
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole('link'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
