# Operate 模式詳解（以及 Read 模式說明）

當設計服務於產品時使用本模式：應用介面、管理後台、設定面板、資料表格、工具、登入後的頁面，以及任何使用者正在完成任務的場景。核心要求位於 SKILL.md 的模式說明和 [craft-floor.md](craft-floor.md)；本文為 Operate 介面提供更深入的指導。Read 介面（文件、指南、長文）應結合 SKILL.md 的 Read 模式與本文的排版和一致性規則；對它們而言，正文行長和導航比元件密度更重要。

## 產品介面的“俗套感”測試

在這裡，熟悉感往往是一項功能。判斷標準是：熟悉該產品類別的使用者能否立即信任介面，還是會在每個似是而非的元件前停下來猶豫。

產品介面的失敗不在於平淡，而在於毫無理由的陌生：過度裝飾的按鈕、不一致的表單控制元件、無意義的動效、用在標籤上的展示字型，以及為標準任務發明的新互動。標準應該是有依據的熟悉感，讓工具消失在任務之中。

## 排版

- **一種字型家族通常就夠了。** 產品介面不需要展示字型與正文字型的搭配。一套調校良好的無襯線字型即可承載標題、按鈕、標籤、正文和資料。 <!-- rule:product-typo-one-family -->
- **使用固定的 rem 字階，而不是流式字階。** 用 `clamp()` 調整標題大小並不適合產品介面。使用者通常在穩定的 DPI 下使用產品；一個在側欄裡自動縮小的 h1 只會顯得更糟。 <!-- rule:product-typo-fixed-rem-scale -->
- **採用更緊湊的字階比例。** 相鄰級別通常相差 1.125～1.2。這裡的文字元素比品牌頁面更多，過大的對比會製造噪音。 <!-- rule:product-typo-tighter-ratio -->
- **正文仍需控制行長**（65～75ch）。資料和緊湊介面可以更密集；表格達到 120ch 以上也沒問題。 <!-- rule:product-typo-line-length -->

## 色彩

產品預設採用 Restrained。單個介面可以在有充分理由時採用 Committed（例如用一種分類色貫穿報表的儀表盤，或以滿幅色彩呈現歡迎頁的引導流程），但 Restrained 是底線。 <!-- rule:product-color-restrained-default -->

- 建立包含豐富狀態的語義詞彙：hover、focus、active、disabled、selected、loading、error、warning、success、info，並將它們標準化。 <!-- rule:product-color-state-vocab -->
- 強調色只用於主要操作、目前選中項和狀態指示，不用於裝飾。 <!-- rule:product-color-accent-only -->
- 為側欄、工具欄和麵板提供第二層中性色（比內容表面略冷或略暖）。 <!-- rule:product-color-second-neutral -->

## 佈局

- 回應式行為應改變結構（摺疊側欄、回應式表格、由斷點驅動的分欄），而不是使用流式排版。 <!-- rule:product-layout-responsive-structural -->

## 元件

每個互動元件都應具備 default、hover、focus、active、disabled、loading、error 狀態。任何一個都不能缺失。 <!-- rule:product-components-all-states -->

- 載入時使用骨架屏，而不是在內容中央放置轉圈圖示。 <!-- rule:product-components-skeleton-loading -->
- 空狀態應教會使用者如何使用介面，而不是隻顯示“這裡什麼也沒有”。 <!-- rule:product-components-empty-states -->
- 整個介面應保持一致的可供性：相同的按鈕形狀、相同的表單控制元件語言、相同的圖示風格。 <!-- rule:product-components-consistent-affordances -->
- 浮層必須能脫離容器。絕對定位的下拉選單若位於帶有 `overflow: hidden` 或 `overflow: auto` 的祖先元素內，會被裁切；應使用 `<dialog>`、Popover API、`position: fixed` 或 Portal。 <!-- rule:skill-interaction-dropdown-clipping -->

## 動效

- 大多數過渡保持在 150～250ms。使用者正處於操作流程中，不要讓他們等待編排好的動畫。 <!-- rule:product-motion-quick-transitions -->
- 動效用於傳達狀態，而不是裝飾。只為狀態變化、回饋、載入和揭示使用動效。 <!-- rule:product-motion-state-not-decoration -->
- 不要編排頁面載入序列。產品開啟後就應進入任務，使用者不想觀看載入表演。 <!-- rule:product-motion-no-page-load-sequence -->

## 產品約束

- 不傳達狀態的裝飾性動效。 <!-- rule:product-ban-decorative-motion -->
- 不同頁面使用不一致的元件語言。如果兩個位置的“儲存”按鈕外觀不同，其中一個就是錯的。 <!-- rule:product-ban-inconsistent-components -->
- 在介面標籤、按鈕和資料中使用展示字型。 <!-- rule:product-ban-display-fonts-ui -->
- 為了所謂風格重新發明標準可供性（自定義捲軸、奇怪的表單控制元件、非標準模態框）。 <!-- rule:product-ban-reinvented-affordances -->
- 對非活動狀態使用濃重色彩或滿飽和強調色。 <!-- rule:product-ban-heavy-inactive-color -->
- 一開始就想到模態框。模態框通常是偷懶的結果；應先窮盡行內和漸進式方案。 <!-- rule:product-ban-modal-first-thought -->

## 產品許可

產品介面可以採用一些品牌頁面無法承受的做法。

- 使用系統字型和熟悉的預設無襯線字型。
- 使用標準導航模式：頂欄與側邊導航、麵包屑、標籤頁、命令面板。
- 接受資訊密度。只要使用者確實需要，表格可以有很多行，面板可以有很多標籤，資訊可以很緊湊。
- 一致性優先於驚喜。跨頁面使用同一套視覺語言是一項優點；愉悅感應留給關鍵時刻，而不是鋪滿每個頁面。
