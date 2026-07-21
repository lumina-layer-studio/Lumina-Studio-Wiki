import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';


const loadModule = async () => {
  try {
    return await import('../scripts/write-pages-control-files.mjs');
  } catch {
    return null;
  }
};


test('redirect manifest leaves root routing to the edge function', async () => {
  const controls = await loadModule();
  assert.ok(controls, 'Pages control-file writer must exist');

  const redirects = controls.buildRedirects({
    locales: {zh: ['/', '/入门'], en: ['/', '/start']},
  });

  assert.ok(!redirects.includes('/ /zh/ 302'));
  assert.ok(redirects.includes('/zh /zh/ 301'));
  assert.ok(redirects.includes('/en /en/ 301'));
  assert.ok(redirects.includes('/zh/入门 /zh/docs/入门/ 301'));
  assert.ok(redirects.includes('/en/start /en/docs/start/ 301'));
});

test('writer places Cloudflare control files at the build root', async () => {
  const controls = await loadModule();
  assert.ok(controls, 'Pages control-file writer must exist');
  const root = await mkdtemp(join(tmpdir(), 'lumina-pages-controls-'));
  test.after(async () => rm(root, {recursive: true, force: true}));
  await mkdir(join(root, 'static'), {recursive: true});
  await writeFile(join(root, 'static', '_headers'), 'headers\n', 'utf8');
  await writeFile(
    join(root, 'static', '_routes.json'),
    '{"version":1,"include":["/"],"exclude":[]}\n',
    'utf8',
  );
  await writeFile(
    join(root, 'routes.json'),
    JSON.stringify({locales: {zh: ['/'], en: ['/']}}),
    'utf8',
  );

  await controls.writeControlFiles({
    root,
    buildDirectory: join(root, 'build'),
    routeManifestPath: join(root, 'routes.json'),
  });

  assert.equal(await readFile(join(root, 'build', '_headers'), 'utf8'), 'headers\n');
  assert.deepEqual(
    JSON.parse(await readFile(join(root, 'build', '_routes.json'), 'utf8')),
    {version: 1, include: ['/'], exclude: []},
  );
  assert.equal(
    await readFile(join(root, 'build', '_redirects'), 'utf8'),
    '/zh /zh/ 301\n/en /en/ 301\n',
  );
});


test('published HTML has a reusable cache policy', async () => {
  const headers = await readFile(
    new URL('../static/_headers', import.meta.url),
    'utf8',
  );

  for (const route of ['/zh/', '/zh/docs/*', '/en/', '/en/docs/*']) {
    assert.match(
      headers,
      new RegExp(
        `${route.replaceAll('/', '\\\/').replace('*', '\\*')}\\n` +
          '  Cache-Control: public, max-age=43200',
      ),
      route,
    );
  }
});
