# AI Assistance Notices

## Goal

Add a clear, consistent disclosure to recently AI-assisted Wiki articles without
marking video tutorials or older human-authored material.

## Scope

The notice applies to both Chinese and English versions of:

- all 69 control-reference pages under `docs/reference/`;
- 20 knowledge articles introduced or substantially rewritten in the
  `bitmap-vs-vector` and `high-frequency bilingual guides` changes;
- the nozzle equivalent-resolution article.

This produces 90 marked articles per locale and 180 marked MDX files in total.

The notice does not apply to:

- pages containing an embedded video;
- workflow tutorials, legacy documents, project pages, release history, or Wiki
  update posts;
- the older human-authored color-chart calibration and filament-selection
  knowledge pages.

## Presentation

Use Docusaurus's built-in `:::info` admonition at the beginning of each article.
Do not add MDX imports or a custom theme component. Existing English
AI-translation notices in the selected articles are replaced by this notice so
the page never displays two AI disclosures.

### Chinese

**Title:** AI 辅助编写说明

> 本文由 AI 在分析 Lumina Studio 当前源码、现有 Wiki 内容及相关操作流程后协助撰写，并已按当前版本进行基础核对。由于软件仍在持续更新，内容可能存在疏漏或与后续版本不一致。如发现不准确之处，或有更清晰的解释、案例与建议，欢迎在本页评论区反馈，或通过 GitHub 提交修订。

### English

**Title:** AI-assisted article

> This article was prepared with AI assistance based on an analysis of the current Lumina Studio source code, existing Wiki content, and relevant workflows. It has been checked against the current version, but omissions or details that become outdated may remain as the software evolves. If you find an error or have a clearer explanation, example, or suggestion, please leave a comment on this page or propose an edit on GitHub.

## Placement and maintenance

Place the admonition immediately after front matter, before the article's
ordinary introduction, images, or procedure. Future AI-assisted text articles
should use the same two notices. A page that later gains an embedded video
should have this article-level notice removed unless the owner explicitly asks
to retain it.

## Verification

- Confirm all 180 selected files contain exactly one locale-appropriate notice.
- Confirm no MDX file containing `<iframe` or `<video` contains the notice.
- Confirm the two older human-authored knowledge pages remain unmarked.
- Run the repository tests, TypeScript typecheck, and both-locale production
  build.
- Scan the changed MDX files for mixed-language notice text and duplicate
  translation notices.
