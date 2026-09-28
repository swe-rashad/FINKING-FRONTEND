import React from 'react';
import { useTranslations } from 'next-intl';
import type {
  MonthlyRevenueItem,
  RevenuePeriodEnumType,
} from '../interfaces/statistics.interface';
import { EmptyState } from './EmptyState';

interface RevenueTrendChartProps {
  monthlyRevenue: MonthlyRevenueItem[];
  rangePill: string;
  period?: RevenuePeriodEnumType;
  hoveredPoint: number | null;
  onHoverPoint: (point: number | null) => void;
  isLoading?: boolean;
}

const formatNumber = (val: number): string => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(val);
};

export function RevenueTrendChart({
  monthlyRevenue,
  rangePill,
  period,
  hoveredPoint,
  onHoverPoint,
  isLoading = false,
}: RevenueTrendChartProps) {
  const t = useTranslations('dashboard');

  const chartWidth = 560;
  const chartHeight = 160;
  const chartPaddingTop = 20;
  const chartPaddingBottom = 30;
  const chartPaddingLeft = 40;
  const chartPaddingRight = 20;

  const innerWidth = chartWidth - chartPaddingLeft - chartPaddingRight;
  const innerHeight = chartHeight - chartPaddingTop - chartPaddingBottom;

  const hasData = monthlyRevenue.some((item) => Number(item.value) > 0);

  const maxDataValue = Math.max(
    ...monthlyRevenue.map((item) => Number(item.value) || 0),
    0
  );
  const maxValue = maxDataValue > 0 ? Math.ceil(maxDataValue * 1.15) : 240;

  const yTicks = [
    Math.round(maxValue * 0.25),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.75),
    Math.round(maxValue),
  ];

  const points = monthlyRevenue.map((item, index) => {
    const x =
      chartPaddingLeft +
      (index / Math.max(monthlyRevenue.length - 1, 1)) * innerWidth;
    const y =
      chartPaddingTop + innerHeight - (item.value / maxValue) * innerHeight;
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

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${
          chartPaddingTop + innerHeight
        } L ${points[0].x} ${chartPaddingTop + innerHeight} Z`
      : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            {t('statistics.charts.revenueTrend')}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {period === 'weekly'
              ? 'Weekly revenue overview'
              : period === 'yearly'
              ? 'Yearly revenue overview'
              : 'Monthly revenue overview'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">
            {period === 'weekly' ? 'Weekly' : period === 'yearly' ? 'Yearly' : 'Monthly'}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {rangePill}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-44 sm:h-52 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <div className="py-6">
          <EmptyState
            title="No revenue data"
            description="There are no transaction records for the selected period."
          />
        </div>
      ) : (
        <div className="w-full relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 sm:h-52 overflow-visible"
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-brand-main)"
                  stopOpacity="0.32"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-brand-main)"
                  stopOpacity="0.0"
                />
              </linearGradient>
            </defs>

            {yTicks.map((val) => {
              const y =
                chartPaddingTop + innerHeight - (val / maxValue) * innerHeight;
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
                    {formatNumber(val)}
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
                    onMouseEnter={() => onHoverPoint(i)}
                    onMouseLeave={() => onHoverPoint(null)}
                  />
                  {isHovered && (
                    <g>
                      <rect
                        x={pt.x - 27}
                        y={pt.y - 28}
                        width="54"
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
      )}
    </div>
  );
}

export default RevenueTrendChart;
