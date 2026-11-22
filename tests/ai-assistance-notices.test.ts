import assert from 'node:assert/strict';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const localeRoots = {
  zh: 'docs',
  en: 'i18n/en/docusaurus-plugin-content-docs/current',
} as const;

async function listDocFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, {withFileTypes: true});
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(root, entry.name);
      if (entry.isDirectory()) return listDocFiles(fullPath);
      return entry.isFile() && /\.(?:md|mdx)$/i.test(entry.name)
        ? [fullPath]
        : [];
    }),
  );
  return files.flat();
}

test('keeps control reference pages paired across locales', async () => {
  const roots = Object.values(localeRoots).map((root) =>
    path.join(root, 'reference'),
  );
  const [zh, en] = await Promise.all(
    roots.map(async (root) =>
      (await listDocFiles(root))
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => path.relative(root, file))
        .sort(),
    ),
  );
  assert.deepEqual(
    en,
    zh,
    'reference pages must have both Chinese and English versions',
  );
});

test('does not include AI-assistance or machine-translation disclaimers in public docs', async () => {
  const allDocs = [
    ...(await listDocFiles(localeRoots.zh)),
    ...(await listDocFiles(localeRoots.en)),
  ];

  assert.ok(allDocs.length > 0, 'expected public documentation files');

  for (const file of allDocs) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(
      source,
      /:::info\[(AI 辅助编写说明|AI-assisted article|AI-Assisted Documentation Note)\]/i,
      file,
    );
    assert.doesNotMatch(
      source,
      /:::\w+\[Translation notice\]|\*\*AI translation notice:\*\*/i,
      file,
    );
  }
});
