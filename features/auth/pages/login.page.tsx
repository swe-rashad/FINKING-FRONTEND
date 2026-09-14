import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { AuthLayout } from '@/features/auth';
import { Button, Input } from '@/shared';
import { GuestGuard } from '@/shared/components/guards';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { authApi } from '../api/auth.api';
import { tokenService } from '@/core/auth/token.service';
import { getSafeRedirectPath } from '@/core/auth/safe-redirect';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['auth']);
  return { props: { messages } };
}

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [email, setEmail] = useState('rashad.yusifli@finking.com');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(t('login.emailRequired'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await authApi.login({ email, password }).send();
      if (res && res.authToken) {
        tokenService.setTokens({
          authToken: res.authToken,
          refreshToken: res.refreshToken,
        });
        router.replace(getSafeRedirectPath(router.query.redirect));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('login.submitError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
      <Head>
        <title>{t('login.title')}</title>
      </Head>
      <AuthLayout>
        <div className="flex w-full justify-center">
          <form onSubmit={handleSubmit} className="w-[23.438rem]">
            <h1 className="font-bold text-2xl mb-3 text-gray-900">{t('login.title')}</h1>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <Input
              placeholder={t('login.emailPlaceholder')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              placeholder={t('login.passwordPlaceholder')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
              required
            />
            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
            >
              {t('login.submit')}
            </Button>
          </form>
        </div>
      </AuthLayout>
    </GuestGuard>
  );
}
