import type { Locale } from './config';

export type FeatureDomain = 'auth' | 'dashboard';

export async function loadMessages(
  locale: Locale,
  domains: FeatureDomain[] = [],
): Promise<Record<string, unknown>> {
  const messages: Record<string, unknown> = {};

  const { default: shared } = await import(`@/shared/locales/${locale}.json`);
  messages.shared = shared;

  for (const domain of domains) {
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
  }

  return messages;
}
