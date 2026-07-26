export type RecentChangeAction = 'added' | 'updated' | 'moved' | 'removed';

export interface RecentChangePageLike {
  action: RecentChangeAction;
  zh?: {title: string; url?: string};
  en?: {title: string; url?: string};
}

interface RecentChangesCopy {
  title: string;
  description: string;
  empty: string;
  fallbackTitle: string;
  actions: Record<RecentChangeAction, string>;
}

const CHINESE_COPY: RecentChangesCopy = {
  title: '最近更改',
  description: '文档发布后自动更新，集中查看最近新增和修订的页面。',
  empty: '目前还没有可显示的文档更改。',
  fallbackTitle: '英文文档页面',
  actions: {
    added: '新增',
    updated: '更新',
    moved: '移动',
    removed: '移除',
  },
};

const ENGLISH_COPY: RecentChangesCopy = {
  title: 'Recent changes',
  description:
    'Updated automatically when documentation pages are published or revised.',
  empty: 'There are no documentation changes to show yet.',
  fallbackTitle: 'Chinese documentation page',
  actions: {
    added: 'Added',
    updated: 'Updated',
    moved: 'Moved',
    removed: 'Removed',
  },
};

function isEnglishLocale(locale: string): boolean {
  return locale === 'en' || locale.startsWith('en-');
}

export function copyForLocale(locale: string): RecentChangesCopy {
  return isEnglishLocale(locale) ? ENGLISH_COPY : CHINESE_COPY;
}

export function localizePage(
  page: RecentChangePageLike,
  locale: string,
): {title: string; url?: string} {
  const english = isEnglishLocale(locale);
  const preferred = english ? page.en : page.zh;
  if (preferred) return preferred;

  const fallback = english ? page.zh : page.en;
  return {
    title: copyForLocale(locale).fallbackTitle,
    ...(fallback?.url ? {url: fallback.url} : {}),
  };
}

export function isUpdatesRootPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized === '/zh/updates' || normalized === '/en/updates';
}

export function formatRecentChangeTimestamp(
  timestamp: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(isEnglishLocale(locale) ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
  }).format(new Date(timestamp));
}
