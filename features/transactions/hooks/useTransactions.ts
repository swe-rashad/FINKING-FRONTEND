import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import {
  fetchTransactions,
  openExportModal,
  closeExportModal,
  openFilterModal,
  closeFilterModal,
  applyFilters,
  clearFilters,
  setSelectedTransaction,
} from '../store/transactions.slice';
import type {
  TransactionDetailsItem,
  TransactionsFilters,
} from '../interfaces/transaction.interface';

export function useTransactions() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.transactions);

  useEffect(() => {
    dispatch(fetchTransactions(1));
  }, [dispatch]);

  return {
    ...state,
    setPage: (page: number) => dispatch(fetchTransactions(page)),
    openExportModal: () => dispatch(openExportModal()),
    closeExportModal: () => dispatch(closeExportModal()),
    openFilterModal: () => dispatch(openFilterModal()),
    closeFilterModal: () => dispatch(closeFilterModal()),
    applyFilters: (filters: Partial<TransactionsFilters>) => dispatch(applyFilters(filters)),
    clearFilters: () => dispatch(clearFilters()),
    setSelectedTransaction: (transaction: TransactionDetailsItem | null) =>
      dispatch(setSelectedTransaction(transaction)),
    refetch: () => dispatch(fetchTransactions(state.currentPage)),
  };
}
