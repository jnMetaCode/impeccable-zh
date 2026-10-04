在專案根目錄產生 `DESIGN.md`，記錄目前視覺設計系統，使 AI Agent 建立新介面時保持品牌一致。

DESIGN.md 遵循[官方 DESIGN.md 格式規範](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md)：可選的 YAML frontmatter 承載機器可讀的設計 token，之後最多包含八個順序固定的 Markdown 章節。**Token 是規範性事實；正文負責說明如何應用。** 不相關章節可以省略，但出現的章節必須維持指定順序。使用下列標準標題，確保檔案可在支援 DESIGN.md 的工具之間移植。

## Frontmatter：token schema

YAML frontmatter 是機器可讀層，也是 Stitch linter 校驗、Live 面板產生卡片的依據。保持精簡；每一項都必須對應專案實際使用的 token。

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

重要規則：

- **Token 引用**使用 `{path.to.token}`，如 `{colors.primary}`、`{rounded.md}`。元件可以引用基礎 token；基礎 token 之間不能互相引用。
- **顏色接受任何合法 CSS 顏色字串。** 為可移植性優先使用十六進位制；如果專案以 `rgb()`、`hsl()`、`oklch()`、廣色域或混色值為規範來源，就原樣保留。沒有明確理由時，不要拆分事實源。
- **元件子 token** 僅允許 8 個屬性：`backgroundColor`、`textColor`、`typography`、`rounded`、`padding`、`size`、`height`、`width`。陰影、動效、焦點環和 backdrop-filter 等寫入 sidecar（步驟 4b）。
- **尺度鍵名開放。** 使用專案已有名稱，如 `oxblood-deep`、`surface-container-low`，不要改成 Material 預設名。
- **變體只是命名約定，不是 schema。** 例如將 `button-primary`、`button-primary-hover`、`button-primary-active` 寫成同級鍵。

## Markdown 正文：八個章節（標準順序）

1. `## Overview`
2. `## Colors`
3. `## Typography`
4. `## Layout`
5. `## Elevation & Depth`
6. `## Shapes`
7. `## Components`
8. `## Do's and Don'ts`

不相關的章節應省略，不要用杜撰的規則填充。回應式佈局寫入 Layout，深度寫入 Elevation & Depth，圓角和形態語言寫入 Shapes，各元件行為寫入 Components。格式允許保留未知章節，但新的視覺指導只要適用就應歸入標準結構。

## 何時執行

- new-work 發現已有統一視覺系統，但不存在 `DESIGN.md`。
- 新視覺世界首次實作完成，需要固化臨時決策。
- 現有 `DESIGN.md` 已過時，設計發生漂移。
- 大型改版前，記錄目前狀態作為參照。

如果 `DESIGN.md` 已存在，**不得靜默覆蓋**。先向使用者展示現有檔案。{{ask_instruction}} 可選操作是重新整理、覆蓋或合併。

## 兩種路徑

- **掃描模式**（預設）：專案已有設計 token、元件或渲染結果。先提取，再確認描述語言。適用於有程式碼可分析的情況。
- **種子模式**：專案尚未實作。確認存在 PRODUCT.md，然後複用 new-work 的視覺世界工作坊並寫入方向性 DESIGN.md 種子；有程式碼後再次用掃描模式執行。

先執行掃描模式步驟 1 再判斷。若沒有發現 token、元件檔案或已渲染站點，提出種子模式選項，不得靜默切換。`/impeccable document --seed` 表示請求 new-work 的視覺世界工作坊，但不代表可替換已有的統一實作；若已有系統，應提供掃描模式，或把明確的身份替換請求路由到 new-work。

## 掃描模式（方法 C：自動提取，再確認描述語言）

### 步驟 1：尋找設計資產

按以下優先順序搜尋程式碼庫：

1. **CSS 自定義屬性**：在 CSS 檔案中查詢 `--color-`、`--font-`、`--spacing-`、`--radius-`、`--shadow-`、`--ease-`、`--duration-` 宣告，通常位於 `src/styles/`、`public/css/`、`app/globals.css` 等目錄。記錄名稱、值和定義檔案。
2. **Tailwind 設定**：如存在 `tailwind.config.{js,ts,mjs}`，讀取 `theme.extend` 中的 colors、fontFamily、spacing、borderRadius、boxShadow。
3. **CSS-in-JS 主題檔案**：檢查 styled-components、emotion、vanilla-extract、stitches 的 `theme.ts`、`tokens.ts` 或同類檔案。
4. **設計 token 檔案**：檢查 `tokens.json`、`design-tokens.json`、Style Dictionary 輸出和 W3C Design Tokens Community Group 格式。
5. **元件庫**：掃描主要按鈕、卡片、輸入框、導航和對話方塊元件，記錄變體 API 與預設樣式。
6. **全域性樣式表**：根級 CSS 通常定義基礎排版和顏色分配。
7. **可見渲染結果**：若有瀏覽器自動化工具，載入站點並抽取 body、h1、a、button、.card 等關鍵元素的計算樣式，以捕獲 token 未覆蓋的值。

### 步驟 2：自動提取可提取內容

用發現的 token 建置結構化草稿。各 token 類別按以下方式處理：

- **顏色**：歸入 Stitch 使用的 Material 派生角色 Primary / Secondary / Tertiary / Neutral。只有一個強調色時，只表達 Primary + Neutral；不要虛構 Secondary 或 Tertiary。
- **排版**：把實際字號和字重對映到 Material 層級 display / headline / title / body / label，記錄字型棧和比例關係。
- **層級**：整理陰影詞彙。若專案採用扁平設計和色調分層，也完全有效，應明確寫出。
- **元件**：針對 button、card、input、chip、list item、tooltip、nav 等常用元件提取形狀、顏色分配、hover/focus 處理和內部間距。
- **佈局與間距**：把網格、容器、斷點、節奏和密度行為歸入 Layout。
- **形狀**：提取圓角、邊角、邊框、裁切和反覆出現的形態行為並歸入 Shapes。

### 步驟 2b：暫存 frontmatter

根據自動提取的 token 起草 YAML frontmatter，步驟 4 會將其寫在 DESIGN.md 頂部。這是 Live 面板和 Stitch linter 消費的機器可讀層。

- **顏色**：每個提取出的顏色寫一項。鍵使用描述性 slug（如 `oxblood-deep`、`editorial-magenta`，而非 `blue-800`），值採用專案的規範格式。不要拆分事實源，也不要在正文以另一格式重複定義同一 token。
- **排版**：每個角色一項（`display`、`headline`、`title`、`body`、`label`）。值為物件，只包含專案中真實存在的屬性：`fontFamily`、`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`、`fontFeature`、`fontVariation`。
- **Rounded / Spacing**：只記錄專案實際使用的級別，並沿用現有命名（`sm` / `md` / `lg`、`surface-sm` 或數字級別）。
- **元件**：每種變體一項，如 `button-primary`、`button-primary-hover`、`button-ghost`，透過 `{colors.X}`、`{rounded.Y}` 引用基礎 token。超出 Stitch 8 屬性集合的陰影、焦點環、backdrop-filter 等寫入 sidecar 的完整片段。

專案沒有的內容直接跳過。空尺度或虛構 token 會汙染規範。

### 步驟 3：向使用者詢問定性語言

以下內容無法自動提取，需要創意輸入。分兩輪結構化提問，每輪不超過三個問題（若執行環境限制更低則遵守更低限制），每輪之間等待使用者回答：

- **創意北極星**：概括整個系統的單一命名隱喻，如“The Editorial Sanctuary”“The Golden State Curator”“The Lab Notebook”。根據 PRODUCT.md 的品牌個性提供 2–3 個選項。
- **概覽語氣**：情緒形容詞、2–3 句美學理念，以及任何已確認的視覺反例。
- **顏色性格**：為自動提取的顏色選擇描述性名稱，如“Deep Muted Teal-Navy”而不是“blue-800”；根據色相和飽和度為每個關鍵色建議 2–3 個選項。
- **層級理念**：扁平、分層還是懸浮；若存在陰影，其作用是環境感還是結構性。
- **元件理念**：用一句短語描述按鈕、卡片、輸入框的感受，如“tactile and confident”或“refined and restrained”。

只有當 PRODUCT.md 中的內容是確實約束視覺系統的長期品牌承諾時才引用。頁面策略和具體介面概念不屬於此處。

### 步驟 4：寫入 DESIGN.md

檔案先寫步驟 2b 暫存的 YAML frontmatter，再按下列標準結構寫 Markdown 正文。

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

### 步驟 4b：寫入 `.impeccable/design.json` sidecar（僅擴充功能內容）

Frontmatter 負責 token 基礎值（colors、typography、rounded、spacing、components）。`.impeccable/design.json` sidecar 承載 **Stitch schema 無法表達的內容**：各顏色的色調梯度、陰影/層級 token、動效 token、斷點、完整元件 HTML/CSS 片段（面板會把它們渲染到 shadow DOM），以及敘事內容（北極星、規則、do/don't）。它擴充功能 frontmatter，而不重複 frontmatter。

每次重新產生根目錄 `DESIGN.md` 都要重新產生 sidecar。若使用者只要求重新整理 sidecar（例如 Live 面板提示過時），則保留 `DESIGN.md`，只寫 `.impeccable/design.json`。

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

**schemaVersion 1 的變化。** 舊 sidecar 承載 token 基礎陣列（`tokens.colors[]`、`tokens.typography[]` 等），現在這些值位於 frontmatter。Sidecar 只儲存 frontmatter 無法承載的元資料（色調梯度、十六進位制近似色對應的規範 OKLCH、顯示名稱、角色提示），並以 frontmatter token 名作為鍵，如 `colorMeta.<token-name>`、`typographyMeta.<token-name>`。元件仍儲存完整 HTML/CSS，因為 Stitch 的 8 屬性集合無法容納它們。

#### 元件轉換規則

`html` 和 `css` 欄位必須是**獨立、可直接使用的片段**，注入 shadow DOM 後即可正確渲染。面板會直接應用，不會後處理，也沒有框架執行時。

1. **展開 Tailwind。** 如果原始碼使用 Tailwind（`className="bg-primary text-white rounded-lg px-6 py-3"`），把每個 utility 展開成 `css` 字串中的字面 CSS 屬性。不得引用 Tailwind class，也不得假定載入了 Tailwind CSS bundle。每個元件必須自包含。
2. **解析 token。** 若專案在 `:root` 暴露 CSS 自定義屬性，如 `--color-primary`、`--radius-md`，則用 `var(--color-primary)` 引用；它們可穿過 shadow DOM 繼承並保持即時繫結。若 token 只存在於 JS 主題物件中，則產生時解析為字面值。
3. **圖示。** 內聯 SVG。不要引用 Lucide/Heroicons 包、圖示字型或 `<img src="...">`。常見圖示為 16–24px，直接複製 SVG path 資料。
4. **狀態。** 內聯包含 `:hover`、`:focus-visible` 以及有意義時的 `:active` 規則。只有預設態的靜態快照會讓面板顯得僵硬；CSS 中的 hover 和 focus 規則使其可互動。
5. **避免 reset 膨脹。** 只提取元件有辨識度的 CSS，如背景、顏色、間距、圓角、排版、過渡。跳過通用 reset（`box-sizing: border-box`、`line-height: inherit`、`-webkit-font-smoothing`）。面板已有中性畫布，不要重複打包 reset。
6. **限定 class 名。** 每個 class 都以 `ds-` 開頭，如 `ds-btn-primary`、`ds-input-search`，避免同一 shadow DOM 內不同元件的 CSS 衝突。

#### 應包含什麼

選擇最能代表視覺系統的 **5–10 個元件**：

- **標準基礎元件（專案有就必須包含）：** button（每個變體單獨一項）、input/text field、navigation、chip/tag、card。
- **標誌性元件（有明顯特色時包含）：** 真正定義現有系統、反覆出現的自定義模式。
- **其餘跳過。** 工具元件、表單建置塊和包裝佈局，除非視覺上獨特，否則不值得記錄。

若專案**尚無元件庫**（只有簡單著陸頁或全新專案），使用 token 合成符合 DESIGN.md 規則的最佳實踐基礎元件。即使在第零天，每個 `.impeccable/design.json` 也應有可渲染內容。

#### 色調梯度

為每個顏色 token 產生 8 階 `tonalRamp` 陣列：從暗到亮，保持同一色相與彩度，亮度約從 15% 遞增到 95%。若專案已有色調尺度（Material 的 `surface-container-low` 系列或 Tailwind 風格的 `blue-50..blue-900`），直接採用；否則用 OKLCH 合成。

#### 敘事對映

直接從剛寫入的 DESIGN.md 提取：

- `narrative.northStar` → Overview 中的 `**Creative North Star: "..."**` 行
- `narrative.overview` → Overview 的理念段落
- `narrative.keyCharacteristics` → `**Key Characteristics:**` 專案列表
- `narrative.rules` → 各章節所有 `**The [Name] Rule.** [body]`，並標記 `section`
- `narrative.dos` / `narrative.donts` → Do's and Don'ts 的專案列表，逐字保留

不要改寫。面板會把它們作為次級可摺疊上下文展示，Markdown 與面板必須保持同一種聲音。

### 步驟 5：確認與改進

1. 向使用者展示完整的 DESIGN.md，簡要說明不顯而易見的創意選擇，如描述性顏色名、氛圍語言和命名規則。
2. 說明同時寫入了 `.impeccable/design.json`；Live 面板現在會渲染專案真實的 button/input/nav 基礎元件，而非通用近似效果。
3. 主動提出繼續改進：“需要我修改某個章節、補充遺漏的元件模式，還是調整氛圍語言？”

你剛寫入的內容就是最新事實源；本會話後續命令無需重新載入。

## 種子模式

適用於尚無視覺系統可提取的專案。它產出由使用者選擇的視覺世界腳手架，而非虛構的 token 規範。

### 步驟 1：路由到 new-work 工作坊

PRODUCT.md 是前置條件。若缺失，載入 [init.md](init.md)，先完成產品訪談。沒有長期產品上下文時，不得建立視覺身份。

若 PRODUCT.md 已存在，載入 [new-work.md](new-work.md) 並確定視覺權威。種子模式需要一個具體的首個介面：使用使用者已命名的目標，否則詢問他們首先要製作什麼。執行 new-work 的 **建立或替換視覺世界** 流程，再執行 **提交視覺世界**，讓視覺世界與首個表現形式一起被選擇。完成方向性 DESIGN.md 種子和介面簡報後停止，不要實作。結構化模擬使用者也視為使用者，必須獲得同樣的選擇權。

若本會話已完成 new-work 工作坊，直接使用已選方向，不再重複詢問。

### 步驟 2：寫入種子 DESIGN.md

沿用掃描模式的標準章節順序。填入工作坊選定的方向，對尚未確定的實作事實如實使用佔位符。種子承諾視覺世界及其不變數，但不假裝實作 token 已存在。

檔案開頭寫入：

```markdown
<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->
```

各章節規則：

- **Overview**：所選設計論點、佈局行為、材質性格、影像立場、動效語法和可複用標誌。選定首個介面的表現形式留在該介面簡報中，不要提升為全域性視覺世界。
- **Colors**：所選色彩策略和角色。只有當使用者、現有資產或 new-work 探索已確定具體值時才記錄，否則標記 `[to be resolved during implementation]`。
- **Typography**：所選字型性格和角色關係。僅在已確定時記錄字型名，否則將搭配標記為 `[to be resolved during implementation]`。
- **Layout**：所選空間語法與回應式行為，不虛構尚未確定的精確尺寸。
- **Elevation & Depth**：將所選材質與深度行為寫成不變數，而不是從通用預設推斷。
- **Shapes**：所選形態和圓角語言。
- **Components**：完全省略；元件尚不存在。
- **Do's and Don'ts**：記錄視覺世界選擇時確認的長期護欄，不記錄任務區域性拒絕項。

種子模式 frontmatter 只寫 `name` 與 `description`，不寫 colors、typography、rounded、spacing 或 components。真實 token 在下一次掃描模式執行時加入。出於同樣原因，種子模式跳過 `.impeccable/design.json` sidecar：此時沒有可渲染內容。

### 步驟 3：確認

1. 展示種子 DESIGN.md，並明確它是種子（標記就是字面承諾）。
2. 告訴使用者：“有一些程式碼後，請重新執行 `/impeccable document`。下一輪會提取真實 token 並產生 sidecar。”

你剛寫入的內容就是最新事實源，無需重新載入。

## 風格指南

- **Frontmatter 優先，正文其次。** Token 寫入 YAML frontmatter，正文說明其語境。不要在兩處重複定義 token 值；frontmatter 是規範來源。
- **只攜帶長期產品約束。** PRODUCT.md 中有約束力的 logo、身份資產、無障礙要求或品牌承諾可以限制 DESIGN.md；介面策略留在相應簡報。
- **遵守規範。** 按順序使用八個標準章節，不相關的就省略。動效指導歸入其影響的視覺世界或元件，不建立 schema 不支援的 token 組。
- **描述性優於技術性**：“輕柔弧形邊緣（8px 圓角）”優於“rounded-lg”。描述在前，技術值放在括號中。
- **功能性優於裝飾性**：每個 token 都說明在何處、為何使用，而不只說明它是什麼。
- **精確值放括號中**：十六進位制、px/rem、字重等數值始終與描述同時給出。
- **使用命名規則**：`**The [Name] Rule.** [short doctrine]`。它們容易記憶和引用，比專案列表更能被 AI 消費；Stitch 輸出也大量採用這種形式，如“The No-Line Rule”“The Ghost Border Fallback”。每章爭取 1–3 條。
- **證據明確時果斷表達。** 對真實不變數使用硬性語言，對臨時指導使用更溫和的語言。
- **只有基於已觀察系統或使用者確認決策時才使用具體稽核測試。** 一句可執行的測試勝過一段原則。
- **選擇性引用 PRODUCT.md。** 產品事實用於解釋視覺世界為何合適；預設不提供頁面構圖或視覺停用清單。
- **按角色組織顏色**，不要按十六進位制或色相排序。規範順序是 Primary / Secondary / Tertiary / Neutral。

## 常見陷阱

- 不要貼上原始 CSS class 名；轉換為描述性語言。
- 不要提取每個 token，只保留真正複用的內容；一次性值會汙染系統。
- 不要虛構不存在的元件。專案只有按鈕和卡片，就只記錄二者。
- 未詢問前，不得覆蓋現有 DESIGN.md。
- 不要重複 PRODUCT.md 內容；DESIGN.md 嚴格限定為視覺內容。
- 不要用近義詞替換標準章節。佈局與回應式行為寫入 `Layout`，動效歸入受影響的視覺世界或元件。
- 標題不能有任何細微改名：必須是“Colors”而非“Color Palette & Roles”，“Typography”而非“Typography Rules”。工具依賴精確標題解析。
- 不要在 frontmatter 與正文之間重複 token 值。若 `colors.primary` 使用十六進位制，正文可以命名並解釋角色，但不得重新宣告另一十六進位制；frontmatter 才是規範來源。
- 不要發明 Stitch schema 之外的頂級 frontmatter token 組（不能有 `motion:`、`breakpoints:`、`shadows:`）。其他內容都屬於 sidecar 的 `extensions`。
