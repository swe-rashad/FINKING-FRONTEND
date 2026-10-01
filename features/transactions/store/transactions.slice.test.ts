import { describe, it, expect } from 'vitest';
import transactionsReducer, {
  setPage,
  openExportModal,
  closeExportModal,
  openFilterModal,
  closeFilterModal,
  setFilters,
  resetFilters,
  setSelectedTransaction,
} from './transactions.slice';
import type { TransactionsState } from './transactions.slice';
import type { TransactionDetailsItem } from '../interfaces/transaction.interface';

describe('transactions.slice', () => {
  const initialState: TransactionsState = {
    transactions: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    isLoading: false,
    isExportModalOpen: false,
    isFilterModalOpen: false,
    selectedTransaction: null,
    filters: {
      status: 'all',
      type: 'all',
      sender: '',
      receiver: '',
      minAmount: '',
      maxAmount: '',
    },
  };

  it('handles setPage', () => {
    const state = transactionsReducer(initialState, setPage(2));
    expect(state.currentPage).toBe(2);
  });

  it('handles openExportModal and closeExportModal', () => {
    let state = transactionsReducer(initialState, openExportModal());
    expect(state.isExportModalOpen).toBe(true);

    state = transactionsReducer(state, closeExportModal());
    expect(state.isExportModalOpen).toBe(false);
  });

  it('handles openFilterModal and closeFilterModal', () => {
    let state = transactionsReducer(initialState, openFilterModal());
    expect(state.isFilterModalOpen).toBe(true);

    state = transactionsReducer(state, closeFilterModal());
    expect(state.isFilterModalOpen).toBe(false);
  });

  it('handles setFilters and resetFilters', () => {
    let state = transactionsReducer(
      initialState,
      setFilters({ sender: 'Acme Corp', minAmount: '50' })
    );
    expect(state.filters.sender).toBe('Acme Corp');
    expect(state.filters.minAmount).toBe('50');

    state = transactionsReducer(state, resetFilters());
    expect(state.filters.sender).toBe('');
    expect(state.filters.minAmount).toBe('');
  });

  it('handles setSelectedTransaction', () => {
    const mockTx: TransactionDetailsItem = {
      id: 'tx-1',
      no: 1,
      sender: 'Alice',
      receiver: 'Bob',
      amount: '$150.00',
      date: '01 Jan 2025',
      type: 'Transfer',
      status: 'Completed',
    };
    const state = transactionsReducer(
      initialState,
      setSelectedTransaction(mockTx)
    );
    expect(state.selectedTransaction).toEqual(mockTx);
  });
});
