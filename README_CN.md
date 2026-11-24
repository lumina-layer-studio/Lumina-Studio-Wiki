# Lumina Studio Wiki

[English](README.md) · [简体中文](README_CN.md) · [在线站点](https://wiki.luminastudio.com.cn/) · [本地预览与构建](#本地预览与构建) · [参与贡献](#参与贡献) · [Lumina Studio](https://github.com/lumina-layer-studio/Lumina-Layers)

[Lumina Studio Wiki](https://wiki.luminastudio.com.cn/) 的中英双语文档源码仓库，基于 Docusaurus 构建。

这里包含 Lumina Studio 的快速上手指南、多品牌切片与打印教程、界面控件参考、校准知识文档、版本更新汇总及站点代码。

## 本地预览与构建

### 环境要求

- **Node.js 20** 或更高版本
- **Corepack**（用于启用 `package.json` 中锁定的 Yarn 4 版本）

> Node.js 25 起不再默认内置 Corepack。如果终端提示找不到 `corepack`，请先按 [Corepack 官方安装说明](https://github.com/nodejs/corepack#how-to-install) 安装后再运行以下命令。

### 启动本地预览

```bash
corepack enable
yarn install --immutable
yarn start
```

### 提交前检查

```bash
yarn typecheck
yarn build
```

`yarn build` 会同时编译中文与英文站点，并检查内部链接和图片资源。

## 目录结构

| 路径 | 内容说明 |
| --- | --- |
| `docs/` | 简体中文文档（`getting-started/`、`tutorials/`、`reference/`、`knowledge/`、`releases/`、`project/`、`legacy/`） |
| `i18n/en/docusaurus-plugin-content-docs/current/` | 与 `docs/` 目录结构对应的英文文档 |
| `updates/` | 更新日志条目 |
| `src/` 与 `static/` | Docusaurus 站点界面组件、样式与静态资源 |

每篇文档使用独立目录，`.mdx` 文件与目录同名，页面配图放在同级 `assets/` 目录中：

```text
docs/tutorials/example/example.mdx
docs/tutorials/example/assets/step-01.webp
```

正文使用 Docusaurus 原生 Markdown/MDX 语法与相对路径 `require('./assets/...').default` 引用图片，方便中英文页面各自维护对应语言界面的真实截图。

## 参与贡献

欢迎通过 Issue 或 Pull Request 修正错漏、补充打印教程、完善控件说明或改进中英文翻译。提交修改前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，了解页面组织方式、截图规范、第三方素材署名及本地检查流程。

安全相关问题请参见 [SECURITY.md](SECURITY.md)。

## 许可说明

本仓库对站点代码与文档内容分别适用以下许可：

- **站点代码与构建脚本：** [MIT License](LICENSE)
- **原创 Wiki 正文与适用媒体素材：** [CC BY-NC-SA 4.0](CONTENT-LICENSE.md)
- **第三方软件界面、商标、模型、角色、照片及单独署名素材：** 权利仍归各自权利人所有，详见 [NOTICE.md](NOTICE.md)。
