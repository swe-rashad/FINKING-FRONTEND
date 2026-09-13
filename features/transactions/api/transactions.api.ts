import { alovaInstance } from '@/core/api/alova';
import type { TransactionItem } from '../interfaces/transaction.interface';

export interface PaginatedTransactionsResponse {
  data: TransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionExportResponse {
  data: string;
  filename: string;
  total: number;
}

export const transactionsApi = {
  getTransactions(page = 1, limit = 10) {
    return alovaInstance.Get<PaginatedTransactionsResponse>('/api/transactions', {
      params: { page, limit },
    });
  },

  exportTransactions(format: 'csv' | 'json' = 'csv') {
    return alovaInstance.Get<TransactionExportResponse>('/api/transactions/export', {
      params: { format },
    });
  },
};
