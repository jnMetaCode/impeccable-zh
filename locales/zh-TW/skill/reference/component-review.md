# 計劃與資源評審

在以設計稿驅動的建置中，當每個柵格區域都有 plate 且 plate 門禁已經評分、但尚未編寫頁面程式碼時，使用此檢查點。已批准設計稿是參考。使用者評審兩件事：最終交付的 plate，以及其他內容的生產計劃，即哪些區域由程式碼繪製。把繪製區域錯誤規劃為程式碼，是此類建置中代價最高的錯誤，使用者應在這裡發現它。文字、控制元件和 chrome 稍後在組裝好的首屏中評審。

## 規劃、捕獲與提供評審

執行 `{{scripts_path}}/impeccable component-review plan`。它根據測量規範、設計稿和 plate 檔案產生 `.impeccable/review/components.json`；任何柵格區域缺少 plate 時都會拒絕，並逐項列出。此階段絕不要手寫或編輯該檔案：評審包由規範派生，所有改動都應寫入 regions 檔案。

如果宿主提供 `component_review`，以 `.impeccable/review/components.json` 作為 `manifest_path` 呼叫。宿主會捕獲內容、展示評審並返回使用者決定。請求暫停表示正在等待使用者，不是建置失敗或已經批准。

否則執行 `{{scripts_path}}/impeccable component-review capture --manifest .impeccable/review/components.json`，再在後台啟動 `{{scripts_path}}/impeccable component-review serve --session <returned session>`。在可用瀏覽器中開啟它輸出的 URL 並等待使用者；提交後 `serve` 以 0 退出。使用 `{{scripts_path}}/impeccable component-review status --session <id>` 讀取決定；`{{scripts_path}}/impeccable component-review verify --manifest .impeccable/review/components.json` 確認批准，並拒絕 pending、needs-work 和過期輸入。絕不要替使用者提交頁面或寫回執。

會話沒有瀏覽器時 `serve` 以 2 退出；空閒 30 分鐘仍無決定而關閉時以 4 退出。兩種情況都表示無人評審：停止等待，不要自行批准，也不要越過檢查點繼續建置。結束本輪並報告計劃與資源評審仍待處理，同時給出 session ID，方便使用者恢復。等待中的評審是待辦，不是完成的建置。

## 按回執執行

嚴格執行使用者決定，絕不能用自己的有利判斷代替。

- **approve**：全部專案獲批且清單確認後，進入 hero 階段。
- **revise**（plate）：按使用者回饋在同一路徑重新產生 plate。
- **revise with split**（資源）：在 regions 檔案中用多個圖層替換該區域：帶透明開口的框架 plate（`kind` 為 `plate`，box 相同）、開口位置的獨立 `image` 內容，以及每個運動部件各自的 plate。按原區域命名為 `<id>-frame`、`<id>-view` 或 `<id>-shutter-left`。重新執行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>` 並產生 plate。
- **revise**（計劃項）：按回饋修改 regions 檔案，如調整柵格區域大小、拆出獨立材質 plate 或調整程式碼區域；重新執行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>` 並產生新 plate。
- **reclassify**（程式碼區域）：把該區域的 `kind` 改為使用者選擇的型別，重寫 `note` 描述材質。重新執行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>` 並產生 plate；有子 Agent 時使用資源生產 Agent。
- **missing**：把區域加入 regions 檔案，重新執行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions <regions.json>`；若為柵格內容則產生 plate。

隨後重新執行 `plan`、`capture` 和 `serve`。未變化的決定會沿用，使用者只看到變化內容。任何規範變化，或已接受 plate 被替換，都需要新一輪評審；目前規範獲批前，建置階段門禁保持關閉。

## 組裝與評審

使用獲批 plate 和計劃建置首屏，並執行 hero 門禁。人工評審不會免除完整性檢查。hero 連續失敗三次後，停止迭代，使用目前建置展示首屏評審；當讀數無法判斷時，由使用者視覺決定。

在 `.impeccable/review/hero.json` 提供第二份 manifest，將 `id` 和 `stage` 設為 `hero`。使用一個覆蓋組裝首屏的頁面預覽元件、真實 HTML 入口和完整依賴列表（只能是本地路徑）。參考仍是已批准設計稿。呼叫同一個宿主評審工具，或對該 manifest 執行 `capture`、`serve` 和 `verify`。needs-work 回饋會啟動新一輪組裝。

接受後，本次建置的人工評審結束：不要再次請求計劃、資源或組裝審批。只要頁面仍呈現使用者接受的內容，hero 分數、色板檢查和所有數值讀數都只是建議；材質否決仍有效，例如 plate 缺失或未引用、SVG 插圖、有機裁剪、plate 被裁切、虛構筆觸或渲染存在性失敗。當捕獲結果不再匹配已接受截圖時，恢復使用者接受的結果；否則繼續遵循讀數。以已接受首屏作為視覺方向，完成其餘頁面、回應式行為、收尾檢查和文件。這只是首屏校準，不代表使用者評審了頁面其餘部分。共享樣式表改動不會重新開啟審批。保留獲批方向；使用者之後明確要求的變化是新任務。

組裝頁面捕獲會執行固定輸入中的內聯指令碼和已宣告本地指令碼。網路 API、frame 和 worker 不可用；初始視口必須在捕獲前穩定。保留真實頁面並宣告指令碼，不要為了透過評審而移除行為。
