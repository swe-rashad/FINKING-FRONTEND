import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TransactionItem, TransactionDetailsItem } from '../interfaces/transaction.interface';
import { transactionsApi } from '../api/transactions.api';

export interface TransactionsState {
  transactions: TransactionItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading: boolean;
  isExportModalOpen: boolean;
  selectedTransaction: TransactionDetailsItem | null;
}

const initialState: TransactionsState = {
  transactions: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  isLoading: true,
  isExportModalOpen: false,
  selectedTransaction: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (page: number | undefined, { getState }) => {
    const state = getState() as { transactions: TransactionsState };
    const targetPage = page ?? state.transactions.currentPage;
    return await transactionsApi.getTransactions(targetPage, state.transactions.pageSize).send();
  }
);

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    openExportModal(state) {
      state.isExportModalOpen = true;
    },
    closeExportModal(state) {
      state.isExportModalOpen = false;
    },
    setSelectedTransaction(state, action: PayloadAction<TransactionDetailsItem | null>) {
      state.selectedTransaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.data;
        state.totalCount = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setPage,
  openExportModal,
  closeExportModal,
  setSelectedTransaction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
