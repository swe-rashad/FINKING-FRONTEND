import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserFormModal } from './UserFormModal';
import { createMockUser } from '@/test/test-utils';

describe('UserFormModal component', () => {
  const existingUser = createMockUser({
    id: 1,
    name: 'Sarah',
    lastname: 'Connor',
    email: 'sarah@example.com',
    role: 'employee',
    status: 'active',
  });

  it('renders create user title and empty fields when user prop is null', () => {
    render(
      <UserFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByRole('heading', { name: /users.modal.createTitle/i })).toBeInTheDocument();
  });

  it('pre-populates fields and shows edit title when existing user is passed', () => {
    render(
      <UserFormModal
        isOpen={true}
        onClose={vi.fn()}
        user={existingUser}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByRole('heading', { name: /users.modal.editTitle/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sarah')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Connor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sarah@example.com')).toBeInTheDocument();
  });

  it('submits updated user data properly', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <UserFormModal
        isOpen={true}
        onClose={vi.fn()}
        user={existingUser}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByRole('button', {
      name: /users.modal.submitEdit/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Sarah',
        lastname: 'Connor',
        email: 'sarah@example.com',
        role: 'employee',
        status: 'active',
      });
    });
  });
});
