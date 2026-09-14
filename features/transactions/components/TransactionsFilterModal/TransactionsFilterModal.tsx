import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/common/Button';
import { Input, inputTypesEnum } from '@/shared/components/common/Input';
import { Select } from '@/shared/components/common/Select';
import { CloseIcon, FilterIcon } from '@/shared/components/icons';
import { useEscapeKey, useLockBodyScroll } from '@/shared/hooks';
import type {
  TransactionsFilters,
  TransactionStatus,
  TransactionType,
} from '../../interfaces/transaction.interface';

interface TransactionsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TransactionsFilters;
  onApply: (filters: Partial<TransactionsFilters>) => void;
  onReset: () => void;
}

export function TransactionsFilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: TransactionsFilterModalProps) {
  const t = useTranslations('dashboard');
  const tShared = useTranslations('shared');
  const [sender, setSender] = useState(filters.sender || '');
  const [receiver, setReceiver] = useState(filters.receiver || '');
  const [status, setStatus] = useState<TransactionsFilters['status']>(filters.status || 'all');
  const [type, setType] = useState<TransactionsFilters['type']>(filters.type || 'all');
  const [minAmount, setMinAmount] = useState(filters.minAmount || '');
  const [maxAmount, setMaxAmount] = useState(filters.maxAmount || '');

  useEscapeKey(onClose, isOpen);
  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApply({
      sender: sender.trim(),
      receiver: receiver.trim(),
      status,
      type,
      minAmount: minAmount.trim(),
      maxAmount: maxAmount.trim(),
    });
  };

  const handleReset = () => {
    setSender('');
    setReceiver('');
    setStatus('all');
    setType('all');
    setMinAmount('');
    setMaxAmount('');
    onReset();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transactions-filter-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-7 relative z-10 border border-gray-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <FilterIcon size={18} />
            </div>
            <h2 id="transactions-filter-title" className="text-lg font-bold text-gray-900">
              {t('transactions.filterModal.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tShared('common.close')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed -mt-1">
          {t('transactions.filterModal.description')}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="filter-sender"
            name="sender"
            type={inputTypesEnum.Text}
            label={t('transactions.filterModal.senderLabel')}
            placeholder={t('transactions.filterModal.senderPlaceholder')}
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />

          <Input
            id="filter-receiver"
            name="receiver"
            type={inputTypesEnum.Text}
            label={t('transactions.filterModal.receiverLabel')}
            placeholder={t('transactions.filterModal.receiverPlaceholder')}
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="filter-status"
              name="status"
              label={t('transactions.filterModal.statusLabel')}
              value={status}
              onChange={(e) => setStatus(e.target.value as 'all' | TransactionStatus)}
              options={[
                { value: 'all', label: t('transactions.filterModal.statusAll') },
                { value: 'Completed', label: t('transactions.status.completed') },
                { value: 'Pending', label: t('transactions.status.pending') },
                { value: 'Failed', label: t('transactions.status.failed') },
              ]}
            />

            <Select
              id="filter-type"
              name="type"
              label={t('transactions.filterModal.typeLabel')}
              value={type}
              onChange={(e) => setType(e.target.value as 'all' | TransactionType)}
              options={[
                { value: 'all', label: t('transactions.filterModal.typeAll') },
                { value: 'Transfer', label: t('transactions.types.transfer') },
                { value: 'Payment', label: t('transactions.types.payment') },
                { value: 'Top-up', label: t('transactions.types.topUp') },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="filter-min-amount"
              name="minAmount"
              type="number"
              label={t('transactions.filterModal.minAmountLabel')}
              placeholder={t('transactions.filterModal.minAmountPlaceholder')}
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />

            <Input
              id="filter-max-amount"
              name="maxAmount"
              type="number"
              label={t('transactions.filterModal.maxAmountLabel')}
              placeholder={t('transactions.filterModal.maxAmountPlaceholder')}
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              {t('transactions.filterModal.reset')}
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {t('transactions.filterModal.apply')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionsFilterModal;
