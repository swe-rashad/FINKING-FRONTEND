import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "@/core/store";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, defaultTimeZone } from "@/core/i18n/config";
import { ToastProvider } from "@/shared/components/common/Toast";
import { DashboardLayout } from "@/features/dashboard";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  const page = <Component {...pageProps} />;

  return (
    <Provider store={store}>
      <Head>
        <title>FINKING</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NextIntlClientProvider
        locale={defaultLocale}
        timeZone={defaultTimeZone}
        messages={pageProps.messages ?? {}}
      >
        <ToastProvider>
          {isDashboard ? <DashboardLayout>{page}</DashboardLayout> : page}
        </ToastProvider>
      </NextIntlClientProvider>
    </Provider>
  );
}
