<div align="center">
  <img src="extension/icons/icon-128.png" width="88" alt="Impeccable 图标">
  <h1>Impeccable 中文社区增强版</h1>
  <p><strong>让 AI 不止会写界面，还懂中文产品设计。</strong></p>
  <p>完整汉化 Impeccable，并加入中文排版、中文 UX 文案与国内 UI 框架指导。</p>

  [![Localization](https://img.shields.io/badge/中文覆盖-43%2F43-success)](locales/zh-CN/source-map.json)
  [![Providers](https://img.shields.io/badge/构建目标-19-1d6358)](scripts/lib/transformers/providers.js)
  [![Commands](https://img.shields.io/badge/设计命令-24-d54c28)](web/index.html)
  [![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

  <p>
    <a href="https://jnmetacode.github.io/impeccable-zh/"><strong>访问中文使用中心</strong></a>
    · <a href="#快速开始">快速开始</a>
    · <a href="docs/CASE-STUDY.zh-CN.md">查看演示案例</a>
    · <a href="README.zh-TW.md">繁體中文</a>
    · <a href="https://github.com/pbakaus/impeccable#readme">English upstream README</a>
  </p>
</div>

> [!IMPORTANT]
> 当前为 Alpha。核心中文内容与构建链路已完成，但尚未发布稳定安装包，建议固定 Git commit 从源码安装。本项目是社区衍生版，与上游作者不存在官方隶属或背书关系。

## 为什么做中文版

通用模型能读中文，但“能翻译”不等于“理解中文界面”。真正影响结果的是可执行的产品语境：中文标签如何换行、手机端触摸目标如何处理、错误提示该多直接、Element Plus 与 Ant Design 的默认模式何时应该保留。

| 没有中文设计上下文 | 使用 Impeccable 中文增强版 |
|---|---|
| 照搬西文行高与字距 | 按中文字体、标点与混排规律检查 |
| 生成模板化 SaaS 页面 | 先记录产品事实，再选择视觉方向 |
| 忽略中文长文本与本地框架状态 | 主动覆盖溢出、错误、空状态和组件语义 |
| “看起来不错”但无法复核 | 61 条确定性规则与证据化评审分工 |

## 已经包含什么

- **43/43 核心源文件完整汉化**：入口、38 个参考文档和 4 个 Agent 契约。
- **3 项中国场景原创增强**：中文排版、中文 UX 文案、国内常用 UI 框架。
- **24 个设计命令**：从 `init`、`shape` 到 `audit`、`polish`、`live`。
- **61 条确定性检测规则**：无需模型和 API Key 即可运行。
- **19 个构建目标**：Claude Code、Codex、Cursor、Trae 国内版、GitHub Copilot、Gemini CLI 等。
- **上游漂移守卫**：逐文件记录 Git blob，上游变化后必须人工复核翻译。

## 快速开始

需要 Node.js 22.18+；推荐安装 Bun。稳定包发布前，从源码构建：

```bash
git clone https://github.com/jnMetaCode/impeccable-zh.git
cd impeccable-zh
npm install --ignore-scripts
npm run localization:build
```

然后在你的项目根目录链接所需工具：

```bash
npx impeccable link --source=/path/to/impeccable-zh --providers=claude,codex,cursor
```

重新加载 AI 编程工具后运行：

```text
/impeccable init
```

团队希望随项目固定版本时，使用 Web 安装向导生成 Git submodule 步骤：

```bash
npm run web:preview
```

访问 `http://127.0.0.1:4173`。公开站点部署后可直接访问 [中文使用中心](https://jnmetacode.github.io/impeccable-zh/)。

## 常用命令

| 目标 | 命令 | 作用 |
|---|---|---|
| 建立上下文 | `/impeccable init` | 访谈并写入长期产品事实 |
| 先规划再编码 | `/impeccable shape <功能>` | 形成用户确认的设计简报 |
| 设计评审 | `/impeccable critique <页面>` | 检查层级、认知负荷与情绪体验 |
| 技术审计 | `/impeccable audit <范围>` | 检查无障碍、性能、响应式和反模式 |
| 中文排版 | `/impeccable typeset <页面>` | 改善字体、层级、行高与混排 |
| 多端适配 | `/impeccable adapt <页面> 手机端` | 处理断点、流式布局与触摸目标 |
| 上线精修 | `/impeccable polish <页面>` | 修复一致性与微观细节 |

完整命令可在 [Web 使用中心](https://jnmetacode.github.io/impeccable-zh/#commands)搜索并复制。

## 演示案例

仓库提供一个可复现的 Element Plus 中文表单演示：从标签拥挤、手机密度过高和状态缺失，逐步经过 `audit → typeset → adapt → polish`，并用明确检查项验证结果。

这个案例使用仓库测试夹具，不冒充真实客户项目，也不虚构转化率数据。查看[完整案例与复现步骤](docs/CASE-STUDY.zh-CN.md)。

## 中文版架构

```text
英文上游 skill/ ──┐
                  ├─ 临时合成 ─ 19 个 Provider 分发物
locales/zh-CN/ ───┤
extensions-cn/ ───┘
```

- 英文 `skill/` 保持为可合并的上游事实源。
- 中文源文件位于 `locales/zh-CN/`。
- 中国原创能力位于 `extensions-cn/`。
- 构建只在临时目录合成中文 Skill，不覆盖英文源文件。
- CLI 命令、JSON 字段、配置键和运行时错误在 v1 保持英文。

关键维护文件：

- [`upstream-lock.json`](upstream-lock.json)：冻结的上游 commit 与组件版本
- [`locales/zh-CN/source-map.json`](locales/zh-CN/source-map.json)：逐文件翻译映射与 blob
- [`locales/zh-CN/glossary.yml`](locales/zh-CN/glossary.yml)：统一术语表
- [`extensions-cn/manifest.json`](extensions-cn/manifest.json)：原创增强分发位置

## 质量保证

```bash
npm run localization:check
npm run localization:test
npm run localization:sync-audit
npm run localization:build
npm run web:test
npm run web:build
```

当前门禁覆盖翻译完整性、上游漂移、19 个 Provider 构建、安装与更新 E2E、中文行为评测结构、Web 数据一致性和响应式浏览器冒烟检查。模型行为评测不会默认调用外部 API；配置方法见 [`tests/localization-evals/README.md`](tests/localization-evals/README.md)。

## 上游同步

翻译不会因为文件仍然存在就被视为“最新”。源文件 blob 变化后，`localization:check` 会失败；每周审计 Workflow 会更新一个固定标题的 Issue，等待人工复核，不会自动提交翻译或改写基线。

```bash
git fetch upstream main
node scripts/localization/sync-audit.mjs --target=upstream/main --json
```

## 许可证与来源

上游 Impeccable 使用 Apache-2.0。本项目保留上游 LICENSE 与 NOTICE；由 `ai-ui-design` 迁移的内容保留 MIT 来源声明，详见 [`NOTICE.md`](NOTICE.md)。

## 当前边界

- 不重写或翻译 Rust CLI 协议。
- 不发布同名 npm 包替代上游 `impeccable`。
- 不绕过上游二进制或 bundle 签名机制。
- 不在缺少评测证据时宣称中文版效果更好。
