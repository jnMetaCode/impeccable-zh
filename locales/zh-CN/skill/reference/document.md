在项目根目录生成 `DESIGN.md`，记录当前视觉设计系统，使 AI Agent 创建新界面时保持品牌一致。

DESIGN.md 遵循[官方 DESIGN.md 格式规范](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md)：可选的 YAML frontmatter 承载机器可读的设计 token，之后最多包含八个顺序固定的 Markdown 章节。**Token 是规范性事实；正文负责说明如何应用。** 不相关章节可以省略，但出现的章节必须维持指定顺序。使用下列标准标题，确保文件可在支持 DESIGN.md 的工具之间移植。

## Frontmatter：token schema

YAML frontmatter 是机器可读层，也是 Stitch linter 校验、Live 面板生成卡片的依据。保持精简；每一项都必须对应项目实际使用的 token。

```yaml
---
name: <project title>
description: <one-line tagline>
colors:
  primary: "#b8422e"
  neutral-bg: "#faf7f2"
  # ...one entry per extracted color; key = descriptive slug
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "normal"
  body:
    # ...
rounded:
  sm: "4px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "16px 48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
---
```

重要规则：

- **Token 引用**使用 `{path.to.token}`，如 `{colors.primary}`、`{rounded.md}`。组件可以引用基础 token；基础 token 之间不能互相引用。
- **颜色接受任何合法 CSS 颜色字符串。** 为可移植性优先使用十六进制；如果项目以 `rgb()`、`hsl()`、`oklch()`、广色域或混色值为规范来源，就原样保留。没有明确理由时，不要拆分事实源。
- **组件子 token** 仅允许 8 个属性：`backgroundColor`、`textColor`、`typography`、`rounded`、`padding`、`size`、`height`、`width`。阴影、动效、焦点环和 backdrop-filter 等写入 sidecar（步骤 4b）。
- **尺度键名开放。** 使用项目已有名称，如 `oxblood-deep`、`surface-container-low`，不要改成 Material 默认名。
- **变体只是命名约定，不是 schema。** 例如将 `button-primary`、`button-primary-hover`、`button-primary-active` 写成同级键。

## Markdown 正文：八个章节（标准顺序）

1. `## Overview`
2. `## Colors`
3. `## Typography`
4. `## Layout`
5. `## Elevation & Depth`
6. `## Shapes`
7. `## Components`
8. `## Do's and Don'ts`

不相关的章节应省略，不要用杜撰的规则填充。响应式布局写入 Layout，深度写入 Elevation & Depth，圆角和形态语言写入 Shapes，各组件行为写入 Components。格式允许保留未知章节，但新的视觉指导只要适用就应归入标准结构。

## 何时运行

- new-work 发现已有统一视觉系统，但不存在 `DESIGN.md`。
- 新视觉世界首次实现完成，需要固化临时决策。
- 现有 `DESIGN.md` 已过时，设计发生漂移。
- 大型改版前，记录当前状态作为参照。

如果 `DESIGN.md` 已存在，**不得静默覆盖**。先向用户展示现有文件。{{ask_instruction}} 可选操作是刷新、覆盖或合并。

## 两种路径

- **扫描模式**（默认）：项目已有设计 token、组件或渲染结果。先提取，再确认描述语言。适用于有代码可分析的情况。
- **种子模式**：项目尚未实现。确认存在 PRODUCT.md，然后复用 new-work 的视觉世界工作坊并写入方向性 DESIGN.md 种子；有代码后再次用扫描模式运行。

先执行扫描模式步骤 1 再判断。若没有发现 token、组件文件或已渲染站点，提出种子模式选项，不得静默切换。`/impeccable document --seed` 表示请求 new-work 的视觉世界工作坊，但不代表可替换已有的统一实现；若已有系统，应提供扫描模式，或把明确的身份替换请求路由到 new-work。

## 扫描模式（方法 C：自动提取，再确认描述语言）

### 步骤 1：寻找设计资产

按以下优先级搜索代码库：

1. **CSS 自定义属性**：在 CSS 文件中查找 `--color-`、`--font-`、`--spacing-`、`--radius-`、`--shadow-`、`--ease-`、`--duration-` 声明，通常位于 `src/styles/`、`public/css/`、`app/globals.css` 等目录。记录名称、值和定义文件。
2. **Tailwind 配置**：如存在 `tailwind.config.{js,ts,mjs}`，读取 `theme.extend` 中的 colors、fontFamily、spacing、borderRadius、boxShadow。
3. **CSS-in-JS 主题文件**：检查 styled-components、emotion、vanilla-extract、stitches 的 `theme.ts`、`tokens.ts` 或同类文件。
4. **设计 token 文件**：检查 `tokens.json`、`design-tokens.json`、Style Dictionary 输出和 W3C Design Tokens Community Group 格式。
5. **组件库**：扫描主要按钮、卡片、输入框、导航和对话框组件，记录变体 API 与默认样式。
6. **全局样式表**：根级 CSS 通常定义基础排版和颜色分配。
7. **可见渲染结果**：若有浏览器自动化工具，加载站点并抽取 body、h1、a、button、.card 等关键元素的计算样式，以捕获 token 未覆盖的值。

### 步骤 2：自动提取可提取内容

用发现的 token 构建结构化草稿。各 token 类别按以下方式处理：

- **颜色**：归入 Stitch 使用的 Material 派生角色 Primary / Secondary / Tertiary / Neutral。只有一个强调色时，只表达 Primary + Neutral；不要虚构 Secondary 或 Tertiary。
- **排版**：把实际字号和字重映射到 Material 层级 display / headline / title / body / label，记录字体栈和比例关系。
- **层级**：整理阴影词汇。若项目采用扁平设计和色调分层，也完全有效，应明确写出。
- **组件**：针对 button、card、input、chip、list item、tooltip、nav 等常用组件提取形状、颜色分配、hover/focus 处理和内部间距。
- **布局与间距**：把网格、容器、断点、节奏和密度行为归入 Layout。
- **形状**：提取圆角、边角、边框、裁切和反复出现的形态行为并归入 Shapes。

### 步骤 2b：暂存 frontmatter

根据自动提取的 token 起草 YAML frontmatter，步骤 4 会将其写在 DESIGN.md 顶部。这是 Live 面板和 Stitch linter 消费的机器可读层。

- **颜色**：每个提取出的颜色写一项。键使用描述性 slug（如 `oxblood-deep`、`editorial-magenta`，而非 `blue-800`），值采用项目的规范格式。不要拆分事实源，也不要在正文以另一格式重复定义同一 token。
- **排版**：每个角色一项（`display`、`headline`、`title`、`body`、`label`）。值为对象，只包含项目中真实存在的属性：`fontFamily`、`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`、`fontFeature`、`fontVariation`。
- **Rounded / Spacing**：只记录项目实际使用的级别，并沿用现有命名（`sm` / `md` / `lg`、`surface-sm` 或数字级别）。
- **组件**：每种变体一项，如 `button-primary`、`button-primary-hover`、`button-ghost`，通过 `{colors.X}`、`{rounded.Y}` 引用基础 token。超出 Stitch 8 属性集合的阴影、焦点环、backdrop-filter 等写入 sidecar 的完整片段。

项目没有的内容直接跳过。空尺度或虚构 token 会污染规范。

### 步骤 3：向用户询问定性语言

以下内容无法自动提取，需要创意输入。分两轮结构化提问，每轮不超过三个问题（若执行环境限制更低则遵守更低限制），每轮之间等待用户回答：

- **创意北极星**：概括整个系统的单一命名隐喻，如“The Editorial Sanctuary”“The Golden State Curator”“The Lab Notebook”。根据 PRODUCT.md 的品牌个性提供 2–3 个选项。
- **概览语气**：情绪形容词、2–3 句美学理念，以及任何已确认的视觉反例。
- **颜色性格**：为自动提取的颜色选择描述性名称，如“Deep Muted Teal-Navy”而不是“blue-800”；根据色相和饱和度为每个关键色建议 2–3 个选项。
- **层级理念**：扁平、分层还是悬浮；若存在阴影，其作用是环境感还是结构性。
- **组件理念**：用一句短语描述按钮、卡片、输入框的感受，如“tactile and confident”或“refined and restrained”。

只有当 PRODUCT.md 中的内容是确实约束视觉系统的长期品牌承诺时才引用。页面策略和具体界面概念不属于此处。

### 步骤 4：写入 DESIGN.md

文件先写步骤 2b 暂存的 YAML frontmatter，再按下列标准结构写 Markdown 正文。

```markdown
---
name: [Project Title]
description: [one-line tagline]
colors:
  # ... staged frontmatter from Step 2b
---

# Design System: [Project Title]

## Overview

**Creative North Star: "[Named metaphor in quotes]"**

[2-3 paragraph holistic description: personality, density, and aesthetic philosophy. Start from the North Star and work outward. State only confirmed visual rejections. End with a short **Key Characteristics:** bullet list.]

## Colors

[Describe the palette character in one sentence.]

### Primary
- **[Descriptive Name]** (#HEX / oklch(...)): [Where and why this color is used. Be specific about context, not just role.]

### Secondary (optional; omit if the project has only one accent)
- **[Descriptive Name]** (#HEX): [Role.]

### Tertiary (optional)
- **[Descriptive Name]** (#HEX): [Role.]

### Neutral
- **[Descriptive Name]** (#HEX): [Text / background / border / divider role.]
- [...]

### Named Rules (optional, powerful)
**The [Rule Name] Rule.** [Short, forceful prohibition or doctrine, e.g. "The One Voice Rule. The primary accent is used on ≤10% of any given screen. Its rarity is the point."]

## Typography

**Display Font:** [Family] (with [fallback])
**Body Font:** [Family] (with [fallback])
**Label/Mono Font:** [Family, if distinct]

**Character:** [1-2 sentence personality description of the pairing.]

### Hierarchy
- **Display** ([weight], [size/clamp], [line-height]): [Purpose; where it appears.]
- **Headline** ([weight], [size], [line-height]): [Purpose.]
- **Title** ([weight], [size], [line-height]): [Purpose.]
- **Body** ([weight], [size], [line-height]): [Purpose. Include max line length like 65–75ch if relevant.]
- **Label** ([weight], [size], [letter-spacing], [case if uppercase]): [Purpose.]

### Named Rules (optional)
**The [Rule Name] Rule.** [Short doctrine about type use.]

## Layout

[Describe the grid or spatial model, container behavior, density, responsive changes, and the spacing rhythm. Include exact values only when observed.]

## Elevation & Depth

[One paragraph: does this system use shadows, tonal layering, or a hybrid? If "no shadows", say so explicitly and describe how depth is conveyed instead.]

### Shadow Vocabulary (if applicable)
- **[Role name]** (`box-shadow: [exact value]`): [When to use it.]
- [...]

### Named Rules (optional)
**The [Rule Name] Rule.** [e.g. "The Flat-By-Default Rule. Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus)."]

## Shapes

[Describe the form language: corner/radius strategy, borders, clipping, and any recurring silhouette or geometry.]

## Components

For each component, lead with a short character line, then specify shape, color assignment, states, and any distinctive behavior.

### Buttons
- **Shape:** [radius described, exact value in parens]
- **Primary:** [color assignment + padding, in semantic + exact terms]
- **Hover / Focus:** [transitions, treatments]
- **Secondary / Ghost / Tertiary (if applicable):** [brief description]

### Chips (if used)
- **Style:** [background, text color, border treatment]
- **State:** [selected / unselected, filter / action variants]

### Cards / Containers
- **Corner Style:** [radius]
- **Background:** [colors used]
- **Shadow Strategy:** [reference Elevation section]
- **Border:** [if any]
- **Internal Padding:** [scale]

### Inputs / Fields
- **Style:** [stroke, background, radius]
- **Focus:** [treatment, e.g. glow, border shift, etc.]
- **Error / Disabled:** [if applicable]

### Navigation
- **Style, typography, default/hover/active states, mobile treatment.**

### [Signature Component] (optional; if the project has a distinctive custom component worth documenting)
[Description.]

## Do's and Don'ts

Concrete visual guardrails grounded in the incumbent implementation or the user's chosen world. Lead each with "Do" or "Don't" and include exact values only when established. Do not turn a task-specific concept or surface strategy into a system-wide prohibition.

### Do:
- **Do** [specific prescription with exact values / named rule].
- **Do** [...]

### Don't:
- **Don't** [specific prohibition confirmed by the incumbent system or the user].
- **Don't** [...]
- **Don't** [...]
```

### 步骤 4b：写入 `.impeccable/design.json` sidecar（仅扩展内容）

Frontmatter 负责 token 基础值（colors、typography、rounded、spacing、components）。`.impeccable/design.json` sidecar 承载 **Stitch schema 无法表达的内容**：各颜色的色调梯度、阴影/层级 token、动效 token、断点、完整组件 HTML/CSS 片段（面板会把它们渲染到 shadow DOM），以及叙事内容（北极星、规则、do/don't）。它扩展 frontmatter，而不重复 frontmatter。

每次重新生成根目录 `DESIGN.md` 都要重新生成 sidecar。若用户只要求刷新 sidecar（例如 Live 面板提示过时），则保留 `DESIGN.md`，只写 `.impeccable/design.json`。

#### Schema

```json
{
  "schemaVersion": 2,
  "generatedAt": "ISO-8601 string",
  "title": "Design System: [Project Title]",
  "extensions": {
    "colorMeta": {
      "primary":        { "role": "primary",  "displayName": "Editorial Magenta", "canonical": "oklch(60% 0.25 350)", "tonalRamp": ["...", "...", "..."] },
      "cool-paper": { "role": "neutral",  "displayName": "Cool Paper",    "canonical": "oklch(96% 0.005 230)", "tonalRamp": ["...", "...", "..."] }
    },
    "typographyMeta": {
      "display": { "displayName": "Display", "purpose": "Hero headlines only." }
    },
    "shadows": [
      { "name": "ambient-low", "value": "0 4px 24px rgba(0,0,0,0.12)", "purpose": "Diffuse hover glow under accent elements." }
    ],
    "motion": [
      { "name": "ease-standard", "value": "cubic-bezier(0.4, 0, 0.2, 1)", "purpose": "Default easing for state transitions." }
    ],
    "breakpoints": [
      { "name": "sm", "value": "640px" }
    ]
  },
  "components": [
    {
      "name": "Primary Button",
      "kind": "button | input | nav | chip | card | custom",
      "refersTo": "button-primary",
      "description": "One-line what and when.",
      "html": "<button class=\"ds-btn-primary\">SAVE CHANGES</button>",
      "css": ".ds-btn-primary { background: #191c1d; color: #fff; padding: 16px 48px; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 500; border: none; border-radius: 0; transition: background 0.2s, transform 0.2s; } .ds-btn-primary:hover { background: oklch(60% 0.25 350); transform: translateY(-2px); }"
    }
  ],
  "narrative": {
    "northStar": "The Editorial Sanctuary",
    "overview": "2-3 paragraphs of the philosophy, pulled from DESIGN.md Overview section.",
    "keyCharacteristics": ["...", "..."],
    "rules": [{ "name": "The One Voice Rule", "body": "...", "section": "colors|typography|elevation" }],
    "dos":   ["Do use ..."],
    "donts": ["Don't use ..."]
  }
}
```

**schemaVersion 1 的变化。** 旧 sidecar 承载 token 基础数组（`tokens.colors[]`、`tokens.typography[]` 等），现在这些值位于 frontmatter。Sidecar 只保存 frontmatter 无法承载的元数据（色调梯度、十六进制近似色对应的规范 OKLCH、显示名称、角色提示），并以 frontmatter token 名作为键，如 `colorMeta.<token-name>`、`typographyMeta.<token-name>`。组件仍保存完整 HTML/CSS，因为 Stitch 的 8 属性集合无法容纳它们。

#### 组件转换规则

`html` 和 `css` 字段必须是**独立、可直接使用的片段**，注入 shadow DOM 后即可正确渲染。面板会直接应用，不会后处理，也没有框架运行时。

1. **展开 Tailwind。** 如果源代码使用 Tailwind（`className="bg-primary text-white rounded-lg px-6 py-3"`），把每个 utility 展开成 `css` 字符串中的字面 CSS 属性。不得引用 Tailwind class，也不得假定加载了 Tailwind CSS bundle。每个组件必须自包含。
2. **解析 token。** 若项目在 `:root` 暴露 CSS 自定义属性，如 `--color-primary`、`--radius-md`，则用 `var(--color-primary)` 引用；它们可穿过 shadow DOM 继承并保持实时绑定。若 token 只存在于 JS 主题对象中，则生成时解析为字面值。
3. **图标。** 内联 SVG。不要引用 Lucide/Heroicons 包、图标字体或 `<img src="...">`。常见图标为 16–24px，直接复制 SVG path 数据。
4. **状态。** 内联包含 `:hover`、`:focus-visible` 以及有意义时的 `:active` 规则。只有默认态的静态快照会让面板显得僵硬；CSS 中的 hover 和 focus 规则使其可交互。
5. **避免 reset 膨胀。** 只提取组件有辨识度的 CSS，如背景、颜色、间距、圆角、排版、过渡。跳过通用 reset（`box-sizing: border-box`、`line-height: inherit`、`-webkit-font-smoothing`）。面板已有中性画布，不要重复打包 reset。
6. **限定 class 名。** 每个 class 都以 `ds-` 开头，如 `ds-btn-primary`、`ds-input-search`，避免同一 shadow DOM 内不同组件的 CSS 冲突。

#### 应包含什么

选择最能代表视觉系统的 **5–10 个组件**：

- **标准基础组件（项目有就必须包含）：** button（每个变体单独一项）、input/text field、navigation、chip/tag、card。
- **标志性组件（有明显特色时包含）：** 真正定义现有系统、反复出现的自定义模式。
- **其余跳过。** 工具组件、表单构建块和包装布局，除非视觉上独特，否则不值得记录。

若项目**尚无组件库**（只有简单落地页或全新项目），使用 token 合成符合 DESIGN.md 规则的最佳实践基础组件。即使在第零天，每个 `.impeccable/design.json` 也应有可渲染内容。

#### 色调梯度

为每个颜色 token 生成 8 阶 `tonalRamp` 数组：从暗到亮，保持同一色相与彩度，亮度约从 15% 递增到 95%。若项目已有色调尺度（Material 的 `surface-container-low` 系列或 Tailwind 风格的 `blue-50..blue-900`），直接采用；否则用 OKLCH 合成。

#### 叙事映射

直接从刚写入的 DESIGN.md 提取：

- `narrative.northStar` → Overview 中的 `**Creative North Star: "..."**` 行
- `narrative.overview` → Overview 的理念段落
- `narrative.keyCharacteristics` → `**Key Characteristics:**` 项目列表
- `narrative.rules` → 各章节所有 `**The [Name] Rule.** [body]`，并标记 `section`
- `narrative.dos` / `narrative.donts` → Do's and Don'ts 的项目列表，逐字保留

不要改写。面板会把它们作为次级可折叠上下文展示，Markdown 与面板必须保持同一种声音。

### 步骤 5：确认与改进

1. 向用户展示完整的 DESIGN.md，简要说明不显而易见的创意选择，如描述性颜色名、氛围语言和命名规则。
2. 说明同时写入了 `.impeccable/design.json`；Live 面板现在会渲染项目真实的 button/input/nav 基础组件，而非通用近似效果。
3. 主动提出继续改进：“需要我修改某个章节、补充遗漏的组件模式，还是调整氛围语言？”

你刚写入的内容就是最新事实源；本会话后续命令无需重新加载。

## 种子模式

适用于尚无视觉系统可提取的项目。它产出由用户选择的视觉世界脚手架，而非虚构的 token 规范。

### 步骤 1：路由到 new-work 工作坊

PRODUCT.md 是前置条件。若缺失，加载 [init.md](init.md)，先完成产品访谈。没有长期产品上下文时，不得创建视觉身份。

若 PRODUCT.md 已存在，加载 [new-work.md](new-work.md) 并确定视觉权威。种子模式需要一个具体的首个界面：使用用户已命名的目标，否则询问他们首先要制作什么。执行 new-work 的 **创建或替换视觉世界** 流程，再执行 **提交视觉世界**，让视觉世界与首个表现形式一起被选择。完成方向性 DESIGN.md 种子和界面简报后停止，不要实现。结构化模拟用户也视为用户，必须获得同样的选择权。

若本会话已完成 new-work 工作坊，直接使用已选方向，不再重复询问。

### 步骤 2：写入种子 DESIGN.md

沿用扫描模式的标准章节顺序。填入工作坊选定的方向，对尚未确定的实现事实如实使用占位符。种子承诺视觉世界及其不变量，但不假装实现 token 已存在。

文件开头写入：

```markdown
<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->
```

各章节规则：

- **Overview**：所选设计论点、布局行为、材质性格、图像立场、动效语法和可复用标志。选定首个界面的表现形式留在该界面简报中，不要提升为全局视觉世界。
- **Colors**：所选色彩策略和角色。只有当用户、现有资产或 new-work 探索已确定具体值时才记录，否则标记 `[to be resolved during implementation]`。
- **Typography**：所选字体性格和角色关系。仅在已确定时记录字体名，否则将搭配标记为 `[to be resolved during implementation]`。
- **Layout**：所选空间语法与响应式行为，不虚构尚未确定的精确尺寸。
- **Elevation & Depth**：将所选材质与深度行为写成不变量，而不是从通用预设推断。
- **Shapes**：所选形态和圆角语言。
- **Components**：完全省略；组件尚不存在。
- **Do's and Don'ts**：记录视觉世界选择时确认的长期护栏，不记录任务局部拒绝项。

种子模式 frontmatter 只写 `name` 与 `description`，不写 colors、typography、rounded、spacing 或 components。真实 token 在下一次扫描模式运行时加入。出于同样原因，种子模式跳过 `.impeccable/design.json` sidecar：此时没有可渲染内容。

### 步骤 3：确认

1. 展示种子 DESIGN.md，并明确它是种子（标记就是字面承诺）。
2. 告诉用户：“有一些代码后，请重新运行 `/impeccable document`。下一轮会提取真实 token 并生成 sidecar。”

你刚写入的内容就是最新事实源，无需重新加载。

## 风格指南

- **Frontmatter 优先，正文其次。** Token 写入 YAML frontmatter，正文说明其语境。不要在两处重复定义 token 值；frontmatter 是规范来源。
- **只携带长期产品约束。** PRODUCT.md 中有约束力的 logo、身份资产、无障碍要求或品牌承诺可以限制 DESIGN.md；界面策略留在相应简报。
- **遵守规范。** 按顺序使用八个标准章节，不相关的就省略。动效指导归入其影响的视觉世界或组件，不创建 schema 不支持的 token 组。
- **描述性优于技术性**：“轻柔弧形边缘（8px 圆角）”优于“rounded-lg”。描述在前，技术值放在括号中。
- **功能性优于装饰性**：每个 token 都说明在何处、为何使用，而不只说明它是什么。
- **精确值放括号中**：十六进制、px/rem、字重等数值始终与描述同时给出。
- **使用命名规则**：`**The [Name] Rule.** [short doctrine]`。它们容易记忆和引用，比项目列表更能被 AI 消费；Stitch 输出也大量采用这种形式，如“The No-Line Rule”“The Ghost Border Fallback”。每章争取 1–3 条。
- **证据明确时果断表达。** 对真实不变量使用硬性语言，对临时指导使用更温和的语言。
- **只有基于已观察系统或用户确认决策时才使用具体审计测试。** 一句可执行的测试胜过一段原则。
- **选择性引用 PRODUCT.md。** 产品事实用于解释视觉世界为何合适；默认不提供页面构图或视觉禁用清单。
- **按角色组织颜色**，不要按十六进制或色相排序。规范顺序是 Primary / Secondary / Tertiary / Neutral。

## 常见陷阱

- 不要粘贴原始 CSS class 名；转换为描述性语言。
- 不要提取每个 token，只保留真正复用的内容；一次性值会污染系统。
- 不要虚构不存在的组件。项目只有按钮和卡片，就只记录二者。
- 未询问前，不得覆盖现有 DESIGN.md。
- 不要重复 PRODUCT.md 内容；DESIGN.md 严格限定为视觉内容。
- 不要用近义词替换标准章节。布局与响应式行为写入 `Layout`，动效归入受影响的视觉世界或组件。
- 标题不能有任何细微改名：必须是“Colors”而非“Color Palette & Roles”，“Typography”而非“Typography Rules”。工具依赖精确标题解析。
- 不要在 frontmatter 与正文之间重复 token 值。若 `colors.primary` 使用十六进制，正文可以命名并解释角色，但不得重新声明另一十六进制；frontmatter 才是规范来源。
- 不要发明 Stitch schema 之外的顶级 frontmatter token 组（不能有 `motion:`、`breakpoints:`、`shadows:`）。其他内容都属于 sidecar 的 `extensions`。
