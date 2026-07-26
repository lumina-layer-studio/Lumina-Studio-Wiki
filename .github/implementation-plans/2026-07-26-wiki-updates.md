# Wiki Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual, reader-facing Wiki update feed and page-level last-update dates without mixing documentation news with Lumina Studio software release notes.

**Architecture:** Use the official Docusaurus blog plugin at `/zh/updates/` and `/en/updates/`. Keep the existing docs plugin and product release pages unchanged, enable its built-in last-update timestamp, and rely on Docusaurus-generated RSS, Atom, and JSON feeds. Store Chinese update posts in `updates/` and English translations in the plugin's standard i18n directory.

**Tech Stack:** Docusaurus 3.10.2, TypeScript, MDX, Yarn 4 through Corepack

---

## Task 1: Enable the native update feed and page timestamps

**Files:**
- Modify: `docusaurus.config.ts`
- Inspect/update after generation: `i18n/en/docusaurus-theme-classic/navbar.json`
- Create after generation: `i18n/en/docusaurus-plugin-content-blog/options.json`

- [x] In `docusaurus.config.ts`, add `showLastUpdateTime: true` and `showLastUpdateAuthor: false` to the existing docs preset.
- [x] Replace `blog: false` with the official blog configuration using `path: 'updates'`, `routeBasePath: 'updates'`, ten posts per page, hidden reading time, all feed formats, and the Lumina Studio copyright line.
- [x] Enable update-post search with `indexBlog: true`.
- [x] Add `Wiki 动态` to the left side of the navbar without changing the existing `更新日志` item.
- [x] Run `npx --yes corepack@0.34.6 yarn write-translations --locale en`.
- [x] Review the generated diff and retain only the required official blog/navbar translation keys. Set the English navbar label to `Wiki Updates` and translate the feed title, description, and sidebar title.
- [x] Run `npx --yes corepack@0.34.6 yarn typecheck`.

## Task 2: Publish the first bilingual update entry

**Files:**
- Create: `updates/authors.yml`
- Create: `updates/2026-07-26-interface-and-controls.md`
- Create: `i18n/en/docusaurus-plugin-content-blog/authors.yml`
- Create: `i18n/en/docusaurus-plugin-content-blog/2026-07-26-interface-and-controls.md`

- [x] Define one editorial identity, `lumina-wiki`, as `Lumina Studio Wiki 团队` in Chinese and `Lumina Studio Wiki Team` in English.
- [x] Write the Chinese update with a concise introduction, `<!-- truncate -->`, and direct public links to the interface/control reference index, keychain-loop tutorial, and contribution guide.
- [x] State the verified scope exactly: 69 Chinese and 69 English reference pages, the keychain-loop workflow tutorial, and public authoring/contribution guidance.
- [x] Write the English counterpart as an editorial translation rather than a mixed-language copy.
- [x] Keep private repositories, infrastructure, automation details, account data, machine paths, and unpublished work out of both entries.
- [x] Run `npx --yes corepack@0.34.6 yarn typecheck`.

## Task 3: Build and verify the public result

**Files:**
- Verify generated output under: `build/`
- Verify source files under: `updates/`, `i18n/en/`, `docs/`, `docusaurus.config.ts`

- [x] Run `npx --yes corepack@0.34.6 yarn build`.
- [x] Confirm both localized update indexes and both localized post pages exist in `build/`.
- [x] Confirm RSS, Atom, and JSON feeds exist for both locales and contain public production URLs.
- [x] Confirm the existing Chinese and English software-release routes still build.
- [x] Scan tracked source and generated update pages for `/Users/`, private IPs, credentials, local URLs, internal repository names, and mixed-language update copy.
- [x] Start or refresh the local Docusaurus preview on `127.0.0.1:54248`.
- [x] Inspect the Chinese and English update indexes, one post, one documentation page's last-update line, navbar labels, responsive layout, and links in the browser.
- [x] Leave the preview available for user review and do not publish to production.

## Task 4: Prepare the branch for review

**Files:**
- Review: all changed files

- [x] Review `git diff` for unrelated or generated noise.
- [x] Commit the implementation with a Conventional Commit message.
- [x] Report the local preview URLs, validation results, remaining limitations, and exact publication status.
