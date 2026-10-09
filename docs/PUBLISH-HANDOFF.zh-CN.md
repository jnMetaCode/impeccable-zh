# 发布交接

本文由 AI 辅助撰写。当前环境不能连接 GitHub，且禁止创建 `.git/index.lock`；以下步骤需要在有正常 Git/GitHub 权限的终端执行。

## 1. 提交并上传项目改动

```bash
cd /Users/yx/work/GitHubEngCn/projects/impeccable-zh
git status --short
git diff --cached --check
git diff --cached
```

确认暂存区只含本次中文安装说明、案例说明和推广文档。发布前先获取远端状态，检查当前提交是否已包含最新 main：

```bash
git fetch origin
git log --oneline HEAD..origin/main
```

如果输出了提交，先检查并整合这些远端变化，重新验证后继续。不要 force push。

```bash
git add README.md README.zh-CN.md README.zh-TW.md docs/CASE-STUDY.zh-CN.md docs/CASE-STUDY.zh-TW.md docs/PROFILE-README-DRAFT.zh-CN.md docs/PROJECT-REVIEW.zh-CN.md docs/PUBLISH-HANDOFF.zh-CN.md
git diff --cached --check
git commit -m "Docs: clarify Chinese installation and prepare profile promotion" -m "Prepared with AI assistance. Unify source linking instructions, correct evaluation examples, and prepare a focused profile with live star badges."
git push origin HEAD:main
```

当前本地分支是 `localization/bootstrap`，所以明确推送 `HEAD:main`。推送失败时按具体错误处理；不要绕过保护分支或覆盖远端提交。本步骤没有创建 Issue 或 PR。

## 2. 更新个人主页

项目仓库 README 与个人主页不是同一个文件。个人主页内容位于 `jnMetaCode/jnMetaCode` 仓库的 `README.md`。

打开个人主页 README 的编辑页，将项目展示区按 [`PROFILE-README-DRAFT.zh-CN.md`](PROFILE-README-DRAFT.zh-CN.md)调整：

- 主线添加 impeccable-zh；
- 本地三件套只留 local-agent-toolkit 一个入口；
- 删除“评估驱动的 AI 应用工程”整块，包括三个项目的表格与 RAG 实验说明；
- 后面保留三个教程/创作项目，并添加对应 Star 徽章；
- 保留现有需要的课程、联系信息和其他作品，不必整体覆盖主页。

主页提交说明中注明 `AI-assisted documentation update`。草稿自身也保留 AI 辅助声明。

## 3. 验证展示

- 公开访问项目仓库，确认首页展示中文安装入口。
- 访问个人主页，确认三个工程项目已移除，三个教程项目的徽章加载正常。
- 确认 impeccable-zh 链接和中文使用中心可访问；源码安装可先作为主要入口。
- 若要调整置顶，建议主线四项 + local-agent-toolkit + ai-coding-guide；置顶需要另行操作。
- 文档变更不会触发当前 Pages 工作流的路径过滤；本次没有网页源码改动，不需要重新部署 Pages。站点无法访问时再检查已有部署记录。

## 已完成的本地验证

- 本地化校验：简繁体各 43/43；
- 本地化、网页、README 与参考文档测试：28/28；
- 简体与繁体中文分发构建：各 19 个目标；
- 中文网页构建通过。

尝试运行 `npm run test`，但因缺少 Bun 在核心测试启动时返回 `spawn bun ENOENT`，全套测试未完成。在正常终端安装 Bun 后，需要运行 `bun run test`，通过后再上传。

没有执行真实付费模型评测，也没有生成完成后的设计对比案例。推广时先使用准确的能力介绍，不宣称已验证效果提升。
