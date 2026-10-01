import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast, toast } from './ToastContext';

function TestConsumer() {
  const { showToast } = useToast();
  return (
    <div>
      <button
        onClick={() =>
          showToast({ message: 'Saved successfully!', type: 'success' })
        }
      >
        Trigger Toast
      </button>
    </div>
  );
}

describe('Toast notification system', () => {
  it('renders toast message when triggered via hook', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Toast'));
    expect(screen.getByText('Saved successfully!')).toBeInTheDocument();
  });

  it('renders toast message when triggered via singleton toast helper', () => {
    render(
      <ToastProvider>
        <div>App Body</div>
      </ToastProvider>
    );

    act(() => {
      toast.error('Something went wrong!', 'Critical Error');
    });

    expect(screen.getByText('Critical Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('dismisses toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Toast'));
    expect(screen.getByText('Saved successfully!')).toBeInTheDocument();

    const dismissButton = screen.getByRole('button', { name: /Dismiss toast/i });
    fireEvent.click(dismissButton);

    expect(screen.queryByText('Saved successfully!')).not.toBeInTheDocument();
  });
});
