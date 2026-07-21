import routeManifest from '@site/data/routes/legacy-routes.json';

type SupportedLocale = keyof typeof routeManifest.locales;

function normalize(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] || '/';
  let decodedPath = path;
  try {
    decodedPath = decodeURI(path);
  } catch {
    // Keep malformed external paths stable instead of breaking the document.
  }
  return decodedPath.endsWith('/') ? decodedPath : `${decodedPath}/`;
}

function localePath(
  locale: SupportedLocale,
  slug: string,
  includeDocs: boolean,
): string {
  const prefix = includeDocs ? `/${locale}/docs` : `/${locale}`;
  return slug === '/' ? `${prefix}/` : `${prefix}${slug}/`;
}

const pageKeys = new Map<string, string>();
for (const [locale, slugs] of Object.entries(routeManifest.locales) as [
  SupportedLocale,
  string[],
][]) {
  for (const slug of slugs) {
    pageKeys.set(
      normalize(localePath(locale, slug, true)),
      normalize(localePath(locale, slug, false)),
    );
  }
}

export function resolveLegacyPageKey(pathname: string): string {
  const normalized = normalize(pathname);
  return pageKeys.get(normalized) ?? normalized;
}
