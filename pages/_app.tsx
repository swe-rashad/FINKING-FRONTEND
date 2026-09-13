import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/core/store";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale } from "@/core/i18n/config";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider
        locale={defaultLocale}
        messages={pageProps.messages ?? {}}
      >
        <Component {...pageProps} />
      </NextIntlClientProvider>
    </Provider>
  );
}
