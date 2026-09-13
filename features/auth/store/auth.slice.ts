import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tokenService } from '@/core/auth/token.service';

export interface AuthUserState {
  name: string;
  email: string;
  company: string;
  role: string;
}

export interface AuthState {
  user: AuthUserState | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: {
    name: 'Rashad Yusifli',
    email: 'rashad.yusifli@finking.com',
    company: 'Finking Financial',
    role: 'Administrator',
  },
  isAuthenticated: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUserState | null>) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    logout(state) {
      tokenService.clearTokens();
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
