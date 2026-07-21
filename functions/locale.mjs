/**
 * Select the best locale supported by the Wiki.
 *
 * Unsupported languages are skipped instead of being treated as English so a
 * later Chinese preference can still be honored. English is the final
 * fallback when neither supported language is present.
 */
export function selectLocale(acceptLanguage) {
  if (!acceptLanguage) {
    return 'en';
  }

  const supported = acceptLanguage
    .split(',')
    .map((entry, position) => {
      const [rawLanguage, ...parameters] = entry.trim().toLowerCase().split(';');
      const qualityParameter = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith('q='));
      const parsedQuality = qualityParameter
        ? Number.parseFloat(qualityParameter.slice(2))
        : 1;
      const quality = Number.isFinite(parsedQuality) ? parsedQuality : 0;
      let locale = null;
      if (rawLanguage === 'zh' || rawLanguage.startsWith('zh-')) {
        locale = 'zh';
      } else if (rawLanguage === 'en' || rawLanguage.startsWith('en-')) {
        locale = 'en';
      }
      return {locale, quality, position};
    })
    .filter(({locale, quality}) => locale !== null && quality > 0)
    .sort((left, right) => right.quality - left.quality || left.position - right.position);

  return supported[0]?.locale ?? 'en';
}
