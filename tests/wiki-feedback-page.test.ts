import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const pages = [
  {
    locale: 'zh',
    file: 'docs/project/wiki-feedback/wiki-feedback.mdx',
    title: 'Wiki 反馈与建议',
    marker: ':::info[AI 辅助编写说明]',
    template: '受影响的页面：',
    commentPrompt: '请直接在本页底部的评论区留言',
  },
  {
    locale: 'en',
    file: 'i18n/en/docusaurus-plugin-content-docs/current/project/wiki-feedback/wiki-feedback.mdx',
    title: 'Wiki Feedback and Suggestions',
    marker: ':::info[AI-assisted article]',
    template: 'Affected page:',
    commentPrompt: 'leave a comment at the bottom of this page',
  },
] as const;

test('provides equivalent localized Wiki feedback pages', async () => {
  for (const page of pages) {
    const source = await readFile(page.file, 'utf8');

    assert.match(source, new RegExp(`title: "${page.title}"`), page.file);
    assert.doesNotMatch(source, /^(?:id|slug|wikijs_[^:]+):/m, page.file);
    assert.match(source, /sidebar_position: 15/, page.file);
    assert.equal(source.split(page.marker).length - 1, 1, page.file);
    assert.ok(source.includes(page.template), page.file);
    assert.ok(source.includes(page.commentPrompt), page.file);
    assert.ok(
      source.includes(
        '../../reference/workspace-and-navigation/bug-report/bug-report.mdx',
      ),
      page.file,
    );
    assert.doesNotMatch(source, /<Comments|github(?:\.com)?/i, page.file);
  }
});

test('links the localized feedback page from the navbar', async () => {
  const config = await readFile('docusaurus.config.ts', 'utf8');
  const englishNavbar = JSON.parse(
    await readFile('i18n/en/docusaurus-theme-classic/navbar.json', 'utf8'),
  ) as Record<string, {message: string}>;

  assert.match(
    config,
    /type:\s*'docSidebar',[\s\S]*?sidebarId:\s*'feedbackSidebar',[\s\S]*?label:\s*'Wiki 反馈'/,
  );
  assert.equal(
    englishNavbar['item.label.Wiki 反馈']?.message,
    'Wiki Feedback',
  );
});
