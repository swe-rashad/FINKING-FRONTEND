import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '@/features/auth/store/auth.slice';
import usersReducer from '@/features/users/store/users.slice';
import transactionsReducer from '@/features/transactions/store/transactions.slice';
import statisticsReducer from '@/features/statistics/store/statistics.slice';
import dashboardReducer from '@/features/dashboard/store/dashboard.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    transactions: transactionsReducer,
    statistics: statisticsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
