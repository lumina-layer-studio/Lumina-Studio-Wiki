# AI Assistance Notices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one localized AI-assistance disclosure to each of the 180 approved text-article files while leaving video and older human-authored pages unmarked.

**Architecture:** Use Docusaurus's native `:::info` admonition directly in MDX, immediately after front matter. A focused Node test owns the approved knowledge-page allowlist, includes every reference page, checks the two locale trees, and rejects notices on embedded-video pages.

**Tech Stack:** Docusaurus 3 MDX, TypeScript, Node test runner, Yarn 4

---

### Task 1: Add the disclosure coverage test

**Files:**
- Create: `tests/ai-assistance-notices.test.ts`

- [ ] **Step 1: Write the failing coverage test**

Create `tests/ai-assistance-notices.test.ts` with:

```ts
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
  zh: ':::info AI 辅助编写说明',
  en: ':::info AI-assisted article',
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
      assert.equal(occurrences(source, markers[locale]), 1, file);
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
      assert.doesNotMatch(source, /:::info (AI 辅助编写说明|AI-assisted article)/);
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
      assert.doesNotMatch(source, /:::info (AI 辅助编写说明|AI-assisted article)/);
    }
  }
});
```

- [ ] **Step 2: Run the test and verify the red state**

Run:

```bash
node node_modules/tsx/dist/cli.mjs --test tests/ai-assistance-notices.test.ts
```

Expected: the first test fails because the selected pages do not yet contain the standardized admonitions.

### Task 2: Insert the standardized notices

**Files:**
- Create temporarily: `.scratch/add-ai-assistance-notices.mjs`
- Modify: all 69 `docs/reference/**/*.mdx` files
- Modify: the 21 approved `docs/knowledge/<slug>/<slug>.mdx` files
- Modify: the matching 90 English files under `i18n/en/docusaurus-plugin-content-docs/current/`

- [ ] **Step 1: Create the mechanical rewrite script**

Create `.scratch/add-ai-assistance-notices.mjs` with:

```js
import {readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

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
];

const localeRoots = {
  zh: 'docs',
  en: 'i18n/en/docusaurus-plugin-content-docs/current',
};

const notices = {
  zh: `:::info AI 辅助编写说明

本文由 AI 在分析 Lumina Studio 当前源码、现有 Wiki 内容及相关操作流程后协助撰写，并已按当前版本进行基础核对。由于软件仍在持续更新，内容可能存在疏漏或与后续版本不一致。如发现不准确之处，或有更清晰的解释、案例与建议，欢迎在本页评论区反馈，或通过 GitHub 提交修订。

:::`,
  en: `:::info AI-assisted article

This article was prepared with AI assistance based on an analysis of the current Lumina Studio source code, existing Wiki content, and relevant workflows. It has been checked against the current version, but omissions or details that become outdated may remain as the software evolves. If you find an error or have a clearer explanation, example, or suggestion, please leave a comment on this page or propose an edit on GitHub.

:::`,
};

async function listMdxFiles(root) {
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

function removePreviousNotice(body) {
  return body
    .replace(
      /:::note\[Translation notice\]\r?\n[\s\S]*?\r?\n:::\r?\n*/g,
      '',
    )
    .replace(
      /:::info (?:AI 辅助编写说明|AI-assisted article)\r?\n[\s\S]*?\r?\n:::\r?\n*/g,
      '',
    )
    .replace(/^\r?\n+/, '');
}

for (const [locale, root] of Object.entries(localeRoots)) {
  const targets = [
    ...(await listMdxFiles(path.join(root, 'reference'))),
    ...knowledgeSlugs.map((slug) =>
      path.join(root, 'knowledge', slug, `${slug}.mdx`),
    ),
  ].sort();

  if (targets.length !== 90) {
    throw new Error(`${locale}: expected 90 targets, found ${targets.length}`);
  }

  for (const file of targets) {
    const source = await readFile(file, 'utf8');
    if (/<iframe|<video/i.test(source)) {
      throw new Error(`${file}: video pages must not receive the notice`);
    }

    const frontMatter = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
    if (!frontMatter) throw new Error(`${file}: front matter not found`);

    const body = removePreviousNotice(source.slice(frontMatter[0].length));
    const updated = `${frontMatter[0]}\n${notices[locale]}\n\n${body}`;
    await writeFile(file, updated, 'utf8');
  }
}
```

- [ ] **Step 2: Run the rewrite and inspect representative pages**

Run:

```bash
node .scratch/add-ai-assistance-notices.mjs
```

Inspect one Chinese knowledge page, one English knowledge page, one Chinese
reference page, and one English reference page. Confirm the notice is the first
body element and no old English translation notice remains.

- [ ] **Step 3: Re-run the focused test**

Run:

```bash
node node_modules/tsx/dist/cli.mjs --test tests/ai-assistance-notices.test.ts
```

Expected: 2 tests pass.

### Task 3: Validate and commit the publication change

**Files:**
- Modify: `tests/ai-assistance-notices.test.ts`
- Modify: the 180 selected MDX files
- Do not commit: `.scratch/add-ai-assistance-notices.mjs`

- [ ] **Step 1: Run all repository tests and typecheck**

Run:

```bash
node node_modules/tsx/dist/cli.mjs --test 'tests/**/*.test.ts'
node node_modules/typescript/bin/tsc --noEmit
```

Expected: all tests pass and TypeScript exits with status 0.

- [ ] **Step 2: Build both locales**

Run:

```bash
ARTALK_SERVER=https://comments.luminastudio.com.cn \
  node node_modules/@docusaurus/core/bin/docusaurus.mjs build
```

Expected: Docusaurus reports successful `zh-Hans` and `en` builds.

- [ ] **Step 3: Run publication safety scans**

Run:

```bash
rg -l '<iframe|<video' docs i18n |
  xargs rg -n ':::info (AI 辅助编写说明|AI-assisted article)'
rg -n 'This page is an \\*\\*AI-assisted translation\\*\\*' \
  docs/reference docs/knowledge \
  i18n/en/docusaurus-plugin-content-docs/current/reference \
  i18n/en/docusaurus-plugin-content-docs/current/knowledge
git diff --check
```

Expected: the first two scans return no matches and `git diff --check` exits
successfully.

- [ ] **Step 4: Remove the temporary rewrite script**

Delete `.scratch/add-ai-assistance-notices.mjs` and confirm it is absent from
`git status --short`.

- [ ] **Step 5: Commit the completed notices**

```bash
git add tests/ai-assistance-notices.test.ts docs/knowledge docs/reference i18n/en/docusaurus-plugin-content-docs/current/knowledge i18n/en/docusaurus-plugin-content-docs/current/reference
git commit -m "docs(wiki): disclose AI-assisted articles"
```
