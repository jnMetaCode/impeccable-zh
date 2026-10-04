# iOS 平臺

適用於釋出到 Apple 硬體的原生 iOS / iPadOS 應用：SwiftUI、UIKit、React Native、Expo、Flutter。

在原生平臺上，訪客模式會限制表達可以覆蓋的範圍。所有模式的結構、導航和互動均由 HIG 一致性約束；品牌只在平臺開放的層面表達，如 tint、字型、動效和內容。

## iOS 粗糙感測試

熟練的 iPhone 使用者會信任這個應用，還是會因不合規範的控制元件停頓？典型跡象是“從網站移植”：重新發明的導航欄、自定義返回手勢、Web 形態按鈕、依賴 hover 的可供性。預設使用平臺元件；只有使用者會感謝的理由才值得偏離。

## 佈局與結構

- **安全區域。** 在 safe-area inset 內佈局。控制元件不得位於劉海、靈動島、Home 指示條或圓角下方。 <!-- rule:ios-layout-safe-area -->
- **系統導航。** 2～5 個頂級區塊使用 tab bar（只能是區塊，不能是操作），層級使用 navigation stack，獨立任務使用 sheet。不要自定義全域性導航或混用隱喻。 <!-- rule:ios-layout-standard-navigation -->
- **保留邊緣右滑返回。** 左邊緣返回是肌肉記憶，絕不能停用或覆蓋。 <!-- rule:ios-layout-edge-swipe-back -->
- 頂級頁面使用 **Large Title**，滾動時摺疊為 inline；深層詳情頁保持 inline。 <!-- rule:ios-layout-large-titles -->

## 觸控目標

- 每個可點選控制元件至少 **44×44 pt**，相鄰目標之間留出空間。 <!-- rule:ios-touch-target-44pt -->

## 排版

- **Dynamic Type。** 使用系統文字樣式（從 Large Title 到 Caption），讓文字跟隨使用者閱讀字號。不要硬編碼 point 尺寸。 <!-- rule:ios-typo-dynamic-type -->
- **San Francisco 承載介面。** 正文、標籤和控制元件使用 SF Pro / SF Compact；品牌字型可以出現在展示時刻。 <!-- rule:ios-typo-system-font -->
- 下限為 **11 pt**；Body 為 17 pt。 <!-- rule:ios-typo-minimum-size -->

## 色彩與材質

- 使用**語義系統色**（label、secondaryLabel、systemBackground、separator、tint），它們會自動調整深色模式和增強對比度；原始 hex 會破壞調整。 <!-- rule:ios-color-semantic-system -->
- **深色模式是一等外觀。** 同時設計和測試兩種模式。 <!-- rule:ios-color-dark-mode -->
- 用**一種 tint 色**驅動互動元素；它不負責裝飾。 <!-- rule:ios-color-single-tint -->
- bar 和 sheet 後方的模糊與透明使用**系統 material**；不要自制玻璃擬態。 <!-- rule:ios-color-system-materials -->

## 元件與控制元件

- 使用**平臺控制元件**：switch、segmented control、stepper、系統 picker、action sheet、alert、context menu、swipe action。為追求風格而重新發明它們，是最常見的原生粗糙感。 <!-- rule:ios-components-native-controls -->
- 圖示使用 **SF Symbols**：基線對齊、支援 Dynamic Type，並使用字重和尺寸變體。不要混入 Web 圖示集。 <!-- rule:ios-components-sf-symbols -->
- **謹慎使用模態。** 可關閉的聚焦子任務使用 sheet，沉浸體驗使用 full-screen cover。明確提供 Cancel/Done；除非需要防止資料丟失，否則允許下滑關閉。 <!-- rule:ios-components-modality -->
- 設定類內容使用 **grouped/inset list**，不要自制卡片堆。 <!-- rule:ios-components-grouped-lists -->

## 動效

- 使用**系統轉換**。Push 滑入、sheet 上升、關閉時反向播放。與導航模型衝突的自定義轉換會使使用者迷失。 <!-- rule:ios-motion-system-transitions -->
- **遵循 Reduce Motion。** 用交叉淡化替代視差和大幅滑動。 <!-- rule:ios-motion-reduce-motion -->

## 驗證建置

- **截圖必須來自 Simulator，絕不能來自瀏覽器。** 建置執行後使用 `xcrun simctl io booted screenshot <path>`；同時執行多個裝置時，把 `booted` 換成 `xcrun simctl list devices booted` 中目標裝置的 UDID。顯示名稱可能重複，UDID 不會。覆蓋應用釋出的每類裝置，至少一臺 iPhone；若支援 iPad，再覆蓋一臺 iPad，並把檔案寫到評審流程指定位置。 <!-- rule:ios-verify-simulator-capture -->
- **深色模式和 Dynamic Type 必須納入驗證。** `xcrun simctl ui booted appearance dark` 切換外觀；多個裝置啟動時繼續使用截圖裝置的 UDID。用較大 Dynamic Type 檢查可發現固定佈局隱藏的截斷。 <!-- rule:ios-verify-appearance-and-type -->
- **模擬器提供廣度；姿態、手勢和效能需要真機。** 明確說明證據來自哪一種裝置。 <!-- rule:ios-verify-hardware-honesty -->
