import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  TransactionItem,
  TransactionDetailsItem,
  TransactionsFilters,
} from '../interfaces/transaction.interface';
import { transactionsApi } from '../api/transactions.api';

export interface TransactionsState {
  transactions: TransactionItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading: boolean;
  isExportModalOpen: boolean;
  isFilterModalOpen: boolean;
  selectedTransaction: TransactionDetailsItem | null;
  filters: TransactionsFilters;
}

const defaultFilters: TransactionsFilters = {
  status: 'all',
  type: 'all',
  sender: '',
  receiver: '',
  minAmount: '',
  maxAmount: '',
};

const initialState: TransactionsState = {
  transactions: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  isLoading: true,
  isExportModalOpen: false,
  isFilterModalOpen: false,
  selectedTransaction: null,
  filters: defaultFilters,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (page: number | undefined, { getState }) => {
    const state = getState() as { transactions: TransactionsState };
    const targetPage = page ?? state.transactions.currentPage;
    return await transactionsApi
      .getTransactions(targetPage, state.transactions.pageSize, state.transactions.filters)
      .send();
  }
);

export const applyFilters = createAsyncThunk(
  'transactions/applyFilters',
  async (filters: Partial<TransactionsFilters>, { dispatch }) => {
    dispatch(setFilters(filters));
    dispatch(closeFilterModal());
    dispatch(fetchTransactions(1));
  }
);

export const clearFilters = createAsyncThunk(
  'transactions/clearFilters',
  async (_, { dispatch }) => {
    dispatch(resetFilters());
    dispatch(closeFilterModal());
    dispatch(fetchTransactions(1));
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
    openFilterModal(state) {
      state.isFilterModalOpen = true;
    },
    closeFilterModal(state) {
      state.isFilterModalOpen = false;
    },
    setFilters(state, action: PayloadAction<Partial<TransactionsFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = defaultFilters;
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
  openFilterModal,
  closeFilterModal,
  setFilters,
  resetFilters,
  setSelectedTransaction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

