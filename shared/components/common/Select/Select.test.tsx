import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

describe('Select component', () => {
  const options = [
    { label: 'Admin', value: 'admin' },
    { label: 'Employee', value: 'employee' },
    { label: 'Customer', value: 'customer' },
  ];

  it('renders trigger with selected option label', () => {
    render(<Select label="Role" value="employee" options={options} />);
    expect(screen.getByRole('button', { name: /Role/i })).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
  });

  it('renders placeholder when no option is selected', () => {
    render(<Select placeholder="Choose role" options={options} />);
    expect(screen.getByText('Choose role')).toBeInTheDocument();
  });

  it('opens options dropdown and selects an option', () => {
    const handleChange = vi.fn();
    render(
      <Select
        name="role"
        options={options}
        placeholder="Choose role"
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('button', { name: /Choose role/i });
    fireEvent.click(trigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const adminOption = screen.getByRole('option', { name: 'Admin' });
    fireEvent.click(adminOption);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { name: 'role', value: 'admin' },
      })
    );
  });

  it('displays error message when error prop is passed', () => {
    render(
      <Select
        options={options}
        error="This field is required"
        placeholder="Choose role"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('cannot be opened when disabled', () => {
    render(<Select options={options} disabled placeholder="Choose role" />);
    const trigger = screen.getByRole('button', { name: /Choose role/i });
    expect(trigger).toBeDisabled();

    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
