import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/common/button';
import { Input, inputTypesEnum } from '@/shared/components/common/Input';
import CloseIcon from '@/features/dashboard/components/icons/CloseIcon';
import ExportIcon from '@/features/dashboard/components/icons/ExportIcon';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  defaultEmail?: string;
  onSubmit: (email: string, format: 'csv' | 'json') => Promise<void>;
}

export function ExportModal({
  isOpen,
  onClose,
  title,
  defaultEmail = 'rashad.yusifli@finking.com',
  onSubmit,
}: ExportModalProps) {
  const t = useTranslations('dashboard');
  const [email, setEmail] = useState(defaultEmail);
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError(t('exportModal.emailRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(trimmed, format);
      onClose();
    } catch (err) {
      console.error('Failed to request export:', err);
      setError('Failed to initiate export. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-7 relative z-10 border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <ExportIcon size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {title || t('exportModal.title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {t('exportModal.description')}
        </p>

        {error && (
          <div className="p-3 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="export-email"
            name="email"
            type={inputTypesEnum.Email}
            label={t('exportModal.emailLabel')}
            placeholder={t('exportModal.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('exportModal.formatLabel')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  format === 'csv'
                    ? 'border-primary-500 bg-primary-50/60 text-primary-700 ring-1 ring-primary-500'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                }`}
              >
                CSV (.csv)
              </button>
              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  format === 'json'
                    ? 'border-primary-500 bg-primary-50/60 text-primary-700 ring-1 ring-primary-500'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                }`}
              >
                JSON (.json)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('exportModal.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('exportModal.submitting') : t('exportModal.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
