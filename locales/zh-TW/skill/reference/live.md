互動式 Live 變體模式：在瀏覽器中選擇元素和設計 action，透過開發伺服器 HMR 熱替換 AI 產生的 HTML+CSS 變體。

## 前置條件

需要一臺執行中且支援 HMR 的開發伺服器（Vite、Next.js、Bun 等），或瀏覽器中開啟的靜態 HTML 檔案。預設埠被佔用時，應用很可能已經執行；先探測預設 URL，不要啟動第二臺伺服器。

Live 編輯需要本地 checkout；不支援向已經部署的生產站點（包括 HTTPS）注入。檢查生產站點時使用 `{{scripts_path}}/impeccable detect <url>` 或瀏覽器擴充功能，不要使用 Live helper。絕不要為了啟用 Live 模式而關閉瀏覽器安全機制或削弱生產 CSP。

<codex>
Codex：從一開始就使用 `sandbox_permissions: "require_escalated"` 執行 Live helper 命令、應用開發伺服器和任何會安裝依賴的設定；Live 模式依賴 localhost 和包管理器網路訪問，這些會被 sandbox 阻止。
</codex>

## 契約（只需完整讀取一次）

嚴格按順序執行，不得跳過或重排。Live 模式的任何工具輸出都可能帶 `_instructions`；它針對目前實際 id 和路徑給出權威下一步。與本文記憶衝突時，以 `_instructions` 為準。

1. `impeccable live`：啟動。如果請求點名或暗示 monorepo 中的檔案、路由或應用，推斷具體路徑並改為執行 `{{scripts_path}}/impeccable live --target <path>`；隨後從返回的 `projectRoot` 執行本次 Live 會話。Boot 根據 dev-server 設定解析應用根目錄並寫入 `.impeccable/live/roots.json`；每個 helper 啟動時都重新錨定該 manifest，錯誤 cwd 不會分叉會話狀態。PRODUCT.md / DESIGN.md 向上查詢到 Git 根目錄；`--file` 等相對參數以應用根目錄解析。
2. 開啟提供 `pageFile` 的應用 URL，可從 `package.json`、文件、終端輸出或已開啟標籤頁推斷。絕不要使用 `serverPort`，它屬於 helper，不是應用。**Cursor：** 輪詢前必須用 `browser_navigate` 開啟 URL。**其他宿主：** 使用可用瀏覽器工具；URL 不確定時只詢問使用者一次。
3. 使用預設長超時（600000ms）進行輪詢。每個事件或 `--reply` 後立即重新執行 `impeccable live-poll`；Codex 在前臺執行一次性 poll。絕不要傳很短的 `--timeout=`。沒有程序輪詢 `/poll` 時，全域性欄的 **Impeccable 標記**會變暗並顯示脈衝琥珀點；重新執行 poll 即可連線。
4. 收到 `generate`：存在 `event.scaffold` 時複用；有截圖時讀取；載入 action 參考；交付變體；`--reply done`；繼續輪詢。在目前執行緒產生，你已經掌握專案 token 和佈局。浮層預覽就是驗證通道；generate 到 accept 之間不要截圖、重新渲染或 QA 變體。編寫時直接滿足 craft-floor 的對比度、間距和排版底線；只在 accept 後對獲選變體執行一次完整驗證。
5. 收到 `steer`：讀取 message 和 `pageUrl`；完成工作；`--reply steer_done`；繼續輪詢。無需領取確認。
6. 收到 `accept` / `discard`：poll 指令碼執行 `impeccable live-accept`、確認交付並輸出 `_completionAck`。普通 accept/discard 立即終止；carbonize accept 在執行 `impeccable live-complete --id EVENT_ID` 前仍可恢復。繼續輪詢前必須完成清理。
7. 中斷後先執行 `impeccable live-status` 或 `impeccable live-resume`，不要猜測。`.impeccable/live/sessions/` 下的 journal 是事實源；helper 重啟後會重放未確認工作，頁面重開後注入的 `live.js` 會重新連線。只有 `live-resume` 報告沒有活動會話時才回退直接編輯，不能僅因多次斷線就回退。
8. 收到 `exit`：執行文末 Cleanup。

宿主策略：
- **Claude Code**：poll 作為後台任務執行，不設短超時；宿主在完成時通知。不要阻塞 shell。
- **Cursor**：在後台終端執行一次性 poll，併為 `"type":"(steer|generate|accept|discard|manual_edit_apply|variant_mount_failed|prefetch|exit)"` 設定通知；處理事件、`--reply`、重啟 poll。不要在 Cursor 使用 `--stream`。
- **Codex**：預設在可 yield 的前臺 exec session 執行一次性 poll。不使用 `&`、不使用 `--stream`，Live 期間始終保持活動的前臺 poll。僅啟動不夠，必須持續讀取 exec session，直到返回事件。不要說“等待使用者”後閒置；無人讀取的 yielded poll 是死會話，使用者的 Go 不會得到處理。
- **其他宿主**：除非確認 shell 退出後 stdout 能可靠返回，否則使用一次性前臺 poll。

交付策略：所有宿主預設一次原子編輯交付；除非已知其 poll loop 不會被額外呼叫阻塞，否則不要改為漸進發布。

聊天是額外開銷。不要複述、不要輸出教程、不要貼上 PRODUCT / DESIGN 內容。把 token 用於工具和編輯；失敗時只說一兩句。

## 輪詢迴圈

```
LOOP:
  {{scripts_path}}/impeccable live-poll   # default long timeout; no --timeout=
  Read JSON; dispatch on "type"

  "generate"  → Handle Generate; reply done; LOOP
  "steer"     → Handle Steer; reply steer_done; LOOP
  "accept"    → Handle Accept; complete carbonize cleanup if required; LOOP
  "discard"   → Handle Discard; LOOP
  "prefetch"  → Handle Prefetch; LOOP
  "manual_edit_apply" → Handle Manual Edit Apply; reply done|partial|error; LOOP
  "variant_mount_failed" → Fix the variant files; reply done --file <path>; LOOP
  "timeout"   → LOOP
  "exit"      → break → Cleanup
```

`variant_mount_failed` 表示瀏覽器無法渲染已釋出內容（包含 `variant`、module `url`、`error`）。使用者看到持續顯示的錯誤卡片，而不是變體。修復變體檔案後執行 `--reply EVENT_ID done --file <manifest or source path>`；瀏覽器會自行重試。

**Stream 模式**（`--stream`，實驗性，Cursor 停用）：一個長期程序，每個事件輸出一行 JSON；使用另一條命令 `--reply`。僅適用於能可靠讀取增量 stdout 的宿主。

## 啟動

```bash
{{scripts_path}}/impeccable live
```

輸出 JSON：`{ ok, serverPort, serverToken, pageFiles, roots, hasProduct, product, productPath, hasDesign, design, designPath, hasSurfaceBrief, surfaceBrief }`。`roots` 是已解析根目錄 manifest；`projectRoot` 等於 `roots.appRoot`。Surface brief 隨結果返回，不要另行執行 `impeccable surface-brief`。產生時的優先順序：**DESIGN.md 決定視覺；PRODUCT.md 決定持久產品資訊和語氣；surface brief 決定目前介面的策略。** 缺少 DESIGN.md 不代表沒有身份；應從 CSS 變數、計算樣式和同級元件中提取（步驟 4 階段 A）。預設保留身份；只有使用者明確要求重新設計時才偏離。

`serverPort` / `serverToken` 屬於小型 helper HTTP 服務（`/live.js`、SSE、`/poll`），不是開發伺服器；頁面 URL 是實際提供某個 `pageFiles` 條目的 origin。

輸出為 `{ ok: false, error: "config_missing" | "config_invalid", path }` 時，專案需要一次性設定：讀取並遵循 [live-setup.md](live-setup.md)。`configDrift` 非 null 時，每次會話只告訴使用者一次哪些 HTML 檔案未覆蓋，建議新增或把 `files` 改為 glob；絕不要自動修改設定。

## 恢復命令

`.impeccable/live/sessions/` 下的 append-only journal 是持久事實狀態，不是專案原始碼。聊天中斷、漏掉 poll、helper 重啟或瀏覽器重新整理後執行：

```bash
{{scripts_path}}/impeccable live-status      # helper state, active sessions, queued events; works with the helper down
{{scripts_path}}/impeccable live-resume --id SESSION_ID   # active snapshot, pending event, next safe action
{{scripts_path}}/impeccable live-complete --id SESSION_ID # canonical manual final acknowledgement after verified cleanup
```

伺服器重啟規則：再次啟動 `impeccable live-server`，然後 poll；啟動會重新排隊未確認事件。除非 `live-resume` 表示不存在活動會話，否則絕不要讓使用者再次點選 Go。

## 處理 `generate`

**替換模式**（預設）：`{id, action, freeformPrompt?, count, pageUrl, element, screenshotPath?, comments?, strokes?}`。

**插入模式**（`event.mode === "insert"`）：`{id, mode: "insert", count, pageUrl, insert: { position, anchor }, placeholder: { width, height }, freeformPrompt?, screenshotPath?, comments?, strokes?}`。沒有 `action`；必須包含非空 `freeformPrompt` 或 annotation。`placeholder` 只是柔性尺寸提示。

速度很重要，使用者正在觀看選中元素。複用預檢元資料，減少發現呼叫。

### 插入模式分支

1. 有截圖時讀取，只用於 annotation。
2. 存在 `event.scaffold` 時直接使用，不要再次執行 helper。否則執行：

```bash
{{scripts_path}}/impeccable live-insert --id EVENT_ID --count EVENT_COUNT --position after \
  --element-id "ANCHOR_ID" --classes "class1,class2" --tag "section" --text "ANCHOR_TEXT"
```

`--position` 對應 `event.insert.position`；anchor flag 與 wrap 完全對應。Scaffold 沒有 `data-impeccable-variant="original"`；變體是在 `insertLine` 新增的 HTML+CSS。Source-preview 目標會返回 `sourceWritten: false`、`wrapperBlock` 且 `replaceEndLine < replaceStartLine`：在 marker 處把變體拼入 `wrapperBlock`，並在 `replaceStartLine` 透過一次編輯插入，與 wrap 章節一致。根據介面選擇訪客模式，並在編寫新 markup 前載入 [craft-floor.md](craft-floor.md)。Svelte 目標遵循下文與 wrap 相同的元件流程，manifest 中為 `mode: "insert"`：每個變體是 `componentDir` 下真實的單根元件，不含 `data-impeccable-*`；產生期間絕不編輯 route；accept 會機械地把獲選 markup 拼入 `sourceFile`。非 Svelte 目標在 accept/discard 後移除 wrapper，anchor 不變。

### 替換模式（預設）

### 1. 讀取截圖（如果存在）

只有使用者點選 Go 前進行了標註，才會傳送 `event.screenshotPath`；它是已經合成 annotation 的元素 PNG。規劃前讀取。不存在時不要索要或自行截圖：沒有標註的截圖會把設計錨定在現狀，妨礙三個不同方向；應根據 `element.outerHTML`、計算樣式和 prompt 工作。

Annotation 語義：comment 的 `{x, y}` 是元素區域性座標，文字約束該點下的子元素。Comment 與 stroke 相互獨立，除非明顯成對。Stroke 按形狀解釋：閉環表示“這個物件”（強調，不是裁剪區域）；箭頭表示方向或移動；叉號/斜線表示刪除；塗畫根據上下文表示強調或刪除。只有意圖確實含糊且會改變簡報時才問一個簡短問題；否則用一句話說明你的理解。

### 2. 包裝元素

存在 `event.scaffold` 時，helper 已找到原始碼並計算 wrapper；把它當作成功輸出，跳過命令。存在 `event.scaffoldAttempted` 和 `scaffoldError` 時，預檢未完成，使用下方命令。

**Source-preview 目標中的 `event.scaffold` 會帶 `sourceWritten: false`。** Helper 沒有寫 wrapper，而是返回 `scaffold.wrapperBlock` 與選中元素的原始碼範圍（`replaceStartLine`、`replaceEndLine`，從 1 開始）。透過**一次編輯**同時寫入 wrapper 和所有變體：在 “Variants: insert below this line” marker 處把變體拼入 `wrapperBlock`，再用結果替換 `[replaceStartLine, replaceEndLine]`。若分兩次寫，框架會在變體到達前過載，使瀏覽器卡在 0/N。`replaceEndLine < replaceStartLine` 表示插入模式，只插入，不刪除。`svelte-component` 路徑永遠不會設定 `sourceWritten`。

```bash
{{scripts_path}}/impeccable live-wrap --id EVENT_ID --count EVENT_COUNT --element-id "ELEMENT_ID" --classes "class1,class2" --tag "div" --text "TEXT_SNIPPET"
```

Flag 必須保持分開，絕不能合併成 `--query`：`--element-id` ← `event.element.id`；`--classes` ← 用逗號連線的 classes；`--tag` ← tagName；`--text` ← textContent 前約 80 字元，**每次呼叫都要提供**，它用於區分重複的同級元件；缺少時 wrap 會落到第一個匹配項。`event.pageUrl` 能推斷檔案時傳 `--file PATH`。`--text` 仍匹配多個候選時，wrap 返回 `{ error: "element_ambiguous", candidates, fallback: "agent-driven" }`；根據頁面上下文選擇正確範圍，並按 fallback 流程手寫 wrapper。

成功輸出：`{ file, insertLine, commentSyntax, styleMode, styleTag, cssSelectorPrefixExamples, cssAuthoring }`；source-preview 還包含上述 `sourceWritten: false` 欄位。沒有預檢 scaffold 而直接執行時，命令會寫 wrapper，你在 `insertLine` 插入變體。`styleMode` 決定預覽 CSS 寫法，把它視為偵測出的能力模式，而不是框架猜測：`scoped` 使用 `@scope ([data-impeccable-variant="N"])`；`astro-global-prefixed` 使用明確的 `[data-impeccable-variant="N"]` 字首和返回的精確 `styleTag`。以目前檔案的 `cssAuthoring` 為事實源，遵循其 styleTag、selector 策略、要求和停用模式；除非其中說明，否則不要自行新增框架例外。

Svelte/SvelteKit 目標會返回 `previewMode: "svelte-component"`：`file` 指向臨時 `node_modules/.impeccable-live/<id>/manifest.json`，`componentDir` 存放變體元件，`sourceFile` 是真實 route。Scaffold 基於 AST，`{#each}`、`{#if}` 等控制流會保留；each 的自由 collection 作為一個結構化 prop（kind `collection`）穿過契約。Payload 已包含寫入 stub 的 `componentStubMarkup`，不要重新讀取 manifest 或 stub。原地編輯 `v1.svelte`、`v2.svelte` 等，絕不要刪除重建；保留 stub 控制流和 `propContract` prop 名稱，絕不要把迴圈展開為字面專案。Stub `<style>` 已包含目前選擇的源規則，可以重新設計或刪除。Accept 時，變體未重新宣告的 seeded rule 會從原始碼刪除，因為使用者批准的預覽中並未應用它。使用語義 class selector，不使用 `@scope` 或 `data-impeccable-*`。回覆時 `--file` 指向 manifest；瀏覽器掛載編譯後的元件，Svelte HMR 不會重置頁面狀態。Accept 會機械地合併獲選元件：恢復 route 表示式、協調 CSS、固化參數並保留縮排；此路徑無需 accept 後清理。不支援 detached preview 的結構，如元件 tag、`bind:`/`use:`、await block、inline script 和 spread attribute，會回退普通 source-preview wrapper，並返回 `previewFallback`；按返回結構處理。

**元件預覽路徑的參數寫入 sidecar，絕不寫屬性**，因為 Svelte 會把屬性值中的 `{` 解析為表示式。在 `componentDir/params.json` 按變體編號宣告，schema 與第 7 節一致：

```json
{ "1": [ {"id":"density","kind":"steps","default":"snug","label":"Density","options":[
    {"value":"airy","label":"Airy"},{"value":"snug","label":"Snug"} ]} ] }
```

元件 `<style>` 對 range/toggle 使用 `var(--p-<id>, default)`；steps 使用 `[data-p-<id>="…"]`，並放在 `:global(...)` 中，讓掛載根節點上的執行時 knob 值能影響規則。

**Fallback 錯誤。** Wrap 拒絕寫入非原始碼檔案（產生檔案、未跟蹤檔案），因為向其 accept 會靜默丟失資料。三種結構都帶 `fallback: "agent-driven"`，見 **Handle fallback**：`file_is_generated`、帶 `generatedMatch` 的 `element_not_in_source`、`element_not_found`。

### 3. 載入 action 參考

`event.action` 為 `impeccable`（freeform）時，使用 SKILL.md 設計規則和 [craft-floor.md](craft-floor.md)，根據介面決定訪客模式，不載入子命令參考。Freeform 不能跳過參數，遵守第 7 節預算和 freeform 偏向。其他 action（`bolder`、`quieter`、`distill`、`polish`、`typeset`、`colorize`、`layout`、`adapt`、`animate`、`delight`、`overdrive`）在規劃前讀取 `reference/<action>.md`；其中 MUST 參數疊加在第 7 節預算上。

### 4. 規劃三個變體：先身份，再模式，再主軸

Live 作用於已有介面，品牌已經確定。任務是在**同一身份內變化**，不是在多個身份間選擇。最嚴重失敗是三個使用者無法接受的偏離品牌變體。按四個階段執行。

#### 階段 A：提取身份（不可跳過）

按優先順序讀取：DESIGN.md 視覺系統欄位；CSS 自定義屬性；選中元素和父元素的計算樣式；同級元件的視覺修辭。用一句話記錄實際畫面：主要表面和強調色（真實值，不寫“溫暖”）、已載入字型搭配、佈局拓撲、表面處理（圓角、邊框、陰影、裝飾密度）以及從文案讀出的語氣。必須具體；無法確認時省略該軸，不要虛構；不要使用審美類別名稱。該句是**身份鎖**，所有變體並排時必須仍屬於同一品牌。缺少 DESIGN.md 不能成為藉口。

#### 階段 B：選擇模式（預設或偏離）

**預設模式**保留身份，在其中改變表達，適用於約 90% 會話。**偏離模式**拒絕現有身份；只有使用者在目前請求或 prompt 中明確要求“重新設計”“從零重建”“完全不同”時才能觸發；舊 critique 或舊 note 不構成授權。不確定就使用預設模式：錯誤預設只會產生三個感覺相近的同品牌變體，可恢復；錯誤偏離會產生三個無法接受的異品牌變體。

#### 階段 C：規劃三個變體

**預設模式。** 每個變體選擇不同的**主軸**，同時保留身份句。六個主軸：1 **層級**；2 **佈局拓撲**；3 **排版系統**（在現有字型內改變搭配邏輯、比例、大小寫或字重）；4 **色彩策略**（僅使用現有 token，以 Restrained / Committed / Full palette / Drenched 改變表面角色）；5 **密度**；6 **結構拆分**（合併、拆分、漸進披露）。三個變體必須採用三個不同主軸，是同一品牌的三個角度。新字型、新色相或新審美類別訊號只屬於偏離模式。

**偏離模式。** 每個變體錨定不同且從品牌推導的審美方向，絕不能使用固定目錄：讀取 PRODUCT.md 的 Brand Personality；推導體現這些詞的物理、空間或材質體驗；再推導三個彼此不同、也不同於目前介面的方向；拒絕任何也適用於相鄰產品的慣性理由。每個方向用一句具體的現實參照描述，例如“博物館展品標籤系統”，而不是“乾淨極簡”。

**兩種模式都必須在規劃時為每個變體命名 2～3 個參數 knob**，並遵守第 7 節預算。參數是設計的一部分；規劃時決定“什麼可調”優於事後補加。

#### 階段 D：眯眼測試

**預設：** 將每個變體與階段 A 身份鎖對比；色板、字型聲音或修辭漂移表示意外進入偏離模式，必須重做。再確認三個不同主軸；三個“密度更緊”的變體屬於失敗。**偏離：** 分兩輪，先 family 後句子。Family 檢查不可妥協：用自己選擇的具體類別標記每個變體；標籤相同或可以互換就重做。句子檢查：並排比較三句描述，有兩句押韻就重做。主軸為顏色或主題時，三個變體不能共享主題與主色相；必須是三個色彩世界，而不是三種深淺。

特定 action 必須沿其維度變化：

- `bolder`：分別放大不同維度，如尺度、飽和度、結構變化。
- `quieter`：分別收斂顏色、裝飾、間距。
- `distill`：分別刪除視覺噪音、重複內容、巢狀結構。
- `polish`：分別精修節奏、層級、微細節。
- `typeset`：每個變體的搭配和字階比例都不同。
- `colorize`：使用不同色相家族，並改變色度和對比策略。
- `layout`：使用不同結構排列，不是微調間距。
- `adapt`：使用不同目標情境，如移動優先、平板、桌面、列印或低資料。
- `animate`：使用不同動效詞彙，如級聯錯峰、裁切擦除、縮放聚焦、形變、視差。
- `delight`：使用不同個性形式，如微互動、排版驚喜、插圖強調、聲音或觸覺、彩蛋。
- `overdrive`：分別打破不同慣例，如尺度、結構、動效、輸入模型、狀態轉換；跳過其“提出方案並詢問”步驟，因為 Live 是非互動式的。

### 5. 應用 freeform prompt（如果存在）

`event.freeformPrompt` 是使用者設定的方向上限；所有變體在階段 B 模式內用不同方式實作。預設模式中 prompt 限制主軸而不改變身份；例如“更自信”可分別強化層級、強調色和密度。偏離模式中 prompt 限制路徑而不限制 family；例如“報紙頭版”可分為大報、小報和行業刊物，再執行 family 檢查。Prompt 與品牌承諾或 DESIGN.md 不變數衝突時，除非使用者明確撤銷，否則保留不變數。

### 6. 交付變體

每個變體都完整替換原元素的 HTML，不能只修改 CSS。預覽 CSS 以 `<style>` 放在 wrapper 內。**預設原子交付：** 在 `insertLine` 的一次編輯中寫入 CSS、全部變體和參數 manifest。

```html
<!-- Variants: insert below this line -->
<style data-impeccable-css="SESSION_ID">
  /* rules matching cssAuthoring.rulePattern */
</style>
<div data-impeccable-variant="1">
  <!-- variant 1: full element replacement (single top-level element) -->
</div>
<div data-impeccable-variant="2" style="display: none">
  <!-- variant 2 -->
</div>
<div data-impeccable-variant="3" style="display: none">
  <!-- variant 3 -->
</div>
```

工具返回不同 tag 時，用 `cssAuthoring.styleTag` 替換 style 開始標籤。**每個 variant div 必須只有一個頂級元素**，且 tag 與原元素相同；鬆散同級會破壞 outline tracking 和 accept。第一個變體可見，其他均為 `display: none`。MutationObserver 支援原子或漸進到達；接受已到達變體會 fence worker，拒絕後續釋出。

`styleMode: "scoped"` 時，每條 `:scope` 規則都必須包含後代組合符：`@scope` 邊界是 variant wrapper div，不是你的元素；裸 `:scope { ... }` 會設定 `display: contents` 外殼。必須進入內部，如 `:scope > .card`、`:scope .hero-title`。儲存庫 [Agent 模板](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/live-e2e/agent.mjs) 中的測試 CSS 是可靠模板。

**JSX / TSX 目標：** `<style>` 內容使用 template literal；否則 CSS 大括號會被當作 JSX。使用 `className=` / `style={{…}}`，`data-impeccable-*` 屬性保持普通字串：

```tsx
<style data-impeccable-css="SESSION_ID">{`
  @scope ([data-impeccable-variant="1"]) { ... }
`}</style>
<div data-impeccable-variant="2" style={{ display: 'none' }}>
  {/* variant 2 */}
</div>
```

Wrap 指令碼會返回 marker 位於內部的單根 JSX wrapper；把 block 放在 marker 處，原始碼仍為有效 TSX。

### 7. 參數（按構圖規模，每個變體 0～4 個）

每個變體可暴露**粗粒度** knob；瀏覽器為每個參數停靠一個控制元件，無需重新產生，透過 CSS 變數或 data attribute 驅動 scoped CSS。使用者可能自然地說“緊一點”“強調色多一點”時就應把該軸做成參數；微小 margin 和一次性位移不是參數。Freeform 下更應暴露你選擇的軸；Hero 使用 0 個參數幾乎總是錯誤，除非設計確實是固定點，否則 1 個也偏少。

預算按元素視覺重量計算，統計視覺子項而不是 DOM 深度：

- **葉子/微小元素**（按鈕、圖示、純標題）：**0 個**。
- **小型構圖**（簡單卡片、帶標籤輸入框、不超過約 5 個視覺子項）：**0～1 個**。
- **中型構圖**（區塊、導航組、6～15 個子項）：**目標 2 個**；簡單時 1 個。
- **大型構圖**（Hero、完整區域、16 個以上子項或多個子區塊）：**目標 2～3 個**；獨立軸都已用 CSS 實作時最多 4 個。

**硬上限為四個。** 命名子命令參考中的 MUST 參數在可表達時不可協商；仍須遵守上限，不要重複 knob。

HTML/JSX 路徑使用 wrapper attribute 宣告；元件預覽路徑改用 `componentDir/params.json`，schema 相同並按變體編號組織：

```html
<div data-impeccable-variant="1" data-impeccable-params='[
  {"id":"color-amount","kind":"range","min":0,"max":1,"step":0.05,"default":0.5,"label":"Color amount"},
  {"id":"serif","kind":"toggle","default":false,"label":"Serif display"}
]'>
```

三種類型：`range` 驅動 `--p-<id>`，使用 `var(--p-color-amount, 0.5)`；欄位為 min/max/step/default/label。`steps` 驅動 `data-p-<id>`，使用 `:scope[data-p-density="airy"] .grid { ... }`；欄位為 options/default/label。`toggle` 同時驅動 `--p-<id>: 0|1` 和屬性是否存在；欄位為 default/label。切換變體時參數會重置到宣告的預設值，這是已知限制。

**Accept 時**，瀏覽器傳送目前值，`impeccable live-accept` 把它寫為同級 comment：`<!-- impeccable-param-values SESSION_ID: {"color-amount":0.7} -->`。Carbonize 清理會固化值：僅保留匹配的 `steps`/`toggle` 分支，刪除其餘；把 `:scope[data-p-…]` 收斂為語義規則；替換 `range` 字面值或更新變數預設值。

### 8. 發出完成訊號

```bash
{{scripts_path}}/impeccable live-poll --reply EVENT_ID done --file RELATIVE_PATH
```

`RELATIVE_PATH` 相對於專案根目錄；開發伺服器沒有 HMR 時，瀏覽器會直接獲取原始碼。隨後立即繼續 poll。

### 中止進行中的會話

瀏覽器切換到 GENERATING 後 wrap 或產生失敗，應通知**瀏覽器**重置浮條：`{{scripts_path}}/impeccable live-poll --reply EVENT_ID error "Short reason"`。絕不要為此使用 `live-accept --discard`；它只是檔案修改器，瀏覽器看不到，浮條會一直顯示圓點。`--discard` 僅用於瀏覽器自己發起 discard 後的原始碼清理。

## 處理 fallback

Wrap 返回 `fallback: "agent-driven"` 時，由你選擇真實原始碼檔案；目標不變：現在預覽三個變體，獲選版本持久化到下次建置不會覆蓋的位置。

1. 根據錯誤 payload 找到元素真實來源：`element_not_in_source` + `generatedMatch` 表示 HTML 是產生的，應找到產生器 template/partial；`element_not_found` 表示執行時注入，應找到渲染元件或資料來源；`file_is_generated` 同理。純視覺變化可能屬於共享樣式表。
2. **在 served file 中預覽**：把 `impeccable live-wrap` 產生的 wrapper scaffold 手動寫入瀏覽器實際載入的檔案：`<!-- impeccable-variants-start ID --><div data-impeccable-variants="ID" data-impeccable-variant-count="3" style="display: contents">…</div><!-- end -->`，插入 variant div，然後執行 `--reply EVENT_ID done --file <served file>`。這是臨時編輯，被重新產生覆蓋也沒關係。
3. **Accept 時寫入真實原始碼**；accept 會拒絕產生檔案，因此此時 `_acceptResult.handled` 通常為 `false`。結構變化寫 template/component；純視覺變化寫正確 stylesheet；資料渲染內容寫資料來源或渲染邏輯。隨後從 served file 刪除臨時 wrapper。
4. **Discard 時**只刪除臨時 wrapper。

## 處理 `accept`

事件：`{id, variantId, _acceptResult, _completionAck}`。Poll 指令碼已經確定性執行 `impeccable live-accept` 並確認交付；瀏覽器 DOM 已更新。

- Accept 事件包含 `pageUrl`；poll 指令碼必須把它傳給 `impeccable live-accept --page-url PAGE_URL`，使接受時清理只移除目前頁面暫存的文案編輯。
- `_completionAck.ok !== true`：暫不 poll。執行 `live-status` / `live-resume`，必要時手動完成清理，再執行 `live-complete --id EVENT_ID`。
- `handled: true, carbonize: false`：無需處理，繼續 poll。
- `handled: true, carbonize: true`：必須執行下述清理；`_acceptResult.todo`、`_completionAck.requiresComplete` 和 stderr banner 都會指向它。
- `handled: false, mode: "fallback"`：會話位於產生檔案；你已在 fallback 步驟 3 寫入真實原始碼，清理臨時 wrapper 後繼續 poll。
- `handled: false, mode: "error"`：**不要手動編輯檔案。** `source_locked`：冪等地重試同一條 `live-accept` 命令，直到 publisher 釋放。`accept_receipt_conflict`：會話已按 `priorOperation` 解決；執行 `live-status` 並告知使用者。其他錯誤先簡要報告，再執行 `live-status`。
- 沒有 `mode` 的 `handled: false`：手動清理，讀取檔案、找到 marker 並編輯。

### Accept 後必須執行的操作（carbonize）

`carbonize: true` 表示獲選變體已透過 helper marker 和 inline CSS 拼入原始碼，以確保瀏覽器無空檔渲染。這只是臨時狀態；繼續任何工作前都要改寫為永久形式，否則 dead `@scope`、wrapper div 和 marker 會跨會話累積。下一次 poll 前同步完成五步：

1. 在 `_acceptResult.file` 定位 `<!-- impeccable-carbonize-start/end SESSION_ID -->` 包圍的 carbonize block，其中包含 `<style data-impeccable-css>`；有 `<!-- impeccable-param-values -->` comment 時先讀取，它驅動第 3、4 步。
2. 把 CSS 規則移動到專案真實樣式表，即已經負責周圍元素的樣式表。
3. 重寫 selector 時固化參數：把 `@scope ([data-impeccable-variant="N"])` 改為真實語義 class；僅保留匹配選擇值的 `:scope[data-p-<id>="VALUE"]` 分支；替換 `var(--p-<id>)` 字面值或更新變數預設值。
4. 解除獲選內容 wrapper：刪除內部 variant div；JSX 中還要刪除外層 `data-impeccable-carbonize` div；移除 `data-impeccable-params` 和全部 `data-p-*` 屬性。
5. 刪除 inline `<style>`、param-values comment、兩個 carbonize marker，以及所有未獲選變體的 `@scope` 規則。

隨後執行 `impeccable live-complete --id SESSION_ID`，確認 `phase: "completed"` 後再 poll。這是門禁，不是形式：只要存在 Live 遺留，它會以 `error: "source_dirty"` 和 findings 拒絕。修復後重試；只有誤報才能用 `--force`。

## 處理 `discard`

事件：`{id, _acceptResult, _completionAck}`。Poll 指令碼已經恢復原內容並確認 `discarded`。除非 `_completionAck.ok !== true`，否則無需處理；異常時執行 `impeccable live-complete --id EVENT_ID --discarded`，再 poll。

## 處理 `steer`

事件：`{id, message, pageUrl}`。它是來自全域性欄 Steer 控制元件的頁面級方向，可以輸入或語音觸發；沒有元素上下文，也不迴圈變體。讀取 `message`，按需檢查頁面或檔案，執行編輯或用文字回答。執行 `{{scripts_path}}/impeccable live-poll --reply EVENT_ID steer_done ["Optional short toast"]`；失敗時使用 `--reply EVENT_ID error "Short reason"`，隨後立即 poll。無需單獨領取確認；`steer_done` 或 `error` 會解鎖 Steer 欄。

## 處理 `prefetch`

事件：`{pageUrl}`。每個路由首次選擇時觸發一次；使用者可能即將在你尚未讀取的頁面點選 Go。把路由解析到檔案並讀取：根 `/` 通常對應 boot 的 `pageFile`；多頁面站點常把 `/foo` 對映到 `public/foo/index.html`；SPA 全部對映到同一入口。隨後繼續 poll，不需要 `--reply`。無法可靠解析時跳過並繼續 poll。

## 處理 `manual_edit_apply`

事件：`{id, pageUrl, batch: {entries}, evidencePath?, chunk?, repair?, deadlineMs}`。

使用者已經點選 Apply。不要再詢問要做什麼，不要 discard，也不要把他們重定向到 Go。父 Live 執行緒保持前臺 poll loop，併發送最終 `/poll --reply --data`。

存在原生子 Agent 時，把原始碼編輯委派給 `impeccable_manual_edit_applier` / `impeccable-manual-edit-applier`。傳遞 cwd、scripts path、event id、page URL、chunk/deadline、`batch`、`evidencePath` 和規範 JSON 結果 schema。子 Agent 不能 poll 或 reply。不可用時用相同契約在目前執行緒執行。

存在 `repair` 時，表示上次 Apply 已修改原始碼但最終驗證失敗。修復目前原始碼並返回同一規範 JSON；不要自行回滾。瀏覽器會在任何回滾前詢問使用者。

原始碼編輯完成後只回復一次：`{{scripts_path}}/impeccable live-poll --reply EVENT_ID done --data '{"status":"done","appliedEntryIds":["8hexid"],"failed":[],"files":["src/page.html"],"notes":[]}'`。未全部應用時使用 `status:"partial"` 或 `status:"error"` 並填寫 `failed[]`。隨後繼續 poll。絕不要省略 event id；manual Apply 不接受 `--reply done --file ...`。

## 退出

使用者可以在聊天中要求停止、關閉標籤頁（SSE 斷開，poll 約 8 秒後返回 `exit`），或點選瀏覽器 exit 按鈕。收到 `exit` 後終止仍在執行的後台 poll，再執行清理。

## 清理

```bash
{{scripts_path}}/impeccable live-server stop
```

該命令停止 helper，並執行 `impeccable live-inject --remove` 移除注入指令碼；需要快速重啟時可用 `stop --keep-inject` 保留注入。`.impeccable/live/config.json` 作為專案設定繼續存在。隨後搜尋並移除任何遺留的 `impeccable-variants-start` wrapper 和 `impeccable-carbonize-start` block。

## 首次設定

只有 `impeccable live` 報告 `config_missing` / `config_invalid`、需要解釋 `configDrift`，或設定缺少 `cspChecked` 時，才讀取 [live-setup.md](live-setup.md)。它負責設定 schema、各框架 `files` 表、注入介面卡、漂移修復以及 CSP 偵測和同意流程。
