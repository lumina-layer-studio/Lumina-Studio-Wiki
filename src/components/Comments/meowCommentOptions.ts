import type {MeowCommentsConfig} from '@neko_vecter/meow-comment-ui';

import {resolveLegacyPageKey} from '@site/src/lib/legacyPageKeys';

type MeowCommentOptions = Omit<MeowCommentsConfig, 'el'>;

interface CreateMeowCommentOptionsInput {
  server: string;
  pathname: string;
  pageTitle: string;
  darkMode: boolean;
}

export function createMeowCommentOptions({
  server,
  pathname,
  pageTitle,
  darkMode,
}: CreateMeowCommentOptionsInput): MeowCommentOptions {
  return {
    baseUrl: server.replace(/\/+$/, ''),
    pageKey: resolveLegacyPageKey(pathname),
    pageTitle,
    locale: pathname.startsWith('/en/') ? 'en' : 'zh-Hans',
    darkMode,
    captcha: 'auto',
    rememberUser: true,
  };
}
