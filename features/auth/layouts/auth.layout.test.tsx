import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthLayout } from './auth.layout';

describe('AuthLayout', () => {
  it('renders children content within the layout', () => {
    render(
      <AuthLayout>
        <div data-testid="auth-child">Login Form Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('auth-child')).toBeInTheDocument();
    expect(screen.getByText('Login Form Content')).toBeInTheDocument();
  });

  it('renders copyright and branding headline', () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );

    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year} FINKING Inc. All rights reserved.`))).toBeInTheDocument();
    expect(screen.getByText('Manage global treasury with complete clarity')).toBeInTheDocument();
  });

  it('renders logo image with alt text', () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );

    expect(screen.getByAltText('FINKING')).toBeInTheDocument();
  });
});
