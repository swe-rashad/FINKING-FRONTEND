import { defineMock } from '@alova/mock';
import type { StatisticsOverviewResponse } from '../interfaces/statistics.interface';

export const mockStatisticsData: StatisticsOverviewResponse = {
  kpi: {
    totalRevenue: '€124,580.00',
    revenueGrowth: '+14.2%',
    totalTransactions: '1,420',
    transactionGrowth: '+8.7%',
    activeUsers: '890',
    userGrowth: '+22.4%',
    avgTransaction: '€87.73',
    avgGrowth: '+5.1%',
  },
  monthlyRevenue: [
    { month: 'Jan', value: 45, label: '€2.3k' },
    { month: 'Feb', value: 85, label: '€4.2k' },
    { month: 'Mar', value: 120, label: '€6.0k' },
    { month: 'Apr', value: 95, label: '€4.8k' },
    { month: 'May', value: 160, label: '€8.0k' },
    { month: 'Jun', value: 140, label: '€7.0k' },
    { month: 'Jul', value: 200, label: '€10.0k' },
    { month: 'Aug', value: 180, label: '€9.0k' },
    { month: 'Sep', value: 230, label: '€11.5k' },
  ],
  categoryDistribution: [
    { name: 'Bank Transfers', percentage: 48, amount: '€59.8k' },
    { name: 'Merchant Payments', percentage: 32, amount: '€39.9k' },
    { name: 'Account Top-ups', percentage: 20, amount: '€24.9k' },
  ],
  items: [
    {
      id: 1,
      no: 1,
      category: 'Bank Transfers',
      users: '620',
      transactions: '780',
      revenue: '€59,800.00',
      growth: '+14.2%',
      status: 'Active',
    },
    {
      id: 2,
      no: 2,
      category: 'Merchant Payments',
      users: '410',
      transactions: '450',
      revenue: '€39,865.60',
      growth: '+8.7%',
      status: 'Active',
    },
    {
      id: 3,
      no: 3,
      category: 'Account Top-ups',
      users: '260',
      transactions: '190',
      revenue: '€24,914.40',
      growth: '+22.4%',
      status: 'Active',
    },
  ],
};

export const statisticsMock = defineMock({
  '[GET]/api/statistics': () => mockStatisticsData,
});
