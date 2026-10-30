import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  generateRecentChanges,
  isPublicDocumentPath,
} from '../scripts/generate-wiki-recent-changes';

function git(repoRoot: string, ...args: string[]): string {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim();
}

async function put(
  repoRoot: string,
  relativePath: string,
  source: string,
): Promise<void> {
  const absolutePath = path.join(repoRoot, relativePath);
  await mkdir(path.dirname(absolutePath), {recursive: true});
  await writeFile(absolutePath, source, 'utf8');
}

function commit(repoRoot: string, message: string): string {
  git(repoRoot, 'add', '--all');
  git(repoRoot, 'commit', '-m', message);
  return git(repoRoot, 'rev-parse', 'HEAD');
}

function page(title: string, slug?: string): string {
  return `---
title: "${title}"
${slug ? `slug: "${slug}"\n` : ''}---

${Array.from({length: 30}, (_, index) => `Stable content ${index}.`).join('\n')}
`;
}

async function createFixtureRepository(): Promise<{
  repoRoot: string;
  baseline: string;
}> {
  const repoRoot = await mkdtemp(
    path.join(os.tmpdir(), 'lumina-wiki-recent-changes-'),
  );
  git(repoRoot, 'init', '--initial-branch=main');
  git(repoRoot, 'config', 'user.name', 'Fixture Author');
  git(repoRoot, 'config', 'user.email', 'fixture@example.com');

  await put(repoRoot, 'README.md', '# Fixture\n');
  const baseline = commit(repoRoot, 'baseline');

  await put(
    repoRoot,
    'docs/guide/sample/sample.mdx',
    page('示例页面', '/guide/sample'),
  );
  await put(
    repoRoot,
    'i18n/en/docusaurus-plugin-content-docs/current/guide/sample/sample.mdx',
    page('Sample page', '/guide/sample'),
  );
  await put(
    repoRoot,
    'docs/guide/chinese-only/chinese-only.mdx',
    page('仅中文页面', '/guide/chinese-only'),
  );
  commit(repoRoot, 'private subject that must never be published');

  await put(
    repoRoot,
    'docs/guide/sample/assets/example.png',
    'fixture image bytes',
  );
  await put(repoRoot, '.github/internal-server.md', '10.0.0.1 /Volumes/NAS');
  commit(repoRoot, 'update colocated asset and internal operations');

  await mkdir(path.join(repoRoot, 'docs/guide/renamed'), {recursive: true});
  await rename(
    path.join(repoRoot, 'docs/guide/sample/sample.mdx'),
    path.join(repoRoot, 'docs/guide/renamed/renamed.mdx'),
  );
  await rename(
    path.join(repoRoot, 'docs/guide/sample/assets'),
    path.join(repoRoot, 'docs/guide/renamed/assets'),
  );
  await mkdir(
    path.join(
      repoRoot,
      'i18n/en/docusaurus-plugin-content-docs/current/guide/renamed',
    ),
    {recursive: true},
  );
  await rename(
    path.join(
      repoRoot,
      'i18n/en/docusaurus-plugin-content-docs/current/guide/sample/sample.mdx',
    ),
    path.join(
      repoRoot,
      'i18n/en/docusaurus-plugin-content-docs/current/guide/renamed/renamed.mdx',
    ),
  );
  await put(
    repoRoot,
    'docs/guide/renamed/renamed.mdx',
    page('已移动页面', '/guide/renamed'),
  );
  await put(
    repoRoot,
    'i18n/en/docusaurus-plugin-content-docs/current/guide/renamed/renamed.mdx',
    page('Moved page', '/guide/renamed'),
  );
  commit(repoRoot, 'move bilingual page');

  await rm(path.join(repoRoot, 'docs/guide/renamed'), {recursive: true});
  await rm(
    path.join(
      repoRoot,
      'i18n/en/docusaurus-plugin-content-docs/current/guide/renamed',
    ),
    {recursive: true},
  );
  commit(repoRoot, 'remove bilingual page');

  return {repoRoot, baseline};
}

test('recognizes only public Wiki document paths', () => {
  assert.equal(isPublicDocumentPath('docs/guide/page/page.mdx'), true);
  assert.equal(
    isPublicDocumentPath(
      'i18n/en/docusaurus-plugin-content-docs/current/guide/page/page.md',
    ),
    true,
  );
  assert.equal(isPublicDocumentPath('updates/editorial.md'), false);
  assert.equal(isPublicDocumentPath('.github/internal-server.md'), false);
  assert.equal(isPublicDocumentPath('tests/wiki.test.ts'), false);
  assert.equal(isPublicDocumentPath('docs/guide/uppercase.MD'), false);
  assert.equal(isPublicDocumentPath('docs/guide/uppercase.MDX'), false);
});

test('generates grouped bilingual recent changes from real Git history', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const outputFile = path.join(repoRoot, 'src/generated/wikiRecentChanges.ts');

  const entries = generateRecentChanges({
    repoRoot,
    baseline,
    outputFile,
  });

  assert.equal(entries.length, 4);
  assert.deepEqual(
    entries.map((entry) => entry.pages.map((pageChange) => pageChange.action)),
    [['removed'], ['moved'], ['updated'], ['added', 'added']],
  );

  assert.deepEqual(entries[0].pages[0], {
    action: 'removed',
    zh: {title: '已不可用的文档'},
    en: {title: 'Unavailable document'},
  });
  assert.deepEqual(entries[1].pages[0], {
    action: 'moved',
    zh: {title: '已不可用的文档'},
    en: {title: 'Unavailable document'},
  });
  assert.deepEqual(entries[2].pages[0], {
    action: 'updated',
    zh: {title: '已不可用的文档'},
    en: {title: 'Unavailable document'},
  });
  assert.deepEqual(entries[3].pages[1], {
    action: 'added',
    zh: {
      title: '仅中文页面',
      url: '/zh/docs/guide/chinese-only/',
    },
  });

  const generatedSource = await readFile(outputFile, 'utf8');
  assert.match(generatedSource, /export default wikiRecentChanges/);
  assert.doesNotMatch(
    generatedSource,
    /Fixture Author|fixture@example\.com|private subject|internal-server|10\.0\.0\.1|Volumes\/NAS/,
  );
});

test('includes new and revised bilingual pages without a custom slug', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const zhPath =
    'docs/getting-started/launcher-activation/launcher-activation.mdx';
  const enPath =
    'i18n/en/docusaurus-plugin-content-docs/current/getting-started/launcher-activation/launcher-activation.mdx';
  await put(repoRoot, zhPath, page('启动器激活'));
  await put(repoRoot, enPath, page('Launcher activation'));
  commit(repoRoot, 'add default-route page');
  await put(repoRoot, zhPath, `${page('启动器激活')}\n补充说明。\n`);
  commit(repoRoot, 'revise Chinese page');
  await put(
    repoRoot,
    'docs/getting-started/launcher-activation/assets/step.webp',
    'image',
  );
  commit(repoRoot, 'revise page image');

  const entries = generateRecentChanges({repoRoot, baseline});
  const matching = entries
    .flatMap((entry) => entry.pages)
    .filter((item) => item.zh?.title === '启动器激活');
  assert.deepEqual(matching.map((item) => item.action), ['updated', 'updated', 'added']);
  for (const item of matching) {
    assert.deepEqual(item.zh, {
      title: '启动器激活',
      url: '/zh/docs/getting-started/launcher-activation/',
    });
    assert.deepEqual(item.en, {
      title: 'Launcher activation',
      url: '/en/docs/getting-started/launcher-activation/',
    });
  }
});

test('uses default Docusaurus routes for ordinary, index and numbered documents', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  await put(repoRoot, 'docs/guide/simple.md', page('普通文档'));
  await put(repoRoot, 'docs/guide/index.mdx', page('目录首页'));
  await put(repoRoot, 'docs/02-basics/01-start.mdx', page('编号文档'));
  await put(
    repoRoot,
    'docs/03-advanced/01-retained.mdx',
    '---\ntitle: 保留编号\nparse_number_prefixes: "false"\n---\n',
  );
  commit(repoRoot, 'add default-route variants');

  const pages = generateRecentChanges({repoRoot, baseline})[0].pages;
  assert.deepEqual(
    pages.map((item) => item.zh?.url).sort(),
    [
      '/zh/docs/basics/start/',
      '/zh/docs/guide/',
      '/zh/docs/guide/simple/',
      '/zh/docs/03-advanced/01-retained/',
    ].sort(),
  );
});

test('infers titles but excludes draft, unlisted and partial documents', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  await put(repoRoot, 'docs/guide/no-frontmatter.md', '# 自动标题\n\n正文。\n');
  await put(repoRoot, 'docs/guide/draft.md', '---\ntitle: Draft\ndraft: "true"\n---\n');
  await put(
    repoRoot,
    'docs/guide/unlisted.md',
    '---\ntitle: Unlisted\nunlisted: "true"\n---\n',
  );
  await put(repoRoot, 'docs/guide/_partial.md', '# Partial\n');
  await put(repoRoot, 'docs/isolated/_partial.md', '# Isolated partial\n');
  await put(repoRoot, 'docs/_hidden/secret.md', '# Hidden partial\n');
  commit(repoRoot, 'add visible and non-public documents');

  const pages = generateRecentChanges({repoRoot, baseline})[0].pages;
  assert.deepEqual(pages, [
    {action: 'added', zh: {title: '自动标题', url: '/zh/docs/guide/no-frontmatter/'}},
  ]);
});

test('groups translations by document identity when localized slugs differ', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const zhPath = 'docs/guide/localized/localized.mdx';
  const enPath =
    'i18n/en/docusaurus-plugin-content-docs/current/guide/localized/localized.mdx';
  await put(repoRoot, zhPath, page('中文页面'));
  await put(repoRoot, enPath, page('English page', '/translated-page'));
  commit(repoRoot, 'add localized page');

  const pages = generateRecentChanges({repoRoot, baseline})[0].pages;
  assert.deepEqual(pages, [{
    action: 'added',
    zh: {title: '中文页面', url: '/zh/docs/guide/localized/'},
    en: {title: 'English page', url: '/en/docs/translated-page/'},
  }]);
});

test('preserves bilingual grouping when legacy document IDs differ but slugs match', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  await put(repoRoot, 'docs/guide/legacy.mdx', '---\ntitle: 中文旧页\nid: zh-legacy\nslug: /shared\n---\n');
  await put(
    repoRoot,
    'i18n/en/docusaurus-plugin-content-docs/current/guide/legacy.mdx',
    '---\ntitle: English legacy\nid: en-legacy\nslug: /shared\n---\n',
  );
  commit(repoRoot, 'add legacy translations');
  const pages = generateRecentChanges({repoRoot, baseline})[0].pages;
  assert.deepEqual(pages, [{
    action: 'added',
    zh: {title: '中文旧页', url: '/zh/docs/shared/'},
    en: {title: 'English legacy', url: '/en/docs/shared/'},
  }]);
});

test('matches translations by source path when IDs and slugs both differ', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const zhPath = 'docs/guide/path-matched.mdx';
  const enPath = 'i18n/en/docusaurus-plugin-content-docs/current/guide/path-matched.mdx';
  const zhSource = '---\ntitle: 中文原文\nid: chinese-id\nslug: /chinese-route\n---\n';
  await put(repoRoot, zhPath, zhSource);
  await put(repoRoot, enPath, '---\ntitle: English translation\nid: english-id\nslug: /english-route\n---\n');
  commit(repoRoot, 'add both translations');
  await put(repoRoot, zhPath, `${zhSource}\n补充说明。\n`);
  commit(repoRoot, 'update Chinese translation');

  const entries = generateRecentChanges({repoRoot, baseline});
  for (const entry of entries.slice(0, 2)) {
    assert.deepEqual(entry.pages, [{
      action: entry === entries[0] ? 'updated' : 'added',
      zh: {title: '中文原文', url: '/zh/docs/chinese-route/'},
      en: {title: 'English translation', url: '/en/docs/english-route/'},
    }]);
  }
});

test('tracks localized pages and assets in non-ASCII directories', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  await put(repoRoot, 'docs/指南/颜色/颜色.mdx', page('颜色指南'));
  await put(
    repoRoot,
    'i18n/en/docusaurus-plugin-content-docs/current/指南/颜色/颜色.mdx',
    page('Color guide'),
  );
  commit(repoRoot, 'add localized page');
  await put(repoRoot, 'docs/指南/颜色/assets/示例.png', 'image');
  commit(repoRoot, 'update page image');

  const pages = generateRecentChanges({repoRoot, baseline})[0].pages;
  assert.deepEqual(pages, [{
    action: 'updated',
    zh: {title: '颜色指南', url: '/zh/docs/指南/颜色/'},
    en: {title: 'Color guide', url: '/en/docs/指南/颜色/'},
  }]);
});

test('points earlier changes to a document’s current route', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const file = 'docs/guide/renamed-route/renamed-route.mdx';
  await put(repoRoot, file, page('改地址的页面', '/old-route'));
  commit(repoRoot, 'add old route');
  await put(repoRoot, file, page('改地址的页面', '/new-route'));
  commit(repoRoot, 'change route');

  const matches = generateRecentChanges({repoRoot, baseline})
    .flatMap((entry) => entry.pages)
    .filter((item) => item.zh?.title === '改地址的页面');
  assert.equal(matches.length, 2);
  for (const item of matches) assert.equal(item.zh?.url, '/zh/docs/new-route/');
});

test('does not fail a current build on malformed historical front matter', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const file = 'docs/guide/recovered/recovered.mdx';
  await put(repoRoot, file, '---\ntitle: [broken\n---\n');
  commit(repoRoot, 'old malformed document');
  await put(repoRoot, file, page('已修复页面'));
  commit(repoRoot, 'fix document');

  const pages = generateRecentChanges({repoRoot, baseline}).flatMap((entry) => entry.pages);
  assert.ok(pages.some((item) => item.zh?.title === '已修复页面'));
});

test('does not print invalid historical front matter into build logs', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const file = 'docs/guide/log-safety.md';
  await put(repoRoot, file, '---\ntitle: HIDDEN-TEST-TITLE\nid: true\nunlisted: true\n---\n');
  commit(repoRoot, 'invalid hidden metadata');
  await put(repoRoot, file, page('已修复的页面'));
  commit(repoRoot, 'fix metadata');

  const result = spawnSync(process.execPath, [
    '--import', path.resolve('node_modules/tsx/dist/loader.mjs'),
    path.resolve('scripts/generate-wiki-recent-changes.ts'),
  ], {cwd: repoRoot, encoding: 'utf8', env: {...process.env, WIKI_RECENT_CHANGES_BASELINE: baseline}});
  assert.equal(result.status, 0);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /HIDDEN-TEST-TITLE/);
});

test('does not expose a page in older entries after it becomes unlisted', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const file = 'docs/guide/no-longer-listed.md';
  await put(repoRoot, file, page('不再公开列出的页面'));
  commit(repoRoot, 'add public page');
  await put(repoRoot, file, '---\ntitle: 不再公开列出的页面\nunlisted: true\n---\n');
  commit(repoRoot, 'unlist page');

  const entries = generateRecentChanges({repoRoot, baseline});
  assert.equal(
    entries.flatMap((entry) => entry.pages)
      .some((item) => item.zh?.title === '不再公开列出的页面'),
    false,
  );
});

test('does not expose an unlisted page under its previous filename', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const oldPath = 'docs/guide/old-name.mdx';
  const newPath = 'docs/guide/new-name.mdx';
  await put(repoRoot, oldPath, page('不应显示的旧标题'));
  commit(repoRoot, 'add public page');
  await rename(path.join(repoRoot, oldPath), path.join(repoRoot, newPath));
  await put(repoRoot, newPath, page('不应显示的旧标题').replace('---\n\n', 'unlisted: true\n---\n\n'));
  commit(repoRoot, 'move and unlist page');

  const entries = generateRecentChanges({repoRoot, baseline});
  assert.equal(entries.flatMap((entry) => entry.pages)
    .some((item) => item.zh?.title === '不应显示的旧标题'), false);
});

test('does not expose an old title when a renamed unlisted page is rewritten', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const oldPath = 'docs/guide/before-rewrite.mdx';
  const newPath = 'docs/guide/after-rewrite.mdx';
  await put(repoRoot, oldPath, page('不可追踪的旧标题'));
  commit(repoRoot, 'add public page');
  await rm(path.join(repoRoot, oldPath));
  await put(repoRoot, newPath, '---\ntitle: 新标题\nunlisted: true\n---\n\n全新内容。\n');
  commit(repoRoot, 'rewrite and unlist page');

  const entries = generateRecentChanges({repoRoot, baseline});
  assert.equal(entries.flatMap((entry) => entry.pages)
    .some((item) => item.zh?.title === '不可追踪的旧标题'), false);
});

test('does not confuse a hidden page with a new page that reuses its ID', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const oldPath = 'docs/guide/old-identity.md';
  await put(repoRoot, oldPath, '---\ntitle: 不应公开的旧标题\nid: reused\n---\n');
  commit(repoRoot, 'add original page');
  await rm(path.join(repoRoot, oldPath));
  await put(repoRoot, 'docs/elsewhere/hidden.md', '---\ntitle: 隐藏页面\nid: reused\nunlisted: true\n---\n');
  await put(repoRoot, 'docs/guide/replacement.md', '---\ntitle: 新页面\nid: reused\n---\n');
  commit(repoRoot, 'hide original and create replacement');

  const previous = generateRecentChanges({repoRoot, baseline})[1].pages;
  assert.equal(previous.some((item) => item.zh?.title === '不应公开的旧标题'), false);
  assert.equal(previous.some((item) => item.zh?.url === '/zh/docs/guide/reused/'), false);
});

test('uses the current public title and route for earlier revisions', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  const file = 'docs/guide/updated-identity.md';
  await put(repoRoot, file, '---\ntitle: 旧标题\nid: old-id\nslug: /same-route\n---\n');
  commit(repoRoot, 'add old identity');
  await put(repoRoot, file, '---\ntitle: 新标题\nid: new-id\nslug: /same-route\n---\n');
  commit(repoRoot, 'update title and ID');

  const entries = generateRecentChanges({repoRoot, baseline});
  for (const entry of entries.slice(0, 2)) {
    assert.deepEqual(entry.pages[0].zh, {title: '新标题', url: '/zh/docs/same-route/'});
  }
});

test('recovers the required public history in a shallow deployment clone', async (t) => {
  const source = await createFixtureRepository();
  const cloneParent = await mkdtemp(
    path.join(os.tmpdir(), 'lumina-wiki-shallow-parent-'),
  );
  const shallowRepo = path.join(cloneParent, 'wiki');
  git(
    cloneParent,
    'clone',
    '--quiet',
    '--depth',
    '1',
    '--branch',
    'main',
    `file://${source.repoRoot}`,
    shallowRepo,
  );
  t.after(() =>
    Promise.all([
      rm(source.repoRoot, {recursive: true, force: true}),
      rm(cloneParent, {recursive: true, force: true}),
    ]),
  );

  assert.throws(
    () => git(shallowRepo, 'cat-file', '-e', `${source.baseline}^{commit}`),
  );

  const entries = generateRecentChanges({
    repoRoot: shallowRepo,
    baseline: source.baseline,
  });

  assert.equal(entries.length, 4);
  assert.doesNotThrow(() =>
    git(shallowRepo, 'cat-file', '-e', `${source.baseline}^{commit}`),
  );
});

test('fails clearly when the configured history baseline is unavailable', async (t) => {
  const {repoRoot} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));

  assert.throws(
    () =>
      generateRecentChanges({
        repoRoot,
        baseline: '0000000000000000000000000000000000000000',
      }),
    /recent changes baseline.+unavailable/i,
  );
});

test('regenerates recent changes inside every Yarn entry command', async () => {
  const packageJson = JSON.parse(
    await readFile('package.json', 'utf8'),
  ) as {scripts: Record<string, string>};
  const gitignore = await readFile('.gitignore', 'utf8');
  const workflow = await readFile('.github/workflows/validate.yml', 'utf8');

  assert.match(
    packageJson.scripts['generate:wiki-updates'] ?? '',
    /generate-wiki-recent-changes/,
  );
  for (const lifecycle of ['start', 'build', 'typecheck']) {
    assert.match(
      packageJson.scripts[lifecycle] ?? '',
      /^tsx scripts\/generate-wiki-recent-changes\.ts && /,
      lifecycle,
    );
  }
  assert.match(gitignore, /src\/generated\/wikiRecentChanges\.ts/);
  assert.match(workflow, /fetch-depth:\s*0/);
});
