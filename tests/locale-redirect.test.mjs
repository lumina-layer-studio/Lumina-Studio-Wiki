import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';


const loadLocale = async () => {
  try {
    return await import('../functions/locale.mjs');
  } catch {
    return null;
  }
};

const loadHandler = async () => {
  try {
    return await import('../functions/index.js');
  } catch {
    return null;
  }
};


test('selectLocale chooses Chinese for Chinese language preferences', async () => {
  const locale = await loadLocale();
  assert.ok(locale, 'locale selector must exist');
  for (const header of [
    'zh',
    'zh-CN',
    'zh-TW,zh;q=0.9,en;q=0.8',
    'EN;q=0.5, ZH-hans;q=0.9',
  ]) {
    assert.equal(locale.selectLocale(header), 'zh', header);
  }
});

test('selectLocale chooses English when Chinese is absent or not accepted', async () => {
  const locale = await loadLocale();
  assert.ok(locale, 'locale selector must exist');
  for (const header of [
    null,
    '',
    'en-US,en;q=0.9',
    'fr-FR,fr;q=0.9',
    'zh-CN;q=0,en;q=1',
  ]) {
    assert.equal(locale.selectLocale(header), 'en', String(header));
  }
});

test('root handler redirects without sharing a cached language decision', async () => {
  const handler = await loadHandler();
  assert.ok(handler, 'root Pages Function must exist');
  const response = await handler.onRequestGet({
    request: new Request('https://wiki.example/', {
      headers: {'Accept-Language': 'zh-CN,zh;q=0.9'},
    }),
  });

  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), 'https://wiki.example/zh/');
  assert.equal(response.headers.get('Vary'), 'Accept-Language');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
});

test('Pages Functions are invoked only for the site root', async () => {
  let routes = null;
  try {
    routes = JSON.parse(await readFile(new URL('../static/_routes.json', import.meta.url), 'utf8'));
  } catch {
    // The assertion below produces a useful test failure for a missing file.
  }

  assert.deepEqual(routes, {version: 1, include: ['/'], exclude: []});
});
