> **还需要补充的上下文**：仅当请求中的目标元素无法唯一解析时，才需要用户说明目标元素。

Generate 是进入 Live 模式的快速通道：用户用一句话指定元素、方向和数量，一分钟内即可在浏览器中切换多个变体。一条命令启动 helper，把元素交给宿主已经展示的页面浮层（滚动到元素、选中它，并触发与点击 Go 相同的事件），然后返回 generate 事件；一次编辑写入所有变体；一次调用回复事件并等待用户选择，helper 会把选择写入源码。本文件负责这条通道的管道；事件之后的设计工作完全由 [live.md](live.md) 负责。如果本会话尚未完整读取它，现在先读取。

**仅适用于 Web。** Live 浏览器浮层没有原生平台等价物；对于 `ios` / `android` / `adaptive` 项目，应拒绝本命令，并建议直接对源码使用 `bolder` 或 `quieter`。

快速通道节省的是管道时间：一条命令围绕宿主已展示的页面启动会话，一次调用回复并等待，不需要你持续看守浏览器。设计工作本身并未缩减。Setup 与其他命令相同，运行 `impeccable context`，读取本文，并在编辑前读取 craft-floor.md；变体的规划、编写和接受方式也与普通 Live 会话完全一致。

以下三条禁令覆盖已知失败方式：

- **绝不要运行 init 或 document，也不要索要 PRODUCT.md 或 DESIGN.md。** 文件存在时，启动命令会在 `boot` 中输出并使用；不存在时会通过 `contextMissing`、`contextNote` 说明，随后从事件中提取身份（步骤 3）。缺失文件绝不是在本命令中访谈用户的理由；会话结束后用一句话建议使用 `init`。
- **绝不要手写 variants wrapper 或虚构 session id。** 只有浏览器能在 Go 时生成 8 位十六进制 session id。缺少事件时重新执行步骤 2，绝不能直接编辑源码绕过。
- **文件仍含 Live marker 时不要处理 hook finding**，也不要为了迎合 finding 重新设计变体；accept 会在变体永久化后验证文件。

## 步骤 1：解析请求

全部从用户的一句话提取三个部分：

- **请求中有数字**：该数字就是数量。**没有数字**：默认 3。协议上限为 8。
- **方向措辞**映射到 Live action 词汇；绝不要发明新的 action 值：
  - **大胆、更强、更有冲击力**：`bolder`
  - **安静、平和、柔和、降低强度**：`quieter`
  - **简洁、极简、删减**：`distill`
  - **精致、收紧、打磨**：`polish`
  - **字体与排版词汇**：`typeset`
  - **颜色词汇**：`colorize`
  - **排列与间距词汇**：`layout`
  - **设备与断点词汇**：`adapt`
  - **动效词汇**：`animate`
  - **有趣、俏皮词汇**：`delight`
  - **打破规则词汇**：`overdrive`
  - **带有意图但不属于上述词汇的措辞**（如“像银行一样”“更温暖”“更高端”）：使用 `impeccable`，并把用户原话作为 prompt。
  - **既匹配 action 又带额外意图**（如“更大胆，但保持单色”）：使用对应 action，其余内容作为 prompt。
  - **完全没有方向的措辞**（如“更好”“改进”“更漂亮”“不同”“新鲜”“重新设计”“修复”“给些选项”“想法”“替代方案”，或只说“变体”）：{{ask_instruction}} 只问一个问题并给出词汇：*“这些变体应采用什么方向？更大胆（bolder）、更安静（quieter）、更简洁（distill）、精修（polish）、排版（typeset）、色彩（colorize）、布局（layout）、动效（animate）、趣味（delight），还是打破规则（overdrive）？”* 按本列表映射回答；若回答仍然开放，如“给我惊喜”“你决定”，则使用 `impeccable`，把用户原始措辞作为 prompt，并在获得答案后开始步骤 2。
- **元素描述**（如“价格卡片”“Hero 标题”）：步骤 2 将其解析为 selector。

当你已经获得一个词汇表中的 action、1～8 的数量和元素描述时，本步骤完成。请求未指定方向时必须先询问。

## 步骤 2：复用页面并启动

**复用**已经运行的开发服务器和宿主已经展示的标签页；本步骤就是为了避免启动第二个服务器或打开第二个浏览器窗口。

1. **查找开发服务器**，按成本从低到高，在第一次命中后停止：用户消息、已经打开应用的浏览器标签页（Claude Code：`tabs_context` 中的 origin）、宿主启动的服务器（Claude Code：`preview_list`）、打印 URL 的终端。其 origin 用作 `--dev-url`。**没有命中**：省略 `--dev-url`，运行启动命令且不等待；boot 会探测服务器并说明下一步。`browser_needed` 会返回发现的 `devUrl`：按第 2 项打开，再使用 `--dev-url <devUrl> --wait-for-browser 60000` 重试。`no_dev_server` 表示没有服务：按结论指定的方式启动开发脚本（Claude Code：`preview_start`；Cursor：后台终端；Codex：可 yield 的 exec），等待 URL，再带 `--dev-url <url>` 重试。
2. **在浏览器中打开渲染该元素的页面，然后启动。** 使用请求指定的路由，否则使用 `--target` 对应页面；`--dev-url` 只接受 origin。
   - **Cursor**（`browser_navigate`）和 **Claude Code**（`navigate`；Browser 面板关闭时会打开，标签页已位于相同 origin 时从 `tabs_context` 取得 `tabId`）：打开 URL，再用 `--dev-url <url> --wait-for-browser 60000` 运行启动命令。boot 注入浮层，页面重新加载进浮层，同时命令等待。这些宿主只能由浏览器工具打开页面；engine 会忽略 `--open`。
   - **没有浏览器工具**（Codex 等）：使用 `--open --wait-for-browser 120000` 运行启动命令；它会打开系统浏览器，较长等待时间方便用户找到标签页。返回 **`browser_open_failed`** 时，用一句话告诉用户 `url`，再使用 `--wait-for-browser 120000` 重试。

```bash
{{scripts_path}}/impeccable live-generate --target src/App.jsx --dev-url http://127.0.0.1:5173/ --selector ".pricing-grid" --action bolder --count 3 --boot --wait-for-browser 60000
```

在 Cursor 和 Claude Code 中以前台方式运行；它会在等待时间内返回。Codex 中使用可 yield 的 exec，与步骤 3 运行 poll 的方式相同。

- `--target`：当请求或项目能明确判断时，填写渲染目标元素的文件，否则省略。
- `--dev-url`：步骤 1 获得的 origin；省略时由 boot 探测。
- `--selector`：优先使用唯一 class，其次是 landmark tag 加 class，最后才是 id；每个变体都会挂载元素副本，因此 id 会在 DOM 中重复。**请求用复数描述重复组件**（如“价格卡片”）时，应选择容纳整组组件的容器，使一份有作用域的样式表能重新设计每个实例。selector 不明显时，可以读取一次渲染元素的源码；不确定时使用 `--dry-run` 只解析和报告，不启动会话。
- `--boot`：运行本通道的 boot，重新为 helper 加载 PRODUCT.md 和 DESIGN.md；允许文件缺失；查找 dev URL；在 helper 生命周期内隐藏底栏；复用已经运行的 helper。结果随 `boot` 返回。
- 还可使用：`--prompt`、`--text`（只保留可见文字包含指定片段的匹配项）、`--index`（从 1 开始选择匹配项）。

按以下顺序读取输出：先读 `boot`；或根据 `boot.contextMissing` 与 `boot.contextNote` 把页面作为事实源；再读 `event`，即包含 `sessionId` 和用户点击 Go 时相同 `_instructions` 的 generate 事件。每个结论都带 `_instructions`，它优先于你对本文的记忆。以下情况需要你决定下一步：

- **`ambiguous`**：候选项已列出；选择它们的共同容器，或带 `--text "<visible text>"`、`--index <n>` 重试。
- **`dev_server_gone`**：等待页面期间服务器停止响应；按结论说明重新启动，再带 `--dev-url <url>` 重试。
- **`no_match`**：标签页没有打开渲染元素的路由，或 selector 错误。导航到正确路由后重试，或从源码推导更好的 selector，也可添加 `--text`。
- `bootError` 中的 **`config_missing` / `config_invalid`**：先遵循 [live-setup.md](live-setup.md)，再重试。
- `ok: true` 且 **`event: null`**：事件慢于等待时间；运行一次 `{{scripts_path}}/impeccable live-poll` 获取事件，然后继续。

当输出包含 `ok: true`、`sessionId` 和 `event`，且你最多只启动一个服务器、打开一个标签页时，本步骤完成。

## 步骤 3：生成

该事件是标准 `generate` 事件，包含所选元素的上下文、已经预检的 scaffold，以及指明 action 参考、规划章节和精确 splice 的 `_instructions`。严格按照 live.md 的 **Handle generate** 处理；从身份锁定到 done 回复都由它负责：按要求读取 action 参考和 craft-floor.md；按照第 4 节规划（先身份，再模式，再选择三个不同主轴，最后做眯眼测试）；按照第 7 节声明 knob；按照第 6 节交付（每个变体都完整替换目标元素，并在 scaffold 指定 splice 位置的一次编辑中写入预览 CSS 和全部变体）。快速通道不限制变体能力；普通 Live 会话能做的改变，如突出某一档、重构整组、重排卡片或改变表面，在这里同样允许。不要截图；接受前由浮层预览承担评审通道。

使用写入的文件，**一次调用完成回复和等待**：

```bash
{{scripts_path}}/impeccable live-poll --reply EVENT_ID done --file src/App.jsx --then-poll
```

它先回复 done，让浏览器挂载变体，再阻塞到用户做出选择。按宿主运行长等待的方式执行：**Claude Code** 使用工具最长超时（600000ms）以前台运行；**Codex** 使用可 yield 的前台 exec；**Cursor** 在后台终端运行，并为 `"type":"(accept|discard|variant_mount_failed|exit)"` 设置通知。绝不要传入很短的 `--timeout=`。运行期间没有其他工作：不要 sleep，也不要定时轮询输出；后台运行的宿主会在返回时唤醒你。`{"type":"timeout"}` 表示用户尚未选择，应再次运行 `live-poll` 并继续等待。如果浏览器切换到 GENERATING 后编辑失败，使用 `--reply EVENT_ID error "Short reason"`，不要加 `--then-poll`，让浮条重置。

随后用一句话告诉用户变体位置：*“三个 [更大胆] 的变体已经显示在 [价格卡片] 上：使用浮动栏箭头切换，通过 Tune 旋钮调整，然后 Accept 保留的版本。”*

不属于 replace 路径时，行动前读取 live.md 中对应章节：`scaffold.previewMode: "svelte-component"`、`mode: "insert"`、`variant_mount_failed`、`steer`、`manual_edit_apply`，以及任何 `fallback: "agent-driven"` 的 wrap 错误。

## 步骤 4：接受并关闭

步骤 3 的调用会返回用户选择。**`discard`**：无需处理。**`accept`**：通常 `_acceptResult.carbonize: true`；清理由 live.md 的 **Required after accept** 原样负责：把获选变体规则移动到原本拥有该元素的样式表中并使用真实 selector；固化选择的 knob 值；解除元素 wrapper 并删除所有 `data-impeccable-*` 属性；删除内联 `<style>` 块和两个 `impeccable-carbonize` marker；然后运行 `{{scripts_path}}/impeccable live-complete --id SESSION_ID`，确认 `phase: "completed"`。只有 accept 使用 `--bake` 时才会出现 `baked: true`；此时 helper 已经永久化变体，不需要 `live-complete`。

处理选择后立即关闭，无需等待用户要求：

```bash
{{scripts_path}}/impeccable live-server stop
```

停止会移除注入脚本并重新加载页面一次；用户看到没有浮层 chrome 的获选设计，同时仍由其开发服务器提供服务。**绝不要终止或重启开发服务器**，包括步骤 2 中由你启动的服务器。

- **关闭前用户要求更多变体**：暂不关闭，对下一个元素重新运行步骤 2；helper 会被复用，最后一次选择后再关闭。
- **工作被中断或不确定状态**：运行 `{{scripts_path}}/impeccable live-status`，再运行 `live-resume`；`.impeccable/live/sessions/` 下的 journal 是唯一事实源。

当 helper 已停止，且开发站点仍正常展示获选设计时，任务完成。
