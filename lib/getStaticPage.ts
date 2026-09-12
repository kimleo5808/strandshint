import { STATIC_PAGES } from '@/data/pages.generated';
import { DEFAULT_LOCALE } from '@/i18n/routing';

// Pages are inlined at build time by scripts/build-content.mjs. Reading
// content/ with fs here returned an empty string on Cloudflare Workers — no
// filesystem at request time — which made MDXRemote throw and served HTTP 500
// on /about, /privacy-policy and /terms-of-service.
export function getStaticPage(slug: string, locale: string = DEFAULT_LOCALE) {
  const byLocale = STATIC_PAGES[slug];
  if (!byLocale) return null;

  return byLocale[locale] ?? byLocale[DEFAULT_LOCALE] ?? null;
}

export function getStaticPageContent(slug: string, locale: string = DEFAULT_LOCALE): string {
  return getStaticPage(slug, locale)?.content ?? '';
}
