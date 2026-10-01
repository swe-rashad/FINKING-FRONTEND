import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportModal } from './ExportModal';

describe('ExportModal component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ExportModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal dialog when isOpen is true', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /exportModal.title/i })).toBeInTheDocument();
  });

  it('validates email before submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ExportModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    const form = screen.getByRole('dialog').querySelector('form')!;
    const emailInput = form.querySelector('input')!;
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    fireEvent.submit(form);

    expect(await screen.findByText('exportModal.emailRequired')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits with valid email and selected format', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <ExportModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        defaultEmail="test@example.com"
      />
    );

    const jsonFormatBtn = screen.getByRole('button', { name: 'JSON' });
    fireEvent.click(jsonFormatBtn);

    const submitBtn = screen.getByRole('button', { name: /exportModal.submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('test@example.com', 'json');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
