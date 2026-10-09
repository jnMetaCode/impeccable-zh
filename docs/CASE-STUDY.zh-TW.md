# 示範案例：把擁擠的中文表單改成可上線體驗

> 這是基於儲存庫測試夾具的可重現示範，不是真實客戶案例，也不包含未經驗證的轉化率或效能提升宣告。

## 場景

一個使用 Element Plus 的企業後台表單需要調整桌面與手機。原始版本功能可用，但存在典型問題：中文標籤換行不可控、輸入區間距擁擠、手機觸控目標偏小、提交與取消動作層級不清晰，而且沒有載入、失敗和超長內容狀態。

示範輸入儲存在 [`tests/localization-evals/zh-TW/fixtures/adapt-element-plus-form/App.vue`](../tests/localization-evals/zh-TW/fixtures/adapt-element-plus-form/App.vue)，對應行為評測場景為 `zh-tw-adapt-element-plus-form`。

## 建議工作流

```text
/impeccable init
/impeccable audit 使用者資料表單
/impeccable typeset 使用者資料表單
/impeccable adapt 使用者資料表單 行動版
/impeccable polish 使用者資料表單
```

## 改進目標

| 原始風險 | 中文版指導重點 | 可驗證結果 |
|---|---|---|
| 標籤與幫助文字互相擠壓 | 中文行長、行高和標點規則 | 320px 寬度下無橫向滾動，標籤不被裁切 |
| 手機沿用桌面密度 | 觸控目標與單列斷點 | 互動目標至少 44×44 CSS px |
| 主次動作權重相同 | 中文 UX 文案與危險動作層級 | 主動作明確，取消動作可識別且不搶奪注意力 |
| 只驗證理想輸入 | 中文長姓名、長組織名和錯誤文案 | 超長內容、載入、失敗、空值均有穩定佈局 |
| 直接套用框架預設值 | Element Plus 語義與覆蓋邊界 | 優先使用元件能力，定製樣式不破壞狀態和鍵盤操作 |

## 為什麼它能被複核

- 輸入夾具隨儲存庫提交，不依賴截圖敘事。
- 評測要求載入 `adapt.md`、`chinese-typeset-cn.md` 和 `china-ui-frameworks-cn.md`，能檢查中文增強是否真正參與推理。
- 自動化評分器不接受“看起來不錯”之類無證據結論；缺少逐條證據會被標記為 `incomplete`。
- 確定性規則與模型評審分開：61 條規則負責可重複檢查，模型負責上下文判斷。

## 重現

先完成中文建置，再根據 [`tests/localization-evals/README.md`](../tests/localization-evals/README.md)設定模型和本地 engine：

```bash
npm run localization:build:zh-TW
npm run localization:eval:run -- --model=<model-id> --locale=zh-TW
npm run localization:eval:score -- --results=evals/zh-TW/runs/<run>.json
```

將 `<model-id>` 替換為評測 harness 支援且已設定憑證的模型。執行全部四個場景後，依輸出路徑開啟結果檔，逐條補充 verdict 與證據，再將 `<run>` 替換為實際結果檔名評分。尖括號表示佔位符，不可原樣執行。目前文件提供輸入與驗收目標，尚未附上完成改造後的實作、前後截圖或真實模型評分結果。

公開展示時應繼續使用“示範案例”這一名稱。只有取得真實專案授權、保留前後證據並完成測量後，才能把案例描述為客戶案例。
