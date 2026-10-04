# 中国常用 UI 框架适配

> 来源类型：`jnMetaCode-original`。
> 适用命令：`craft`、`shape`、`adapt`、`audit`、`polish`。
> 官方资料核对日期：2026-09-30。

当项目已使用 Ant Design、Element Plus 或 TDesign 时，优先延续现有框架和版本，不要为了视觉调整替换技术栈。先从 lockfile、入口文件、全局 Provider 和主题文件确认真实版本与配置；不得仅凭组件标签猜测。

## 通用适配顺序

1. **识别框架与宿主技术栈。** 确认 React、Vue、小程序或移动端实现；同名设计体系的不同技术栈不是可直接互换的包。
2. **读取现有全局配置。** 找到 locale、主题 token、组件尺寸、弹层容器、暗色模式和 CSS 命名空间设置。
3. **复用 token。** 品牌色、圆角、字号、间距和状态色优先进入框架公开 token 或 CSS variable，不大面积覆盖内部 class。
4. **保留组件语义。** 使用框架已有的 Form、Table、Dialog、Empty、Result、Skeleton 等组件状态，不用无语义 `div` 复制外观。
5. **验证中文压力情况。** 检查双字按钮、长标签、中文校验信息、金额日期、分页、表格密度和窄屏弹层。
6. **验证升级边界。** 不使用未公开内部变量、DOM 层级和 hash class 作为长期契约。

## Ant Design

适用于 React 项目中的 Ant Design。先确认主版本；不要把 v4 的 Less 变量方案机械搬到 v5/v6。

- 使用 `ConfigProvider` 的 `theme` 配置 Design Token；全局品牌基线放在 token，单组件差异放在 component token。
- 需要暗色或紧凑模式时使用公开 algorithm 组合，不复制整套派生颜色。
- locale、表单验证文案、组件尺寸、方向和弹层容器在 Provider 层统一处理。
- `message`、`notification`、`Modal` 等静态调用可能不继承普通 React context；使用当前版本官方推荐的 App、hook 或 holder 方案，必须在真实运行环境验证主题与 locale。
- 不覆盖运行时生成的 hash class；自定义样式应使用 token、公开 className/style 接口或项目包装组件。
- Table 在窄屏下不能只做横向压缩：按任务决定冻结关键列、允许受控横滚、转为详情行或切换移动端信息结构。

核对入口：

- [Ant Design 定制主题](https://ant.design/docs/react/customize-theme-cn/)
- [Ant Design ConfigProvider](https://ant.design/components/config-provider-cn/)

## Element Plus

适用于 Vue 3 项目。先检查全量注册、按需导入、Nuxt 集成和主题编译路径，避免同时引入重复样式。

- 使用 `ElConfigProvider` 统一 locale、size、z-index、namespace 及框架公开的组件级配置。
- 中文 locale 之外，日期组件所使用的日期库 locale 也必须一致验证；不能只翻译组件按钮。
- 小范围动态主题优先使用公开 `--el-*` CSS variables；大规模 SCSS 主题按官方 Sass module 方式配置，不继续新增旧式 `@import` 方案。
- 暗色模式同时引入官方暗色变量并在明确作用域切换 `.dark`；自定义暗色变量必须在官方变量之后覆盖。
- Form 的 label 位置、校验触发、错误文本和 Enter 提交行为按真实业务测试；中文标签变长时允许 top label，不能靠缩小字号硬塞。
- Row/Col 断点只解决网格宽度，不自动解决信息优先级；移动端仍需决定哪些列、操作和辅助信息保留。

核对入口：

- [Element Plus Config Provider](https://element-plus.org/zh-CN/component/config-provider.html)
- [Element Plus 主题](https://element-plus.org/zh-CN/guide/theming.html)
- [Element Plus 国际化](https://element-plus.org/zh-CN/guide/i18n.html)

## TDesign

TDesign 同时存在 Vue、Vue Next、React、移动端和小程序实现。必须从依赖包确认平台，不根据视觉相似度混用 API。

- 使用对应技术栈的公开 ConfigProvider、全局配置和 Design Token；不要把 Web token 直接复制到小程序或移动端。
- 优先复用 TDesign 的行业组件和状态组件，同时检查它们是否符合当前产品的信息密度与权限模型。
- 主题切换必须覆盖明亮、暗黑和跟随系统三种真实状态；验证状态色、图表、遮罩和弹层，而不只检查页面背景。
- 表格、日期、上传、树选择等重型组件使用当前技术栈文档中的 API；不能把 Vue 示例翻译成 React 属性名。
- 小程序端遵守组件注册、包体积、rpx、安全区和原生导航约束；桌面 Web 的 hover 交互不能成为唯一入口。

核对入口：

- [TDesign 官网与技术栈入口](https://tdesign.tencent.com/)
- [TDesign Starter](https://tdesign.tencent.com/starter)

## 不允许的做法

- 同一页面混入第二套组件库，只为获得一个组件；
- 复制官方示例后保留英文 placeholder、假数据或无意义操作；
- 通过 `!important` 和深层选择器批量覆盖框架内部结构；
- 用桌面端缩放代替移动端信息架构；
- 假定框架默认中文、默认时区或默认无障碍行为已经满足业务；
- 为追求“国产化”替换一个运行稳定且没有迁移需求的现有组件库。

## 验收

- lockfile 中的实际版本与所用 API 匹配；
- 全局 locale、主题、尺寸、弹层容器和暗色模式只有一个权威入口；
- 中文长文案、金额日期、表单错误、空状态和高风险确认通过压力测试；
- 键盘、焦点、屏幕阅读器名称和触摸目标经过真实交互验证；
- 360px 窄屏、常用桌面宽度和 200% 缩放均没有关键功能丢失；
- 自定义样式不依赖内部 hash class、未公开 DOM 层级或过时主题接口；
- 构建产物没有因重复全量导入组件库而出现不可解释的体积增长。
