# 命令指導

## 工作流問題

只給出建議，不執行命令；下方選單僅用於無參數呼叫。按需檢視相關命令引用，瞭解前置條件和範圍。更完整的工作流可連結到[官方文件](https://impeccable.style/docs/)。如果使用者同時要求執行，則遵循其請求。

## 無參數路由：結合上下文的選單

使用者無參數呼叫 `{{command_prefix}}impeccable` 時讀取本檔案。他們是在問“接下來應該做什麼？”，因此選單必須結合上下文，不能是固定列表。

設定階段已經執行 `impeccable context`。如果輸出 `NO_PRODUCT_MD`，說明專案還沒有記錄產品上下文：把 `/impeccable init` 放在首條建議並用一句話解釋原因，同時繼續展示後續選單；不要悄悄直接執行 init。否則執行一次 `{{scripts_path}}/impeccable signals` 並讀取其 JSON，先推薦 **2～3 個價值最高的下一步命令**，每個命令附上一句來自 signals 的理由，然後按類別展示 SKILL.md Commands 表中的完整選單。**絕不自動執行命令；推薦必須由使用者確認。**

對訊號做判斷，不存在必須機械遵守的分數：

- `setup.hasDesign` 為 false 且 `setup.hasCode` 為 true → `document`，記錄現有視覺系統。
- `critique.latest` 為 `null` → 專案從未做過設計評審；對於已設定且有真實介面的專案，優先建議 `/impeccable critique <surface>`。
- `critique.latest` 分數低，或 `p0` / `p1` 非零 → `polish`，它會把該快照作為 backlog，並在過期或清零時關閉。
- `git.changedFiles` 指向一個介面 → 把 `audit` 或 `polish` 精確限定到這些檔案並點名。
- `devServer.running` 為 true → 可以用 `live` 做瀏覽器內迭代，用 `generate` 對指定元素產生一次性變體；如果為 false，不要優先推薦它們。**`live`、`generate` 和內建 `impeccable detect` 僅適用於網頁。** 如果 `setup.platform` 是 `ios`、`android` 或 `adaptive`，不要優先推薦這些命令，因為瀏覽器 overlay 和 HTML 規則引擎不適用於原生程式碼。
- 其他情況按意圖分組（新建、改進現有內容、視覺迭代），並針對目前介面和 `setup.platform` 調整。

**如果 `scan.targets` 非空且 `setup.platform` 不是 `ios` / `android` / `adaptive`，執行一次 `{{scripts_path}}/impeccable detect --json <scan.targets joined by spaces>`**。這是針對本地檔案的內建偵測器，無網路、無 npx；它讀取 HTML/CSS，因此原生專案應跳過。`scan.via` 表示目標來源：`git-changes`、`source-dir`、`html` 或 `root`。把結果用於選擇：大量品質或對比度問題 → `audit` 或 `polish`；明確的草率模式 → 相應命令，例如漸變文字或 eyebrow → `quieter` / `typeset`，平淡或灰暗配色 → `colorize`。真實的目前訊號優於猜測。如果 detect 報錯或專案過大、執行緩慢，跳過偵測並建議使用者自行執行 `audit`；絕不能因此阻塞建議。

先給出 2～3 個明確建議和可直接輸入的準確命令；完整選單作為後續內容，而不是開場。
