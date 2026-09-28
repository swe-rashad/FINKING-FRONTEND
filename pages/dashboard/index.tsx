import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';
import { useAppSelector } from '@/core/store';
import { getDefaultDashboardRoute } from '@/core/auth/permissions';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale, ['dashboard']);
  return { props: { messages } };
}

export default function DashboardIndex() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const targetRoute = getDefaultDashboardRoute(currentUser);
    router.replace(targetRoute);
  }, [currentUser, router]);

  return null;
}
