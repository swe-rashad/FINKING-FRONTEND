import { alovaInstance } from '@/core/api/alova';
import type { StatisticsOverviewResponse } from '../interfaces/statistics.interface';

export const statisticsApi = {
  getStatistics() {
    return alovaInstance.Get<StatisticsOverviewResponse>('/api/statistics');
  },
};
