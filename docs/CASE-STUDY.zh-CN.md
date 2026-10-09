# 中文表单适配：输入夹具与参考实现

> 这是基于仓库测试夹具的演示与 AI 辅助编写的参考实现，不是真实客户案例或模型效果评测，也不包含未经验证的转化率或性能提升声明。

## 场景

原始 Vue 3 + Element Plus 表单只有信用代码、合同日期和一个保存按钮。固定 96px 标签区容易挤压中文长标签；没有配置中文日期 locale、字段校验和保存逻辑。不能把这个最小输入描述成已经具备完整业务功能的产品。

演示输入保存在 [`tests/localization-evals/zh-CN/fixtures/adapt-element-plus-form/App.vue`](../tests/localization-evals/zh-CN/fixtures/adapt-element-plus-form/App.vue)，对应行为评测场景为 `zh-adapt-element-plus-form`。

## 可运行的参考实现

[`demos/chinese-form/`](../demos/chinese-form/README.md)直接挂载原始夹具作为 before，提供另写的 Vue 3 + Element Plus 实现作为 after。两者使用同一依赖锁文件；before 保留默认 locale 与组件尺寸，after 使用中文 locale 和较大的表单控件。

```bash
npm --prefix demos/chinese-form ci --ignore-scripts
npm --prefix demos/chinese-form run dev
```

在终端提供的地址切换“原始输入 / 参考实现”。after 提供 640px 以下顶部标签、中文日期、输入校验和模拟保存/失败重试。所有保存均为计时器模拟，无服务器请求，也不验证企业真实性。

已验证：生产构建通过。待验证：浏览器交互与截图、200% 缩放、真实设备和完整无障碍检查。本机 Chrome 在沙箱中启动异常退出，不能据此宣称界面验收已通过。浏览器检查命令与证据输出位置见[演示说明](../demos/chinese-form/README.md#浏览器验收与截图)。

## 建议工作流

```text
/impeccable init
/impeccable audit 客户资料表单
/impeccable typeset 客户资料表单
/impeccable adapt 客户资料表单 手机端
/impeccable polish 客户资料表单
```

## 改进目标

| 原始风险 | 中文版指导重点 | 可验证结果 |
|---|---|---|
| 标签与帮助文字互相挤压 | 中文行长、行高和标点规则 | 320px 宽度下无横向滚动，标签不被裁切 |
| 手机沿用桌面密度 | 触摸目标与单列断点 | 表单输入与动作按钮至少 44px 高；日期网格单元格单独检查 |
| 没有保存反馈与恢复路径 | 中文 UX 文案与动作层级 | 保存与清空动作可区分，失败保留输入并支持重试 |
| 只验证理想输入 | 中文长姓名、长组织名和错误文案 | 超长内容、加载、失败、空值均有稳定布局 |
| 直接套用框架默认值 | Element Plus 语义与覆盖边界 | 优先使用组件能力，定制样式不破坏状态和键盘操作 |

## 为什么它能被复核

- 输入夹具随仓库提交，不依赖截图叙事。
- 评测要求加载 `adapt.md`、`chinese-typeset-cn.md` 和 `china-ui-frameworks-cn.md`，能检查中文增强是否真正参与推理。
- 自动化评分器不接受“看起来不错”之类无证据结论；缺少逐条证据会被标记为 `incomplete`。
- 确定性规则与模型评审分开：61 条规则负责可重复检查，模型负责上下文判断。

## 复现

先完成中文构建，再根据 [`tests/localization-evals/README.md`](../tests/localization-evals/README.md)配置模型和本地 engine：

```bash
npm run localization:build
npm run localization:eval:run -- --model="MODEL_ID"
npm run localization:eval:score -- --results="evals/zh-CN/runs/RESULT_FILE.json"
```

将 `MODEL_ID` 替换为评测 harness 支持且已配置凭证的模型。执行全部四个场景后，按输出路径打开结果文件，逐条补充 verdict 与证据，再将 `RESULT_FILE.json` 替换为实际结果文件名评分。示例中的大写名称是占位符，需要先替换。参考实现不参与这套模型评分；当前尚未公开浏览器前后截图或真实模型评分结果。

公开展示时应继续使用“演示案例”这一名称。只有取得真实项目授权、保留前后证据并完成测量后，才能把案例描述为客户案例。
