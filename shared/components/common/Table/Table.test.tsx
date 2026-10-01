import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table } from './Table';
import type { Column } from './table.type';

interface SampleItem {
  id: string;
  name: string;
  amount: number;
}

describe('Table component', () => {
  const columns: Column<SampleItem>[] = [
    { key: 'name', header: 'User Name', accessor: 'name' },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: SampleItem) => `$${item.amount}`,
    },
  ];

  const data: SampleItem[] = [
    { id: '1', name: 'Alice', amount: 100 },
    { id: '2', name: 'Bob', amount: 200 },
  ];

  it('renders columns and data rows', () => {
    render(
      <Table<SampleItem>
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
      />
    );

    expect(screen.getAllByText('User Name')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Amount')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Alice')[0]).toBeInTheDocument();
    expect(screen.getAllByText('$100')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Bob')[0]).toBeInTheDocument();
    expect(screen.getAllByText('$200')[0]).toBeInTheDocument();
  });

  it('handles row click events', () => {
    const handleRowClick = vi.fn();
    render(
      <Table<SampleItem>
        columns={columns}
        data={data}
        keyExtractor={(item) => item.id}
        onRowClick={handleRowClick}
      />
    );

    const firstRowText = screen.getAllByText('Alice')[0];
    fireEvent.click(firstRowText);
    expect(handleRowClick).toHaveBeenCalledWith(data[0], 0);
  });

  it('displays empty message when data is empty', () => {
    render(
      <Table<SampleItem>
        columns={columns}
        data={[]}
        keyExtractor={(item) => item.id}
        emptyMessage="No transactions found"
      />
    );

    expect(screen.getAllByText('No transactions found')[0]).toBeInTheDocument();
  });

  it('displays loading indicator when isLoading is true', () => {
    render(
      <Table<SampleItem>
        columns={columns}
        data={[]}
        keyExtractor={(item) => item.id}
        isLoading={true}
      />
    );

    expect(screen.getAllByText('common.loading')[0]).toBeInTheDocument();
  });
});
