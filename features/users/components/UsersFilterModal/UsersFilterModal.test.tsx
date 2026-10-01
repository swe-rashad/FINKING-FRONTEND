import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsersFilterModal } from './UsersFilterModal';
import type { UsersFilters } from '../../interfaces/user.interface';

describe('UsersFilterModal component', () => {
  const defaultFilters: UsersFilters = {
    name: 'John',
    email: 'john@example.com',
    role: 'Employee',
    status: 'Active',
  };

  const emptyFilters: UsersFilters = {
    name: '',
    email: '',
    role: 'all',
    status: 'all',
  };

  it('renders modal dialog when isOpen is true', () => {
    render(
      <UsersFilterModal
        isOpen={true}
        onClose={vi.fn()}
        filters={defaultFilters}
        onApply={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <UsersFilterModal
        isOpen={false}
        onClose={vi.fn()}
        filters={defaultFilters}
        onApply={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onApply with updated filter values on submit', () => {
    const handleApply = vi.fn();
    render(
      <UsersFilterModal
        isOpen={true}
        onClose={vi.fn()}
        filters={emptyFilters}
        onApply={handleApply}
        onReset={vi.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/users.filterModal.nameLabel/i);
    fireEvent.change(nameInput, { target: { value: 'Alice' } });

    const applyBtn = screen.getByRole('button', {
      name: /users.filterModal.apply/i,
    });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alice',
      })
    );
  });

  it('calls onReset when reset button is clicked', () => {
    const handleReset = vi.fn();
    render(
      <UsersFilterModal
        isOpen={true}
        onClose={vi.fn()}
        filters={defaultFilters}
        onApply={vi.fn()}
        onReset={handleReset}
      />
    );

    const resetBtn = screen.getByRole('button', {
      name: /users.filterModal.reset/i,
    });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
