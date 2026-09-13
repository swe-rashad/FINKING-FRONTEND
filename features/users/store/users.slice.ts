import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  UserItem,
  CreateUserDto,
  UpdateUserDto,
  UsersFilters,
} from '../interfaces/user.interface';
import { usersApi } from '../api/users.api';

export interface UsersState {
  users: UserItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading: boolean;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isFilterModalOpen: boolean;
  activeUser: UserItem | null;
  filters: UsersFilters;
}

const defaultFilters: UsersFilters = {
  search: '',
  role: 'all',
  status: 'all',
};

const initialState: UsersState = {
  users: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  isLoading: true,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isFilterModalOpen: false,
  activeUser: null,
  filters: defaultFilters,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number | undefined, { getState }) => {
    const state = getState() as { users: UsersState };
    const targetPage = page ?? state.users.currentPage;
    return await usersApi.getUsers(targetPage, state.users.pageSize, state.users.filters).send();
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (data: CreateUserDto, { dispatch }) => {
    await usersApi.createUser(data).send();
    dispatch(closeCreateModal());
    dispatch(fetchUsers(1));
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: number; data: UpdateUserDto }, { dispatch, getState }) => {
    await usersApi.updateUser(id, data).send();
    dispatch(closeEditModal());
    const state = getState() as { users: UsersState };
    dispatch(fetchUsers(state.users.currentPage));
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { dispatch, getState }) => {
    await usersApi.deleteUser(id).send();
    const state = getState() as { users: UsersState };
    dispatch(fetchUsers(state.users.currentPage));
  }
);

export const applyFilters = createAsyncThunk(
  'users/applyFilters',
  async (filters: Partial<UsersFilters>, { dispatch }) => {
    dispatch(setFilters(filters));
    dispatch(closeFilterModal());
    dispatch(fetchUsers(1));
  }
);

export const clearFilters = createAsyncThunk(
  'users/clearFilters',
  async (_, { dispatch }) => {
    dispatch(resetFilters());
    dispatch(closeFilterModal());
    dispatch(fetchUsers(1));
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    openCreateModal(state) {
      state.isCreateModalOpen = true;
    },
    closeCreateModal(state) {
      state.isCreateModalOpen = false;
    },
    openEditModal(state, action: PayloadAction<UserItem>) {
      state.activeUser = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal(state) {
      state.activeUser = null;
      state.isEditModalOpen = false;
    },
    openFilterModal(state) {
      state.isFilterModalOpen = true;
    },
    closeFilterModal(state) {
      state.isFilterModalOpen = false;
    },
    setFilters(state, action: PayloadAction<Partial<UsersFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = defaultFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.totalCount = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setPage,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openFilterModal,
  closeFilterModal,
  setFilters,
  resetFilters,
} = usersSlice.actions;

export default usersSlice.reducer;
