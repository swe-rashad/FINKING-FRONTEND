import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { fetchStatistics, setHoveredPoint } from '../store/statistics.slice';

export function useStatistics() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.statistics);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  return {
    ...state,
    setHoveredPoint: (point: number | null) => dispatch(setHoveredPoint(point)),
    refetch: () => dispatch(fetchStatistics()),
  };
}
