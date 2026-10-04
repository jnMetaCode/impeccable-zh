# 中文行为评测

本目录保存可提交的评测规范与合成 fixture。真实模型轨迹写入被 `.gitignore` 排除的 `evals/zh-CN/runs/`，避免把潜在敏感输出或大体积轨迹直接提交。

## 1. 前置条件

- 先运行 `npm run localization:build`；
- 准备 Impeccable engine，或设置 `IMPECCABLE_BIN`；
- 只配置准备评测的模型凭证；
- 显式指定模型，不存在默认付费模型。

执行器复用上游 Skill behavior harness。它把文件工具限制在一次性合成工作区，但 bash 是真实宿主 shell，不是安全沙箱；fixture 不得包含真实凭证或用户数据。

## 2. 运行

运行单个任务：

```bash
npm run localization:eval:run -- \
  --model=claude-sonnet-5 \
  --scenario=zh-typeset-finance-dashboard
```

运行全部 4 个任务：

```bash
npm run localization:eval:run -- --model=claude-sonnet-5
```

支持的凭证名称与上游 harness 一致：`ANTHROPIC_API_KEY`、`OPENAI_API_KEY`、`GOOGLE_CLOUD_API_KEY`、`DEEPSEEK_API_KEY`。执行前应核对模型名称、价格和调用权限。

每个输出结果最初都将 criteria 标记为 `unscored`，因此不能直接通过评分。

## 3. 证据评审

逐条检查结果中的 `assessments`：

- `kind: must`：要求行为发生；
- `kind: mustNot`：要求禁用行为没有发生；
- `verdict: pass`：该条要求得到满足；
- `verdict: fail`：该条要求未满足；
- `verdict: unscored`：尚未评审，整个场景保持 incomplete；
- `evidence`：至少一条具体轨迹、文件 diff、最终输出或截图证据，不能只写“看起来正确”。

不要改动 criterion 的 `kind` 或 `text`。评分器要求它们与冻结场景完全一致，防止通过删改验收条件制造成功结果。

## 4. 离线评分

```bash
npm run localization:eval:score -- \
  --results=evals/zh-CN/runs/<run>.json
```

只有以下条件全部满足才返回成功：

1. 上游 commit 与评测规范一致；
2. 四个场景都有结果且模型正常完成；
3. 每个场景加载了要求的命令引用和中国增强引用；
4. 所有 must / mustNot 均有 `pass` 结论和非空证据；
5. 没有未知、重复或被篡改的 criterion。

评测结果应按模型、时间和 commit 独立报告。单个模型通过不能推断其他模型或真实 Claude Code、Codex、Cursor 宿主也通过。
