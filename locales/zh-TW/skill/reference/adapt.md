> **還需要補充的上下文**：目標平臺、裝置和使用情境。

把已有設計調整到不同情境：其他螢幕尺寸、裝置、平臺或用途。陷阱是把調整當作縮放；真正的任務是為新情境重新思考體驗。

**僅適用於 Web**，包括移動 Web。原生平臺（`ios` / `android` / `adaptive`）應改用 [adapt.native.md](adapt.native.md)；專案為原生應用時立即切換。

---

## 評估調整挑戰

理解為什麼調整以及需要調整什麼：

1. **識別來源情境**：原本為桌面 Web 還是移動應用設計？依賴大屏、滑鼠或高速網路等哪些假設？哪些部分在目前情境表現良好？
2. **理解目標情境**：
   - **裝置**：手機、平板、桌面、電視、手錶還是列印？
   - **輸入方式**：觸控、滑鼠、鍵盤、語音還是手柄？
   - **螢幕約束**：尺寸、解析度、方向？
   - **連線**：高速 Wi-Fi、慢速 3G、離線？
   - **使用情境**：移動中還是桌前，快速掃視還是專注閱讀？
   - **使用者預期**：使用者對該平臺有何慣例預期？
3. **識別挑戰**：哪些內容、導航或功能放不下？哪些 hover、微小觸控目標無法工作？哪些模式不適合目標平臺？

**關鍵要求**：調整是為新情境重新思考體驗，不是縮放畫素。

## 規劃調整策略

### 行動版調整（桌面 → 移動）

**佈局策略**：多欄改為單欄；並排改為垂直堆疊；固定寬度改為全寬；頂部/側邊導航改為底部導航。

**互動策略**：觸控目標至少 44×44px，不依賴 hover；適當使用滑動手勢；dropdown 改為 bottom sheet；控制元件置於拇指可達範圍；擴大點選區域和間距。

**內容策略**：使用漸進披露；優先主要內容，次要內容放入 tab/accordion；文案更精簡；正文至少 16px。

**導航策略**：使用漢堡選單或底部導航；降低導航複雜度；用 sticky header 保持上下文；在導航流程中提供返回按鈕。

### 平板調整（混合方式）

**佈局策略**：使用兩欄而不是單欄或三欄；次要內容放側面板；使用 master-detail；根據橫豎屏自適應。

**互動策略**：同時支援觸控和 pointer；觸控目標仍為 44×44px，但可比手機更密集；使用側邊導航 drawer；適合時採用多列表單。

### 桌面調整（移動 → 桌面）

**佈局策略**：使用多欄和水平空間；側邊導航持續可見；同時展示多個資訊面板；設定 max-width，不能無限拉伸到 4K。

**互動策略**：用 hover 提供補充資訊；支援鍵盤快捷鍵、右鍵選單、有意義的拖放，以及 Shift/Cmd 多選。

**內容策略**：提前展示更多資訊，減少漸進披露；使用多列資料表、豐富視覺化和更詳細說明。

### 列印調整（螢幕 → 列印）

**佈局策略**：在合理位置分頁；移除導航、頁尾和互動元素；使用黑白或有限色彩；為裝訂保留適當邊距。

**內容策略**：展開縮略內容，顯示完整 URL 和隱藏區塊；新增頁碼、頁首、頁尾和列印日期、頁面標題等元資料；把圖表轉換為列印友好版本。

### 郵件調整（Web → 郵件）

**佈局策略**：最大寬度 600px；只用單欄；內聯 CSS；為郵件客戶端相容性使用 table 佈局。

**互動策略**：使用大而明確的 CTA 按鈕，不用文字連結；不依賴 hover；複雜互動深鏈到 Web 應用。

## 實作調整

### 回應式斷點

可使用：行動版 320～767px；平板 768～1023px；桌面 1024px 以上；或在設計實際損壞的位置使用內容驅動斷點。

### 佈局調整技術

- **CSS Grid/Flexbox**：自動重流佈局
- **Container Query**：按容器而不是視口調整
- **`clamp()`**：在最小和最大值之間流式調整
- **Media query**：為不同情境提供樣式
- **Display 屬性**：按情境顯示或隱藏元素

### 觸控調整

- 觸控目標至少 44×44px
- 增加互動元素間距
- 刪除依賴 hover 的互動
- 新增 ripple、highlight 等觸控回饋
- 考慮拇指區域，螢幕底部通常比頂部容易觸達

### 內容調整

- 謹慎使用 `display: none`，內容仍會下載
- 漸進增強，先提供核心內容，大屏再增強
- 視口外內容延遲載入
- 使用回應式圖片（`srcset`、`picture`）

### 導航調整

- 行動版把複雜導航轉換為漢堡選單/drawer
- 移動應用使用底部導航
- 桌面端保持側邊導航
- 小屏使用 breadcrumb 保持上下文

**重要要求**：在真機上測試。DevTools 裝置模擬有幫助，但並不完整。

**絕對不要**：
- 在行動版隱藏核心功能，重要功能必須可用
- 假設桌面裝置一定強大，也要考慮無障礙和舊機器
- 在不同情境使用不同資訊架構，避免混亂
- 打破平臺使用者預期
- 忘記行動版和平板橫屏
- 盲目使用通用斷點，應由內容驅動
- 忽略桌面觸控，許多桌面裝置支援觸控

## 驗證調整

- **真機**：真實手機、平板、桌面
- **不同方向**：豎屏與橫屏
- **不同瀏覽器**：Safari、Chrome、Firefox、Edge
- **不同系統**：iOS、Android、Windows、macOS
- **不同輸入**：觸控、滑鼠、鍵盤
- **極端情況**：320px 小屏和 4K 大屏
- **慢速連線**：受限網路測試

**自定義控制元件**（slider、拖動區域、可滾動控制元件條）：before/after slider 可能透過所有寬度檢查，卻無法在 iOS 拖動；因此應在同一批檢查中實際操作每個範圍內控制元件：

- **主要手勢**：點選並確認響應，再用目標輸入方式拖動；拖動必須完成，不能只開始。
- **跨控制元件滾動**：沿頁面滾動軸劃過控制元件時，應滾動頁面或容器而不啟用控制元件；沿控制元件自身軸開始拖動時，應移動控制元件而不是頁面。兩種失敗都不會報錯，必須都測試。
- **證據**：說明證據來自模擬視口、瀏覽器工具合成觸控、哪個瀏覽器引擎，或真機。截圖和調整視口只能證明佈局，不能證明手勢。點明未測試內容後繼續；無法獲得硬體是需要報告的缺口，不是阻塞。

調整在每種情境下都顯得自然後，交給 `{{command_prefix}}impeccable polish` 完成最終精修。

---

## 參考資料

以下內容原為 `responsive-design.md`，現內聯到 adapt 流程中，集中提供深度回應式參考。

### 回應式設計

#### 正確使用移動優先

從行動版基礎樣式開始，用 `min-width` query 逐層增加複雜度。桌面優先的 `max-width` 會讓行動版先載入不必要樣式。

#### 由內容驅動斷點

不要追逐裝置尺寸；讓內容說明何時需要斷點。從窄屏開始，拉伸到設計損壞的位置再新增斷點。通常三個斷點足夠（640、768、1024px）。流式值使用 `clamp()`，無需額外斷點。

#### 偵測輸入方式，而不只是螢幕尺寸

**螢幕尺寸無法說明輸入方式。** 筆記本可能有觸屏，平板可能連線鍵盤。使用 pointer 和 hover query：

```css
/* Fine pointer (mouse, trackpad) */
@media (pointer: fine) {
  .button { padding: 8px 16px; }
}

/* Coarse pointer (touch, stylus) */
@media (pointer: coarse) {
  .button { padding: 12px 20px; }  /* Larger touch target */
}

/* Device supports hover */
@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}

/* Device doesn't support hover (touch) */
@media (hover: none) {
  .card { /* No hover state - use active instead */ }
}
```

**關鍵要求**：絕不能讓功能依賴 hover，觸控使用者無法 hover。

#### 安全區域：處理劉海

現代手機有劉海、圓角和 Home 指示條。使用 `env()`：

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* With fallback */
.footer {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

在 meta tag 中**啟用 viewport-fit**：
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

#### 正確使用回應式圖片

##### 頻寬度描述符的 srcset

```html
<img
  src="hero-800.jpg"
  srcset="
    hero-400.jpg 400w,
    hero-800.jpg 800w,
    hero-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Hero image"
>
```

工作方式：`srcset` 列出圖片真實寬度，`sizes` 告訴瀏覽器顯示寬度，瀏覽器結合視口寬度和裝置畫素比選擇最佳檔案。

##### 使用 Picture 元素實作藝術指導

需要不同裁剪/構圖，而不僅是不同解析度時：

```html
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(max-width: 767px)" srcset="tall.jpg">
  <img src="fallback.jpg" alt="...">
</picture>
```

#### 佈局調整模式

**導航**：行動版為漢堡選單 + drawer，平板為緊湊橫向，桌面為完整帶標籤導航。**表格**：行動版使用 `display: block` 和 `data-label` 轉換為卡片。**漸進披露**：可摺疊內容使用 `<details>/<summary>`。

#### 測試：不要只相信 DevTools

DevTools 裝置模擬適合驗證佈局，但無法覆蓋真實觸控、CPU/記憶體約束、網路延遲模式、字型渲染差異和瀏覽器 chrome/鍵盤表現。

**至少測試**：一臺真實 iPhone、一臺真實 Android；相關時再加一臺平板。廉價 Android 能暴露模擬器永遠看不到的效能問題。

---

**避免**：桌面優先設計；用裝置偵測代替能力偵測；維護獨立移動/桌面程式碼庫；忽略平板和橫屏；假設所有移動裝置效能強勁。
