import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { fetchStatistics, setHoveredPoint } from '../store/statistics.slice';
import type { GetStatisticsDto } from '../interfaces/statistics.interface';

export function useStatistics(params?: GetStatisticsDto) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.statistics);

  const startDate = params?.startDate instanceof Date ? params.startDate.toISOString() : params?.startDate;
  const endDate = params?.endDate instanceof Date ? params.endDate.toISOString() : params?.endDate;

  useEffect(() => {
    dispatch(fetchStatistics(startDate || endDate ? { startDate, endDate } : undefined));
  }, [dispatch, startDate, endDate]);

  return {
    ...state,
    setHoveredPoint: (point: number | null) => dispatch(setHoveredPoint(point)),
    refetch: (overrideParams?: GetStatisticsDto) =>
      dispatch(fetchStatistics(overrideParams ?? (startDate || endDate ? { startDate, endDate } : undefined))),
  };
}
