import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { AuthLayout } from '@/features/auth';
import { Button, Input } from '@/shared';
import { GuestGuard } from '@/shared/components/guards';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { signUp } from '../store/auth.slice';
import { getSafeRedirectPath } from '@/core/auth/safe-redirect';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['auth']);
  return { props: { messages } };
}

export default function SignUpPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error: reduxError } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || reduxError;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError(t('signup.firstNameRequired'));
      return;
    }
    if (!email.trim()) {
      setLocalError(t('signup.emailRequired'));
      return;
    }
    if (!password) {
      setLocalError(t('signup.passwordRequired'));
      return;
    }

    setLocalError(null);
    const result = await dispatch(signUp({ name: name.trim(), lastname: lastname.trim(), email, password }));
    if (signUp.fulfilled.match(result)) {
      router.replace(getSafeRedirectPath(router.query.redirect));
    }
  };

  return (
    <GuestGuard>
      <Head>
        <title>{t('signup.title')}</title>
      </Head>
      <AuthLayout>
        <div className="flex w-full justify-center">
          <form onSubmit={handleSubmit} className="w-[23.438rem]">
            <h1 className="font-bold text-2xl mb-3 text-gray-900">{t('signup.title')}</h1>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-3 mb-4">
              <Input
                placeholder={t('signup.firstNamePlaceholder')}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder={t('signup.lastNamePlaceholder')}
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            <Input
              placeholder={t('signup.emailPlaceholder')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              placeholder={t('signup.passwordPlaceholder')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
              required
            />

            <Button type="submit" loading={isLoading} className="w-full mb-4">
              {t('signup.submit')}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              {t('signup.loginLink')}{' '}
              <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">
                {t('signup.loginAction')}
              </Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </GuestGuard>
  );
}
