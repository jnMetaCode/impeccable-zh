# Impeccable 中文社区增强版

> 当前状态：Alpha 开发中，尚未发布稳定安装包。
> 本项目是基于 [pbakaus/impeccable](https://github.com/pbakaus/impeccable) 的社区衍生版，与上游作者不存在官方隶属或背书关系。

Impeccable 为 AI 编程 Agent 提供设计指导、24 个命令、浏览器实时迭代和 61 条确定性前端反模式检测规则。本项目在保持上游运行时与兼容协议的基础上，增加简体中文指导、中国 UI 框架、中文排版、中文 UX 文案和国内产品场景。

## 当前进度

- 已锁定上游 commit：`0d6b47ea19b63afe15e3f93a44d5d9fbbc6fd275`
- 已建立上游文件到中文文件的漂移检查
- 已完成全部 43 个核心源文件的简体中文本地化，包括新视觉工作、设计评审、视觉生成、设计系统记录、Live 状态机和四个 Agent 契约
- 当前翻译覆盖率为 43/43（100%），已满足 Release 内容覆盖门禁
- 已加入中文排版、中文 UX 文案和中国常用 UI 框架适配三项增强
- 已通过 19 个 provider 的上游构建流程
- 保持 24 个命令和 61 条上游确定性检测规则不变

核心源文件已完整汉化；项目仍处于 Alpha，因为真实安装 E2E、受支持运行时 CI、行为评测基线和公开发布准备尚未全部完成。

## 架构原则

- 英文 `skill/` 保持为可合并的上游事实源。
- 中文源文件位于 `locales/zh-CN/`。
- 中国原创能力位于 `extensions-cn/`。
- 构建时在临时目录合成中文 Skill，不覆盖英文源文件。
- CLI 命令、JSON 字段、配置键和运行时错误在 v1 保持英文。
- `.agents/`、`.claude/`、`.cursor/` 等宿主目录属于生成产物，不手工翻译。

## 开发验证

需要 Node.js 22.18+ 或受上游支持的更新版本。上游推荐使用 Bun；没有 Bun 时，本地化构建脚本会使用 Node 运行构建器。

```bash
npm install --ignore-scripts
npm run localization:check
npm run localization:test
npm run localization:sync-audit
npm run localization:build
```

`localization:build` 会生成 `dist/`，但不会同步或改写仓库中跟踪的宿主目录。

## Web 使用入口

仓库内提供无外部前端依赖的响应式 Web 端，可选择 19 个构建目标、生成源码安装步骤、搜索 24 个命令并一键复制：

```bash
npm run web:test
npm run web:preview
```

默认访问 `http://127.0.0.1:4173`。`web:build` 会把可直接部署到静态托管或 GitHub Pages 的文件生成到 `build/web/`。

中文行为评测默认不会发起模型调用。显式配置模型、凭证和 engine 后，按 [中文行为评测说明](tests/localization-evals/README.md)运行；未人工补充逐条证据的轨迹会被评分器判定为 incomplete。

## 上游同步

每个翻译文件都记录对应上游 Git blob。上游源文件发生变化后，`localization:check` 会失败，维护者必须人工复核翻译，不能静默把旧中文内容标记为最新。

`localization:sync-audit` 默认比较冻结 commit 与本地 `upstream/main`，不会自行联网拉取。更新过 tracking ref 后可生成机器可读报告：

```bash
git fetch upstream main
node scripts/localization/sync-audit.mjs --target=upstream/main --json
```

报告区分已翻译文件修改、删除、重命名、新增待翻译文件和其他变化。历史不是冻结 commit 的后代时会失败，要求人工检查，不自动重写基线。

每周 workflow 发现变化时会创建固定标题的跟踪 Issue；已有未关闭 Issue 时更新原 Issue，避免重复通知。自动化不会提交翻译 PR，也不会修改 `upstream-lock.json`。

关键文件：

- `upstream-lock.json`：上游 commit 与组件版本
- `locales/zh-CN/source-map.json`：逐文件翻译映射
- `locales/zh-CN/glossary.yml`：术语表
- `extensions-cn/manifest.json`：原创增强的分发位置

## 许可证与来源

上游 Impeccable 使用 Apache-2.0。本项目保留上游 LICENSE 与 NOTICE。由 `ai-ui-design` 迁移的内容继续保留其 MIT 来源声明。详见 [NOTICE.md](NOTICE.md)。

## 暂不接受的范围

- 重写或翻译 Rust CLI 协议
- 发布同名 npm 包替代上游 `impeccable`
- 绕过上游二进制或 bundle 签名机制
- 手工维护十余份宿主生成文件
- 在没有评测证据时宣称中文版本效果更好
