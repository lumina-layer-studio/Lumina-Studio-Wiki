# Contributing to Lumina Studio Wiki / 参与贡献

感谢你帮助改进 Lumina Studio Wiki。公开仓库的 `main` 是已发布内容的基准，所有修改通过 Pull Request 审核后合并。

## 推荐流程

1. Fork 本仓库，并从最新 `main` 创建主题分支。
2. 修改对应文档或素材，不要提交构建输出、依赖目录或本机配置。
3. 尽量同时维护中文与英文页面；暂时只完成一种语言时，请在 PR 中说明。
4. 运行本地检查并在 PR 中填写结果。
5. 提交 PR，等待自动检查与维护者审核。

## 中英文文档

- 中文页面：`docs/`
- 英文页面：`i18n/en/docusaurus-plugin-content-docs/current/`
- 两种语言应保持相同的主题、步骤、注意事项和外部链接。
- 翻译应使用自然表达，并人工核对软件术语、步骤、链接和图片。

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
yarn build
```

## Commit 与 PR

- 一次 PR 聚焦一个主题。
- 建议使用 Conventional Commits，例如 `docs(tutorial): clarify nozzle selection`。
- PR 标题和说明可使用英文或中文。

---

Thank you for contributing to the Lumina Studio Wiki. Fork the repository, branch from `main`, keep Chinese (`docs/`) and English (`i18n/en/docusaurus-plugin-content-docs/current/`) pages aligned where practical, run `yarn typecheck` and `yarn build`, and open a pull request. Place each page in a same-named folder with a matching `.mdx` file and a local `assets/` directory using relative `require('./assets/...').default` image tags (without MDX `import` statements). Strip personal metadata or local paths from screenshots, use real UI captures for each locale, and credit the source and license for any third-party media.
