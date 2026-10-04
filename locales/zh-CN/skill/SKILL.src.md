---
name: impeccable
description: "当用户想要设计、重新设计、规划、评审、审计、润色、澄清、精简、加固、优化、适配、添加动效、着色、提取或以其他方式改进前端界面时使用。覆盖网站、落地页、仪表盘、产品 UI、应用外壳、组件、表单、设置、引导流程和空状态。处理 UX 评审、视觉层级、信息架构、认知负荷、无障碍、性能、响应式、主题、反模式、排版、字体、间距、布局、对齐、颜色、动效、微交互、UX 文案、错误状态、边界情况、国际化以及可复用设计系统或令牌。也适用于需要更大胆或更有愉悦感的平淡设计、需要收敛的喧闹设计、浏览器中的实时 UI 迭代，以及应当展现高技术完成度的视觉效果。不用于纯后端或非 UI 任务。"
argument-hint: "[{{command_hint}}] [target]"
user-invocable: true
allowed-tools:
  - Bash(npx impeccable *)
  - Bash({{scripts_path}}/impeccable *)
license: Apache 2.0
---

本 Skill 提供工具和明确授权，帮助你完成足以被称为突破常规模板的设计。不要停留在安全、胆怯和机械的方案；应像优秀设计总监一样处理每个任务：交付生产级代码，展现明确观点和创造力，理解客户与用户需求，并保证出色的细节完成度。

核心原则：

- 全力完成，不含糊、不走捷径。除非缺少只能由用户提供的素材，否则交付物必须完整。
- 构想要大胆、鲜明、美观并具有启发性。
- 验证必须有明确轮次上限，不能无限循环。网页应将桌面端与移动端截图合并成一轮，原生应用应一次覆盖计划发布的设备类型；完整构建后统一检查、批量修复，再最多确认一次，然后停止打磨。无限自检既消耗用户成本，也不如独立收尾评审可靠。

## 设置

1. 每个会话只运行一次 `<skill-base-dir>/scripts/impeccable context`。`<skill-base-dir>` 是包含本 SKILL.md 的 Skill 目录，不是上两级插件根目录；cwd 保持在用户项目中。该目录用于解析本 Skill 及引用文件里的所有 `{{scripts_path}}/impeccable <verb>` 命令，只有运行时无法报告基目录时才使用 `{{scripts_path}}` 回退值。Windows shell 没有 `sh` 时调用 `{{scripts_path}}/impeccable.cmd`。启动器会运行同目录下或首次使用时下载的独立二进制，不需要 Node 等运行时。用户指定源码文件或路由时传入 `--target <path>`。它会加载 PRODUCT.md、DESIGN.md、对应界面简报，以及适用的原生平台指南；遵循输出指令，不要重复运行。 <!-- rule:skill-setup-context -->
2. 加载当前请求的执行手册：若用户明确或隐含指定子命令，读取 Commands 表对应引用；若是新界面或替换整个视觉体系，读取 [reference/new-work.md](reference/new-work.md)。编辑前检查目标和现有视觉事实。应用无法运行时，先检查已提交的视觉回归基准或截图 fixture；根据当前 token、CSS、组件和素材验证目标与新鲜度，处理冲突并比较主题/变体截图。 <!-- rule:skill-setup-command-ref --> <!-- rule:skill-setup-read-project -->
3. 分析与方向确定后、任何 UI 编辑之前，立即读取 [reference/craft-floor.md](reference/craft-floor.md)，小型微调也不例外。它定义质量底线、绝对禁区和检测器无法捕捉的设计判断。只做规划时不要加载。 <!-- rule:skill-craft-floor-load -->
4. 如果依赖、入口代码或组件标签表明项目使用 Ant Design、Element Plus 或 TDesign，读取 [reference/china-ui-frameworks-cn.md](reference/china-ui-frameworks-cn.md)，先确认具体技术栈和版本，再按框架公开 token 与配置入口工作。

**启动器不可用：** 如果启动器拒绝或失败，必须在下一次工具调用前单独发送：“上下文加载未运行；我将直接读取项目已有上下文。”然后读取现有 PRODUCT.md 和 DESIGN.md，不虚构缺失信息，继续执行适用的第 2～3 步和允许的工具。启动器失败本身不阻止规划或编辑。

## 如何设计

- **设计简报优先。** 用户已经指定审美、时代、材质、字体或配色时，即使与饱和度反模式警告冲突也应遵守。把清晰要求改成你的个人偏好属于失败。 <!-- rule:skill-brief-wins -->
- **优化保留，重设计替换。** 优化必须保留现有身份、行为、文案和范围外内容；替换事实性文案或增加产品承诺前必须询问。重设计保留产品事实、内容、功能、原生交互习惯和约束，但把旧外观当作证据与反例；在 new-work 中选择新的视觉体系并替换 DESIGN.md。不要把已经舍弃的方向与新方向折中混合。 <!-- rule:skill-world-change-semantics -->
- **视觉权威来自证据，而不是文件名。** 缺少 DESIGN.md 不等于全新项目；new-work 应判断是保留、扩展还是替换现有视觉体系。 <!-- rule:skill-new-work-gate -->

## 模式

模式描述访客在当前界面上怎样才算成功。

- **说服（Persuade）：** 访客需要做决定并采取行动，设计本身就是产品。适用于落地页、营销页、活动页和定价页。设计应赢得注意和行动；简报需要真实图片时就交付真实图片，遵循已确认的视觉体系，而不是套用行业模板。 <!-- rule:brand-register-core -->
- **操作（Operate）：** 访客需要完成任务。适用于应用 UI、仪表盘、编辑器、后台、设置和工具。可扫描性、一致性、平台习惯和真实使用场景高于视觉表达，品牌体现在精准细节中。 <!-- rule:product-register-core -->
- **阅读（Read）：** 访客需要理解信息。适用于文档、文章、指南、帮助和更新日志。先为理解建立结构，再让阅读体验值得停留。 <!-- rule:skill-read-register -->
- **体验（Experience）：** 访客置身于作品本身。适用于作品集、画廊和展示项目。首屏就让作品成为主角，界面退居其后。 <!-- rule:skill-experience-register -->

根据当前界面而不是整个产品选择模式，并只把模式保存在该界面简报中。工具的落地页仍是说服模式；时尚品牌的文档仍是阅读模式；文档索引属于阅读而不是说服。新界面参见 [new-work.md](reference/new-work.md)，操作/阅读模式的深入说明参见 [operate.md](reference/operate.md)。 <!-- rule:skill-visitor-mode -->

## 命令

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | 构建 | 普通 new-work 请求的弃用别名 | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | 构建 | 编写代码前规划 UX/UI | [reference/shape.md](reference/shape.md) |
| `init` | 构建 | 将稳定的产品上下文写入 PRODUCT.md | [reference/init.md](reference/init.md) |
| `document` | 构建 | 根据现有项目代码生成 DESIGN.md | [reference/document.md](reference/document.md) |
| `extract [target]` | 构建 | 把可复用 token 和组件提取到设计系统 | [reference/extract.md](reference/extract.md) |
| `critique [target]` | 评估 | 使用启发式评分进行 UX 设计评审 | [reference/critique.md](reference/critique.md) |
| `audit [target]` | 评估 | 检查无障碍、性能和响应式等技术质量 | [reference/audit.md](reference/audit.md) · 原生：[reference/audit.native.md](reference/audit.native.md) |
| `polish [target]` | 优化 | 发布前完成最终质量检查 | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | 优化 | 增强安全、平淡的设计 | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | 优化 | 收敛过于强烈或刺激的设计 | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | 优化 | 去除复杂度，保留本质 | [reference/distill.md](reference/distill.md) |
| `harden [target]` | 优化 | 补齐错误、国际化和边界情况，达到生产要求 | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | 优化 | 设计首次使用、空状态和激活流程 | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | 增强 | 加入有目的的动画与动效 | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | 增强 | 为单色界面加入有策略的颜色 | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | 增强 | 改善字体与排版层级 | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | 增强 | 修复间距、节奏和视觉层级 | [reference/layout.md](reference/layout.md) |
| `delight [target]` | 增强 | 加入个性与让人记住的细节 | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | 增强 | 突破常规限制 | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | 修复 | 改善 UX 文案、标签和错误信息 | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | 修复 | 适配不同设备和屏幕尺寸 | [reference/adapt.md](reference/adapt.md) · 原生：[reference/adapt.native.md](reference/adapt.native.md) |
| `optimize [target]` | 修复 | 诊断并修复 UI 性能 | [reference/optimize.md](reference/optimize.md) |
| `live` | 迭代 | 在浏览器中选取元素并迭代视觉方案 | [reference/live.md](reference/live.md) |
| `generate [n] [action] [element]` | 迭代 | 为指定元素生成可选择的变体、版本或替代方案，无需手工挑选 | [reference/generate.md](reference/generate.md) |

路由： <!-- rule:skill-routing -->

- **无参数：** 读取 [routing.md](reference/routing.md)，展示结合上下文的菜单；绝不自动运行命令。
- **明确或清晰隐含要求执行命令：** 加载对应引用文件（原生平台使用 native 版本）并执行；若两个命令都适用，只询问一次。
- **询问工作流或命令选择：** 读取 [工作流问题](reference/routing.md#工作流问题)。
- **其他情况：** 作为一般设计工作处理。新界面或替换视觉体系时，如果缺少 PRODUCT.md，先执行 init，再进入 new-work；针对现有代码的窄范围优化则按 `impeccable context` 指令继续，完成后建议 init，而不是因此阻塞。
- `teach` 是 `init` 的别名。`craft` 是普通 new-work 的弃用别名，不增加任何行为。`shape` 负责需求发现，只在需要确定视觉体系和界面概念时进入 new-work。

init 写入 PRODUCT.md 后继续当前流程，不要重新运行 `impeccable context`；如果记录的平台是 `ios`、`android` 或 `adaptive`，init 会自行加载原生平台引用。

**Pin / Unpin：** `{{scripts_path}}/impeccable pin <pin|unpin> <command>` 创建或移除独立的 `{{command_prefix}}<command>` 快捷命令。简洁报告脚本结果；出错时原样转述 stderr。

**Hooks：** `{{command_prefix}}impeccable hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>` 管理项目的设计检测 hook。它会在 UI 文件编辑后自动运行检测器并展示结果。用户带任意参数调用时，加载 [reference/hooks.md](reference/hooks.md)。

**Doctor：** `{{command_prefix}}impeccable doctor` 检查并修复项目 Impeccable 产物（PRODUCT.md、DESIGN.md 及 sidecar、配置、界面简报和 hook）与当前版本之间的漂移。用户主动调用，或询问哪些内容过期、陈旧、需要刷新时，加载 [reference/doctor.md](reference/doctor.md)。设置阶段输出的 `CONTEXT_STALE` 是同一报告的轻量子集；按其自身指令处理，不要擅自再运行 doctor。 <!-- rule:skill-doctor-route -->

**绝不能把修复漂移当成设计任务的副作用。** 除非用户要求，否则只报告 `CONTEXT_STALE`，不直接处理。唯一例外是标为 `auto` 的发现，因为下一次写入该文件时本来就会自动处理。 <!-- rule:skill-drift-not-a-side-quest -->
