import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LogoSvg from '@/assets/icons/logo.svg';
import { loadMessages } from '@/core/i18n/loader';
import { defaultLocale } from '@/core/i18n/config';

export async function getStaticProps() {
  const messages = await loadMessages(defaultLocale);
  return { props: { messages } };
}

export default function NotFoundPage() {
  const t = useTranslations('shared');

  return (
    <>
      <Head>
        <title>404 - {t('errors.notFound.heading')} | Finking</title>
      </Head>

      <main className="min-h-screen flex flex-col p-6 sm:p-10 bg-white overflow-hidden">
        <header>
          <Link href="/" className="inline-block">
            <Image
              src={LogoSvg}
              alt="Finking Logo"
              width={180}
              height={48}
              priority
            />
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative flex flex-col items-center text-center">

            <span
              aria-hidden
              className="animate-blur-scale pointer-events-none select-none absolute text-[20rem] sm:text-[28rem] font-black leading-none text-primary-500"
              style={{ zIndex: 0 }}
            >
              404
            </span>

            <h1
              className="animate-fade-in-up relative z-10 text-6xl sm:text-7xl font-extrabold tracking-tight text-black mb-3"
              style={{ animationDelay: '0.1s' }}
            >
              {t('errors.notFound.title')}
            </h1>

            <p
              className="animate-fade-in-up relative z-10 font-medium text-base sm:text-lg text-black mb-2"
              style={{ animationDelay: '0.2s' }}
            >
              {t('errors.notFound.heading')}
            </p>

            <p
              className="animate-fade-in-up relative z-10 text-hint text-sm mb-10 max-w-xs leading-relaxed"
              style={{ animationDelay: '0.3s' }}
            >
              {t('errors.notFound.description')}
            </p>

            <div
              className="animate-fade-in-up relative z-10 w-[15rem]"
              style={{ animationDelay: '0.5s' }}
            >
              <Link
                href="/"
                className="rounded-md h-[3rem] w-full bg-primary-500 hover:bg-primary-900 text-white font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {t('common.goHome')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
