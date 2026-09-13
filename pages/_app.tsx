import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/core/store";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, defaultTimeZone } from "@/core/i18n/config";
import { ToastProvider } from "@/shared/components/common/Toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider
        locale={defaultLocale}
        timeZone={defaultTimeZone}
        messages={pageProps.messages ?? {}}
      >
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </NextIntlClientProvider>
    </Provider>
  );
}
