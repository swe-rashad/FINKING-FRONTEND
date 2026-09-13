import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DashboardState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
}

const initialState: DashboardState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    openMobileSidebar(state) {
      state.mobileSidebarOpen = true;
    },
    closeMobileSidebar(state) {
      state.mobileSidebarOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  openMobileSidebar,
  closeMobileSidebar,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
