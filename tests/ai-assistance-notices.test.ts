import assert from 'node:assert/strict';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const knowledgeSlugs = [
  'base-color-layer-height',
  'batch-generate',
  'bitmap-to-svg',
  'bitmap-vs-vector',
  'color-count-free-color-object-slot',
  'color-workstation-basics',
  'feature-compatibility',
  'filament-selection-and-storage',
  'image-mode-selection',
  'image-upload-crop-rotate',
  'large-format',
  'layer-preview-guide',
  'material-library-management',
  'material-profile-selection',
  'material-recipe-query',
  'nozzle-equivalent-resolution',
  'preview-slicer-print-differences',
  'share-card-json',
  'slicer-path-and-open-troubleshooting',
  'svg-troubleshooting',
  'web-generation-troubleshooting',
] as const;

const markers = {
  zh: ':::info[AI 辅助编写说明]',
  en: ':::info[AI-assisted article]',
} as const;

const localeRoots = {
  zh: 'docs',
  en: 'i18n/en/docusaurus-plugin-content-docs/current',
} as const;

async function listMdxFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, {withFileTypes: true});
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(root, entry.name);
      if (entry.isDirectory()) return listMdxFiles(fullPath);
      return entry.isFile() && entry.name.endsWith('.mdx') ? [fullPath] : [];
    }),
  );
  return files.flat();
}

function occurrences(source: string, marker: string): number {
  return source.split(marker).length - 1;
}

test('marks the approved AI-assisted articles exactly once', async () => {
  for (const [locale, root] of Object.entries(localeRoots) as Array<
    [keyof typeof localeRoots, string]
  >) {
    const referenceFiles = await listMdxFiles(path.join(root, 'reference'));
    const knowledgeFiles = knowledgeSlugs.map((slug) =>
      path.join(root, 'knowledge', slug, `${slug}.mdx`),
    );
    const targets = [...referenceFiles, ...knowledgeFiles];

    assert.equal(referenceFiles.length, 69);
    assert.equal(targets.length, 90);

    for (const file of targets) {
      const source = await readFile(file, 'utf8');
      const frontMatter = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);

      assert.ok(frontMatter, file);
      assert.equal(occurrences(source, markers[locale]), 1, file);
      assert.ok(
        source.slice(frontMatter[0].length).trimStart().startsWith(markers[locale]),
        file,
      );
      assert.doesNotMatch(source, /:::note\[Translation notice\]/, file);
      assert.doesNotMatch(source, /<iframe|<video/i, file);
    }
  }
});

test('does not mark embedded-video or older human-authored pages', async () => {
  const allMdx = [
    ...(await listMdxFiles(localeRoots.zh)),
    ...(await listMdxFiles(localeRoots.en)),
  ];

  for (const file of allMdx) {
    const source = await readFile(file, 'utf8');
    if (/<iframe|<video/i.test(source)) {
      assert.doesNotMatch(
        source,
        /:::info\[(AI 辅助编写说明|AI-assisted article)\]/,
      );
    }
  }

  for (const locale of Object.keys(localeRoots) as Array<
    keyof typeof localeRoots
  >) {
    for (const slug of ['color-chart-calibration', 'filament-selection']) {
      const file = path.join(
        localeRoots[locale],
        'knowledge',
        slug,
        `${slug}.mdx`,
      );
      const source = await readFile(file, 'utf8');
      assert.doesNotMatch(
        source,
        /:::info\[(AI 辅助编写说明|AI-assisted article)\]/,
      );
    }
  }
});
