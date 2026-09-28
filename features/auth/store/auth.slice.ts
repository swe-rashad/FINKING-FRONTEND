import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/auth.api';
import { usersApi } from '@/features/users/api/users.api';
import { tokenService } from '@/core/auth/token.service';
import type { LoginCredentials, SignUpCredentials } from '../interfaces/auth.interface';
import type { CurrentUserResponse } from '@/features/users/interfaces/user.interface';

export interface AuthState {
  currentUser: CurrentUserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  accessToken: tokenService.getAuthToken(),
  refreshToken: tokenService.getRefreshToken(),
  isAuthenticated: tokenService.isAuthenticated(),
  isLoading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await usersApi.getCurrentUser().send();
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch current user');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.signIn(credentials).send();
      tokenService.setTokens(response);
      await dispatch(fetchCurrentUser());
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Authentication failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: SignUpCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.signUp(credentials).send();
      tokenService.setTokens(response);
      await dispatch(fetchCurrentUser());
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Registration failed');
    }
  }
);

export const refreshTokens = createAsyncThunk(
  'auth/refreshTokens',
  async (_, { rejectWithValue }) => {
    try {
      const currentRefreshToken = tokenService.getRefreshToken();
      if (!currentRefreshToken) throw new Error('No refresh token available');
      const response = await authApi.refreshToken(currentRefreshToken).send();
      tokenService.setTokens(response);
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Refresh token failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      tokenService.clearTokens();
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Sign in failed';
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Registration failed';
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to get current user';
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokens.rejected, (state) => {
        tokenService.clearTokens();
        state.currentUser = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
