import { describe, it, expect } from 'vitest';
import statisticsReducer, {
  setHoveredPoint,
  setStatisticsData,
} from './statistics.slice';
import type { StatisticsState } from './statistics.slice';
import { RevenuePeriodEnum } from '../interfaces/statistics.interface';

describe('statistics.slice', () => {
  const initialState: StatisticsState = {
    transactions: [],
    monthlyRevenue: [],
    categoryDistribution: [],
    kpi: {
      totalRevenue: '€0.00',
      totalTransactions: '0',
      activeUsers: '0',
      avgTransaction: '€0.00',
    },
    period: RevenuePeriodEnum.Monthly,
    isLoading: true,
    hoveredPoint: null,
  };

  it('handles setHoveredPoint', () => {
    const state = statisticsReducer(initialState, setHoveredPoint(4));
    expect(state.hoveredPoint).toBe(4);

    const clearedState = statisticsReducer(state, setHoveredPoint(null));
    expect(clearedState.hoveredPoint).toBeNull();
  });

  it('handles setStatisticsData', () => {
    const mockOverview = {
      kpi: {
        totalRevenue: '€50,000.00',
        totalTransactions: '1,200',
        activeUsers: '450',
        avgTransaction: '€41.67',
      },
      categoryDistribution: [],
      monthlyRevenue: [{ month: 'Jan', value: 10000, label: '10k' }],
      transactions: [],
      period: RevenuePeriodEnum.Monthly,
    };

    const state = statisticsReducer(
      initialState,
      setStatisticsData(mockOverview)
    );
    expect(state.isLoading).toBe(false);
    expect(state.kpi.totalRevenue).toBe('€50,000.00');
    expect(state.monthlyRevenue).toHaveLength(1);
  });
});
