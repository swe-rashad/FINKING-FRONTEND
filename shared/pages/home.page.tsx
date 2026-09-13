import { useTranslations } from 'next-intl';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale);
  return { props: { messages } };
}

export default function HomePage() {
  const t = useTranslations('shared');

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">{t('home.welcome')}</h1>
    </main>
  );
}
