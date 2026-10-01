import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState component', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="No data available"
        description="Try changing the date range filter"
      />
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(
      screen.getByText('Try changing the date range filter')
    ).toBeInTheDocument();
  });

  it('renders custom icon when supplied', () => {
    render(
      <EmptyState
        title="No data"
        icon={<span data-testid="custom-empty-icon">Icon</span>}
      />
    );

    expect(screen.getByTestId('custom-empty-icon')).toBeInTheDocument();
  });
});
