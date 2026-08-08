import assert from 'node:assert/strict';
import test from 'node:test';

import {createMeowCommentOptions} from '../src/components/Comments/meowCommentOptions';

test('creates a stable Chinese page key for Meow Comment', () => {
  assert.deepEqual(
    createMeowCommentOptions({
      server: 'https://comments.luminastudio.com.cn/',
      pathname: '/zh/docs/knowledge/image-mode-selection/',
      pageTitle: '图像模式选择',
    }),
    {
      baseUrl: 'https://comments.luminastudio.com.cn',
      pageKey: '/zh/knowledge/image-mode-selection/',
      pageTitle: '图像模式选择',
      locale: 'zh-Hans',
      darkMode: 'auto',
      captcha: 'auto',
      rememberUser: true,
    },
  );
});

test('uses English UI messages without changing the legacy page key', () => {
  const options = createMeowCommentOptions({
    server: 'https://comments.luminastudio.com.cn',
    pathname: '/en/docs/tutorials/gradient-card/',
    pageTitle: 'Print a gradient card',
  });

  assert.equal(options.locale, 'en');
  assert.equal(options.pageKey, '/en/tutorials/gradient-card/');
});
