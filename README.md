# Lumina Studio Wiki

[English](README.md) · [简体中文](README_CN.md) · [Live site](https://wiki.luminastudio.com.cn/) · [Local preview](#local-preview-and-build) · [Contributing](#contributing) · [Lumina Studio](https://github.com/lumina-layer-studio/Lumina-Layers)

Bilingual Docusaurus source for the [Lumina Studio Wiki](https://wiki.luminastudio.com.cn/) — user guides, slicer tutorials, UI control references, calibration notes, and release summaries in Simplified Chinese and English.

## Local preview and build

Requires **Node.js 20+** and **Corepack** (for the Yarn 4 version pinned in `package.json`). Node.js 25+ no longer bundles Corepack; see the [Corepack installation guide](https://github.com/nodejs/corepack#how-to-install) if `corepack` is missing.

```bash
corepack enable
yarn install --immutable
yarn start
```

Before opening a Pull Request, check types and build both locales:

```bash
yarn typecheck
yarn test
yarn build
```

## Content layout

| Path | Contents |
| --- | --- |
| `docs/` | Simplified Chinese docs (`getting-started/`, `tutorials/`, `reference/`, `knowledge/`, `releases/`, `project/`, `legacy/`) |
| `i18n/en/docusaurus-plugin-content-docs/current/` | English TOML translations, generated Markdown/MDX and localized assets mirroring `docs/` |
| `updates/` | Release update entries |
| `src/` & `static/` | Site components, styles, and static assets |

Each article uses a same-named folder and `.mdx` file with local images under `assets/`:

```text
docs/tutorials/example/example.mdx
docs/tutorials/example/assets/step-01.webp
```

## Contributing

Translations use `@neko_vecter/i18n-toolkit`. Edit the English TOML, then run `yarn i18n:build`; do not edit generated English pages directly. After changing Chinese source, extract and review its translation first. See the [translation workflow](CONTRIBUTING.md#翻译同步).

Issues and Pull Requests for fixes, tutorials, control references, and translations are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for authoring conventions and [SECURITY.md](SECURITY.md) for security reports.

## Licensing

- **Website and build code:** [MIT License](LICENSE)
- **Original Wiki text and covered media:** [CC BY-NC-SA 4.0](CONTENT-LICENSE.md)
- **Third-party UIs, trademarks, models, characters, photos, and credited media:** retained by their respective rights holders; see [NOTICE.md](NOTICE.md).
