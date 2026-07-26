import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

import {
  copyForLocale,
  isUpdatesRootPath,
  localizePage,
} from '../src/components/WikiRecentChanges/model';

test('provides concise Chinese and English recent-change labels', () => {
  const chinese = copyForLocale('zh-Hans');
  const english = copyForLocale('en');

  assert.equal(chinese.title, '最近更改');
  assert.equal(chinese.actions.added, '新增');
  assert.equal(chinese.actions.updated, '更新');
  assert.equal(chinese.actions.moved, '移动');
  assert.equal(chinese.actions.removed, '移除');

  assert.equal(english.title, 'Recent changes');
  assert.equal(english.actions.added, 'Added');
  assert.equal(english.actions.updated, 'Updated');
  assert.equal(english.actions.moved, 'Moved');
  assert.equal(english.actions.removed, 'Removed');
});

test('uses a safe localized fallback without inventing a translation', () => {
  assert.deepEqual(
    localizePage(
      {
        action: 'added',
        zh: {
          title: '仅中文页面',
          url: '/zh/docs/guide/chinese-only/',
        },
      },
      'en',
    ),
    {
      title: 'Chinese documentation page',
      url: '/zh/docs/guide/chinese-only/',
    },
  );

  assert.deepEqual(
    localizePage(
      {
        action: 'removed',
        zh: {title: '已移除页面'},
      },
      'zh-Hans',
    ),
    {title: '已移除页面'},
  );
});

test('injects the stream only on the localized Wiki Updates landing pages', async () => {
  assert.equal(isUpdatesRootPath('/zh/updates/'), true);
  assert.equal(isUpdatesRootPath('/en/updates'), true);
  assert.equal(isUpdatesRootPath('/zh/updates/page/2/'), false);
  assert.equal(isUpdatesRootPath('/en/updates/tags/release/'), false);

  const wrapper = await readFile(
    'src/theme/BlogPostItems/index.tsx',
    'utf8',
  );
  assert.match(wrapper, /@theme-original\/BlogPostItems/);
  assert.match(wrapper, /WikiRecentChanges/);
  assert.match(wrapper, /isUpdatesRootPath/);
});
