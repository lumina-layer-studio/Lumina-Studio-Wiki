# Contributing to Lumina Studio Wiki / 参与贡献

感谢你帮助改进 Lumina Studio Wiki。公开仓库的 `main` 是已发布内容的基准，所有修改通过 Pull Request 审核后合并。

## 推荐流程

1. Fork 本仓库，并从最新 `main` 创建主题分支。
2. 修改对应文档或素材，不要提交构建输出、依赖目录或本机配置。
3. 同时维护中文原文与英文翻译目录；尚未核对译文的改动请保留为草稿 PR。
4. 运行本地检查并在 PR 中填写结果。
5. 提交 PR，等待自动检查与维护者审核。

## 中英文文档

- 中文页面：`docs/`
- 英文译文：`i18n/en/docusaurus-plugin-content-docs/current/` 下与中文同路径的 `.toml` 文件。
- 英文 `.md` / `.mdx` 由工具生成；不要直接修改生成文件，否则下次生成会覆盖。
- 两种语言应保持相同的主题、步骤、注意事项和外部链接。
- 翻译应使用自然表达，并人工核对软件术语、步骤、链接和图片。

### 翻译同步

使用固定版本的 `@neko_vecter/i18n-toolkit`。它是构建工具，不进入浏览器运行包；本项目继续使用 Yarn 4。包的命令入口是 `i18n-toolkit`，无需另写 CLI 或更换包管理器。

```bash
# 1. 修改中文，提取需要核对的翻译块（不调用翻译 API）
yarn i18n:extract
# 2. 编辑对应 .toml 的 translate，核对正文、标题、链接和图片
# 3. 仅为自己已核对完的页面确认当前中文版本
yarn i18n:review docs/tutorials/example/example.mdx
# 4. 生成英文，再检查生成文件与翻译目录是否一致
yarn i18n:build
yarn i18n:check
```

每个 `[[block]]` 保留工具生成的 `key`、`type`、`origin`，只编辑 `translate`。复合块中的 `{{...}}` 是子块引用，不要随意删除。正文使用相对链接；英文截图放在英文页面自己的 `assets/`，保留相对 `require('./assets/...').default`，不要把工具新提取的中文图片路径误当作英文配图。标题、描述、提示框标题和图片说明也要翻译。

`i18n:review` 记录已核对的中文版本，不会替你翻译。中文变化后，构建会要求重新核对；缺少目录或块、译文语法错误、生成文件不同步也会停止。`yarn i18n:sync` 执行提取和受检查的生成，有尚未核对的源文改动时会停下，不会静默用中文覆盖英文。仅修改译文时，编辑 TOML 后运行 `yarn i18n:build` 即可。

新页面先按同名目录创建中文，再提取 TOML、填写译文、确认并生成。删除或重命名页面时，同步处理对应的 TOML、英文输出与素材目录。历史英文中有独立排版和仍待翻译的隐藏页面，本次迁移保留了这些原状；不要将源文回退误认为完成翻译。

脚本固定使用 `--no-translate`，即使本机设置了翻译服务的环境变量也不会发送文档。`yarn build` 先执行翻译一致性检查，Docusaurus 再检查两种语言的页面、资源和链接。

## 控件参考文档

复杂控件应在 `docs/reference/` 下建立独立页面，不要只在综合教程里顺带提及。父控件与附属控件使用相对链接互相指向；工作流教程说明如何完成任务，控件参考完整解释参数。

页面按“用户能独立理解和验证的一项行为”划分。只负责确认、取消、关闭、加载状态或重复列表操作的按钮留在父流程页面；滑块、开关、单选框等通用基础组件不单独建页。仅收录当前导航可进入的界面。

编写前请核对：

- 控件显示、隐藏、启用或禁用的条件；
- 数值范围、步长、默认值、单位、边界值和 `0` 等特殊值；
- 增大、减小、开启和关闭分别改变什么；
- 哪些模式和流程会使用、忽略或覆盖它；
- 与其他控件的依赖、互斥、优先级和回退关系；
- 实际效果、副作用与使用限制。

参数说明请对照当前版本界面与实际行为核实，先说明控件的具体用途与调整效果，语言尽量简明直白。

## 图片、模型与视频

- 只提交自己拥有权利、获得明确许可或许可条件允许再发布的素材。
- 第三方素材请在页面或 PR 中说明来源、作者、链接和适用许可。
- 不要上传含账号、收藏夹、通知、本机路径、设备标识或其他个人信息的截图。
- 教程视频请填写 Bilibili 或 YouTube 公开链接，不要向仓库提交视频文件、压缩包或工程归档。

### 页面与素材结构

每篇页面使用独立目录，MDX 文件与目录同名，配图放在同级 `assets/` 目录，中英文页面分别存放各自语言界面的真实截图：

```text
docs/tutorials/example/example.mdx
docs/tutorials/example/assets/step-01.webp
```

图片使用 Docusaurus 支持的相对 `require` 写法：

```jsx
<img
  src={require('./assets/step-01.webp').default}
  alt="描述画面内容"
/>
```

- MDX 正文中不写 `import`，不引入自定义图片、路径或布局组件。
- 页面间跳转使用相对 Markdown 链接，不手写站点语言前缀或部署域名。
- 提交图片前请清除定位、设备和账号等元数据。

## 本地检查

```bash
corepack enable
yarn install --immutable
yarn typecheck
yarn test
yarn build
```

## Commit 与 PR

- 一次 PR 聚焦一个主题。
- 建议使用 Conventional Commits，例如 `docs(tutorial): clarify nozzle selection`。
- PR 标题和说明可使用英文或中文。

---

Fork the repository and branch from `main`. Edit Chinese source under `docs/`, run `yarn i18n:extract`, and edit `translate` in the corresponding English TOML under `i18n/en/docusaurus-plugin-content-docs/current/`. Preserve keys and child placeholders. Review terminology, metadata, links and locale-specific images; then run `yarn i18n:review docs/path/page.mdx`, `yarn i18n:build`, `yarn typecheck`, `yarn test`, and `yarn build`. English Markdown/MDX is generated, not edited directly. The scripts never call a translation API. Source changes require an explicit review before generation; `i18n:sync` stops rather than publishing an unreviewed source fallback.

Use same-named page folders and local `assets/` directories with relative `require('./assets/...').default` image tags. Do not add MDX imports. Keep real UI screenshots localized, remove personal metadata, and credit third-party sources and licenses. Rename or remove a page's source, TOML, generated output and assets together.
