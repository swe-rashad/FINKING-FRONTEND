import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openFilterModal,
  closeFilterModal,
  applyFilters,
  clearFilters,
} from '../store/users.slice';
import type { CreateUserDto, UpdateUserDto, UserItem, UsersFilters } from '../interfaces/user.interface';

export function useUsers() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.users);

  useEffect(() => {
    dispatch(fetchUsers(1));
  }, [dispatch]);

  return {
    ...state,
    setPage: (page: number) => dispatch(fetchUsers(page)),
    openCreateModal: () => dispatch(openCreateModal()),
    closeCreateModal: () => dispatch(closeCreateModal()),
    openEditModal: (user: UserItem) => dispatch(openEditModal(user)),
    closeEditModal: () => dispatch(closeEditModal()),
    openFilterModal: () => dispatch(openFilterModal()),
    closeFilterModal: () => dispatch(closeFilterModal()),
    applyFilters: (filters: Partial<UsersFilters>) => dispatch(applyFilters(filters)),
    clearFilters: () => dispatch(clearFilters()),
    createUser: (data: CreateUserDto) => dispatch(createUser(data)).unwrap(),
    updateUser: (id: number, data: UpdateUserDto) => dispatch(updateUser({ id, data })).unwrap(),
    deleteUser: (id: number) => dispatch(deleteUser(id)).unwrap(),
  };
}
