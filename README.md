# Lumina Studio Wiki

[English](README.md) · [简体中文](README_CN.md) · [Live site](https://wiki.luminastudio.com.cn/) · [Local preview](#local-preview-and-build) · [Contributing](#contributing) · [Lumina Studio](https://github.com/lumina-layer-studio/Lumina-Layers)

Bilingual documentation source for the [Lumina Studio Wiki](https://wiki.luminastudio.com.cn/), built with Docusaurus.

This repository holds the user guides, multi-brand slicer tutorials, UI control references, calibration notes, release summaries, and website code for Lumina Studio in Simplified Chinese and English.

## Local preview and build

### Requirements

- **Node.js 20** or newer
- **Corepack** (manages the Yarn 4 version pinned in `package.json`)

> Node.js 25 and newer no longer bundle Corepack by default. If `corepack` is not on your `PATH`, install it first following the [Corepack installation guide](https://github.com/nodejs/corepack#how-to-install).

### Start the local dev server

```bash
corepack enable
yarn install --immutable
yarn start
```

### Validate before opening a PR

```bash
yarn typecheck
yarn build
```

`yarn build` compiles both the Simplified Chinese and English locales and verifies internal links and image assets.

## Content layout

| Path | Contents |
| --- | --- |
| `docs/` | Simplified Chinese documentation (`getting-started/`, `tutorials/`, `reference/`, `knowledge/`, `releases/`, `project/`, `legacy/`) |
| `i18n/en/docusaurus-plugin-content-docs/current/` | English documentation mirroring the `docs/` hierarchy |
| `updates/` | Release update entries |
| `src/` & `static/` | Docusaurus theme customizations, components, and static site assets |

Each documentation page lives in its own folder with a matching `.mdx` filename and a local `assets/` directory for images:

```text
docs/tutorials/example/example.mdx
docs/tutorials/example/assets/step-01.webp
```

Pages use standard Docusaurus Markdown/MDX syntax and relative `require('./assets/...').default` image tags so Chinese and English articles each keep localized UI screenshots self-contained.

## Contributing

Fixes for typos, clearer explanations, new tutorials, control reference updates, and translations are welcome via Issues and Pull Requests. Before submitting a PR, read [CONTRIBUTING.md](CONTRIBUTING.md) for page structure, screenshot guidelines, media attribution, and local verification steps.

For security issues, see [SECURITY.md](SECURITY.md).

## Licensing

This repository uses separate licenses for site code and documentation content:

- **Website and build code:** [MIT License](LICENSE)
- **Original Wiki text and covered media:** [CC BY-NC-SA 4.0](CONTENT-LICENSE.md)
- **Third-party software UIs, trademarks, models, characters, photos, and separately credited works:** retained by their respective rights holders; see [NOTICE.md](NOTICE.md).
