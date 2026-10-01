import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionsFilterModal } from './TransactionsFilterModal';
import type { TransactionsFilters } from '../../interfaces/transaction.interface';

describe('TransactionsFilterModal component', () => {
  const defaultFilters: TransactionsFilters = {
    sender: 'Alice Corp',
    receiver: 'Bob Ltd',
    status: 'Completed',
    type: 'Transfer',
    minAmount: '100',
    maxAmount: '500',
  };

  const emptyFilters: TransactionsFilters = {
    sender: '',
    receiver: '',
    status: 'all',
    type: 'all',
  };

  it('renders modal dialog when isOpen is true', () => {
    render(
      <TransactionsFilterModal
        isOpen={true}
        onClose={vi.fn()}
        filters={defaultFilters}
        onApply={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bob Ltd')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('500')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TransactionsFilterModal
        isOpen={false}
        onClose={vi.fn()}
        filters={defaultFilters}
        onApply={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onApply with updated inputs on submit', () => {
    const handleApply = vi.fn();
    render(
      <TransactionsFilterModal
        isOpen={true}
        onClose={vi.fn()}
        filters={emptyFilters}
        onApply={handleApply}
        onReset={vi.fn()}
      />
    );

    const senderInput = screen.getByLabelText(
      /transactions.filterModal.senderLabel/i
    );
    fireEvent.change(senderInput, { target: { value: 'New Sender' } });

    const applyBtn = screen.getByRole('button', {
      name: /transactions.filterModal.apply/i,
    });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: 'New Sender',
      })
    );
  });

  it('calls onReset when reset button is clicked', () => {
    const handleReset = vi.fn();
    render(
      <TransactionsFilterModal
        isOpen={true}
        onClose={vi.fn()}
        filters={defaultFilters}
        onApply={vi.fn()}
        onReset={handleReset}
      />
    );

    const resetBtn = screen.getByRole('button', {
      name: /transactions.filterModal.reset/i,
    });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
