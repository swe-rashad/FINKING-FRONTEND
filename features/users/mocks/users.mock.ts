import { defineMock } from '@alova/mock';
import { paginateMock } from '@/core/utils/mock-pagination';
import type { BackendUser } from '../interfaces/user.interface';

const usersStore: BackendUser[] = [
  { id: 1, createdAt: '2026-01-01', updatedAt: '2026-01-01', email: 'lucas.weber@company.de', name: 'Lucas', lastname: 'Weber', verificated: true, status: 'active', role: 'customer' },
  { id: 2, createdAt: '2026-01-02', updatedAt: '2026-01-02', email: 'emma.watson@enterprise.co.uk', name: 'Emma', lastname: 'Watson', verificated: true, status: 'blocked', role: 'employee' },
  { id: 3, createdAt: '2026-01-03', updatedAt: '2026-01-03', email: 'alexandre.dupont@banque.fr', name: 'Alexandre', lastname: 'Dupont', verificated: true, status: 'active', role: 'employee' },
  { id: 4, createdAt: '2026-01-04', updatedAt: '2026-01-04', email: 'sofia.rossi@finanza.it', name: 'Sofia', lastname: 'Rossi', verificated: true, status: 'active', role: 'employee' },
  { id: 5, createdAt: '2026-01-05', updatedAt: '2026-01-05', email: 'matteo.mueller@corp.de', name: 'Matteo', lastname: 'Müller', verificated: true, status: 'active', role: 'employee' },
  { id: 6, createdAt: '2026-01-06', updatedAt: '2026-01-06', email: 'camille.laurent@finance.fr', name: 'Camille', lastname: 'Laurent', verificated: false, status: 'active', role: 'employee' },
  { id: 7, createdAt: '2026-01-07', updatedAt: '2026-01-07', email: 'oliver.davies@investments.co.uk', name: 'Oliver', lastname: 'Davies', verificated: true, status: 'active', role: 'employee' },
  { id: 8, createdAt: '2026-01-08', updatedAt: '2026-01-08', email: 'elena.garcia@banco.es', name: 'Elena', lastname: 'Garcia', verificated: true, status: 'active', role: 'employee' },
  { id: 9, createdAt: '2026-01-09', updatedAt: '2026-01-09', email: 'lars.lindqvist@nordic.se', name: 'Lars', lastname: 'Lindqvist', verificated: true, status: 'active', role: 'employee' },
  { id: 10, createdAt: '2026-01-10', updatedAt: '2026-01-10', email: 'charlotte.dubois@capital.fr', name: 'Charlotte', lastname: 'Dubois', verificated: true, status: 'active', role: 'customer' },
];

export const usersMock = defineMock({
  '[GET]/users': ({ query }) => {
    let filtered = [...usersStore];
    if (query.name) {
      const name = String(query.name).toLowerCase();
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(name) || u.lastname.toLowerCase().includes(name)
      );
    }
    if (query.email) {
      const email = String(query.email).toLowerCase();
      filtered = filtered.filter((u) => u.email.toLowerCase().includes(email));
    }
    if (query.role && query.role !== 'all') {
      filtered = filtered.filter((u) => u.role === String(query.role).toLowerCase());
    }
    if (query.status && query.status !== 'all') {
      filtered = filtered.filter((u) => u.status === String(query.status).toLowerCase());
    }
    return paginateMock(filtered, query);
  },

  '[POST]/users/create': ({ data }) => {
    const newUser: BackendUser = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: data.email,
      name: data.name || '',
      lastname: data.lastname || '',
      verificated: data.verificated ?? false,
      status: data.status || 'forceChangePassword',
      role: data.role || 'employee',
    };
    usersStore.unshift(newUser);
    return newUser;
  },

  '[GET]/users/{id}': ({ params }) => {
    const id = Number(params.id);
    return usersStore.find((u) => u.id === id) || usersStore[0];
  },

  '[PUT]/users/{id}': ({ params, data }) => {
    const id = Number(params.id);
    const index = usersStore.findIndex((u) => u.id === id);
    if (index !== -1) {
      usersStore[index] = { ...usersStore[index], ...data, updatedAt: new Date().toISOString() };
      return usersStore[index];
    }
    return { id, ...data };
  },

  '[PATCH]/users/{id}': ({ params, data }) => {
    const id = Number(params.id);
    const index = usersStore.findIndex((u) => u.id === id);
    if (index !== -1) {
      usersStore[index] = { ...usersStore[index], ...data, updatedAt: new Date().toISOString() };
      return usersStore[index];
    }
    return { id, ...data };
  },

  '[PATCH]/users/{id}/block': ({ params }) => {
    const id = Number(params.id);
    const index = usersStore.findIndex((u) => u.id === id);
    if (index !== -1) {
      const current = usersStore[index].status;
      usersStore[index].status = current === 'blocked' ? 'active' : 'blocked';
      usersStore[index].updatedAt = new Date().toISOString();
      return usersStore[index];
    }
    return { id, status: 'blocked' };
  },

  '[DELETE]/users/{id}': ({ params }) => {
    const id = Number(params.id);
    const index = usersStore.findIndex((u) => u.id === id);
    if (index !== -1) usersStore.splice(index, 1);
    return {};
  },
});
