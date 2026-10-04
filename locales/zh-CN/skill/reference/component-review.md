# 计划与资源评审

在以设计稿驱动的构建中，当每个栅格区域都有 plate 且 plate 门禁已经评分、但尚未编写页面代码时，使用此检查点。已批准设计稿是参考。用户评审两件事：最终交付的 plate，以及其他内容的生产计划，即哪些区域由代码绘制。把绘制区域错误规划为代码，是此类构建中代价最高的错误，用户应在这里发现它。文字、控件和 chrome 稍后在组装好的首屏中评审。

## 规划、捕获与提供评审

运行 `{{scripts_path}}/impeccable component-review plan`。它根据测量规范、设计稿和 plate 文件生成 `.impeccable/review/components.json`；任何栅格区域缺少 plate 时都会拒绝，并逐项列出。此阶段绝不要手写或编辑该文件：评审包由规范派生，所有改动都应写入 regions 文件。

如果宿主提供 `component_review`，以 `.impeccable/review/components.json` 作为 `manifest_path` 调用。宿主会捕获内容、展示评审并返回用户决定。请求暂停表示正在等待用户，不是构建失败或已经批准。

否则运行 `{{scripts_path}}/impeccable component-review capture --manifest .impeccable/review/components.json`，再在后台启动 `{{scripts_path}}/impeccable component-review serve --session <returned session>`。在可用浏览器中打开它输出的 URL 并等待用户；提交后 `serve` 以 0 退出。使用 `{{scripts_path}}/impeccable component-review status --session <id>` 读取决定；`{{scripts_path}}/impeccable component-review verify --manifest .impeccable/review/components.json` 确认批准，并拒绝 pending、needs-work 和过期输入。绝不要替用户提交页面或写回执。

会话没有浏览器时 `serve` 以 2 退出；空闲 30 分钟仍无决定而关闭时以 4 退出。两种情况都表示无人评审：停止等待，不要自行批准，也不要越过检查点继续构建。结束本轮并报告计划与资源评审仍待处理，同时给出 session ID，方便用户恢复。等待中的评审是待办，不是完成的构建。

## 按回执执行

严格执行用户决定，绝不能用自己的有利判断代替。

- **approve**：全部项目获批且清单确认后，进入 hero 阶段。
- **revise**（plate）：按用户反馈在同一路径重新生成 plate。
- **revise with split**（资源）：在 regions 文件中用多个图层替换该区域：带透明开口的框架 plate（`kind` 为 `plate`，box 相同）、开口位置的独立 `image` 内容，以及每个运动部件各自的 plate。按原区域命名为 `<id>-frame`、`<id>-view` 或 `<id>-shutter-left`。重新运行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>` 并生成 plate。
- **revise**（计划项）：按反馈修改 regions 文件，如调整栅格区域大小、拆出独立材质 plate 或调整代码区域；重新运行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>` 并生成新 plate。
- **reclassify**（代码区域）：把该区域的 `kind` 改为用户选择的类型，重写 `note` 描述材质。重新运行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>` 并生成 plate；有子 Agent 时使用资源生产 Agent。
- **missing**：把区域加入 regions 文件，重新运行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>`；若为栅格内容则生成 plate。

随后重新运行 `plan`、`capture` 和 `serve`。未变化的决定会沿用，用户只看到变化内容。任何规范变化，或已接受 plate 被替换，都需要新一轮评审；当前规范获批前，构建阶段门禁保持关闭。

## 组装与评审

使用获批 plate 和计划构建首屏，并运行 hero 门禁。人工评审不会免除完整性检查。hero 连续失败三次后，停止迭代，使用当前构建展示首屏评审；当读数无法判断时，由用户视觉决定。

在 `.impeccable/review/hero.json` 提供第二份 manifest，将 `id` 和 `stage` 设为 `hero`。使用一个覆盖组装首屏的页面预览组件、真实 HTML 入口和完整依赖列表（只能是本地路径）。参考仍是已批准设计稿。调用同一个宿主评审工具，或对该 manifest 运行 `capture`、`serve` 和 `verify`。needs-work 反馈会启动新一轮组装。

接受后，本次构建的人工评审结束：不要再次请求计划、资源或组装审批。只要页面仍呈现用户接受的内容，hero 分数、色板检查和所有数值读数都只是建议；材质否决仍有效，例如 plate 缺失或未引用、SVG 插图、有机裁剪、plate 被裁切、虚构笔触或渲染存在性失败。当捕获结果不再匹配已接受截图时，恢复用户接受的结果；否则继续遵循读数。以已接受首屏作为视觉方向，完成其余页面、响应式行为、收尾检查和文档。这只是首屏校准，不代表用户评审了页面其余部分。共享样式表改动不会重新开启审批。保留获批方向；用户之后明确要求的变化是新任务。

组装页面捕获会执行固定输入中的内联脚本和已声明本地脚本。网络 API、frame 和 worker 不可用；初始视口必须在捕获前稳定。保留真实页面并声明脚本，不要为了通过评审而移除行为。
