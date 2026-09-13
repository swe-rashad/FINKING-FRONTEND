import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  StatisticItem,
  MonthlyRevenueItem,
  CategoryDistributionItem,
  StatisticsOverviewResponse,
} from '../interfaces/statistics.interface';
import { statisticsApi } from '../api/statistics.api';

export interface StatisticsState {
  items: StatisticItem[];
  monthlyRevenue: MonthlyRevenueItem[];
  categoryDistribution: CategoryDistributionItem[];
  kpi: {
    totalRevenue: string;
    revenueGrowth: string;
    totalTransactions: string;
    transactionGrowth: string;
    activeUsers: string;
    userGrowth: string;
    avgTransaction: string;
    avgGrowth: string;
  };
  isLoading: boolean;
  hoveredPoint: number | null;
}

const initialState: StatisticsState = {
  items: [],
  monthlyRevenue: [],
  categoryDistribution: [],
  kpi: {
    totalRevenue: '€0.00',
    revenueGrowth: '+0.0%',
    totalTransactions: '0',
    transactionGrowth: '+0.0%',
    activeUsers: '0',
    userGrowth: '+0.0%',
    avgTransaction: '€0.00',
    avgGrowth: '+0.0%',
  },
  isLoading: true,
  hoveredPoint: null,
};

export const fetchStatistics = createAsyncThunk(
  'statistics/fetchStatistics',
  async () => {
    return await statisticsApi.getStatistics().send();
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
      state.items = action.payload.items;
      state.monthlyRevenue = action.payload.monthlyRevenue;
      state.categoryDistribution = action.payload.categoryDistribution;
      state.kpi = action.payload.kpi;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.monthlyRevenue = action.payload.monthlyRevenue;
        state.categoryDistribution = action.payload.categoryDistribution;
        state.kpi = action.payload.kpi;
      })
      .addCase(fetchStatistics.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setHoveredPoint, setStatisticsData } = statisticsSlice.actions;
export default statisticsSlice.reducer;
