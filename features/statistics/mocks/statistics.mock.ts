import { defineMock } from '@alova/mock';
import { mockTransactionsData } from '@/features/transactions/mocks/transactions.mock';
import type {
  StatisticsOverviewResponse,
  CategoryDistributionItem,
  MonthlyRevenueItem,
  StatisticItem,
} from '../interfaces/statistics.interface';

const parseAmount = (amountStr: string): number => {
  const clean = amountStr.replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
};

export const computeStatisticsFromTransactions = (): StatisticsOverviewResponse => {
  const transactions = mockTransactionsData;
  const totalTransactionsCount = transactions.length;

  // Calculate total revenue and avg from completed/all transactions
  const totalRevenueNum = transactions.reduce((acc, t) => acc + parseAmount(t.amount), 0);
  const avgTransactionNum = totalTransactionsCount > 0 ? totalRevenueNum / totalTransactionsCount : 0;

  // Calculate unique participants
  const uniqueUsers = new Set(transactions.flatMap((t) => [t.sender, t.receiver]));

  // Monthly revenue aggregation
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const monthlyRevenueMap: Record<string, number> = {};
  monthOrder.forEach((m) => {
    monthlyRevenueMap[m] = 0;
  });

  transactions.forEach((t) => {
    monthOrder.forEach((m) => {
      if (t.date.includes(m)) {
        monthlyRevenueMap[m] += parseAmount(t.amount);
      }
    });
  });

  const monthlyRevenue: MonthlyRevenueItem[] = monthOrder.map((month) => {
    const revenue = monthlyRevenueMap[month];
    const value = Math.max(15, Math.round(revenue / 50)); // Chart height scale (0 - 240)
    return {
      month,
      value,
      label: `€${revenue >= 1000 ? (revenue / 1000).toFixed(1) + 'k' : revenue.toFixed(0)}`,
    };
  });

  // Group by transaction types: Transfer, Payment, Top-up
  const typesMap: Record<
    string,
    {
      count: number;
      revenue: number;
      users: Set<string>;
      completedCount: number;
    }
  > = {
    Transfer: { count: 0, revenue: 0, users: new Set(), completedCount: 0 },
    Payment: { count: 0, revenue: 0, users: new Set(), completedCount: 0 },
    'Top-up': { count: 0, revenue: 0, users: new Set(), completedCount: 0 },
  };

  transactions.forEach((t) => {
    if (!typesMap[t.type]) {
      typesMap[t.type] = { count: 0, revenue: 0, users: new Set(), completedCount: 0 };
    }
    typesMap[t.type].count += 1;
    typesMap[t.type].revenue += parseAmount(t.amount);
    typesMap[t.type].users.add(t.sender);
    typesMap[t.type].users.add(t.receiver);
    if (t.status === 'Completed') {
      typesMap[t.type].completedCount += 1;
    }
  });

  const categoryDistribution: CategoryDistributionItem[] = Object.entries(typesMap).map(
    ([type, data]) => {
      const percentage = totalRevenueNum > 0 ? Math.round((data.revenue / totalRevenueNum) * 100) : 0;
      return {
        name: type === 'Transfer' ? 'Bank Transfers' : type === 'Payment' ? 'Merchant Payments' : 'Account Top-ups',
        percentage,
        amount: `€${data.revenue >= 1000 ? (data.revenue / 1000).toFixed(1) + 'k' : data.revenue.toFixed(0)}`,
      };
    }
  );

  const growthRates: Record<string, string> = {
    Transfer: '+14.2%',
    Payment: '+8.7%',
    'Top-up': '+22.4%',
  };

  const items: StatisticItem[] = Object.entries(typesMap).map(([type, data], index) => ({
    id: index + 1,
    no: index + 1,
    category: type === 'Transfer' ? 'Bank Transfers' : type === 'Payment' ? 'Merchant Payments' : 'Account Top-ups',
    users: data.users.size.toLocaleString('en-US'),
    transactions: data.count.toLocaleString('en-US'),
    revenue: `€${data.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    growth: growthRates[type] || '+5.0%',
    status: data.completedCount > 0 ? 'Active' : 'Inactive',
  }));

  return {
    kpi: {
      totalRevenue: `€${totalRevenueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      revenueGrowth: '+14.2%',
      totalTransactions: totalTransactionsCount.toLocaleString('en-US'),
      transactionGrowth: '+8.7%',
      activeUsers: uniqueUsers.size.toLocaleString('en-US'),
      userGrowth: '+22.4%',
      avgTransaction: `€${avgTransactionNum.toFixed(2)}`,
      avgGrowth: '+5.1%',
    },
    monthlyRevenue,
    categoryDistribution,
    items,
  };
};

export const statisticsMock = defineMock({
  '[GET]/api/statistics': () => computeStatisticsFromTransactions(),
});
