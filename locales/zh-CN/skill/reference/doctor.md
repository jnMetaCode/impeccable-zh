报告并修复项目中的 Impeccable 产物与已安装版本实际读取内容之间的漂移：PRODUCT.md、DESIGN.md 及其 `.impeccable/design.json` sidecar、`.impeccable/config.json`、持久化界面简报和设计 hook。

这是维护，不是设计。不要重新设计任何内容，不要打开报告未点名的文件，也不要附带运行其他命令。

## 本命令负责什么、不负责什么

“过期”包含三类不同漂移，必须区分：

- **工具版本。** 已安装 Skill 旧于发布版本。`impeccable context` 启动时会报告 `UPDATE_AVAILABLE`，运行 `npx impeccable update` 即可修复。这不属于本命令。
- **Schema 漂移。** 产物由旧版 Impeccable 写入：存在已无人读取的字段、当前需要的新字段或废弃位置中的文件。这是机械问题，本命令可以修复大部分。
- **事实漂移。** 代码已经变化，文档不再准确。单纯比较文件无法判断。`document` 负责 DESIGN.md，`init` 负责 PRODUCT.md；本命令只应把具体缺口交给它们，而不是提出模糊怀疑。

## 步骤 1：运行检查

```
{{scripts_path}}/impeccable doctor --json
```

用户在 monorepo 中点名 workspace、文件或路由时添加 `--target <path>`。不加时报告描述仓库根目录，而它在 monorepo 中通常不是正确项目。

输出包含 `findings`（每项含 `id`、`artifact`、`path`、`severity`、`summary`、`fix`）；monorepo 还包含 `workspaces`，展示每个应用的 product 和 design 解析结果。`ruleRegistryAvailable: false` 表示无法验证被忽略的规则 ID；应明确说明，不能暗示列表没有问题。

空的 `findings` 数组是正常结果。用一句话说明并停止。

## 步骤 2：按严重度执行

严重度表示应该采取什么行动，而不是问题有多糟。

- **`auto`** 不涉及决策。运行一次 `{{scripts_path}}/impeccable doctor --fix` 应用这些修复，再用一句话报告移动了什么。无需事先询问，也不要事后再询问。
- **`mention`** 需要让用户知晓，但现在无需决定。每项用一句话说明并附带建议修复。
- **`route`** 需要特定命令。说明命令及其要解决的缺口。只有用户在本轮要求时才运行；`init` 和 `document` 是对话，不是无人值守的修复。

一次报告全部三组。Finding 不是错误，命令不会因此失败。

## 步骤 3：废弃字段具有约束力

报告废弃字段的 finding（当前是 `## Register`）不是风格建议。从此后的每项决策中都把该字段视为不存在，无论它有什么值，并提出删除该区块。以“以防万一”为由保留，会让已经退役的轴继续影响输出。

## 步骤 4：不要夸大事实漂移

`design-md-drift` 统计 DESIGN.md 上次修改后视觉源码目录中的提交数。提交数量不代表内容矛盾。报告数量及其度量对象；如果用户想知道文档是否真的错误，应对照当前 token 和组件阅读 DESIGN.md，再根据内容回答。绝不能因为数字较大就声称 DESIGN.md 已过期。

同样谨慎处理 `workspace-context-inherited`。继承是设计行为。一份 product 记录能否如实描述多个应用，应由用户判断，不是自动修复的缺陷。

## Monorepo 说明

- `workspace-platform-native-evidence` 最关键：包含原生构建文件的 workspace 如果继承解析为 Web 的根记录，会一直得到 Web 指导，且永远不会加载 [ios.md](ios.md) 或 [android.md](android.md)。应在该 workspace 创建子 PRODUCT.md，因为一份继承记录不能同时描述两个平台。
- `config-project-roots-match-nothing` 表示所有 `projectRoots` glob 都未匹配，仓库根目录被静默当作活动项目。常见原因是 workspace 目录重命名。报告 pattern，并询问它们应指向哪些目录。
- `config-invalid-build-path` 与 `config-build-path-unset` 都涉及 `.impeccable/config.json` 中的 `buildPath`；开发者的 gitignored `.impeccable/config.local.json` 优先。值为 `comp` 或 `code`，决定新界面由生成设计稿还是直接代码构建。无法识别的值不会回退到另一条路径，应报告精确值。未设置 finding 只在项目做过方向工作但从未记录偏好时触发；仅当工具面存在图片生成能力时才提供选择，否则无需说明。
- 提议修改前，使用 `workspaces` 表展示哪些应用有独立上下文、哪些继承、哪些缺失。

## 关闭启动检查

`impeccable context` 在会话开始时报告这些 finding 的低成本子集，每个项目每周最多一次。在 `.impeccable/config.json` 设置 `"stalenessCheck": false` 可关闭；单次会话使用 `IMPECCABLE_NO_STALENESS_CHECK=1`。关闭启动检查后本命令仍可使用；对于只想按需查看报告的用户，应建议这种组合。
