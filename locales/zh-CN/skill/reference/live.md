交互式 Live 变体模式：在浏览器中选择元素和设计 action，通过开发服务器 HMR 热替换 AI 生成的 HTML+CSS 变体。

## 前置条件

需要一台运行中且支持 HMR 的开发服务器（Vite、Next.js、Bun 等），或浏览器中打开的静态 HTML 文件。默认端口被占用时，应用很可能已经运行；先探测默认 URL，不要启动第二台服务器。

Live 编辑需要本地 checkout；不支持向已经部署的生产站点（包括 HTTPS）注入。检查生产站点时使用 `{{scripts_path}}/impeccable detect <url>` 或浏览器扩展，不要使用 Live helper。绝不要为了启用 Live 模式而关闭浏览器安全机制或削弱生产 CSP。

<codex>
Codex：从一开始就使用 `sandbox_permissions: "require_escalated"` 运行 Live helper 命令、应用开发服务器和任何会安装依赖的设置；Live 模式依赖 localhost 和包管理器网络访问，这些会被 sandbox 阻止。
</codex>

## 契约（只需完整读取一次）

严格按顺序执行，不得跳过或重排。Live 模式的任何工具输出都可能带 `_instructions`；它针对当前实际 id 和路径给出权威下一步。与本文记忆冲突时，以 `_instructions` 为准。

1. `impeccable live`：启动。如果请求点名或暗示 monorepo 中的文件、路由或应用，推断具体路径并改为运行 `{{scripts_path}}/impeccable live --target <path>`；随后从返回的 `projectRoot` 运行本次 Live 会话。Boot 根据 dev-server 配置解析应用根目录并写入 `.impeccable/live/roots.json`；每个 helper 启动时都重新锚定该 manifest，错误 cwd 不会分叉会话状态。PRODUCT.md / DESIGN.md 向上查找到 Git 根目录；`--file` 等相对参数以应用根目录解析。
2. 打开提供 `pageFile` 的应用 URL，可从 `package.json`、文档、终端输出或已打开标签页推断。绝不要使用 `serverPort`，它属于 helper，不是应用。**Cursor：** 轮询前必须用 `browser_navigate` 打开 URL。**其他宿主：** 使用可用浏览器工具；URL 不确定时只询问用户一次。
3. 使用默认长超时（600000ms）进行轮询。每个事件或 `--reply` 后立即重新运行 `impeccable live-poll`；Codex 在前台运行一次性 poll。绝不要传很短的 `--timeout=`。没有进程轮询 `/poll` 时，全局栏的 **Impeccable 标记**会变暗并显示脉冲琥珀点；重新运行 poll 即可连接。
4. 收到 `generate`：存在 `event.scaffold` 时复用；有截图时读取；加载 action 参考；交付变体；`--reply done`；继续轮询。在当前线程生成，你已经掌握项目 token 和布局。浮层预览就是验证通道；generate 到 accept 之间不要截图、重新渲染或 QA 变体。编写时直接满足 craft-floor 的对比度、间距和排版底线；只在 accept 后对获选变体执行一次完整验证。
5. 收到 `steer`：读取 message 和 `pageUrl`；完成工作；`--reply steer_done`；继续轮询。无需领取确认。
6. 收到 `accept` / `discard`：poll 脚本运行 `impeccable live-accept`、确认交付并输出 `_completionAck`。普通 accept/discard 立即终止；carbonize accept 在运行 `impeccable live-complete --id EVENT_ID` 前仍可恢复。继续轮询前必须完成清理。
7. 中断后先运行 `impeccable live-status` 或 `impeccable live-resume`，不要猜测。`.impeccable/live/sessions/` 下的 journal 是事实源；helper 重启后会重放未确认工作，页面重开后注入的 `live.js` 会重新连接。只有 `live-resume` 报告没有活动会话时才回退直接编辑，不能仅因多次断线就回退。
8. 收到 `exit`：执行文末 Cleanup。

宿主策略：
- **Claude Code**：poll 作为后台任务运行，不设短超时；宿主在完成时通知。不要阻塞 shell。
- **Cursor**：在后台终端运行一次性 poll，并为 `"type":"(steer|generate|accept|discard|manual_edit_apply|variant_mount_failed|prefetch|exit)"` 设置通知；处理事件、`--reply`、重启 poll。不要在 Cursor 使用 `--stream`。
- **Codex**：默认在可 yield 的前台 exec session 运行一次性 poll。不使用 `&`、不使用 `--stream`，Live 期间始终保持活动的前台 poll。仅启动不够，必须持续读取 exec session，直到返回事件。不要说“等待用户”后闲置；无人读取的 yielded poll 是死会话，用户的 Go 不会得到处理。
- **其他宿主**：除非确认 shell 退出后 stdout 能可靠返回，否则使用一次性前台 poll。

交付策略：所有宿主默认一次原子编辑交付；除非已知其 poll loop 不会被额外调用阻塞，否则不要改为渐进发布。

聊天是额外开销。不要复述、不要输出教程、不要粘贴 PRODUCT / DESIGN 内容。把 token 用于工具和编辑；失败时只说一两句。

## 轮询循环

```
LOOP:
  {{scripts_path}}/impeccable live-poll   # default long timeout; no --timeout=
  Read JSON; dispatch on "type"

  "generate"  → Handle Generate; reply done; LOOP
  "steer"     → Handle Steer; reply steer_done; LOOP
  "accept"    → Handle Accept; complete carbonize cleanup if required; LOOP
  "discard"   → Handle Discard; LOOP
  "prefetch"  → Handle Prefetch; LOOP
  "manual_edit_apply" → Handle Manual Edit Apply; reply done|partial|error; LOOP
  "variant_mount_failed" → Fix the variant files; reply done --file <path>; LOOP
  "timeout"   → LOOP
  "exit"      → break → Cleanup
```

`variant_mount_failed` 表示浏览器无法渲染已发布内容（包含 `variant`、module `url`、`error`）。用户看到持续显示的错误卡片，而不是变体。修复变体文件后执行 `--reply EVENT_ID done --file <manifest or source path>`；浏览器会自行重试。

**Stream 模式**（`--stream`，实验性，Cursor 禁用）：一个长期进程，每个事件输出一行 JSON；使用另一条命令 `--reply`。仅适用于能可靠读取增量 stdout 的宿主。

## 启动

```bash
{{scripts_path}}/impeccable live
```

输出 JSON：`{ ok, serverPort, serverToken, pageFiles, roots, hasProduct, product, productPath, hasDesign, design, designPath, hasSurfaceBrief, surfaceBrief }`。`roots` 是已解析根目录 manifest；`projectRoot` 等于 `roots.appRoot`。Surface brief 随结果返回，不要另行运行 `impeccable surface-brief`。生成时的优先级：**DESIGN.md 决定视觉；PRODUCT.md 决定持久产品信息和语气；surface brief 决定当前界面的策略。** 缺少 DESIGN.md 不代表没有身份；应从 CSS 变量、计算样式和同级组件中提取（步骤 4 阶段 A）。默认保留身份；只有用户明确要求重新设计时才偏离。

`serverPort` / `serverToken` 属于小型 helper HTTP 服务（`/live.js`、SSE、`/poll`），不是开发服务器；页面 URL 是实际提供某个 `pageFiles` 条目的 origin。

输出为 `{ ok: false, error: "config_missing" | "config_invalid", path }` 时，项目需要一次性配置：读取并遵循 [live-setup.md](live-setup.md)。`configDrift` 非 null 时，每次会话只告诉用户一次哪些 HTML 文件未覆盖，建议添加或把 `files` 改为 glob；绝不要自动修改配置。

## 恢复命令

`.impeccable/live/sessions/` 下的 append-only journal 是持久事实状态，不是项目源码。聊天中断、漏掉 poll、helper 重启或浏览器刷新后运行：

```bash
{{scripts_path}}/impeccable live-status      # helper state, active sessions, queued events; works with the helper down
{{scripts_path}}/impeccable live-resume --id SESSION_ID   # active snapshot, pending event, next safe action
{{scripts_path}}/impeccable live-complete --id SESSION_ID # canonical manual final acknowledgement after verified cleanup
```

服务器重启规则：再次启动 `impeccable live-server`，然后 poll；启动会重新排队未确认事件。除非 `live-resume` 表示不存在活动会话，否则绝不要让用户再次点击 Go。

## 处理 `generate`

**替换模式**（默认）：`{id, action, freeformPrompt?, count, pageUrl, element, screenshotPath?, comments?, strokes?}`。

**插入模式**（`event.mode === "insert"`）：`{id, mode: "insert", count, pageUrl, insert: { position, anchor }, placeholder: { width, height }, freeformPrompt?, screenshotPath?, comments?, strokes?}`。没有 `action`；必须包含非空 `freeformPrompt` 或 annotation。`placeholder` 只是柔性尺寸提示。

速度很重要，用户正在观看选中元素。复用预检元数据，减少发现调用。

### 插入模式分支

1. 有截图时读取，只用于 annotation。
2. 存在 `event.scaffold` 时直接使用，不要再次运行 helper。否则运行：

```bash
{{scripts_path}}/impeccable live-insert --id EVENT_ID --count EVENT_COUNT --position after \
  --element-id "ANCHOR_ID" --classes "class1,class2" --tag "section" --text "ANCHOR_TEXT"
```

`--position` 对应 `event.insert.position`；anchor flag 与 wrap 完全对应。Scaffold 没有 `data-impeccable-variant="original"`；变体是在 `insertLine` 新增的 HTML+CSS。Source-preview 目标会返回 `sourceWritten: false`、`wrapperBlock` 且 `replaceEndLine < replaceStartLine`：在 marker 处把变体拼入 `wrapperBlock`，并在 `replaceStartLine` 通过一次编辑插入，与 wrap 章节一致。根据界面选择访客模式，并在编写新 markup 前加载 [craft-floor.md](craft-floor.md)。Svelte 目标遵循下文与 wrap 相同的组件流程，manifest 中为 `mode: "insert"`：每个变体是 `componentDir` 下真实的单根组件，不含 `data-impeccable-*`；生成期间绝不编辑 route；accept 会机械地把获选 markup 拼入 `sourceFile`。非 Svelte 目标在 accept/discard 后移除 wrapper，anchor 不变。

### 替换模式（默认）

### 1. 读取截图（如果存在）

只有用户点击 Go 前进行了标注，才会发送 `event.screenshotPath`；它是已经合成 annotation 的元素 PNG。规划前读取。不存在时不要索要或自行截图：没有标注的截图会把设计锚定在现状，妨碍三个不同方向；应根据 `element.outerHTML`、计算样式和 prompt 工作。

Annotation 语义：comment 的 `{x, y}` 是元素局部坐标，文字约束该点下的子元素。Comment 与 stroke 相互独立，除非明显成对。Stroke 按形状解释：闭环表示“这个对象”（强调，不是裁剪区域）；箭头表示方向或移动；叉号/斜线表示删除；涂画根据上下文表示强调或删除。只有意图确实含糊且会改变简报时才问一个简短问题；否则用一句话说明你的理解。

### 2. 包装元素

存在 `event.scaffold` 时，helper 已找到源码并计算 wrapper；把它当作成功输出，跳过命令。存在 `event.scaffoldAttempted` 和 `scaffoldError` 时，预检未完成，使用下方命令。

**Source-preview 目标中的 `event.scaffold` 会带 `sourceWritten: false`。** Helper 没有写 wrapper，而是返回 `scaffold.wrapperBlock` 与选中元素的源码范围（`replaceStartLine`、`replaceEndLine`，从 1 开始）。通过**一次编辑**同时写入 wrapper 和所有变体：在 “Variants: insert below this line” marker 处把变体拼入 `wrapperBlock`，再用结果替换 `[replaceStartLine, replaceEndLine]`。若分两次写，框架会在变体到达前重载，使浏览器卡在 0/N。`replaceEndLine < replaceStartLine` 表示插入模式，只插入，不删除。`svelte-component` 路径永远不会设置 `sourceWritten`。

```bash
{{scripts_path}}/impeccable live-wrap --id EVENT_ID --count EVENT_COUNT --element-id "ELEMENT_ID" --classes "class1,class2" --tag "div" --text "TEXT_SNIPPET"
```

Flag 必须保持分开，绝不能合并成 `--query`：`--element-id` ← `event.element.id`；`--classes` ← 用逗号连接的 classes；`--tag` ← tagName；`--text` ← textContent 前约 80 字符，**每次调用都要提供**，它用于区分重复的同级组件；缺少时 wrap 会落到第一个匹配项。`event.pageUrl` 能推断文件时传 `--file PATH`。`--text` 仍匹配多个候选时，wrap 返回 `{ error: "element_ambiguous", candidates, fallback: "agent-driven" }`；根据页面上下文选择正确范围，并按 fallback 流程手写 wrapper。

成功输出：`{ file, insertLine, commentSyntax, styleMode, styleTag, cssSelectorPrefixExamples, cssAuthoring }`；source-preview 还包含上述 `sourceWritten: false` 字段。没有预检 scaffold 而直接运行时，命令会写 wrapper，你在 `insertLine` 插入变体。`styleMode` 决定预览 CSS 写法，把它视为检测出的能力模式，而不是框架猜测：`scoped` 使用 `@scope ([data-impeccable-variant="N"])`；`astro-global-prefixed` 使用明确的 `[data-impeccable-variant="N"]` 前缀和返回的精确 `styleTag`。以当前文件的 `cssAuthoring` 为事实源，遵循其 styleTag、selector 策略、要求和禁用模式；除非其中说明，否则不要自行添加框架例外。

Svelte/SvelteKit 目标会返回 `previewMode: "svelte-component"`：`file` 指向临时 `node_modules/.impeccable-live/<id>/manifest.json`，`componentDir` 存放变体组件，`sourceFile` 是真实 route。Scaffold 基于 AST，`{#each}`、`{#if}` 等控制流会保留；each 的自由 collection 作为一个结构化 prop（kind `collection`）穿过契约。Payload 已包含写入 stub 的 `componentStubMarkup`，不要重新读取 manifest 或 stub。原地编辑 `v1.svelte`、`v2.svelte` 等，绝不要删除重建；保留 stub 控制流和 `propContract` prop 名称，绝不要把循环展开为字面项目。Stub `<style>` 已包含当前选择的源规则，可以重新设计或删除。Accept 时，变体未重新声明的 seeded rule 会从源码删除，因为用户批准的预览中并未应用它。使用语义 class selector，不使用 `@scope` 或 `data-impeccable-*`。回复时 `--file` 指向 manifest；浏览器挂载编译后的组件，Svelte HMR 不会重置页面状态。Accept 会机械地合并获选组件：恢复 route 表达式、协调 CSS、固化参数并保留缩进；此路径无需 accept 后清理。不支持 detached preview 的结构，如组件 tag、`bind:`/`use:`、await block、inline script 和 spread attribute，会回退普通 source-preview wrapper，并返回 `previewFallback`；按返回结构处理。

**组件预览路径的参数写入 sidecar，绝不写属性**，因为 Svelte 会把属性值中的 `{` 解析为表达式。在 `componentDir/params.json` 按变体编号声明，schema 与第 7 节一致：

```json
{ "1": [ {"id":"density","kind":"steps","default":"snug","label":"Density","options":[
    {"value":"airy","label":"Airy"},{"value":"snug","label":"Snug"} ]} ] }
```

组件 `<style>` 对 range/toggle 使用 `var(--p-<id>, default)`；steps 使用 `[data-p-<id>="…"]`，并放在 `:global(...)` 中，让挂载根节点上的运行时 knob 值能影响规则。

**Fallback 错误。** Wrap 拒绝写入非源码文件（生成文件、未跟踪文件），因为向其 accept 会静默丢失数据。三种结构都带 `fallback: "agent-driven"`，见 **Handle fallback**：`file_is_generated`、带 `generatedMatch` 的 `element_not_in_source`、`element_not_found`。

### 3. 加载 action 参考

`event.action` 为 `impeccable`（freeform）时，使用 SKILL.md 设计规则和 [craft-floor.md](craft-floor.md)，根据界面决定访客模式，不加载子命令参考。Freeform 不能跳过参数，遵守第 7 节预算和 freeform 偏向。其他 action（`bolder`、`quieter`、`distill`、`polish`、`typeset`、`colorize`、`layout`、`adapt`、`animate`、`delight`、`overdrive`）在规划前读取 `reference/<action>.md`；其中 MUST 参数叠加在第 7 节预算上。

### 4. 规划三个变体：先身份，再模式，再主轴

Live 作用于已有界面，品牌已经确定。任务是在**同一身份内变化**，不是在多个身份间选择。最严重失败是三个用户无法接受的偏离品牌变体。按四个阶段执行。

#### 阶段 A：提取身份（不可跳过）

按优先级读取：DESIGN.md 视觉系统字段；CSS 自定义属性；选中元素和父元素的计算样式；同级组件的视觉修辞。用一句话记录实际画面：主要表面和强调色（真实值，不写“温暖”）、已加载字体搭配、布局拓扑、表面处理（圆角、边框、阴影、装饰密度）以及从文案读出的语气。必须具体；无法确认时省略该轴，不要虚构；不要使用审美类别名称。该句是**身份锁**，所有变体并排时必须仍属于同一品牌。缺少 DESIGN.md 不能成为借口。

#### 阶段 B：选择模式（默认或偏离）

**默认模式**保留身份，在其中改变表达，适用于约 90% 会话。**偏离模式**拒绝现有身份；只有用户在当前请求或 prompt 中明确要求“重新设计”“从零重建”“完全不同”时才能触发；旧 critique 或旧 note 不构成授权。不确定就使用默认模式：错误默认只会产生三个感觉相近的同品牌变体，可恢复；错误偏离会产生三个无法接受的异品牌变体。

#### 阶段 C：规划三个变体

**默认模式。** 每个变体选择不同的**主轴**，同时保留身份句。六个主轴：1 **层级**；2 **布局拓扑**；3 **排版系统**（在现有字体内改变搭配逻辑、比例、大小写或字重）；4 **色彩策略**（仅使用现有 token，以 Restrained / Committed / Full palette / Drenched 改变表面角色）；5 **密度**；6 **结构拆分**（合并、拆分、渐进披露）。三个变体必须采用三个不同主轴，是同一品牌的三个角度。新字体、新色相或新审美类别信号只属于偏离模式。

**偏离模式。** 每个变体锚定不同且从品牌推导的审美方向，绝不能使用固定目录：读取 PRODUCT.md 的 Brand Personality；推导体现这些词的物理、空间或材质体验；再推导三个彼此不同、也不同于当前界面的方向；拒绝任何也适用于相邻产品的惯性理由。每个方向用一句具体的现实参照描述，例如“博物馆展品标签系统”，而不是“干净极简”。

**两种模式都必须在规划时为每个变体命名 2～3 个参数 knob**，并遵守第 7 节预算。参数是设计的一部分；规划时决定“什么可调”优于事后补加。

#### 阶段 D：眯眼测试

**默认：** 将每个变体与阶段 A 身份锁对比；色板、字体声音或修辞漂移表示意外进入偏离模式，必须重做。再确认三个不同主轴；三个“密度更紧”的变体属于失败。**偏离：** 分两轮，先 family 后句子。Family 检查不可妥协：用自己选择的具体类别标记每个变体；标签相同或可以互换就重做。句子检查：并排比较三句描述，有两句押韵就重做。主轴为颜色或主题时，三个变体不能共享主题与主色相；必须是三个色彩世界，而不是三种深浅。

特定 action 必须沿其维度变化：

- `bolder`：分别放大不同维度，如尺度、饱和度、结构变化。
- `quieter`：分别收敛颜色、装饰、间距。
- `distill`：分别删除视觉噪音、重复内容、嵌套结构。
- `polish`：分别精修节奏、层级、微细节。
- `typeset`：每个变体的搭配和字阶比例都不同。
- `colorize`：使用不同色相家族，并改变色度和对比策略。
- `layout`：使用不同结构排列，不是微调间距。
- `adapt`：使用不同目标情境，如移动优先、平板、桌面、打印或低数据。
- `animate`：使用不同动效词汇，如级联错峰、裁切擦除、缩放聚焦、形变、视差。
- `delight`：使用不同个性形式，如微交互、排版惊喜、插图强调、声音或触觉、彩蛋。
- `overdrive`：分别打破不同惯例，如尺度、结构、动效、输入模型、状态转换；跳过其“提出方案并询问”步骤，因为 Live 是非交互式的。

### 5. 应用 freeform prompt（如果存在）

`event.freeformPrompt` 是用户设定的方向上限；所有变体在阶段 B 模式内用不同方式实现。默认模式中 prompt 限制主轴而不改变身份；例如“更自信”可分别强化层级、强调色和密度。偏离模式中 prompt 限制路径而不限制 family；例如“报纸头版”可分为大报、小报和行业刊物，再运行 family 检查。Prompt 与品牌承诺或 DESIGN.md 不变量冲突时，除非用户明确撤销，否则保留不变量。

### 6. 交付变体

每个变体都完整替换原元素的 HTML，不能只修改 CSS。预览 CSS 以 `<style>` 放在 wrapper 内。**默认原子交付：** 在 `insertLine` 的一次编辑中写入 CSS、全部变体和参数 manifest。

```html
<!-- Variants: insert below this line -->
<style data-impeccable-css="SESSION_ID">
  /* rules matching cssAuthoring.rulePattern */
</style>
<div data-impeccable-variant="1">
  <!-- variant 1: full element replacement (single top-level element) -->
</div>
<div data-impeccable-variant="2" style="display: none">
  <!-- variant 2 -->
</div>
<div data-impeccable-variant="3" style="display: none">
  <!-- variant 3 -->
</div>
```

工具返回不同 tag 时，用 `cssAuthoring.styleTag` 替换 style 开始标签。**每个 variant div 必须只有一个顶级元素**，且 tag 与原元素相同；松散同级会破坏 outline tracking 和 accept。第一个变体可见，其他均为 `display: none`。MutationObserver 支持原子或渐进到达；接受已到达变体会 fence worker，拒绝后续发布。

`styleMode: "scoped"` 时，每条 `:scope` 规则都必须包含后代组合符：`@scope` 边界是 variant wrapper div，不是你的元素；裸 `:scope { ... }` 会设置 `display: contents` 外壳。必须进入内部，如 `:scope > .card`、`:scope .hero-title`。仓库 [Agent 模板](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/live-e2e/agent.mjs) 中的测试 CSS 是可靠模板。

**JSX / TSX 目标：** `<style>` 内容使用 template literal；否则 CSS 大括号会被当作 JSX。使用 `className=` / `style={{…}}`，`data-impeccable-*` 属性保持普通字符串：

```tsx
<style data-impeccable-css="SESSION_ID">{`
  @scope ([data-impeccable-variant="1"]) { ... }
`}</style>
<div data-impeccable-variant="2" style={{ display: 'none' }}>
  {/* variant 2 */}
</div>
```

Wrap 脚本会返回 marker 位于内部的单根 JSX wrapper；把 block 放在 marker 处，源码仍为有效 TSX。

### 7. 参数（按构图规模，每个变体 0～4 个）

每个变体可暴露**粗粒度** knob；浏览器为每个参数停靠一个控件，无需重新生成，通过 CSS 变量或 data attribute 驱动 scoped CSS。用户可能自然地说“紧一点”“强调色多一点”时就应把该轴做成参数；微小 margin 和一次性位移不是参数。Freeform 下更应暴露你选择的轴；Hero 使用 0 个参数几乎总是错误，除非设计确实是固定点，否则 1 个也偏少。

预算按元素视觉重量计算，统计视觉子项而不是 DOM 深度：

- **叶子/微小元素**（按钮、图标、纯标题）：**0 个**。
- **小型构图**（简单卡片、带标签输入框、不超过约 5 个视觉子项）：**0～1 个**。
- **中型构图**（区块、导航组、6～15 个子项）：**目标 2 个**；简单时 1 个。
- **大型构图**（Hero、完整区域、16 个以上子项或多个子区块）：**目标 2～3 个**；独立轴都已用 CSS 实现时最多 4 个。

**硬上限为四个。** 命名子命令参考中的 MUST 参数在可表达时不可协商；仍须遵守上限，不要重复 knob。

HTML/JSX 路径使用 wrapper attribute 声明；组件预览路径改用 `componentDir/params.json`，schema 相同并按变体编号组织：

```html
<div data-impeccable-variant="1" data-impeccable-params='[
  {"id":"color-amount","kind":"range","min":0,"max":1,"step":0.05,"default":0.5,"label":"Color amount"},
  {"id":"serif","kind":"toggle","default":false,"label":"Serif display"}
]'>
```

三种类型：`range` 驱动 `--p-<id>`，使用 `var(--p-color-amount, 0.5)`；字段为 min/max/step/default/label。`steps` 驱动 `data-p-<id>`，使用 `:scope[data-p-density="airy"] .grid { ... }`；字段为 options/default/label。`toggle` 同时驱动 `--p-<id>: 0|1` 和属性是否存在；字段为 default/label。切换变体时参数会重置到声明的默认值，这是已知限制。

**Accept 时**，浏览器发送当前值，`impeccable live-accept` 把它写为同级 comment：`<!-- impeccable-param-values SESSION_ID: {"color-amount":0.7} -->`。Carbonize 清理会固化值：仅保留匹配的 `steps`/`toggle` 分支，删除其余；把 `:scope[data-p-…]` 收敛为语义规则；替换 `range` 字面值或更新变量默认值。

### 8. 发出完成信号

```bash
{{scripts_path}}/impeccable live-poll --reply EVENT_ID done --file RELATIVE_PATH
```

`RELATIVE_PATH` 相对于项目根目录；开发服务器没有 HMR 时，浏览器会直接获取源码。随后立即继续 poll。

### 中止进行中的会话

浏览器切换到 GENERATING 后 wrap 或生成失败，应通知**浏览器**重置浮条：`{{scripts_path}}/impeccable live-poll --reply EVENT_ID error "Short reason"`。绝不要为此使用 `live-accept --discard`；它只是文件修改器，浏览器看不到，浮条会一直显示圆点。`--discard` 仅用于浏览器自己发起 discard 后的源码清理。

## 处理 fallback

Wrap 返回 `fallback: "agent-driven"` 时，由你选择真实源码文件；目标不变：现在预览三个变体，获选版本持久化到下次构建不会覆盖的位置。

1. 根据错误 payload 找到元素真实来源：`element_not_in_source` + `generatedMatch` 表示 HTML 是生成的，应找到生成器 template/partial；`element_not_found` 表示运行时注入，应找到渲染组件或数据源；`file_is_generated` 同理。纯视觉变化可能属于共享样式表。
2. **在 served file 中预览**：把 `impeccable live-wrap` 生成的 wrapper scaffold 手动写入浏览器实际加载的文件：`<!-- impeccable-variants-start ID --><div data-impeccable-variants="ID" data-impeccable-variant-count="3" style="display: contents">…</div><!-- end -->`，插入 variant div，然后执行 `--reply EVENT_ID done --file <served file>`。这是临时编辑，被重新生成覆盖也没关系。
3. **Accept 时写入真实源码**；accept 会拒绝生成文件，因此此时 `_acceptResult.handled` 通常为 `false`。结构变化写 template/component；纯视觉变化写正确 stylesheet；数据渲染内容写数据源或渲染逻辑。随后从 served file 删除临时 wrapper。
4. **Discard 时**只删除临时 wrapper。

## 处理 `accept`

事件：`{id, variantId, _acceptResult, _completionAck}`。Poll 脚本已经确定性运行 `impeccable live-accept` 并确认交付；浏览器 DOM 已更新。

- Accept 事件包含 `pageUrl`；poll 脚本必须把它传给 `impeccable live-accept --page-url PAGE_URL`，使接受时清理只移除当前页面暂存的文案编辑。
- `_completionAck.ok !== true`：暂不 poll。运行 `live-status` / `live-resume`，必要时手动完成清理，再运行 `live-complete --id EVENT_ID`。
- `handled: true, carbonize: false`：无需处理，继续 poll。
- `handled: true, carbonize: true`：必须执行下述清理；`_acceptResult.todo`、`_completionAck.requiresComplete` 和 stderr banner 都会指向它。
- `handled: false, mode: "fallback"`：会话位于生成文件；你已在 fallback 步骤 3 写入真实源码，清理临时 wrapper 后继续 poll。
- `handled: false, mode: "error"`：**不要手动编辑文件。** `source_locked`：幂等地重试同一条 `live-accept` 命令，直到 publisher 释放。`accept_receipt_conflict`：会话已按 `priorOperation` 解决；运行 `live-status` 并告知用户。其他错误先简要报告，再运行 `live-status`。
- 没有 `mode` 的 `handled: false`：手动清理，读取文件、找到 marker 并编辑。

### Accept 后必须执行的操作（carbonize）

`carbonize: true` 表示获选变体已通过 helper marker 和 inline CSS 拼入源码，以确保浏览器无空档渲染。这只是临时状态；继续任何工作前都要改写为永久形式，否则 dead `@scope`、wrapper div 和 marker 会跨会话累积。下一次 poll 前同步完成五步：

1. 在 `_acceptResult.file` 定位 `<!-- impeccable-carbonize-start/end SESSION_ID -->` 包围的 carbonize block，其中包含 `<style data-impeccable-css>`；有 `<!-- impeccable-param-values -->` comment 时先读取，它驱动第 3、4 步。
2. 把 CSS 规则移动到项目真实样式表，即已经负责周围元素的样式表。
3. 重写 selector 时固化参数：把 `@scope ([data-impeccable-variant="N"])` 改为真实语义 class；仅保留匹配选择值的 `:scope[data-p-<id>="VALUE"]` 分支；替换 `var(--p-<id>)` 字面值或更新变量默认值。
4. 解除获选内容 wrapper：删除内部 variant div；JSX 中还要删除外层 `data-impeccable-carbonize` div；移除 `data-impeccable-params` 和全部 `data-p-*` 属性。
5. 删除 inline `<style>`、param-values comment、两个 carbonize marker，以及所有未获选变体的 `@scope` 规则。

随后运行 `impeccable live-complete --id SESSION_ID`，确认 `phase: "completed"` 后再 poll。这是门禁，不是形式：只要存在 Live 遗留，它会以 `error: "source_dirty"` 和 findings 拒绝。修复后重试；只有误报才能用 `--force`。

## 处理 `discard`

事件：`{id, _acceptResult, _completionAck}`。Poll 脚本已经恢复原内容并确认 `discarded`。除非 `_completionAck.ok !== true`，否则无需处理；异常时运行 `impeccable live-complete --id EVENT_ID --discarded`，再 poll。

## 处理 `steer`

事件：`{id, message, pageUrl}`。它是来自全局栏 Steer 控件的页面级方向，可以输入或语音触发；没有元素上下文，也不循环变体。读取 `message`，按需检查页面或文件，执行编辑或用文字回答。运行 `{{scripts_path}}/impeccable live-poll --reply EVENT_ID steer_done ["Optional short toast"]`；失败时使用 `--reply EVENT_ID error "Short reason"`，随后立即 poll。无需单独领取确认；`steer_done` 或 `error` 会解锁 Steer 栏。

## 处理 `prefetch`

事件：`{pageUrl}`。每个路由首次选择时触发一次；用户可能即将在你尚未读取的页面点击 Go。把路由解析到文件并读取：根 `/` 通常对应 boot 的 `pageFile`；多页面站点常把 `/foo` 映射到 `public/foo/index.html`；SPA 全部映射到同一入口。随后继续 poll，不需要 `--reply`。无法可靠解析时跳过并继续 poll。

## 处理 `manual_edit_apply`

事件：`{id, pageUrl, batch: {entries}, evidencePath?, chunk?, repair?, deadlineMs}`。

用户已经点击 Apply。不要再询问要做什么，不要 discard，也不要把他们重定向到 Go。父 Live 线程保持前台 poll loop，并发送最终 `/poll --reply --data`。

存在原生子 Agent 时，把源码编辑委派给 `impeccable_manual_edit_applier` / `impeccable-manual-edit-applier`。传递 cwd、scripts path、event id、page URL、chunk/deadline、`batch`、`evidencePath` 和规范 JSON 结果 schema。子 Agent 不能 poll 或 reply。不可用时用相同契约在当前线程执行。

存在 `repair` 时，表示上次 Apply 已修改源码但最终验证失败。修复当前源码并返回同一规范 JSON；不要自行回滚。浏览器会在任何回滚前询问用户。

源码编辑完成后只回复一次：`{{scripts_path}}/impeccable live-poll --reply EVENT_ID done --data '{"status":"done","appliedEntryIds":["8hexid"],"failed":[],"files":["src/page.html"],"notes":[]}'`。未全部应用时使用 `status:"partial"` 或 `status:"error"` 并填写 `failed[]`。随后继续 poll。绝不要省略 event id；manual Apply 不接受 `--reply done --file ...`。

## 退出

用户可以在聊天中要求停止、关闭标签页（SSE 断开，poll 约 8 秒后返回 `exit`），或点击浏览器 exit 按钮。收到 `exit` 后终止仍在运行的后台 poll，再执行清理。

## 清理

```bash
{{scripts_path}}/impeccable live-server stop
```

该命令停止 helper，并运行 `impeccable live-inject --remove` 移除注入脚本；需要快速重启时可用 `stop --keep-inject` 保留注入。`.impeccable/live/config.json` 作为项目配置继续存在。随后搜索并移除任何遗留的 `impeccable-variants-start` wrapper 和 `impeccable-carbonize-start` block。

## 首次设置

只有 `impeccable live` 报告 `config_missing` / `config_invalid`、需要解释 `configDrift`，或配置缺少 `cspChecked` 时，才读取 [live-setup.md](live-setup.md)。它负责配置 schema、各框架 `files` 表、注入适配器、漂移修复以及 CSP 检测和同意流程。
