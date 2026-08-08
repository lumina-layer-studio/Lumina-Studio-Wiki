import type {MeowCommentsConfig} from 'meow-comment-ui';

import {resolveLegacyPageKey} from '@site/src/lib/legacyPageKeys';

type MeowCommentOptions = Omit<MeowCommentsConfig, 'el'>;

interface CreateMeowCommentOptionsInput {
  server: string;
  pathname: string;
  pageTitle: string;
}

export function createMeowCommentOptions({
  server,
  pathname,
  pageTitle,
}: CreateMeowCommentOptionsInput): MeowCommentOptions {
  return {
    baseUrl: server.replace(/\/+$/, ''),
    pageKey: resolveLegacyPageKey(pathname),
    pageTitle,
    locale: pathname.startsWith('/en/') ? 'en' : 'zh-Hans',
    darkMode: 'auto',
    captcha: 'auto',
    rememberUser: true,
  };
}
