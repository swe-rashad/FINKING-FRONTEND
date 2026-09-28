import { defineMock } from '@alova/mock';
import type { MerchantProfile } from '../api/merchants.api';

let merchantStore: MerchantProfile = {
  id: 101,
  name: 'FinKing Merchant Services',
  legalName: 'FinKing Ltd.',
  email: 'support@finking.com',
  status: 'active',
};

export const merchantsMock = defineMock({
  '[GET]/merchants/current': () => merchantStore,
  '[PATCH]/merchants/current': ({ data }) => {
    merchantStore = { ...merchantStore, ...data };
    return merchantStore;
  },
});
