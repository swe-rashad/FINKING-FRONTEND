export interface StatisticItem {
  id: number;
  no: number;
  category: string;
  users: string;
  transactions: string;
  revenue: string;
  growth: string;
  status: 'Active' | 'Inactive';
}

export interface MonthlyRevenueItem {
  month: string;
  value: number;
  label: string;
}

export interface CategoryDistributionItem {
  name: string;
  percentage: number;
  amount: string;
}

export interface StatisticsOverviewResponse {
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
}
