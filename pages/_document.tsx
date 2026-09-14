import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2196f3" />
        <meta
          name="description"
          content="FINKING - Next-generation financial dashboard and banking operations platform."
        />
      </Head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
