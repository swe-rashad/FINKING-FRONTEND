import { alovaInstance } from '@/core/api/alova';
import type {
  GetStatisticsDto,
  RevenueStatisticsDataType,
  CategoryDistributionStatisticsDataType,
  TotalRevenueResponse,
  TotalTransactionsResponse,
  AverageTransactionAmountResponse,
  ActiveUsersResponse,
  LastTransactionItem,
  StatisticsOverviewResponse,
} from '../interfaces/statistics.interface';

function serializeParams(params?: GetStatisticsDto) {
  if (!params) return undefined;
  const result: Record<string, string> = {};
  if (params.startDate) {
    result.startDate =
      params.startDate instanceof Date
        ? params.startDate.toISOString()
        : String(params.startDate);
  }
  if (params.endDate) {
    result.endDate =
      params.endDate instanceof Date
        ? params.endDate.toISOString()
        : String(params.endDate);
  }
  return result;
}

export const statisticsApi = {
  getRevenueOverview(params?: GetStatisticsDto) {
    return alovaInstance.Get<RevenueStatisticsDataType>('/statistics/revenue-overview', {
      params: serializeParams(params),
    });
  },

  getCategoryDistribution(params?: GetStatisticsDto) {
    return alovaInstance.Get<CategoryDistributionStatisticsDataType>('/statistics/category-distribution', {
      params: serializeParams(params),
    });
  },

  getTotalRevenue(params?: GetStatisticsDto) {
    return alovaInstance.Get<TotalRevenueResponse>('/statistics/total-revenue', {
      params: serializeParams(params),
    });
  },

  getTotalTransactions(params?: GetStatisticsDto) {
    return alovaInstance.Get<TotalTransactionsResponse>('/statistics/total-transactions', {
      params: serializeParams(params),
    });
  },

  getAverageTransactionAmount(params?: GetStatisticsDto) {
    return alovaInstance.Get<AverageTransactionAmountResponse>('/statistics/average-transaction-amount', {
      params: serializeParams(params),
    });
  },

  getActiveUsers(params?: GetStatisticsDto) {
    return alovaInstance.Get<ActiveUsersResponse>('/statistics/active-users', {
      params: serializeParams(params),
    });
  },

  getLastTransactions(params?: GetStatisticsDto) {
    return alovaInstance.Get<LastTransactionItem[]>('/statistics/get-last-transactions', {
      params: serializeParams(params),
    });
  },

  getStatistics(params?: GetStatisticsDto) {
    return alovaInstance.Get<StatisticsOverviewResponse>('/api/statistics', {
      params: serializeParams(params),
    });
  },

  exportStatistics(payload?: { startDate?: string; endDate?: string; email?: string }) {
    return alovaInstance.Post<{ data: string; filename: string }>('/statistics/export', payload || {});
  },
};
