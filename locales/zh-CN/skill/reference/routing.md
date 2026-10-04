# 命令指导

## 工作流问题

只给出建议，不执行命令；下方菜单仅用于无参数调用。按需查看相关命令引用，了解前置条件和范围。更完整的工作流可链接到[官方文档](https://impeccable.style/docs/)。如果用户同时要求执行，则遵循其请求。

## 无参数路由：结合上下文的菜单

用户无参数调用 `{{command_prefix}}impeccable` 时读取本文件。他们是在问“接下来应该做什么？”，因此菜单必须结合上下文，不能是固定列表。

设置阶段已经运行 `impeccable context`。如果输出 `NO_PRODUCT_MD`，说明项目还没有记录产品上下文：把 `/impeccable init` 放在首条建议并用一句话解释原因，同时继续展示后续菜单；不要悄悄直接执行 init。否则运行一次 `{{scripts_path}}/impeccable signals` 并读取其 JSON，先推荐 **2～3 个价值最高的下一步命令**，每个命令附上一句来自 signals 的理由，然后按类别展示 SKILL.md Commands 表中的完整菜单。**绝不自动运行命令；推荐必须由用户确认。**

对信号做判断，不存在必须机械遵守的分数：

- `setup.hasDesign` 为 false 且 `setup.hasCode` 为 true → `document`，记录现有视觉系统。
- `critique.latest` 为 `null` → 项目从未做过设计评审；对于已设置且有真实界面的项目，优先建议 `/impeccable critique <surface>`。
- `critique.latest` 分数低，或 `p0` / `p1` 非零 → `polish`，它会把该快照作为 backlog，并在过期或清零时关闭。
- `git.changedFiles` 指向一个界面 → 把 `audit` 或 `polish` 精确限定到这些文件并点名。
- `devServer.running` 为 true → 可以用 `live` 做浏览器内迭代，用 `generate` 对指定元素生成一次性变体；如果为 false，不要优先推荐它们。**`live`、`generate` 和内置 `impeccable detect` 仅适用于网页。** 如果 `setup.platform` 是 `ios`、`android` 或 `adaptive`，不要优先推荐这些命令，因为浏览器 overlay 和 HTML 规则引擎不适用于原生代码。
- 其他情况按意图分组（新建、改进现有内容、视觉迭代），并针对当前界面和 `setup.platform` 调整。

**如果 `scan.targets` 非空且 `setup.platform` 不是 `ios` / `android` / `adaptive`，运行一次 `{{scripts_path}}/impeccable detect --json <scan.targets joined by spaces>`**。这是针对本地文件的内置检测器，无网络、无 npx；它读取 HTML/CSS，因此原生项目应跳过。`scan.via` 表示目标来源：`git-changes`、`source-dir`、`html` 或 `root`。把结果用于选择：大量质量或对比度问题 → `audit` 或 `polish`；明确的草率模式 → 相应命令，例如渐变文字或 eyebrow → `quieter` / `typeset`，平淡或灰暗配色 → `colorize`。真实的当前信号优于猜测。如果 detect 报错或项目过大、运行缓慢，跳过检测并建议用户自行运行 `audit`；绝不能因此阻塞建议。

先给出 2～3 个明确建议和可直接输入的准确命令；完整菜单作为后续内容，而不是开场。
