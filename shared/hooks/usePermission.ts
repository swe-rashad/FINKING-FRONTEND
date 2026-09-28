import { useAppSelector } from '@/core/store';
import { canAccess, hasPathAccess, PermissionAction } from '@/core/auth/permissions';

export function usePermission() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  return {
    currentUser,
    can: (action: PermissionAction | string) => canAccess(currentUser, action),
    canAccessPath: (path: string) => hasPathAccess(currentUser, path),
    canUsersRead: canAccess(currentUser, 'users:read'),
    canUsersCreate: canAccess(currentUser, 'users:create'),
    canUsersUpdate: canAccess(currentUser, 'users:update'),
    canUsersDelete: canAccess(currentUser, 'users:delete'),
    canUsersBlock: canAccess(currentUser, 'users:block'),
    canTransactionsRead: canAccess(currentUser, 'transactions:read'),
    canTransactionsExport: canAccess(currentUser, 'transactions:export'),
    canStatisticsRead: canAccess(currentUser, 'statistics:read'),
    canStatisticsExport: canAccess(currentUser, 'statistics:export'),
  };
}
