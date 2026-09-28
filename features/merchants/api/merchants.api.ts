import { alovaInstance } from '@/core/api/alova';

export interface MerchantProfile {
  id: number;
  name: string;
  legalName?: string;
  email?: string;
  status?: string;
}

export const merchantsApi = {
  getCurrentMerchant() {
    return alovaInstance.Get<MerchantProfile>('/merchants/current');
  },

  updateCurrentMerchant(payload: Partial<MerchantProfile>) {
    return alovaInstance.Patch<MerchantProfile>('/merchants/current', payload);
  },
};
