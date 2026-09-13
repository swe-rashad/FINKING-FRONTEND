import { alovaInstance } from '@/core/api/alova';
import type { TransactionItem } from '../interfaces/transaction.interface';

export interface PaginatedTransactionsResponse {
  data: TransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const transactionsApi = {
  getTransactions(page = 1, limit = 10) {
    return alovaInstance.Get<PaginatedTransactionsResponse>('/api/transactions', {
      params: { page, limit },
    });
  },
};
