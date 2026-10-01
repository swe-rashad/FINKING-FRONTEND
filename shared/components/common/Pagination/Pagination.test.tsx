import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination component', () => {
  it('returns null when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders page numbers and indicates current page', () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />
    );

    const activePageBtn = screen.getByRole('button', { name: '2' });
    expect(activePageBtn).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when clicking a page number', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
    );

    const page3Btn = screen.getByRole('button', { name: '3' });
    fireEvent.click(page3Btn);

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page and advances on next button', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
    );

    const prevBtn = screen.getByRole('button', { name: 'Previous' });
    const nextBtn = screen.getByRole('button', { name: 'Next' });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('disables next button on last page', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={handlePageChange} />
    );

    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toBeDisabled();
  });
});
