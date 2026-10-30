import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
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
    zh: {title: '已移动页面'},
    en: {title: 'Moved page'},
  });
  assert.deepEqual(entries[1].pages[0], {
    action: 'moved',
    zh: {title: '已移动页面', url: '/zh/docs/guide/renamed/'},
    en: {title: 'Moved page', url: '/en/docs/guide/renamed/'},
  });
  assert.deepEqual(entries[2].pages[0], {
    action: 'updated',
    zh: {title: '示例页面', url: '/zh/docs/guide/sample/'},
    en: {title: 'Sample page', url: '/en/docs/guide/sample/'},
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
  commit(repoRoot, 'add default-route variants');

  const pages = generateRecentChanges({repoRoot, baseline})[0].pages;
  assert.deepEqual(
    pages.map((item) => item.zh?.url).sort(),
    ['/zh/docs/basics/start/', '/zh/docs/guide/', '/zh/docs/guide/simple/'].sort(),
  );
});

test('infers titles but excludes draft, unlisted and partial documents', async (t) => {
  const {repoRoot, baseline} = await createFixtureRepository();
  t.after(() => rm(repoRoot, {recursive: true, force: true}));
  await put(repoRoot, 'docs/guide/no-frontmatter.md', '# 自动标题\n\n正文。\n');
  await put(repoRoot, 'docs/guide/draft.md', '---\ntitle: Draft\ndraft: true\n---\n');
  await put(
    repoRoot,
    'docs/guide/unlisted.md',
    '---\ntitle: Unlisted\nunlisted: true\n---\n',
  );
  await put(repoRoot, 'docs/guide/_partial.md', '# Partial\n');
  commit(repoRoot, 'add visible and non-public documents');

  const pages = generateRecentChanges({repoRoot, baseline})[0].pages;
  assert.deepEqual(pages, [
    {action: 'added', zh: {title: '自动标题', url: '/zh/docs/guide/no-frontmatter/'}},
  ]);
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
