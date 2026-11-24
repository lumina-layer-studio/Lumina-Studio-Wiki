# Lumina Studio Wiki

[English](README.md) · [简体中文](README_CN.md) · [在线站点](https://wiki.luminastudio.com.cn/) · [本地预览与构建](#本地预览与构建) · [参与贡献](#参与贡献) · [Lumina Studio](https://github.com/lumina-layer-studio/Lumina-Layers)

[Lumina Studio Wiki](https://wiki.luminastudio.com.cn/) 的中英双语源码仓库（基于 Docusaurus），包含上手指南、切片与打印教程、界面控件参考、校准说明和版本更新记录。

## 本地预览与构建

需要 **Node.js 20+** 与 **Corepack**（用于启用 `package.json` 锁定的 Yarn 4）。Node.js 25 起不再默认自带 Corepack，若缺少 `corepack` 请先参考 [Corepack 安装说明](https://github.com/nodejs/corepack#how-to-install)。

```bash
corepack enable
yarn install --immutable
yarn start
```

提交 PR 前请完成类型检查与双语站点构建：

```bash
yarn typecheck
yarn build
```

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `docs/` | 简体中文文档（`getting-started/`、`tutorials/`、`reference/`、`knowledge/`、`releases/`、`project/`、`legacy/`） |
| `i18n/en/docusaurus-plugin-content-docs/current/` | 与 `docs/` 对应的英文文档 |
| `updates/` | 版本更新条目 |
| `src/` 与 `static/` | 站点组件、样式与静态文件 |

每篇文档放在同名目录下，页面配图保存在同级 `assets/` 中：

```text
docs/tutorials/example/example.mdx
docs/tutorials/example/assets/step-01.webp
```

## 参与贡献

欢迎通过 Issue 或 Pull Request 修正错漏、补充教程、完善控件说明或改进翻译。编写规范见 [CONTRIBUTING.md](CONTRIBUTING.md)，安全问题见 [SECURITY.md](SECURITY.md)。

## 许可说明

- **站点代码与构建脚本：** [MIT License](LICENSE)
- **原创 Wiki 正文与适用媒体素材：** [CC BY-NC-SA 4.0](CONTENT-LICENSE.md)
- **第三方软件界面、商标、模型、角色、照片及单独署名素材：** 归各自权利人所有，见 [NOTICE.md](NOTICE.md)。
