# 中文客户表单参考实现

AI 辅助编写的 Vue 3 + Element Plus 演示。直接加载仓库原始评测夹具作为 before，另提供中文适配的参考实现作为 after。它不是客户项目、真实模型运行产物或中文增强效果的对照实验。

## 运行

在仓库根目录执行，需要 Node.js 22.18+：

```bash
npm --prefix demos/chinese-form ci --ignore-scripts
npm --prefix demos/chinese-form run dev
```

访问终端输出的本地地址。`?view=before` 展示原始表单，默认页面展示参考实现。生产构建使用：

```bash
npm --prefix demos/chinese-form run build
```

依赖由本目录的 `package-lock.json` 固定。无需模型凭证；页面不发送保存请求，800ms 的计时器仅模拟加载、成功与失败，刷新会清空输入。

## 可检查的改动

- 640px 以下改成顶部标签，桌面保留左侧标签；字段使用原组件库。
- 通过 ElConfigProvider 配置中文 locale，日期显示“年/月/日”。
- 信用代码检查必填、18 位长度与字符集；不检查校验位或企业真实性。
- 表单校验错误就近显示；保存失败保留输入并提示重试。
- 保存中禁用字段和按钮，防止重复提交；卸载时清理计时器。
- 输入和动作按钮最小高度 44px；日期弹层约束宽度。日期网格的每个单元格不承诺 44×44px。

## 浏览器验收与截图

先安装根目录依赖与 Playwright 浏览器（或使用现有 Chrome）：

```bash
npm install --ignore-scripts
npx playwright install chromium
node scripts/verify-chinese-form.mjs
```

如果已有 Chrome，可设置 `CHINESE_FORM_BROWSER` 为浏览器可执行文件的绝对路径，替代下载浏览器。检查脚本自行服务已构建的静态文件，验证 320/360/1280px 布局、表单控件尺寸、中文日期弹层、空值校验、失败保留输入、重试和清空，并输出 before/after 截图。

输出写入 gitignored 的 `build/chinese-form-evidence/`。只在实际运行通过后分享对应证据；脚本失败不会生成通过结论。640px 视口可用于检查窄屏重排，但不等价于浏览器 200% 缩放或真实手机。

当前记录：生产构建通过；本机 Chrome 在沙箱中启动异常退出，浏览器交互检查和截图尚未完成。完整键盘操作、屏幕阅读器、浏览器 200% 缩放与真实触屏设备仍需人工验收。
