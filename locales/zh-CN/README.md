# 简体中文本地化源文件

这里保存 Impeccable 中文社区增强版的可维护翻译源，不保存生成后的宿主副本。

规则：

- `source-map.json` 中的 `sourceBlob` 锁定翻译所依据的上游文件。
- 上游文件变化后，校验会失败，必须人工复核并更新翻译与 blob。
- 命令名、配置键、JSON 字段、文件名和代码标识符保持英文。
- `<!-- rule:... -->` 标记和 `{{placeholder}}` 必须完整保留。
- 中国原创内容放在 `extensions-cn/`，不伪装成上游翻译。

验证：

```bash
npm run localization:check
npm run localization:report
```

生成临时中文 Skill 源树：

```bash
npm run localization:compose -- --out /tmp/impeccable-zh-skill
```

使用临时合成源运行上游构建，且不改写英文 `skill/`：

```bash
npm run localization:build
```

发布门禁要求全部跟踪源文件完成映射：

```bash
npm run localization:check -- --release
```

Alpha 阶段允许覆盖率低于 100%，但不得低于 `coverage-policy.json` 中持续提高的基线。
