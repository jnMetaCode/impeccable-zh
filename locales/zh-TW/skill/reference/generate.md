> **還需要補充的上下文**：僅當請求中的目標元素無法唯一解析時，才需要使用者說明目標元素。

Generate 是進入 Live 模式的快速通道：使用者用一句話指定元素、方向和數量，一分鐘內即可在瀏覽器中切換多個變體。一條命令啟動 helper，把元素交給宿主已經展示的頁面浮層（滾動到元素、選中它，並觸發與點選 Go 相同的事件），然後返回 generate 事件；一次編輯寫入所有變體；一次呼叫回覆事件並等待使用者選擇，helper 會把選擇寫入原始碼。本檔案負責這條通道的管道；事件之後的設計工作完全由 [live.md](live.md) 負責。如果本會話尚未完整讀取它，現在先讀取。

**僅適用於 Web。** Live 瀏覽器浮層沒有原生平臺等價物；對於 `ios` / `android` / `adaptive` 專案，應拒絕本命令，並建議直接對原始碼使用 `bolder` 或 `quieter`。

快速通道節省的是管道時間：一條命令圍繞宿主已展示的頁面啟動會話，一次呼叫回覆並等待，不需要你持續看守瀏覽器。設計工作本身並未縮減。Setup 與其他命令相同，執行 `impeccable context`，讀取本文，並在編輯前讀取 craft-floor.md；變體的規劃、編寫和接受方式也與普通 Live 會話完全一致。

以下三條禁令覆蓋已知失敗方式：

- **絕不要執行 init 或 document，也不要索要 PRODUCT.md 或 DESIGN.md。** 檔案存在時，啟動命令會在 `boot` 中輸出並使用；不存在時會透過 `contextMissing`、`contextNote` 說明，隨後從事件中提取身份（步驟 3）。缺失檔案絕不是在本命令中訪談使用者的理由；會話結束後用一句話建議使用 `init`。
- **絕不要手寫 variants wrapper 或虛構 session id。** 只有瀏覽器能在 Go 時產生 8 位十六進位制 session id。缺少事件時重新執行步驟 2，絕不能直接編輯原始碼繞過。
- **檔案仍含 Live marker 時不要處理 hook finding**，也不要為了迎合 finding 重新設計變體；accept 會在變體永久化後驗證檔案。

## 步驟 1：解析請求

全部從使用者的一句話提取三個部分：

- **請求中有數字**：該數字就是數量。**沒有數字**：預設 3。協議上限為 8。
- **方向措辭**對映到 Live action 詞彙；絕不要發明新的 action 值：
  - **大膽、更強、更有衝擊力**：`bolder`
  - **安靜、平和、柔和、降低強度**：`quieter`
  - **簡潔、極簡、刪減**：`distill`
  - **精緻、收緊、打磨**：`polish`
  - **字型與排版詞彙**：`typeset`
  - **顏色詞彙**：`colorize`
  - **排列與間距詞彙**：`layout`
  - **裝置與斷點詞彙**：`adapt`
  - **動效詞彙**：`animate`
  - **有趣、俏皮詞彙**：`delight`
  - **打破規則詞彙**：`overdrive`
  - **帶有意圖但不屬於上述詞彙的措辭**（如“像銀行一樣”“更溫暖”“更高階”）：使用 `impeccable`，並把使用者原話作為 prompt。
  - **既匹配 action 又帶額外意圖**（如“更大膽，但保持單色”）：使用對應 action，其餘內容作為 prompt。
  - **完全沒有方向的措辭**（如“更好”“改進”“更漂亮”“不同”“新鮮”“重新設計”“修復”“給些選項”“想法”“替代方案”，或只說“變體”）：{{ask_instruction}} 只問一個問題並給出詞彙：*“這些變體應採用什麼方向？更大膽（bolder）、更安靜（quieter）、更簡潔（distill）、精修（polish）、排版（typeset）、色彩（colorize）、佈局（layout）、動效（animate）、趣味（delight），還是打破規則（overdrive）？”* 按本列表映射回答；若回答仍然開放，如“給我驚喜”“你決定”，則使用 `impeccable`，把使用者原始措辭作為 prompt，並在獲得答案後開始步驟 2。
- **元素描述**（如“價格卡片”“Hero 標題”）：步驟 2 將其解析為 selector。

當你已經獲得一個詞彙表中的 action、1～8 的數量和元素描述時，本步驟完成。請求未指定方向時必須先詢問。

## 步驟 2：複用頁面並啟動

**複用**已經執行的開發伺服器和宿主已經展示的標籤頁；本步驟就是為了避免啟動第二個伺服器或開啟第二個瀏覽器視窗。

1. **查詢開發伺服器**，按成本從低到高，在第一次命中後停止：使用者訊息、已經開啟應用的瀏覽器標籤頁（Claude Code：`tabs_context` 中的 origin）、宿主啟動的伺服器（Claude Code：`preview_list`）、列印 URL 的終端。其 origin 用作 `--dev-url`。**沒有命中**：省略 `--dev-url`，執行啟動命令且不等待；boot 會探測伺服器並說明下一步。`browser_needed` 會返回發現的 `devUrl`：按第 2 項開啟，再使用 `--dev-url <devUrl> --wait-for-browser 60000` 重試。`no_dev_server` 表示沒有服務：按結論指定的方式啟動開發指令碼（Claude Code：`preview_start`；Cursor：後台終端；Codex：可 yield 的 exec），等待 URL，再帶 `--dev-url <url>` 重試。
2. **在瀏覽器中開啟渲染該元素的頁面，然後啟動。** 使用請求指定的路由，否則使用 `--target` 對應頁面；`--dev-url` 只接受 origin。
   - **Cursor**（`browser_navigate`）和 **Claude Code**（`navigate`；Browser 面板關閉時會開啟，標籤頁已位於相同 origin 時從 `tabs_context` 取得 `tabId`）：開啟 URL，再用 `--dev-url <url> --wait-for-browser 60000` 執行啟動命令。boot 注入浮層，頁面重新載入進浮層，同時命令等待。這些宿主只能由瀏覽器工具開啟頁面；engine 會忽略 `--open`。
   - **沒有瀏覽器工具**（Codex 等）：使用 `--open --wait-for-browser 120000` 執行啟動命令；它會開啟系統瀏覽器，較長等待時間方便使用者找到標籤頁。返回 **`browser_open_failed`** 時，用一句話告訴使用者 `url`，再使用 `--wait-for-browser 120000` 重試。

```bash
{{scripts_path}}/impeccable live-generate --target src/App.jsx --dev-url http://127.0.0.1:5173/ --selector ".pricing-grid" --action bolder --count 3 --boot --wait-for-browser 60000
```

在 Cursor 和 Claude Code 中以前臺方式執行；它會在等待時間內返回。Codex 中使用可 yield 的 exec，與步驟 3 執行 poll 的方式相同。

- `--target`：當請求或專案能明確判斷時，填寫渲染目標元素的檔案，否則省略。
- `--dev-url`：步驟 1 獲得的 origin；省略時由 boot 探測。
- `--selector`：優先使用唯一 class，其次是 landmark tag 加 class，最後才是 id；每個變體都會掛載元素副本，因此 id 會在 DOM 中重複。**請求用複數描述重複元件**（如“價格卡片”）時，應選擇容納整組元件的容器，使一份有作用域的樣式表能重新設計每個例項。selector 不明顯時，可以讀取一次渲染元素的原始碼；不確定時使用 `--dry-run` 只解析和報告，不啟動會話。
- `--boot`：執行本通道的 boot，重新為 helper 載入 PRODUCT.md 和 DESIGN.md；允許檔案缺失；查詢 dev URL；在 helper 生命週期內隱藏底欄；複用已經執行的 helper。結果隨 `boot` 返回。
- 還可使用：`--prompt`、`--text`（只保留可見文字包含指定片段的匹配項）、`--index`（從 1 開始選擇匹配項）。

按以下順序讀取輸出：先讀 `boot`；或根據 `boot.contextMissing` 與 `boot.contextNote` 把頁面作為事實源；再讀 `event`，即包含 `sessionId` 和使用者點選 Go 時相同 `_instructions` 的 generate 事件。每個結論都帶 `_instructions`，它優先於你對本文的記憶。以下情況需要你決定下一步：

- **`ambiguous`**：候選項已列出；選擇它們的共同容器，或帶 `--text "<visible text>"`、`--index <n>` 重試。
- **`dev_server_gone`**：等待頁面期間伺服器停止響應；按結論說明重新啟動，再帶 `--dev-url <url>` 重試。
- **`no_match`**：標籤頁沒有開啟渲染元素的路由，或 selector 錯誤。導航到正確路由後重試，或從原始碼推導更好的 selector，也可新增 `--text`。
- `bootError` 中的 **`config_missing` / `config_invalid`**：先遵循 [live-setup.md](live-setup.md)，再重試。
- `ok: true` 且 **`event: null`**：事件慢於等待時間；執行一次 `{{scripts_path}}/impeccable live-poll` 獲取事件，然後繼續。

當輸出包含 `ok: true`、`sessionId` 和 `event`，且你最多隻啟動一個伺服器、開啟一個標籤頁時，本步驟完成。

## 步驟 3：產生

該事件是標準 `generate` 事件，包含所選元素的上下文、已經預檢的 scaffold，以及指明 action 參考、規劃章節和精確 splice 的 `_instructions`。嚴格按照 live.md 的 **Handle generate** 處理；從身份鎖定到 done 回覆都由它負責：按要求讀取 action 參考和 craft-floor.md；按照第 4 節規劃（先身份，再模式，再選擇三個不同主軸，最後做眯眼測試）；按照第 7 節宣告 knob；按照第 6 節交付（每個變體都完整替換目標元素，並在 scaffold 指定 splice 位置的一次編輯中寫入預覽 CSS 和全部變體）。快速通道不限制變體能力；普通 Live 會話能做的改變，如突出某一檔、重構整組、重排卡片或改變表面，在這裡同樣允許。不要截圖；接受前由浮層預覽承擔評審通道。

使用寫入的檔案，**一次呼叫完成回覆和等待**：

```bash
{{scripts_path}}/impeccable live-poll --reply EVENT_ID done --file src/App.jsx --then-poll
```

它先回復 done，讓瀏覽器掛載變體，再阻塞到使用者做出選擇。按宿主執行長等待的方式執行：**Claude Code** 使用工具最長超時（600000ms）以前臺執行；**Codex** 使用可 yield 的前臺 exec；**Cursor** 在後台終端執行，併為 `"type":"(accept|discard|variant_mount_failed|exit)"` 設定通知。絕不要傳入很短的 `--timeout=`。執行期間沒有其他工作：不要 sleep，也不要定時輪詢輸出；後台執行的宿主會在返回時喚醒你。`{"type":"timeout"}` 表示使用者尚未選擇，應再次執行 `live-poll` 並繼續等待。如果瀏覽器切換到 GENERATING 後編輯失敗，使用 `--reply EVENT_ID error "Short reason"`，不要加 `--then-poll`，讓浮條重置。

隨後用一句話告訴使用者變體位置：*“三個 [更大膽] 的變體已經顯示在 [價格卡片] 上：使用浮動欄箭頭切換，透過 Tune 旋鈕調整，然後 Accept 保留的版本。”*

不屬於 replace 路徑時，行動前讀取 live.md 中對應章節：`scaffold.previewMode: "svelte-component"`、`mode: "insert"`、`variant_mount_failed`、`steer`、`manual_edit_apply`，以及任何 `fallback: "agent-driven"` 的 wrap 錯誤。

## 步驟 4：接受並關閉

步驟 3 的呼叫會返回使用者選擇。**`discard`**：無需處理。**`accept`**：通常 `_acceptResult.carbonize: true`；清理由 live.md 的 **Required after accept** 原樣負責：把獲選變體規則移動到原本擁有該元素的樣式表中並使用真實 selector；固化選擇的 knob 值；解除元素 wrapper 並刪除所有 `data-impeccable-*` 屬性；刪除內聯 `<style>` 塊和兩個 `impeccable-carbonize` marker；然後執行 `{{scripts_path}}/impeccable live-complete --id SESSION_ID`，確認 `phase: "completed"`。只有 accept 使用 `--bake` 時才會出現 `baked: true`；此時 helper 已經永久化變體，不需要 `live-complete`。

處理選擇後立即關閉，無需等待使用者要求：

```bash
{{scripts_path}}/impeccable live-server stop
```

停止會移除注入指令碼並重新載入頁面一次；使用者看到沒有浮層 chrome 的獲選設計，同時仍由其開發伺服器提供服務。**絕不要終止或重啟開發伺服器**，包括步驟 2 中由你啟動的伺服器。

- **關閉前使用者要求更多變體**：暫不關閉，對下一個元素重新執行步驟 2；helper 會被複用，最後一次選擇後再關閉。
- **工作被中斷或不確定狀態**：執行 `{{scripts_path}}/impeccable live-status`，再執行 `live-resume`；`.impeccable/live/sessions/` 下的 journal 是唯一事實源。

當 helper 已停止，且開發站點仍正常展示獲選設計時，任務完成。
