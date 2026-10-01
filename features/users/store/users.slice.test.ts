import { describe, it, expect } from 'vitest';
import usersReducer, {
  setPage,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openFilterModal,
  closeFilterModal,
  setFilters,
  resetFilters,
  toggleUserStatusLocal,
  updateUserLocal,
} from './users.slice';
import type { UsersState } from './users.slice';
import { createMockUser } from '@/test/test-utils';

describe('users.slice', () => {
  const sampleUser = createMockUser({
    id: 1,
    name: 'Alice',
    lastname: 'Smith',
    email: 'alice@example.com',
    role: 'customer',
    status: 'active',
  });

  const initialState: UsersState = {
    users: [sampleUser],
    totalCount: 1,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    isLoading: false,
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isFilterModalOpen: false,
    activeUser: null,
    filters: {
      name: '',
      email: '',
      role: 'all',
      status: 'all',
    },
  };

  it('handles setPage', () => {
    const nextState = usersReducer(initialState, setPage(3));
    expect(nextState.currentPage).toBe(3);
  });

  it('handles openCreateModal and closeCreateModal', () => {
    let state = usersReducer(initialState, openCreateModal());
    expect(state.isCreateModalOpen).toBe(true);

    state = usersReducer(state, closeCreateModal());
    expect(state.isCreateModalOpen).toBe(false);
  });

  it('handles openEditModal and closeEditModal', () => {
    let state = usersReducer(initialState, openEditModal(sampleUser));
    expect(state.isEditModalOpen).toBe(true);
    expect(state.activeUser).toEqual(sampleUser);

    state = usersReducer(state, closeEditModal());
    expect(state.isEditModalOpen).toBe(false);
    expect(state.activeUser).toBeNull();
  });

  it('handles openFilterModal and closeFilterModal', () => {
    let state = usersReducer(initialState, openFilterModal());
    expect(state.isFilterModalOpen).toBe(true);

    state = usersReducer(state, closeFilterModal());
    expect(state.isFilterModalOpen).toBe(false);
  });

  it('handles setFilters and resetFilters', () => {
    let state = usersReducer(initialState, setFilters({ name: 'Bob', role: 'employee' }));
    expect(state.filters.name).toBe('Bob');
    expect(state.filters.role).toBe('employee');

    state = usersReducer(state, resetFilters());
    expect(state.filters.name).toBe('');
    expect(state.filters.role).toBe('all');
  });

  it('handles toggleUserStatusLocal', () => {
    let state = usersReducer(initialState, toggleUserStatusLocal(1));
    expect(state.users[0].status).toBe('blocked');

    state = usersReducer(state, toggleUserStatusLocal(1));
    expect(state.users[0].status).toBe('active');
  });

  it('handles updateUserLocal', () => {
    const state = usersReducer(
      initialState,
      updateUserLocal({ id: 1, data: { name: 'Alicia' } })
    );
    expect(state.users[0].name).toBe('Alicia');
  });
});
