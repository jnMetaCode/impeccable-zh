# Operate 模式详解（以及 Read 模式说明）

当设计服务于产品时使用本模式：应用界面、管理后台、设置面板、数据表格、工具、登录后的页面，以及任何用户正在完成任务的场景。核心要求位于 SKILL.md 的模式说明和 [craft-floor.md](craft-floor.md)；本文为 Operate 界面提供更深入的指导。Read 界面（文档、指南、长文）应结合 SKILL.md 的 Read 模式与本文的排版和一致性规则；对它们而言，正文行长和导航比组件密度更重要。

## 产品界面的“俗套感”测试

在这里，熟悉感往往是一项功能。判断标准是：熟悉该产品类别的用户能否立即信任界面，还是会在每个似是而非的组件前停下来犹豫。

产品界面的失败不在于平淡，而在于毫无理由的陌生：过度装饰的按钮、不一致的表单控件、无意义的动效、用在标签上的展示字体，以及为标准任务发明的新交互。标准应该是有依据的熟悉感，让工具消失在任务之中。

## 排版

- **一种字体家族通常就够了。** 产品界面不需要展示字体与正文字体的搭配。一套调校良好的无衬线字体即可承载标题、按钮、标签、正文和数据。 <!-- rule:product-typo-one-family -->
- **使用固定的 rem 字阶，而不是流式字阶。** 用 `clamp()` 调整标题大小并不适合产品界面。用户通常在稳定的 DPI 下使用产品；一个在侧栏里自动缩小的 h1 只会显得更糟。 <!-- rule:product-typo-fixed-rem-scale -->
- **采用更紧凑的字阶比例。** 相邻级别通常相差 1.125～1.2。这里的文字元素比品牌页面更多，过大的对比会制造噪音。 <!-- rule:product-typo-tighter-ratio -->
- **正文仍需控制行长**（65～75ch）。数据和紧凑界面可以更密集；表格达到 120ch 以上也没问题。 <!-- rule:product-typo-line-length -->

## 色彩

产品默认采用 Restrained。单个界面可以在有充分理由时采用 Committed（例如用一种分类色贯穿报表的仪表盘，或以满幅色彩呈现欢迎页的引导流程），但 Restrained 是底线。 <!-- rule:product-color-restrained-default -->

- 建立包含丰富状态的语义词汇：hover、focus、active、disabled、selected、loading、error、warning、success、info，并将它们标准化。 <!-- rule:product-color-state-vocab -->
- 强调色只用于主要操作、当前选中项和状态指示，不用于装饰。 <!-- rule:product-color-accent-only -->
- 为侧栏、工具栏和面板提供第二层中性色（比内容表面略冷或略暖）。 <!-- rule:product-color-second-neutral -->

## 布局

- 响应式行为应改变结构（折叠侧栏、响应式表格、由断点驱动的分栏），而不是使用流式排版。 <!-- rule:product-layout-responsive-structural -->

## 组件

每个交互组件都应具备 default、hover、focus、active、disabled、loading、error 状态。任何一个都不能缺失。 <!-- rule:product-components-all-states -->

- 加载时使用骨架屏，而不是在内容中央放置转圈图标。 <!-- rule:product-components-skeleton-loading -->
- 空状态应教会用户如何使用界面，而不是只显示“这里什么也没有”。 <!-- rule:product-components-empty-states -->
- 整个界面应保持一致的可供性：相同的按钮形状、相同的表单控件语言、相同的图标风格。 <!-- rule:product-components-consistent-affordances -->
- 浮层必须能脱离容器。绝对定位的下拉菜单若位于带有 `overflow: hidden` 或 `overflow: auto` 的祖先元素内，会被裁切；应使用 `<dialog>`、Popover API、`position: fixed` 或 Portal。 <!-- rule:skill-interaction-dropdown-clipping -->

## 动效

- 大多数过渡保持在 150～250ms。用户正处于操作流程中，不要让他们等待编排好的动画。 <!-- rule:product-motion-quick-transitions -->
- 动效用于传达状态，而不是装饰。只为状态变化、反馈、加载和揭示使用动效。 <!-- rule:product-motion-state-not-decoration -->
- 不要编排页面加载序列。产品打开后就应进入任务，用户不想观看加载表演。 <!-- rule:product-motion-no-page-load-sequence -->

## 产品约束

- 不传达状态的装饰性动效。 <!-- rule:product-ban-decorative-motion -->
- 不同页面使用不一致的组件语言。如果两个位置的“保存”按钮外观不同，其中一个就是错的。 <!-- rule:product-ban-inconsistent-components -->
- 在界面标签、按钮和数据中使用展示字体。 <!-- rule:product-ban-display-fonts-ui -->
- 为了所谓风格重新发明标准可供性（自定义滚动条、奇怪的表单控件、非标准模态框）。 <!-- rule:product-ban-reinvented-affordances -->
- 对非活动状态使用浓重色彩或满饱和强调色。 <!-- rule:product-ban-heavy-inactive-color -->
- 一开始就想到模态框。模态框通常是偷懒的结果；应先穷尽行内和渐进式方案。 <!-- rule:product-ban-modal-first-thought -->

## 产品许可

产品界面可以采用一些品牌页面无法承受的做法。

- 使用系统字体和熟悉的默认无衬线字体。
- 使用标准导航模式：顶栏与侧边导航、面包屑、标签页、命令面板。
- 接受信息密度。只要用户确实需要，表格可以有很多行，面板可以有很多标签，信息可以很紧凑。
- 一致性优先于惊喜。跨页面使用同一套视觉语言是一项优点；愉悦感应留给关键时刻，而不是铺满每个页面。
