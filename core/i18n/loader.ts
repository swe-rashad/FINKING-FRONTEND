import type { Locale } from './config';

export type FeatureDomain = 'auth' | 'dashboard';

export async function loadMessages(
  locale: Locale,
  domains: FeatureDomain[] = [],
): Promise<Record<string, unknown>> {
  const messages: Record<string, unknown> = {};

  const sharedPromise = import(`@/shared/locales/${locale}.json`).then((mod) => {
    messages.shared = mod.default;
  });

  const domainPromises = domains.map(async (domain) => {
    if (domain === 'auth') {
      const { default: auth } = await import(
        `@/features/auth/locales/${locale}.json`
      );
      messages.auth = auth;
    } else if (domain === 'dashboard') {
      const { default: dashboard } = await import(
        `@/features/dashboard/locales/${locale}.json`
      );
      messages.dashboard = dashboard;
    }
  });

  await Promise.all([sharedPromise, ...domainPromises]);

  return messages;
}
