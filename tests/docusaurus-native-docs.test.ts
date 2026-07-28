import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import config from '../docusaurus.config';
import sidebars from '../sidebars';

const repoRoot = path.resolve(import.meta.dirname, '..');
const chineseDocsRoot = path.join(repoRoot, 'docs');
const englishDocsRoot = path.join(
  repoRoot,
  'i18n/en/docusaurus-plugin-content-docs/current',
);
const localizedBlogRoots = [
  path.join(repoRoot, 'updates'),
  path.join(repoRoot, 'i18n/en/docusaurus-plugin-content-blog'),
];

function documentPaths(root: string): string[] {
  return readdirSync(root, {recursive: true, withFileTypes: true})
    .filter(
      (entry) =>
        entry.isFile() && /\.(?:md|mdx)$/i.test(entry.name),
    )
    .map((entry) =>
      path
        .relative(root, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join('/'),
    )
    .sort();
}

function frontMatter(source: string): string {
  return source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
}

test('uses filesystem-derived document IDs and routes in both locales', () => {
  const chinesePaths = documentPaths(chineseDocsRoot);
  const englishPaths = documentPaths(englishDocsRoot);

  assert.deepEqual(englishPaths, chinesePaths);

  for (const relativePath of chinesePaths) {
    for (const root of [chineseDocsRoot, englishDocsRoot]) {
      const metadata = frontMatter(
        readFileSync(path.join(root, relativePath), 'utf8'),
      );
      assert.doesNotMatch(
        metadata,
        /^(?:id|slug|wikijs_[A-Za-z0-9_-]+):/m,
        `${path.relative(repoRoot, path.join(root, relativePath))} still overrides native Docusaurus metadata`,
      );
    }
  }

  for (const blogRoot of localizedBlogRoots) {
    for (const relativePath of documentPaths(blogRoot)) {
      const metadata = frontMatter(
        readFileSync(path.join(blogRoot, relativePath), 'utf8'),
      );
      assert.doesNotMatch(
        metadata,
        /^(?:id|slug|wikijs_[A-Za-z0-9_-]+):/m,
        `${path.relative(repoRoot, path.join(blogRoot, relativePath))} still overrides native Docusaurus metadata`,
      );
    }
  }
});

test('uses Markdown directive labels for custom admonition titles', () => {
  const invalid: string[] = [];
  const formattedLabels: string[] = [];

  for (const root of [chineseDocsRoot, englishDocsRoot]) {
    for (const relativePath of documentPaths(root)) {
      const source = readFileSync(path.join(root, relativePath), 'utf8');
      source.split(/\r?\n/).forEach((line, index) => {
        if (
          /^:::(?:note|tip|info|warning|danger|caution|success|important)\s+.+$/.test(
            line,
          ) &&
          !/^:::[a-z]+\[.+\]$/.test(line)
        ) {
          invalid.push(
            `${path.relative(repoRoot, path.join(root, relativePath))}:${index + 1}`,
          );
        }
        if (
          /^:::[a-z]+\[[^\]]*(?:\*\*|`|<|>)[^\]]*\]$/.test(line)
        ) {
          formattedLabels.push(
            `${path.relative(repoRoot, path.join(root, relativePath))}:${index + 1}`,
          );
        }
      });
    }
  }

  assert.deepEqual(invalid, []);
  assert.deepEqual(formattedLabels, []);
});

test('separates primary docs, releases, and feedback into native sidebars', () => {
  assert.deepEqual(Object.keys(sidebars), [
    'docsSidebar',
    'releasesSidebar',
    'feedbackSidebar',
  ]);

  const themeConfig = config.themeConfig as
    | {
        navbar?: {items?: Array<{type?: string; sidebarId?: string}>};
        docs?: unknown;
      }
    | undefined;
  const navbarItems = themeConfig?.navbar?.items ?? [];
  assert.ok(
    navbarItems.some(
      (item) =>
        typeof item === 'object' &&
        item.type === 'docSidebar' &&
        item.sidebarId === 'releasesSidebar',
    ),
  );
  assert.ok(
    navbarItems.some(
      (item) =>
        typeof item === 'object' &&
        item.type === 'docSidebar' &&
        item.sidebarId === 'feedbackSidebar',
    ),
  );
  assert.equal(themeConfig?.docs, undefined);
});
