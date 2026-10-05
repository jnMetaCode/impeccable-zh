# 贡献指南

感谢你帮助改进 Impeccable 中文社区增强版。本仓库优先接受中文本地化、中国产品设计增强、文档、测试以及 Provider 兼容性修复。

## 先确认改动属于哪里

- **简体中文翻译**：修改 `locales/zh-CN/`。
- **繁體中文翻譯**：修改 `locales/zh-TW/`；请使用台湾常用术语并通过术语门禁。
- **中文原创增强**：简体位于 `extensions-cn/`，繁体位于 `locales/zh-TW/extensions/`。
- **本地化、网站或测试工具**：修改 `scripts/localization/`、`scripts/web/`、`web/` 或 `tests/`。
- **上游通用引擎、英文 Skill 或 Provider 能力**：通常应先向 [pbakaus/impeccable](https://github.com/pbakaus/impeccable) 提交；本仓库通过上游同步机制接收这些变化。

不要直接把中文写入英文事实源 `skill/`，也不要手工修改构建生成的 Provider 目录。

## 开始贡献

除明显的错别字和小型文档修正外，请先创建 Issue，说明问题、目标语言、影响的 Provider 和建议验收方式。涉及大量翻译、上游结构或新功能时，等待维护者确认范围后再实现，避免重复工作。

建议流程：

1. 从最新 `main` 创建短期分支。
2. 保持改动聚焦；翻译、功能和大规模格式化不要混在同一个提交中。
3. 为行为变化补充测试或可复现 fixture。
4. 更新相关 README、案例或变更日志。
5. 在 PR 中披露 AI 辅助的范围，并人工审阅最终差异。

## 本地验证

需要 Node.js 22.18+。安装依赖后，至少运行与你的改动对应的检查：

```bash
npm install --ignore-scripts
npm run localization:check -- --release
npm run localization:test
npm run web:test
npm run web:build
```

修改简体或繁体内容时，还需验证对应发行构建：

```bash
npm run localization:build
npm run localization:build:zh-TW
```

完整上游开发和引擎测试说明见 [`docs/DEVELOP.md`](docs/DEVELOP.md)。

## 翻译要求

- 保留命令名、代码标识符、JSON 字段、配置键和文件路径。
- 不删除或弱化上游安全限制、确认步骤及失败条件。
- 术语优先遵循对应语言目录的 `glossary.yml`。
- 不以机器转换结果直接替代人工语义审校。
- 上游文件变化时，不要只更新 source map；必须复核并同步对应译文。
- 中文原创内容需要明确可执行的规则、示例或验收方式，不能只有风格形容词。

## Pull Request 检查清单

- 说明改动解决的具体问题和验证证据。
- 链接已获确认的 Issue（小型文档修正除外）。
- 列出运行过的命令及结果。
- 涉及界面时附桌面和移动端截图。
- 涉及翻译时说明语言变体，并确认术语检查通过。
- 披露使用过的 AI 工具和人工复核范围。

提交贡献即表示你同意相关内容按本仓库的 [Apache-2.0 许可证](LICENSE)分发，并确认你有权提交这些内容。
