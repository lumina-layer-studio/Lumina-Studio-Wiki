import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createLocalizedDocRedirects,
  localizedDocSlugPairs,
} from '../src/data/localizedDocRedirects';

test('creates two compatibility redirects for every localized slug pair', () => {
  assert.equal(localizedDocSlugPairs.length, 21);

  assert.deepEqual(createLocalizedDocRedirects('/docs/更新日志/'), [
    '/docs/changelog/',
  ]);
  assert.deepEqual(createLocalizedDocRedirects('/docs/changelog/'), [
    '/docs/更新日志/',
  ]);
});

test('keeps redirect sources unique and all paths canonical', () => {
  const sources: string[] = [];

  for (const [zhSlug, enSlug] of localizedDocSlugPairs) {
    const zhPath = `/docs/${zhSlug.replace(/^\/|\/$/g, '')}/`;
    const enPath = `/docs/${enSlug.replace(/^\/|\/$/g, '')}/`;
    sources.push(zhPath, enPath);

    assert.match(zhPath, /^\/docs\/.+\/$/);
    assert.match(enPath, /^\/docs\/.+\/$/);
    assert.notEqual(zhPath, enPath);
    assert.deepEqual(createLocalizedDocRedirects(zhPath), [enPath]);
    assert.deepEqual(createLocalizedDocRedirects(enPath), [zhPath]);
  }

  assert.equal(new Set(sources).size, sources.length);
  assert.equal(createLocalizedDocRedirects('/docs/not-mapped/'), undefined);
});
