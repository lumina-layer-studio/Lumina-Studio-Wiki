# Lumina Studio Wiki

[Lumina Studio Wiki](https://wiki.luminastudio.com.cn/) 的公开源文件。仓库包含中英文文档、教程图片、Docusaurus 站点代码和公开构建检查。

本仓库是**已发布 Wiki 内容的唯一公开来源**。服务器、NAS、备份、账号、密钥、未发布草稿和内部运维资料不属于本仓库。

## 本地预览

需要 Node.js 20 或更高版本，以及 Corepack：

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm start
```

提交前请运行：

```bash
pnpm test:public
pnpm typecheck
pnpm build
python3 scripts/public_repo_guard.py --tree build
```

中文正文位于 `docs/`，英文正文位于 `i18n/en/docusaurus-plugin-content-docs/current/`。欢迎通过 Issue 或 Pull Request 修正文案、补充教程和改进翻译；详细规则见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

- 站点源代码采用 [MIT License](LICENSE)。
- 原创 Wiki 正文与适用媒体采用 [CC BY-NC-SA 4.0](CONTENT-LICENSE.md)。
- 第三方软件界面、商标、模型、角色、照片及单独标注的素材仍归各自权利人所有。

---

This repository is the public source for the bilingual [Lumina Studio Wiki](https://wiki.luminastudio.com.cn/). It contains published documentation, tutorial images, the Docusaurus site, and public validation checks. Private drafts, credentials, infrastructure, backups, and machine-specific operations are intentionally maintained elsewhere.

Contributions are welcome through issues and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for localization, AI-assisted translation, media-rights, and validation requirements.
