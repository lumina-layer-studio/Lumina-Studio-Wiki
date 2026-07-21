# Contributing to Lumina Studio Wiki / 参与贡献

感谢你帮助改进 Lumina Studio Wiki。公开仓库的 `main` 是已发布内容的准确信息源；所有修改都通过 Pull Request 审核后合并。

## 推荐流程

1. Fork 本仓库，并从最新 `main` 创建主题分支。
2. 修改对应文档或素材，不要提交构建输出、依赖目录或本机配置。
3. 尽量同时维护中文与英文页面；暂时无法完成另一语言时，在 PR 中明确说明。
4. 运行本地检查并在 PR 模板中填写结果。
5. 提交 PR，等待自动检查与维护者审核。

## 中英文文档

- 中文页面：`docs/`
- 英文页面：`i18n/en/docusaurus-plugin-content-docs/current/`
- 两种语言应保持相同的主题、步骤、警告和外部链接。
- 翻译应使用自然表达，不应机械逐句直译。
- 使用 AI 辅助翻译时，必须在 PR 中注明工具参与，并由提交者人工核对软件术语、步骤、链接和图片。

## 图片、模型与视频

- 只提交自己拥有权利、获得明确许可或许可条件允许再发布的素材。
- 在页面或 PR 中说明第三方素材来源、作者、链接和适用许可。
- 不要上传含账号、收藏夹、通知、机器路径、设备标识或其他个人信息的截图。
- 教程视频应使用经批准的视频平台链接或嵌入；不要向仓库提交 MP4、字幕包、压缩包或工程归档。
- AI 生成或修改的图片必须在 PR 中注明，不得伪装成真实的软件界面或真实操作截图。

### 页面与素材结构

每篇页面使用独立目录，MDX 文件必须与目录同名，页面所用图片放在同级 `assets/` 目录。中英文页面分别保存自己实际显示的素材。

```text
docs/tutorials/example/example.mdx
docs/tutorials/example/assets/step-01.webp
```

图片使用 Docusaurus 官方支持的相对 `require` 写法：

```jsx
<img
  src={require('./assets/step-01.webp').default}
  alt="描述画面内容"
/>
```

- MDX 正文中不得写 `import`，不得引入自定义图片、路径或布局组件。
- 页面链接使用相对 Markdown 链接，不手写站点语言前缀或部署地址。
- 提交图片时要清除定位、设备和账号等元数据，并在 PR 中说明来源、作者、许可方式和 AI 参与情况。
- 不要把视频母版、工程文件或压缩包放进 Git。视频只填写 Bilibili 或 YouTube 公开链接。
- 如果审核需要核验原始素材，维护者会在 PR 中说明安全的提交方式；原始文件不进入 Git。

## 本地检查

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm test:public
pnpm typecheck
pnpm build
python3 scripts/public_repo_guard.py --tree build
```

公开检查不需要任何账号或密钥。请不要为了让 CI 工作而添加本机配置或访问凭据。

## 社区修改与官方更新的关系

公开 `main` 始终是合并工作的基准。若社区贡献和官方更新修改了同一页面，自动检查会要求维护者人工合并，不会静默覆盖已经合并的内容。

## Commit 与 PR

- 一次 PR 聚焦一个主题。
- 建议使用 Conventional Commits，例如 `docs(tutorial): clarify nozzle selection`。
- PR 标题和说明优先使用英文，并可附中文说明。
- `main` 禁止直接推送和强制推送。

---

Thank you for improving the Wiki. Fork the repository, branch from the latest `main`, keep the Chinese and English pages aligned where practical, run the documented checks, and submit a pull request. Keep each page in a same-named folder with a same-named `.mdx` file and a local `assets/` directory. Use Docusaurus Markdown features and relative `require('./assets/...').default` image sources; do not add imports or custom path/image components to document files. Disclose AI-assisted translation or imagery, verify it manually, and provide the source and permission for third-party media. Never include credentials, non-public operations, personal paths, or self-hosted video payloads.
