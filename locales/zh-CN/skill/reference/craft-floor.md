# 创作质量底线

方向确定后加载本文，并在不宣读检查清单的情况下进行构建。已经固定的简报或已经提交的视觉世界优先于本文；你自己的习惯没有优先权。设计 hook 启用时，它会在编辑过程中执行下述机械检查：直接处理其发现，不要重新审计每条规则。 <!-- rule:skill-craft-floor -->

## 验证

以下每一项都检查实际构建结果，而不是设计意图。应在批量检查轮次中一起执行，而不是分别截图；这些检查共享同一次渲染。

- **对比度：** 正文和 placeholder 文字不低于 4.5:1，大号文字不低于 3:1。彩色表面上的次要文字应从该色相或前景色推导，绝不要使用灰色。 <!-- rule:skill-color-verify-contrast -->
- **纵深：** 阴影应包含偏移和柔和模糊。无偏移的彩色光晕只是装饰。 <!-- rule:skill-color-no-glow-halo -->
- **间距：** 相关内容紧密成组，不同内容充分分隔；标题上方空间大于下方。读取实际计算值。 <!-- rule:skill-layout-spacing-rhythm -->
- **排版：** 正文行长 65～75ch，展示文字最大 6rem，字距下限 -0.04em；标题平衡，字号和字重层级清楚。在每个断点使用真实文案，修复所有溢出。 <!-- rule:skill-typo-floor --> <!-- rule:skill-ban-text-overflow -->
- **动效：** 设置一个经过创作的时刻，而不是散落效果，也不是让每个区块使用同一种入场。默认状态中的内容应已经可见，再使用指数型 ease-out。不要只依赖 transform 和 opacity；只要性能流畅，blur、backdrop-filter、clip-path、mask 和 shadow 都属于可用材料。 <!-- rule:skill-motion-floor --> <!-- rule:skill-motion-materials-palette --> <!-- rule:skill-motion-no-section-fade -->
- **状态：** hover、disabled、loading、error、empty；还应包含真实内容、可用控件、响应式构图和键盘焦点。 <!-- rule:skill-floor-shipping -->
- **浏览器表面：** 即使不是你直接绘制的部分，也必须承载设计。文字选择、光标、自定义滚动条、焦点环、下划线偏移和表格数字默认值都不属于任何设计系统。使用色板为它们设置主题。这是页面经过真正构建而不是简单拼装的最低成本信号，也是模型最容易遗漏的部分。 <!-- rule:skill-craft-browser-surfaces -->
- **文案：** 使用产品自己的语言。控件说明操作；错误信息说明问题和恢复方式。 <!-- rule:skill-copy-design-material -->
- **覆盖：** 简报中的每项要求都存在，并能在几秒内找到。 <!-- rule:skill-floor-brief-coverage -->

## 拒绝默认套路

以下是各类别的默认套路，而不是绝对禁令：简报明确要求时可以使用。决策轴仍然开放时直接选择其中一种，说明你并未真正做出设计决策；发现这一点后应重写元素，而不是稍微弱化它。

页面脚手架：

- 用相同尺寸的“图标 + 标题 + 文字”卡片作为页面结构。卡片是偷懒的容器；嵌套卡片永远错误。 <!-- rule:skill-ban-identical-card-grids --> <!-- rule:skill-layout-cards-lazy -->
- Hero 指标模板：大数字、小标签、辅助统计和强调色。 <!-- rule:skill-ban-hero-metric -->
- 标题上方的 kicker 或 eyebrow。这是一项禁令，而非默认套路：任何简报都不能重新允许。标题应独立承担权重；删除标签，让标题自己表达。 <!-- rule:skill-ban-eyebrow-on-every-section -->
- 区块编号（01 / 02 / 03），除非顺序本身承载读者需要的信息。 <!-- rule:skill-ban-numbered-section-markers -->
- 对不需要打断流程或保护焦点的任务使用模态框。 <!-- rule:skill-reflex-modal-by-reflex -->

表面习惯：

- 渐变文字。应通过字重或字号建立强调。 <!-- rule:skill-ban-gradient-text -->
- 把玻璃和模糊当作装饰，而不是服务某个明确效果。 <!-- rule:skill-ban-glassmorphism-default -->
- 在卡片、列表项、提示框或警告上使用宽度超过 1px 的彩色 `border-left` 或 `border-right`。 <!-- rule:skill-ban-side-stripe-borders -->
- 在并非真正新粗野主义的视觉世界中使用硬偏移阴影（`box-shadow: 4px 4px 0`）。无模糊块状阴影是一套服装，不是纵深系统；没有选择它的视觉世界不应默认使用。 <!-- rule:skill-ban-hard-offset-shadow -->
- 用迷你趋势线、进度环和带柔和阴影的圆角矩形代替真实内容。 <!-- rule:skill-reflex-decorative-chrome -->
- 把等宽字体当作“技术感”装饰，而不是用于代码、数据或测量。 <!-- rule:skill-reflex-mono-as-technical -->
- 在自有视觉世界的页面中使用系统展示字体（Impact、Arial Black、平台无衬线体）作为展示声音。应寻找并自托管性格符合已批准字形的字体；最接近的已安装字体是失败，而不是回退。 <!-- rule:skill-ban-system-display-face -->
- 用 Unicode 字符或 emoji 代替图标系统。图标应来自真实图标库或原创 SVG，并保持统一描边和字重。 <!-- rule:skill-ban-glyph-icons -->
- 用几何遮罩代替有机轮廓。使用圆形、多边形或径向渐变裁切近似照片主体边缘，是这种效果的廉价版本，甚至不如不用。应从真实图片生成 alpha matte，或制作抠图资源。 <!-- rule:skill-ban-geometric-occlusion-mask -->
- 按产品类别习惯选择浅色或深色。应根据使用场景决定：谁在什么地方、什么环境光下使用。 <!-- rule:skill-reflex-theme-by-habit -->

<codex>
- 字距不能小于 -0.04em；-0.02～-0.03em 通常可读性更好。 <!-- rule:skill-typo-codex-tracking-repeat -->
- 高度表达只声明一次：使用边框或阴影。宽大柔和阴影下再加 1px 边框会形成幽灵卡片。卡片圆角保持 12～16px；胶囊形只用于小控件。 <!-- rule:skill-codex-elevation-radius --> <!-- rule:skill-ban-codex-ghost-card --> <!-- rule:skill-ban-codex-over-round -->
- 使用真实插图，否则不用。素描风 SVG 场景、`loose-sketch` / `doodle` 类名和 `feTurbulence` 颗粒会显得业余。本规则禁止 SVG 模仿图片，不禁止 SVG 表达几何：清晰矢量形状、图表、动画线条和着色器驱动效果仍是一等媒介。带阴影、透视或人物的插图，即使是线稿，也属于图片；几何意味着会话可以精确描述的形状。 <!-- rule:skill-ban-codex-sketchy-svg -->
- 背景是表面，只能使用来自主题世界的纹理。`repeating-linear-gradient` 条纹和双轴网格叠层必须有真实画布、地图、蓝图或测量工具作为依据。 <!-- rule:skill-ban-codex-stripes --> <!-- rule:skill-ban-codex-grid-backgrounds -->
- 声明和配置必须来自已提供事实；示意值应如实标注。先命名一个概念再反讽它，并不构成事实声明。 <!-- rule:skill-codex-material-honesty --> <!-- rule:skill-ban-codex-x-theater -->
</codex>

<gemini>
绝不要直接或通过父元素为图片添加 hover 动画。图片不是操作目标；应让容器提供反馈。 <!-- rule:skill-interaction-gemini-no-image-hover -->
</gemini>

这套底线负责机械质量，但绝不选择方向。所有检查通过后，把页面资源投入已经确定的视觉世界；当“精致”和“坚定执行”发生冲突时，选择坚定执行。 <!-- rule:skill-floor-not-ceiling -->
