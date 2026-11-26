import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {buildDocument, createMiddleware, parseDocument, parseMiddleware, stringifyMiddleware} from '@neko_vecter/i18n-toolkit';
import {reviewCatalogue, validateCatalogue} from '../scripts/i18n-catalogue.mjs';

const source = `---
title: 示例
---

# 示例

:::info[说明]
包含 **粗体**、[链接](./other.mdx) 和 $x^2$。
:::

| 列 | 数值 |
| --- | --- |
| 行 | 2 |

~~~js
const text = "保持代码";
~~~

$$
E = mc^2
$$

<img src={require('./assets/example.webp').default} alt="示例" />

- 第一项
  - 内层
`;

test('toolkit preserves Markdown, math, tables, directives, JSX and nested lists', async () => {
  const catalogue = await createMiddleware({source});
  const reviewed = reviewCatalogue(source, catalogue);
  const serialized = parseMiddleware(stringifyMiddleware(reviewed));
  assert.equal(buildDocument(source, {middleware: serialized}), source);
  assert.doesNotThrow(() => validateCatalogue(source, serialized, 'fixture.mdx'));
});

test('source edits cannot silently replace a reviewed English paragraph', async () => {
  const original = '# 标题\n\n原来的说明。\n';
  const catalogue = await createMiddleware({source: original});
  catalogue.blocks[0].translate = '# Title\n';
  catalogue.blocks[1].translate = 'The hand-edited explanation.\n';
  const reviewed = reviewCatalogue(original, catalogue);
  const changed = '# 标题\n\n新的说明。\n';
  const extracted = await createMiddleware({source: changed, existing: reviewed});
  assert.throws(() => validateCatalogue(changed, extracted, 'guide.mdx'), /review/i);
  assert.equal(buildDocument(original, {middleware: reviewed}), '# Title\n\nThe hand-edited explanation.\n');
});

test('missing and stale blocks fail before building, even if source was marked reviewed', async () => {
  const catalogue = reviewCatalogue(source, await createMiddleware({source}));
  catalogue.blocks.pop();
  assert.throws(() => validateCatalogue(source, catalogue, 'fixture.mdx'), /blocks/i);
});

test('invalid translated MDX is rejected before overwriting the English file', async () => {
  const catalogue = await createMiddleware({source: '# 标题\n'});
  catalogue.blocks[0].translate = '<div>\n';
  assert.throws(() => reviewCatalogue('# 标题\n', catalogue));
});

test('a catalogue with edited source text cannot claim a different block origin', async () => {
  const catalogue = reviewCatalogue(source, await createMiddleware({source}));
  catalogue.blocks[1].origin = '# Unrelated source\n';
  assert.throws(() => validateCatalogue(source, catalogue, 'fixture.mdx'), /origin/i);
});

test('development report annotations remain hidden definitions, not visible list text', () => {
  const visibleText = (node: {type: string; value?: string; children?: unknown[]}): string => {
    if (node.type === 'definition') return '';
    return (node.value ?? '') + (node.children ?? []).map((child) => visibleText(child as typeof node)).join('');
  };
  for (const root of ['docs', 'i18n/en/docusaurus-plugin-content-docs/current']) {
    for (const month of ['03', '04', '05', '06', '07']) {
      const file = `${root}/releases/2026-${month}.md`;
      assert.doesNotMatch(visibleText(parseDocument(readFileSync(file, 'utf8')).tree), /devlog-entry:|prs:[\d,]+/, file);
    }
  }
});
