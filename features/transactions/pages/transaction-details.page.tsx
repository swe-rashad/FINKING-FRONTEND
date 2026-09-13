import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/features/dashboard';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { Button } from '@/shared/components/common/button';
import { useToast } from '@/shared/components/common/Toast';
import ExportIcon from '@/features/dashboard/components/icons/ExportIcon';
import { transactionsApi } from '../api/transactions.api';
import type { TransactionDetailsItem } from '../interfaces/transaction.interface';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['dashboard']);
  return { props: { messages } };
}

export default function TransactionDetailsPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();

  const [transaction, setTransaction] = useState<TransactionDetailsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    transactionsApi
      .getTransactionById(String(id))
      .send()
      .then((res) => {
        setTransaction(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load transaction details:', err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading || !transaction) {
    return (
      <DashboardLayout>
        <div className="w-full px-4 sm:px-6 pb-12 flex flex-col">
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-3" />
            {t('transactionDetails.loading')}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleShareReceipt = () => {
    showToast({
      type: 'success',
      title: t('transactionDetails.title'),
      message: t('transactionDetails.receiptShared', { id: transaction.id }),
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>{`${transaction.id} - ${t('transactionDetails.title')} | FINKING`}</title>
      </Head>
      <div className="w-full px-4 sm:px-6 pb-12 flex flex-col">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-4 text-gray-500">
          <Link
            href="/dashboard/transactions"
            className="text-primary-500 hover:text-primary-600 transition-colors"
          >
            {t('transactionDetails.breadcrumbParent')}
          </Link>
          <span className="text-gray-300 font-normal">&gt;</span>
          <span className="text-gray-800 font-normal">{t('transactionDetails.breadcrumbCurrent')}</span>
        </nav>

        {/* Header with Title and Share Receipt action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {t('transactionDetails.title')}
          </h1>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={<ExportIcon size={16} />}
              onClick={handleShareReceipt}
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
            >
              {t('transactionDetails.actions.shareReceipt')}
            </Button>
          </div>
        </div>

        {/* Dual Card Layout matching reference screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Card: Əsas detallar / Main details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-6 pb-2 border-b border-gray-50">
              {t('transactionDetails.mainDetailsTitle')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.dateOfOperation')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.date || '29.01.2026 16:14:24'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.currency')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.currency || 'EUR'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.merchantName')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.merchantName || 'AzWallet FJM (topup)'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.amount')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.amount || '20.00'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.operationType')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.operationType || t('transactionDetails.values.purchase')}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.status')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.status === 'Completed'
                    ? t('transactionDetails.values.approved')
                    : transaction.status}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.cardNumber')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.cardMasked || '523915******8748'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.statusDescription')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.statusDescription || t('transactionDetails.values.paymentApproved')}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.rrn')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.rrn || '602912253898'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Əlavə detallar / Additional details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-6 pb-2 border-b border-gray-50">
              {t('transactionDetails.additionalDetailsTitle')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.operationId')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono break-all">
                  {transaction.operationId || '260129022658452734'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.merchantId')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.merchantId || '1201563'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.orderId')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.orderId || '56738073'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.subMerchantId')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.subMerchantId || '202006593'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.mcc')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.mcc || '6012'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.terminalId')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.terminalId || 'POST6593'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.reversal')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.reversal || t('transactionDetails.values.yes')}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.terminalSerialId')}
                </p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {transaction.terminalSerialId || 'V1E03307'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">
                  {t('transactionDetails.fields.threeDSecure')}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.threeDSecure || t('transactionDetails.values.no')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
