# 变更日志

本文件记录 Impeccable 中文社区增强版的用户可见变更。英文上游自身的变更请查看 [pbakaus/impeccable](https://github.com/pbakaus/impeccable) 的发布记录。

在创建独立版本标签前，本项目按发布日期记录变更；源码安装时请固定 Git commit。

## Unreleased

- 暂无。

## 2026-10-04

- 新增繁體中文 `zh-TW` 完整本地化：43/43 个核心文件、3 个繁体增强参考和独立术语门禁。
- 新增繁体 README、案例、行为评测夹具与 `/zh-TW/` Web 使用中心。
- 本地化工具链改为支持多语言构建、检查、报告、合成与评测。
- CI 同时构建简体和繁体 Provider 产物，并保留简体为默认发行产物。
- 修复本地预览对 `/zh-TW/` 目录路由的处理。

对应提交：[`4f4359b4`](https://github.com/jnMetaCode/impeccable-zh/commit/4f4359b4aaaf2461675099b1da78a47f5ca6dd90)。

## 2026-10-03

- 上线响应式中文 Web 使用中心、Provider 安装向导和 24 个命令目录。
- 补充可复现的 Element Plus 中文表单案例与仓库首页展示图。
- 配置 GitHub Pages 自动部署和公网访问地址。

对应提交：[`c6480fb9`](https://github.com/jnMetaCode/impeccable-zh/commit/c6480fb9)、[`3d416801`](https://github.com/jnMetaCode/impeccable-zh/commit/3d416801)、[`f37ee817`](https://github.com/jnMetaCode/impeccable-zh/commit/f37ee817)。

## 2026-10-01

- 完成简体中文 `zh-CN` 43/43 个核心文件本地化。
- 新增中文排版、中文 UX 文案和中国常用 UI 框架三项原创增强。
- 建立逐文件 Git blob 漂移检查、覆盖率门禁、上游同步审计和行为评测框架。
- 验证 19 个 Provider 构建目标与隔离安装流程。

对应提交：[`694c3193`](https://github.com/jnMetaCode/impeccable-zh/commit/694c3193)。
