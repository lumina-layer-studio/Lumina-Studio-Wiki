# Lumina Studio Wiki

[Lumina Studio Wiki](https://wiki.luminastudio.com.cn/) 的中英文公开源文件，包含使用文档、教程图片和站点代码。欢迎通过 Issue 或 Pull Request 帮助完善教程与翻译。

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

新教程图片和视频采用可核验的媒体登记：网页图片随 PR 审核，视频使用 Bilibili 或 YouTube 链接，原始素材不直接进入 Git。具体步骤见贡献指南。

## 许可

- 站点源代码采用 [MIT License](LICENSE)。
- 原创 Wiki 正文与适用媒体采用 [CC BY-NC-SA 4.0](CONTENT-LICENSE.md)。
- 第三方软件界面、商标、模型、角色、照片及单独标注的素材仍归各自权利人所有。

---

This repository contains the bilingual source for the [Lumina Studio Wiki](https://wiki.luminastudio.com.cn/), including user documentation, tutorial images, and the website code.

Contributions are welcome through issues and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for localization, AI-assisted translation, media-rights, and validation requirements.
