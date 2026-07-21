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

export function resolveLegacyPageKey(pathname: string): string {
  const normalized = normalize(pathname);
  return normalized.replace(/^\/(zh|en)\/docs\//, '/$1/');
}
