import { useTranslations } from 'next-intl';
import { AuthLayout } from '@/features/auth';
import { Button, Input } from '@/shared';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['auth']);
  return { props: { messages } };
}

export default function LoginPage() {
  const t = useTranslations('auth');

  return (
    <AuthLayout>
      <div className='flex w-full justify-center'>
        <div className='w-[23.438rem]'>
          <h1 className='font-bold text-2xl mb-3'>{t('login.title')}</h1>
          <Input placeholder={t('login.emailPlaceholder')} type='email' className="mb-4" />
          <Input placeholder={t('login.passwordPlaceholder')} type='password' className="mb-4" />
          <Button>{t('login.submit')}</Button>
        </div>
      </div>
    </AuthLayout>
  );
}
