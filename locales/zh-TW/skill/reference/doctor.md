報告並修復專案中的 Impeccable 產物與已安裝版本實際讀取內容之間的漂移：PRODUCT.md、DESIGN.md 及其 `.impeccable/design.json` sidecar、`.impeccable/config.json`、持久化介面簡報和設計 hook。

這是維護，不是設計。不要重新設計任何內容，不要開啟報告未點名的檔案，也不要附帶執行其他命令。

## 本命令負責什麼、不負責什麼

“過期”包含三類不同漂移，必須區分：

- **工具版本。** 已安裝 Skill 舊於釋出版本。`impeccable context` 啟動時會報告 `UPDATE_AVAILABLE`，執行 `npx impeccable update` 即可修復。這不屬於本命令。
- **Schema 漂移。** 產物由舊版 Impeccable 寫入：存在已無人讀取的欄位、目前需要的新欄位或廢棄位置中的檔案。這是機械問題，本命令可以修復大部分。
- **事實漂移。** 程式碼已經變化，文件不再準確。單純比較檔案無法判斷。`document` 負責 DESIGN.md，`init` 負責 PRODUCT.md；本命令只應把具體缺口交給它們，而不是提出模糊懷疑。

## 步驟 1：執行檢查

```
{{scripts_path}}/impeccable doctor --json
```

使用者在 monorepo 中點名 workspace、檔案或路由時新增 `--target <path>`。不加時報告描述儲存庫根目錄，而它在 monorepo 中通常不是正確專案。

輸出包含 `findings`（每項含 `id`、`artifact`、`path`、`severity`、`summary`、`fix`）；monorepo 還包含 `workspaces`，展示每個應用的 product 和 design 解析結果。`ruleRegistryAvailable: false` 表示無法驗證被忽略的規則 ID；應明確說明，不能暗示列表沒有問題。

空的 `findings` 陣列是正常結果。用一句話說明並停止。

## 步驟 2：按嚴重度執行

嚴重度表示應該採取什麼行動，而不是問題有多糟。

- **`auto`** 不涉及決策。執行一次 `{{scripts_path}}/impeccable doctor --fix` 應用這些修復，再用一句話報告移動了什麼。無需事先詢問，也不要事後再詢問。
- **`mention`** 需要讓使用者知曉，但現在無需決定。每項用一句話說明並附帶建議修復。
- **`route`** 需要特定命令。說明命令及其要解決的缺口。只有使用者在本輪要求時才執行；`init` 和 `document` 是對話，不是無人值守的修復。

一次報告全部三組。Finding 不是錯誤，命令不會因此失敗。

## 步驟 3：廢棄欄位具有約束力

報告廢棄欄位的 finding（目前是 `## Register`）不是風格建議。從此後的每項決策中都把該欄位視為不存在，無論它有什麼值，並提出刪除該區塊。以“以防萬一”為由保留，會讓已經退役的軸繼續影響輸出。

## 步驟 4：不要誇大事實漂移

`design-md-drift` 統計 DESIGN.md 上次修改後視覺原始碼目錄中的提交數。提交數量不代表內容矛盾。報告數量及其度量物件；如果使用者想知道文件是否真的錯誤，應對照目前 token 和元件閱讀 DESIGN.md，再根據內容回答。絕不能因為數字較大就聲稱 DESIGN.md 已過期。

同樣謹慎處理 `workspace-context-inherited`。繼承是設計行為。一份 product 記錄能否如實描述多個應用，應由使用者判斷，不是自動修復的缺陷。

## Monorepo 說明

- `workspace-platform-native-evidence` 最關鍵：包含原生建置檔案的 workspace 如果繼承解析為 Web 的根記錄，會一直得到 Web 指導，且永遠不會載入 [ios.md](ios.md) 或 [android.md](android.md)。應在該 workspace 建立子 PRODUCT.md，因為一份繼承記錄不能同時描述兩個平臺。
- `config-project-roots-match-nothing` 表示所有 `projectRoots` glob 都未匹配，儲存庫根目錄被靜默當作活動專案。常見原因是 workspace 目錄重新命名。報告 pattern，並詢問它們應指向哪些目錄。
- `config-invalid-build-path` 與 `config-build-path-unset` 都涉及 `.impeccable/config.json` 中的 `buildPath`；開發者的 gitignored `.impeccable/config.local.json` 優先。值為 `comp` 或 `code`，決定新介面由產生設計稿還是直接程式碼建置。無法識別的值不會回退到另一條路徑，應報告精確值。未設定 finding 只在專案做過方向工作但從未記錄偏好時觸發；僅當工具面存在圖片產生能力時才提供選擇，否則無需說明。
- 提議修改前，使用 `workspaces` 表展示哪些應用有獨立上下文、哪些繼承、哪些缺失。

## 關閉啟動檢查

`impeccable context` 在會話開始時報告這些 finding 的低成本子集，每個專案每週最多一次。在 `.impeccable/config.json` 設定 `"stalenessCheck": false` 可關閉；單次會話使用 `IMPECCABLE_NO_STALENESS_CHECK=1`。關閉啟動檢查後本命令仍可使用；對於只想按需檢視報告的使用者，應建議這種組合。
