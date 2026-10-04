# /impeccable hooks

管理当前项目的**设计检测器 hook**。

Hook 会在直接编辑设计相关文件（`.tsx`、`.jsx`、`.html`、`.vue`、`.svelte`、`.astro`、`.css`、`.scss`、`.sass`、`.less`、`.ts`、`.js`）时运行 Impeccable 设计检测器。Claude Code、Codex 和 GitHub Copilot 使用 post-tool-use hook，在编辑后向 Agent 上下文加入简短系统提醒：发现问题时要求修正，仍有待办时再次提醒，UI 类文件无问题时给出简短确认；配置 `hook.quiet` 可关闭确认。普通 `.ts`、`.js` 仍会扫描，但只在发现问题时发声。Cursor 使用 `preToolUse`，在错误写入落盘前阻止它，允许干净写入时保持安静。Grok Build 使用相同 PostToolUse 扫描标记触碰过的文件，再在 Stop 的 `additionalContext` 中展示发现；不要期待逐次编辑提醒，因为 Grok 会丢弃该 stdout。

检测规则分两层。逐次编辑 hook 只展示即时层：值得打断编辑的机械、明确问题，例如图片损坏、内容溢出或裁切、对比度和可读性失败、渐变文字、发光阴影、设计系统漂移。其他内容，如文案节奏、色板和排版品味、布局节奏，推迟到 `Stop` hook 的深度检查；它会对本会话触碰的所有 UI 文件运行完整规则集，并去重逐次编辑已报告的问题后统一展示。没有剩余问题时静默停止。在 `.impeccable/config.json` 设置 `hook.perEditRules: "all"` 可恢复每次编辑运行完整规则集。Claude Code、Codex 和 Grok Build 支持原生 `Stop` 事件。Cursor 的 stop hook 分发不稳定，使用写入前门禁；GitHub Copilot 的 stop 类事件无法把上下文传回模型，所以两者每次编辑仍运行完整检测器。Grok 在 `end_turn` 后还会发送仅观察的 `reason: "shutdown"` Stop；跳过它，只扫描 `end_turn`。

每个 hook 都是机械检查。扫描器无法捕捉的设计反射位于 [craft-floor.md](craft-floor.md)，Skill 在编辑 UI 前会加载它，因此无论 hook 是否接线都适用。没有自动 hook 的会话会从 `impeccable context` 获得一次 `MANUAL_DETECTOR_REQUIRED` 指令，要求结束时运行一次检测器。

本命令通过编辑 `.impeccable/config.json` 按**项目**开关 hook；hook 运行设置位于 `hook`，共享检测器忽略项位于 `detector`。每位开发者的覆盖项，包括 CLI 记录的安装同意决定 `hook.consent`，位于被 Git 忽略的 `.impeccable/config.local.json`。`hook.enabled: false` 关闭 hook；`hook.quiet: true` 隐藏干净/待办确认；`hook.auditLog` 可指定 NDJSON 日志路径。旧环境变量 `IMPECCABLE_HOOK_DISABLED`、`IMPECCABLE_HOOK_QUIET`、`IMPECCABLE_HOOK_LOG` 仍有效，设置时优先于配置。

项目使用 Blade、Twig、ERB 或 Handlebars 时，在 **`detector.extensions`** 声明服务端模板扩展名，否则 hook 会因不在内置列表而跳过。每个扩展一项：`{ "ext": ".blade.php", "engine": "html" }`。`engine` 选择分析器，markup 模板用 `html`，JS/TS/CSS 类文件用 `text`，默认为 `html`。按文件名结尾匹配，因此 `.blade.php`、`.html.erb` 等双扩展名有效。配置只能增加扩展名，内置列表始终生效。

手动 `npx impeccable detect` 默认使用同一项目过滤配置：`detector.ignoreRules`、`detector.ignoreFiles`、`detector.ignoreValues`、`detector.designSystem.enabled`。`hook.enabled` 只控制自动 hook，不影响手动 CLI 扫描。`npx impeccable detect --no-config ...` 可执行忽略项目配置和上下文的原始检测；`npx impeccable ignores ...` 可直接对相同忽略项执行 CLI CRUD。

支持的宿主：Claude Code（项目内 `.claude/settings.local.json`，被 Git 忽略，保持机器本地；移到共享 `settings.json` 的 hook 也会原位使用）、Codex（`.codex/hooks.json`）、Cursor（`.cursor/hooks.json`）、Grok Build（`.grok/hooks/impeccable.json`，需要 `/hooks-trust` 或 `--trust`）、GitHub Copilot（`.github/hooks/impeccable.json`，由 Copilot CLI 和云 Agent 读取的团队共享提交文件）。Copilot CLI 只会在该文件提交到默认分支后触发仓库级 hook。

在 **Cursor** 中，`preToolUse` 检查拟议的 Write/Edit/Shell 写入内容，只有真实检测器发现问题时才拒绝。拒绝信息作为工具错误对 Agent 可见，使其能在错误写入落盘前重新考虑。

Gemini 会把会话与完成 hook 合并安装到现有 `.gemini/settings.json`。允许注释；带注释文件在重写前备份为 `settings.json.bak`，无效 JSON 保持不动。Gemini 不安装逐次编辑检测器 hook。`BeforeTool` 只重写执行 `build-phase` 的 shell 命令，且仅限 macOS/Linux；Windows 上 Gemini 通过 PowerShell 运行 hook，session id 无法进入 shell，因此设计稿构建不会绑定会话，完成提醒保持安静。

## 路由

第一个参数是 action，默认为 `status`。

| Action | 作用 |
|---|---|
| `status` | 输出当前状态、共享/本地配置路径、忽略的规则/文件/值和环境变量覆盖。 |
| `on` | 在 `.impeccable/config.json` 设置 `enabled: true`，记录本地 hook 同意，并在 Skill 已安装时安装或修复各 Provider manifest。 |
| `off` | 在 `.impeccable/config.json` 设置 `enabled: false`。 |
| `ignore-rule <id>` | 把 `<id>` 加入 `detector.ignoreRules`；`overused-font` 必须带 `--all-values`。在整个项目中忽略该规则。 |
| `ignore-file <glob>` | 把 `<glob>` 加入 `detector.ignoreFiles`，对匹配文件忽略**所有**规则。 |
| `ignore-value <id> <value> [--shared] [--reason "..."]` | 把规则/值忽略项加入共享 `.impeccable/config.json`。 |
| `ignore-value <id> <value> --local [--reason "..."]` | 把私有规则/值忽略项加入 `.impeccable/config.local.json`。 |
| `ignore-value <id> "*" --file <glob> [--file <glob>...]` | 只在匹配文件中关闭某一规则，其他位置仍启用。可重复 `--file`，或使用 `--file=<glob>` / `--files=<glob>`。没有 `--file` 的裸 `"*"` 会被拒绝；确实要全项目关闭时使用 `ignore-rule <id>`。 |
| `reset` | 删除项目配置、去重缓存和 Cursor 待办队列，并从 `on` 安装过的所有 Provider manifest 中移除 hook 条目，包括已提交的 Copilot 文件；`on` 从未写入的团队共享 `settings.json` 不会被触碰。 |

## 流程

1. 从用户参数解析 action；未提供时使用 `status`。
2. 调用管理脚本，逐字传递用户输出：

   ```bash
   {{scripts_path}}/impeccable hooks <action> [args...]
   ```

3. `<action>` 为 `off` 时，补充一句：“完成。在本项目运行 `{{command_prefix}}impeccable hooks on` 前，新编辑不会触发设计 hook。”
4. `<action>` 为 `on` 时，补充：“完成。下次对 UI 文件执行 Edit/Write 后，设计 hook 会触发。”
5. `<action>` 为 `ignore-value`、`ignore-file` 或 `ignore-rule` 时，只打印脚本输出。默认范围为共享 `.impeccable/config.json`；只有用户明确要求私有例外时才加 `--local`。
6. `<action>` 为 `status` 时，只打印脚本输出。除非用户提出后续问题，否则不要附加说明。

## 分诊发现

Hook 自身从不写入忽略配置；所有例外都通过 `impeccable hooks`。把每项发现分为三种结果：

- **真实设计问题**：修复。绝不要通过忽略来逃避修复或强行通过被阻止的写入。
- **确定的误报或获准例外**：自行持久化范围最窄的忽略项，并在回复中披露。必须能指出证据，例如有意的 demo/fixture、用于展示错误设计的文档、字面或领域适当的运动（真实弹跳的小球），或用户已经确认的选择。通过 `--reason` 记录为 `"<谁决定：证据>"`；只有用户确实确认时才能写“用户确认”。
- **不确定**：保留 finding，用一句话询问用户。只问一次；一个简短问题比 hook 在后续每次编辑中重复触发成本更低。

自行处理的上限是 `ignore-value`。`ignore-file` 和 `ignore-rule` 会屏蔽过多内容，不能凭自己判断添加；必须先询问用户。

优先使用范围最窄的例外：

- Finding 行展示 `ignore-value <rule> <value>` 时，连同 `--reason` 传给 `impeccable hooks ignore-value`；默认写入共享配置。
- `overused-font`、`bounce-easing` 等值相关 finding 使用具体值的 `ignore-value`。不要为了某一种字体使用 `ignore-rule overused-font`。
- 没有具体 value 命令的 finding，如 `side-tab`，把该规则限定到文件：`ignore-value <id> "*" --file <path>`。先运行 `npx impeccable detect <path>` 确认该文件实际触发什么。
- 只有整个文件都不属于设计评审范围时才使用 `ignore-file <path>`，例如 fixture、生成产物、刻意展示粗糙设计的 demo。它会永久屏蔽该文件的所有规则，包括未来规则。真实 UI 只有一个嘈杂规则时，应使用上述文件范围的 value 忽略。
- 只有用户要求在整个项目屏蔽某规则时才使用 `ignore-rule <id>`。广泛忽略 overused font 时，只有用户要求忽略所有常用字体才能使用 `ignore-rule overused-font --all-values`。
- 默认优先使用配置忽略项，把例外集中在可审查位置。只有 waiver 必须随单个文件离开仓库时才使用内联 comment，例如生成/导出的独立文档或邮件 HTML。支持 `impeccable-disable <rule>`（全文件）和 `impeccable-disable-line` / `impeccable-disable-next-line`（单行），任何注释语法都可用，可在 `:` 或 `--` 后附原因。检测器默认识别；`--no-inline-ignores` 或 `--no-config` 会绕过。

值相关例外示例：

```bash
{{scripts_path}}/impeccable hooks ignore-value overused-font Inter --shared --reason "User confirmed Inter is intentional"
```

带证据的自行例外示例：

```bash
{{scripts_path}}/impeccable hooks ignore-value bounce-easing bounce-ball --shared --reason "Agent: literal ball-bounce animation, bounce easing is the subject"
```

整条字体规则例外示例：

```bash
{{scripts_path}}/impeccable hooks ignore-rule overused-font --all-values --reason "User asked to ignore overused fonts generally"
```

仍值得检查其他规则的单文件单规则例外：

```bash
{{scripts_path}}/impeccable hooks ignore-value design-system-font-size "*" --file "src/overlay/widget.js" --reason "Injected widget builds its own type scale; DESIGN.md's ramp describes the site"
```

完全不在范围内的整文件例外：

```bash
{{scripts_path}}/impeccable hooks ignore-file "src/legacy/Card.tsx"
```

## 约束

- 本命令绝不要手动修改 `.impeccable/config.json` 或 `.impeccable/config.local.json`。必须通过 `impeccable hooks`，确保写入经过验证且文件结构一致。唯一例外是 `detector.extensions` 没有管理 action；用户要求覆盖模板技术栈时，只直接编辑 `.impeccable/config.json` 的该字段，其他内容保持不动。
- 不要在此流程中编辑 `impeccable hook`、`impeccable hook-before-edit` 背后的 launcher 或 binary，它们属于 Skill 管道。
- Cursor 可在检测到真实问题时阻止拟议写入。Claude Code、Codex 和 GitHub Copilot 不阻止编辑，而是在编辑后提醒。禁用 hook 会同时停止阻止与提醒。
- Hook 随 Impeccable Skill 打包，通过项目本地 manifest 安装：`.claude/settings.local.json`、`.codex/hooks.json`、`.cursor/hooks.json`、`.github/hooks/impeccable.json`、`.gemini/settings.json`。Codex 首次使用时需要用户通过 `/hooks` 批准。Cursor 中确认 Settings -> Hooks 已启用。GitHub Copilot CLI 在文件提交到默认分支后才加载 `.github/hooks/impeccable.json`，云 Agent 直接从仓库读取。

## 失败模式

- `.impeccable/config.json` 或 `.impeccable/config.local.json` 无法读取或格式错误时，hook 忽略该文件，继续使用其他有效配置或默认值。`impeccable hooks status` 会把格式错误文件显示为 ignored。
- 用户要求全局“disable the hook”时，先给出 `{{command_prefix}}impeccable hooks off`；它对当前项目持久生效，并在配置中写入 `hook.enabled: false`。旧环境变量 `IMPECCABLE_HOOK_DISABLED=1` 仍可作为随 shell 生效的一次性覆盖。
