import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { tokenService } from '@/core/auth/token.service';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale);
  return { props: { messages } };
}

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (tokenService.isAuthenticated()) {
      router.replace('/dashboard/statistics');
    } else {
      router.replace('/auth/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F9]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
        <span className="text-xs font-medium text-gray-400">Redirecting...</span>
      </div>
    </div>
  );
}
