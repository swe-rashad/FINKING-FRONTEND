import { useState } from 'react';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { Table, Column } from '@/shared/components/common/Table';
import { Pagination } from '@/shared/components/common/Pagination';
import { Button } from '@/shared/components/common/Button';
import { DateRangePicker } from '@/shared/components/common/DateRangePicker';
import {
  ActiveIcon,
  DeclinedIcon,
  ArrowRightIcon,
} from '@/shared/components/icons';
import type { StatisticItem } from '../interfaces/statistics.interface';
import { useStatistics } from '../hooks';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['dashboard']);
  return { props: { messages } };
}

export default function StatisticsPage() {
  const t = useTranslations('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-09-30');

  const {
    items,
    monthlyRevenue,
    categoryDistribution,
    kpi,
    isLoading,
    hoveredPoint,
    setHoveredPoint,
  } = useStatistics();

  const columns: Column<StatisticItem>[] = [
    {
      key: 'no',
      header: t('statistics.columns.no'),
      width: '3.25rem',
      render: (item) => (
        <span className={item.status === 'Inactive' ? 'text-gray-400 font-normal' : 'text-gray-900 font-medium'}>
          {item.no}
        </span>
      ),
    },
    {
      key: 'category',
      header: t('statistics.columns.category'),
      render: (item) => (
        <span className={item.status === 'Inactive' ? 'text-gray-400 font-normal' : 'text-gray-900 font-semibold'}>
          {item.category}
        </span>
      ),
    },
    {
      key: 'users',
      header: t('statistics.columns.users'),
      render: (item) => (
        <span className="text-gray-600">
          {item.users}
        </span>
      ),
    },
    {
      key: 'transactions',
      header: t('statistics.columns.transactions'),
      render: (item) => (
        <span className="text-gray-600">
          {item.transactions}
        </span>
      ),
    },
    {
      key: 'revenue',
      header: t('statistics.columns.revenue'),
      render: (item) => (
        <span className="font-semibold text-gray-900">
          {item.revenue}
        </span>
      ),
    },
    {
      key: 'growth',
      header: t('statistics.columns.growth'),
      render: (item) => {
        const isPositive = item.growth.startsWith('+');
        return (
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {item.growth}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: t('statistics.columns.status'),
      render: (item) => {
        const isActive = item.status === 'Active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              isActive ? 'bg-[#E8F8EE] text-[#12B76A]' : 'bg-[#FEF3F2] text-[#F04438]'
            }`}
          >
            {isActive ? (
              <ActiveIcon size={14} className="text-[#12B76A]" />
            ) : (
              <DeclinedIcon size={14} className="text-[#F04438]" />
            )}
            <span>
              {isActive
                ? t('statistics.status.active')
                : t('statistics.status.inactive')}
            </span>
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '3rem',
      render: () => (
        <div className="flex items-center justify-end w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowRightIcon size={14} />}
            iconPosition="right"
            className="w-full sm:hidden text-gray-700"
          >
            {t('statistics.actions.details')}
          </Button>
          <button
            type="button"
            title={t('statistics.actions.details')}
            aria-label={t('statistics.actions.viewDetails')}
            className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto cursor-pointer shrink-0"
          >
            <ArrowRightIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  const chartWidth = 560;
  const chartHeight = 160;
  const chartPaddingTop = 20;
  const chartPaddingBottom = 30;
  const chartPaddingLeft = 40;
  const chartPaddingRight = 20;

  const innerWidth = chartWidth - chartPaddingLeft - chartPaddingRight;
  const innerHeight = chartHeight - chartPaddingTop - chartPaddingBottom;

  const maxValue = 240;
  const points = monthlyRevenue.map((item, index) => {
    const x = chartPaddingLeft + (index / Math.max(monthlyRevenue.length - 1, 1)) * innerWidth;
    const y = chartPaddingTop + innerHeight - (item.value / maxValue) * innerHeight;
    return { x, y, month: item.month, value: item.value, label: item.label };
  });

  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartPaddingTop + innerHeight} L ${points[0].x} ${chartPaddingTop + innerHeight} Z`
    : '';

  return (
    <>
      <Head>
        <title>{t('statistics.title')}</title>
      </Head>
      <div className="w-full px-4 sm:px-6 pb-12 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {t('statistics.title')}
          </h1>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={({ start, end }) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              {t('statistics.kpi.totalRevenue')}
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-2xl font-bold text-gray-900">{kpi.totalRevenue}</span>
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                {kpi.revenueGrowth}
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {t('statistics.charts.thisMonth')}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              {t('statistics.kpi.totalTransactions')}
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-2xl font-bold text-gray-900">{kpi.totalTransactions}</span>
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                {kpi.transactionGrowth}
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {t('statistics.charts.thisMonth')}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              {t('statistics.kpi.activeUsers')}
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-2xl font-bold text-gray-900">{kpi.activeUsers}</span>
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                {kpi.userGrowth}
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {t('statistics.charts.thisMonth')}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              {t('statistics.kpi.avgTransaction')}
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-2xl font-bold text-gray-900">{kpi.avgTransaction}</span>
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                {kpi.avgGrowth}
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {t('statistics.charts.thisMonth')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {t('statistics.charts.revenueTrend')}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t('statistics.charts.revenueSubtitle')}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-900">
                {new Date().getFullYear()}
              </span>
            </div>

            <div className="w-full relative">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 sm:h-52 overflow-visible"
              >
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-main)" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="var(--color-brand-main)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[60, 120, 180, 240].map((val) => {
                  const y = chartPaddingTop + innerHeight - (val / maxValue) * innerHeight;
                  return (
                    <g key={val}>
                      <line
                        x1={chartPaddingLeft}
                        y1={y}
                        x2={chartWidth - chartPaddingRight}
                        y2={y}
                        stroke="#F3F4F6"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={chartPaddingLeft - 8}
                        y={y + 3}
                        fontSize="10"
                        fill="#9CA3AF"
                        textAnchor="end"
                      >
                        ${val}k
                      </text>
                    </g>
                  );
                })}

                {areaD && <path d={areaD} fill="url(#revenueGrad)" />}

                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="var(--color-brand-main)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {points.map((pt, i) => {
                  const isHovered = hoveredPoint === i;
                  const isLast = i === points.length - 1;
                  return (
                    <g key={pt.month}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered || isLast ? 5 : 3.5}
                        fill="#FFFFFF"
                        stroke="var(--color-brand-main)"
                        strokeWidth={isHovered || isLast ? 3 : 2}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredPoint(i)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {isHovered && (
                        <g>
                          <rect
                            x={pt.x - 24}
                            y={pt.y - 28}
                            width="48"
                            height="20"
                            rx="4"
                            fill="#111827"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 15}
                            fontSize="10"
                            fill="#FFFFFF"
                            fontWeight="600"
                            textAnchor="middle"
                          >
                            {pt.label}
                          </text>
                        </g>
                      )}
                      <text
                        x={pt.x}
                        y={chartHeight - 6}
                        fontSize="11"
                        fill="#6B7280"
                        fontWeight="500"
                        textAnchor="middle"
                      >
                        {pt.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {t('statistics.charts.categoryBreakdown')}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t('statistics.charts.categorySubtitle')}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                {t('statistics.charts.volume')}
              </span>
            </div>

            <div className="flex flex-col gap-3.5 my-auto">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{cat.amount}</span>
                      <span className="text-gray-400 font-medium">({cat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: 'var(--color-brand-main)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400 font-medium">
            {t('statistics.rowCount', { count: items.length })}
          </p>
        </div>

        <Table<StatisticItem>
          columns={columns}
          data={items}
          isLoading={isLoading}
          keyExtractor={(item) => item.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
          previousLabel={t('statistics.pagination.previous')}
          nextLabel={t('statistics.pagination.next')}
        />
      </div>
    </>
  );
}
