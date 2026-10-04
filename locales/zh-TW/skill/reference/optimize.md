效能是一項功能。找到目前介面的真實瓶頸，修復後再測量。不要最佳化並不慢的部分。

## 評估效能問題

瞭解目前效能並識別問題：

1. **測量目前狀態**：
   - **Core Web Vitals**：LCP、INP、CLS 分數
   - **載入時間**：可互動時間、首次內容繪製
   - **Bundle 大小**：JavaScript、CSS、圖片體積
   - **執行時效能**：幀率、記憶體和 CPU 使用率
   - **網路**：請求數量、載荷大小、瀑布圖

2. **識別瓶頸**：
   - 哪裡慢？首次載入、互動還是動畫？
   - 原因是什麼？大圖片、昂貴 JavaScript 還是佈局抖動？
   - 嚴重程度如何？可以感知、令人煩躁還是完全阻塞？
   - 影響誰？全部使用者、僅行動版，還是慢速網路使用者？

**關鍵要求**：最佳化前後都要測量。過早最佳化會浪費時間，只最佳化真正重要的問題。

## 最佳化策略

制定系統化改進計劃：

### 載入效能

**最佳化圖片**：
- 使用現代格式（WebP、AVIF）
- 使用正確尺寸，不要為 300px 顯示區域載入 3000px 圖片
- 首屏以下圖片延遲載入
- 使用回應式圖片（`srcset`、`picture` 元素）
- 壓縮圖片，80%～85% 的品質損失通常難以察覺
- 使用 CDN 加速交付

```html
<img
  src="hero.webp"
  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  loading="lazy"
  alt="Hero image"
/>
```

**縮減 JavaScript Bundle**：
- 按路由或元件拆分程式碼
- Tree shaking，刪除未使用程式碼
- 刪除未使用依賴
- 延遲載入非關鍵程式碼
- 大型元件使用動態 import

```javascript
// Lazy load heavy component
const HeavyChart = lazy(() => import('./HeavyChart'));
```

**最佳化 CSS**：
- 刪除未使用 CSS
- 內聯關鍵 CSS，其餘非同步載入
- 壓縮 CSS 檔案
- 獨立區域使用 CSS containment

**最佳化字型**：
- 使用 `font-display: swap` 或 `optional`
- 對字型做字元子集化
- 預載入關鍵字型
- 適當使用系統字型
- 限制載入的字重數量

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
  unicode-range: U+0020-007F; /* Basic Latin only */
}
```

**最佳化載入策略**：
- 關鍵資源優先，非關鍵內容使用 async/defer
- 預載入關鍵資源
- 預取可能訪問的下一頁面
- 使用 Service Worker 提供離線與快取
- 使用 HTTP/2 或 HTTP/3 多路複用

### 渲染效能

**避免佈局抖動**：
```javascript
// ❌ Bad: Alternating reads and writes (causes reflows)
elements.forEach(el => {
  const height = el.offsetHeight; // Read (forces layout)
  el.style.height = height * 2; // Write
});

// ✅ Good: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // All reads
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2; // All writes
});
```

**最佳化渲染**：
- 獨立區域使用 CSS `contain`
- 減少 DOM 深度，結構越平效能越好
- 縮小 DOM 規模
- 長列表使用 `content-visibility: auto`
- 超長列表使用虛擬滾動，如 react-window、TanStack Virtual

**減少繪製與合成成本**：
- 使用 `transform` 和 `opacity` 實作可靠移動；當 blur、filter、mask、clip-path、shadow 和顏色變化能帶來有意義的精修時，也可以使用
- 不要隨意動畫化 `width`、`height`、`top`、`left` 和 margin 等驅動佈局的屬性
- 僅為已知昂貴操作謹慎使用 `will-change`
- 把 blur/filter/shadow 的昂貴繪製限制在較小、隔離的區域

### 動畫效能

**GPU 加速**：
```css
/* ✅ GPU-accelerated (fast) */
.animated {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ CPU-bound (slow) */
.animated {
  left: 100px;
  width: 300px;
}
```

**流暢 60fps**：
- 每幀目標 16ms（60fps）
- JavaScript 動畫使用 `requestAnimationFrame`
- 對 scroll handler 使用 debounce/throttle
- 可行時使用 CSS 動畫
- 動畫期間避免長時間執行的 JavaScript

**Intersection Observer**：
```javascript
// Efficiently detect when elements enter viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is visible, lazy load or animate
    }
  });
});
```

### React/框架最佳化

**React 專項**：
- 對昂貴元件使用 `memo()`
- 對昂貴計算使用 `useMemo()` 和 `useCallback()`
- 虛擬化長列表
- 按路由拆分程式碼
- 避免在 render 中建立行內函數
- 使用 React DevTools Profiler

**框架無關**：
- 減少重新渲染
- 對昂貴操作使用 debounce
- 快取計算結果
- 延遲載入路由和元件

### 網路最佳化

**減少請求**：
- 合併小檔案
- 圖示使用 SVG sprite
- 內聯較小的關鍵資源
- 刪除未使用的第三方指令碼

**最佳化 API**：
- 使用分頁，不要載入全部資料
- 使用 GraphQL 只請求需要的欄位
- 壓縮響應（gzip、brotli）
- 設定 HTTP 快取頭
- 靜態資源使用 CDN

**最佳化慢速網路體驗**：
- 根據連線情況自適應載入（navigator.connection）
- 使用樂觀 UI 更新
- 設定請求優先順序
- 使用漸進增強

## Core Web Vitals 最佳化

### Largest Contentful Paint（LCP < 2.5s）
- 最佳化 Hero 圖片
- 內聯關鍵 CSS
- 預載入關鍵資源
- 使用 CDN
- 使用服務端渲染

### Interaction to Next Paint（INP < 200ms）
- 拆分長任務
- 推遲非關鍵 JavaScript
- 用 Web Worker 處理繁重計算
- 減少 JavaScript 執行時間

### Cumulative Layout Shift（CLS < 0.1）
- 為圖片和影片設定尺寸
- 不要在已有內容上方注入內容
- 使用 CSS `aspect-ratio`
- 為廣告和嵌入內容預留空間
- 避免引發佈局偏移的動畫

```css
/* Reserve space for image */
.image-container {
  aspect-ratio: 16 / 9;
}
```

## 效能監控

**使用工具**：
- Chrome DevTools（Lighthouse、Performance 面板）
- WebPageTest
- Core Web Vitals（Chrome UX Report）
- Bundle 分析器（webpack-bundle-analyzer）
- 效能監控（Sentry、DataDog、New Relic）

**關鍵指標**：
- LCP、INP、CLS（Core Web Vitals；INP 於 2024 年 3 月取代 FID）
- Time to Interactive（TTI）
- First Contentful Paint（FCP）
- Total Blocking Time（TBT）
- Bundle 大小
- 請求數量

**重要要求**：在真實裝置和真實網路條件下測量。高速連線下的桌面 Chrome 不具有代表性。

**絕對不要**：
- 未測量就最佳化
- 為效能犧牲無障礙
- 最佳化過程中破壞功能
- 到處使用 `will-change`，它會建立新圖層並消耗記憶體
- 延遲載入首屏內容
- 忽略重大問題卻最佳化微小細節，應先處理最大瓶頸
- 忘記行動版效能，其裝置和網路往往更慢

## 驗證改進

確認最佳化確實有效：

- **最佳化前後指標**：比較 Lighthouse 分數
- **真實使用者監控**：跟蹤真實使用者所獲改善
- **不同裝置**：測試低端 Android，而不只是旗艦 iPhone
- **慢速網路**：限制為 3G 並測試體驗
- **無迴歸**：確認功能仍然正常
- **使用者感知**：實際感受是否更快？

當使用者可感知的指標真正改善後，交給 `{{command_prefix}}impeccable polish` 完成最終精修。
