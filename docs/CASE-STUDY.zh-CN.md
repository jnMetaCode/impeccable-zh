# 演示案例：把拥挤的中文表单改成可上线体验

> 这是基于仓库测试夹具的可复现演示，不是真实客户案例，也不包含未经验证的转化率或性能提升声明。

## 场景

一个使用 Element Plus 的企业后台表单需要适配桌面与手机。原始版本功能可用，但存在典型问题：中文标签换行不可控、输入区间距拥挤、手机触摸目标偏小、提交与取消动作层级不清晰，而且没有加载、失败和超长内容状态。

演示输入保存在 [`tests/localization-evals/zh-CN/fixtures/adapt-element-plus-form/App.vue`](../tests/localization-evals/zh-CN/fixtures/adapt-element-plus-form/App.vue)，对应行为评测场景为 `zh-adapt-element-plus-form`。

## 建议工作流

```text
/impeccable init
/impeccable audit 用户资料表单
/impeccable typeset 用户资料表单
/impeccable adapt 用户资料表单 手机端
/impeccable polish 用户资料表单
```

## 改进目标

| 原始风险 | 中文版指导重点 | 可验证结果 |
|---|---|---|
| 标签与帮助文字互相挤压 | 中文行长、行高和标点规则 | 320px 宽度下无横向滚动，标签不被裁切 |
| 手机沿用桌面密度 | 触摸目标与单列断点 | 交互目标至少 44×44 CSS px |
| 主次动作权重相同 | 中文 UX 文案与危险动作层级 | 主动作明确，取消动作可识别且不抢夺注意力 |
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

将 `MODEL_ID` 替换为评测 harness 支持且已配置凭证的模型。执行全部四个场景后，按输出路径打开结果文件，逐条补充 verdict 与证据，再将 `RESULT_FILE.json` 替换为实际结果文件名评分。示例中的大写名称是占位符，需要先替换。当前文档提供输入与验收目标，尚未附上完成改造后的实现、前后截图或真实模型评分结果。

公开展示时应继续使用“演示案例”这一名称。只有取得真实项目授权、保留前后证据并完成测量后，才能把案例描述为客户案例。
