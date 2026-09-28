import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  LastTransactionItem,
  MonthlyRevenueItem,
  CategoryDistributionItem,
  StatisticsOverviewResponse,
  GetStatisticsDto,
  StatisticsKpiData,
  RevenuePeriodEnumType,
  RevenueStatisticsItem,
} from '../interfaces/statistics.interface';
import { RevenuePeriodEnum } from '../interfaces/statistics.interface';
import { statisticsApi } from '../api/statistics.api';
import { isMockEnabled } from '@/core/api/alova';
import { formatCurrency, formatCompactCurrency, CATEGORY_DISPLAY_NAMES } from '../utils/statistics.utils';

export interface StatisticsState {
  transactions: LastTransactionItem[];
  monthlyRevenue: MonthlyRevenueItem[];
  categoryDistribution: CategoryDistributionItem[];
  kpi: StatisticsKpiData;
  period: RevenuePeriodEnumType;
  isLoading: boolean;
  hoveredPoint: number | null;
}

const initialState: StatisticsState = {
  transactions: [],
  monthlyRevenue: [],
  categoryDistribution: [],
  kpi: { totalRevenue: '€0.00', totalTransactions: '0', activeUsers: '0', avgTransaction: '€0.00' },
  period: RevenuePeriodEnum.Monthly,
  isLoading: true,
  hoveredPoint: null,
};

function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return n.toLocaleString('en-US');
}

function formatDateLabel(date: string, period: RevenuePeriodEnumType): string {
  if (!date) return date;
  if (period === RevenuePeriodEnum.Yearly) return date;
  if (period === RevenuePeriodEnum.Weekly) {
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : date;
  }
  const parts = date.split('-');
  if (parts.length >= 2) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
    return !isNaN(d.getTime()) ? d.toLocaleString('en-US', { month: 'short' }) : date;
  }
  return date;
}

function buildMonthlyRevenue(data: RevenueStatisticsItem[], period: RevenuePeriodEnumType): MonthlyRevenueItem[] {
  const aggregated = new Map<string, number>();
  for (const item of data) {
    const key = item.date ?? '';
    aggregated.set(key, (aggregated.get(key) ?? 0) + (Number(item.value) || 0));
  }
  return Array.from(aggregated.entries()).map(([date, total]) => ({
    month: formatDateLabel(date, period),
    value: total,
    label: formatCompactNumber(total),
  }));
}

function ok<T>(result: PromiseSettledResult<T>): T | undefined {
  return result.status === 'fulfilled' ? result.value : undefined;
}

export const fetchStatistics = createAsyncThunk<StatisticsOverviewResponse, GetStatisticsDto | undefined>(
  'statistics/fetchStatistics',
  async (params, { rejectWithValue }) => {
    try {
      if (isMockEnabled()) return await statisticsApi.getStatistics(params).send();

      const [totalRevenueRes, totalTransactionsRes, activeUsersRes, avgTxnRes, categoryDistRes, revenueOverviewRes, lastTxnsRes] =
        await Promise.allSettled([
          statisticsApi.getTotalRevenue(params).send(),
          statisticsApi.getTotalTransactions(params).send(),
          statisticsApi.getActiveUsers(params).send(),
          statisticsApi.getAverageTransactionAmount(params).send(),
          statisticsApi.getCategoryDistribution(params).send(),
          statisticsApi.getRevenueOverview(params).send(),
          statisticsApi.getLastTransactions(params).send(),
        ]);

      const kpi: StatisticsKpiData = {
        totalRevenue: formatCurrency(Number(ok(totalRevenueRes)?.value) || 0),
        totalTransactions: (Number(ok(totalTransactionsRes)?.value) || 0).toLocaleString('en-US'),
        activeUsers: (Number(ok(activeUsersRes)?.value) || 0).toLocaleString('en-US'),
        avgTransaction: formatCurrency(Number(ok(avgTxnRes)?.value) || 0),
      };

      const catData = ok(categoryDistRes);
      const categoryDistribution: CategoryDistributionItem[] = catData?.data?.map((item) => {
        const count = Number(item.transactionsCount) || 0;
        return {
          name: CATEGORY_DISPLAY_NAMES[item.type] || item.type,
          type: item.type,
          percentage: Math.round((count / (catData.totalTransactions || 1)) * 100),
          amount: formatCompactCurrency(Number(item.value) || 0),
          count,
        };
      }) ?? [];

      const transactions: LastTransactionItem[] = ok(lastTxnsRes) ?? [];

      const revenueData = ok(revenueOverviewRes);
      const period: RevenuePeriodEnumType = revenueData?.period ?? RevenuePeriodEnum.Monthly;
      const monthlyRevenue: MonthlyRevenueItem[] =
        revenueData?.data?.length ? buildMonthlyRevenue(revenueData.data as RevenueStatisticsItem[], period) : [];

      return { kpi, categoryDistribution, monthlyRevenue, transactions, period };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch statistics');
    }
  }
);

export const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setHoveredPoint(state, action: PayloadAction<number | null>) {
      state.hoveredPoint = action.payload;
    },
    setStatisticsData(state, action: PayloadAction<StatisticsOverviewResponse>) {
      state.transactions = action.payload.transactions;
      state.monthlyRevenue = action.payload.monthlyRevenue;
      state.categoryDistribution = action.payload.categoryDistribution;
      state.kpi = action.payload.kpi;
      if (action.payload.period) state.period = action.payload.period;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.monthlyRevenue = action.payload.monthlyRevenue;
        state.categoryDistribution = action.payload.categoryDistribution;
        state.kpi = action.payload.kpi;
        if (action.payload.period) state.period = action.payload.period;
      })
      .addCase(fetchStatistics.rejected, (state) => { state.isLoading = false; });
  },
});

export const { setHoveredPoint, setStatisticsData } = statisticsSlice.actions;
export default statisticsSlice.reducer;
