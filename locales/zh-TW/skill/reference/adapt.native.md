> **還需要補充的上下文**：目標平臺、裝置和使用情境。

將已有的**原生**設計（`ios` / `android` / `adaptive`）調整到不同情境：其他裝置類別、方向、平臺或來源。常見陷阱是把調整理解為縮放。真正的任務是在 [ios.md](ios.md) / [android.md](android.md) 的平臺慣例內，為新情境重新思考體驗；如果 Setup 尚未讀取目標平臺參考，規劃前先讀取。

## 評估調整挑戰

1. **來源情境**：原設計面向什麼，又依賴哪些假設？僅手機、僅豎屏、某個平臺慣例，還是網站？
2. **目標情境**：裝置類別（手機、平板、摺疊屏）、方向、平臺和使用姿勢是什麼（移動中單手，還是靜止時雙手）？
3. **哪裡會失效**：導航是否不適合目標平臺？佈局是否只被拉伸而未重構？是否使用目標平臺不存在的手勢或控制元件？

## 調整策略

### 手機 → 平板（iPad / 大屏）

- **重構，不要拉伸。** 放大的手機介面是平板調整的失敗形態。使用 size classes（iOS）或 window size classes（Android）切換結構。
- **導航改變形態**：iPad 上 tab bar 可保留或變為側欄；Android navigation bar 在擴充功能寬度下變為 rail 或 drawer。
- **利用寬度**：使用 split view / master-detail（列表與詳情並排）、多列網格；手機上的 sheet 可改為 popover。
- **多工是一種尺寸，不是邊緣情況**：iPad Split View 和 Android 多視窗可能在平板上提供手機寬度視窗；由 size class 驅動的佈局可以自然處理兩者。

### 方向與摺疊屏

- 橫屏應重構為並排窗格或重新定位控制元件，絕不能裁切或加黑邊。只有任務確實要求時才鎖定方向。
- 摺疊屏（Android）：透過 window size classes 響應姿態和鉸鏈；測試摺疊、展開和桌面式姿態。

### 平臺 → 平臺（iOS ↔ Android）

翻譯慣例，絕不要直接移植：

| iOS | Android |
|---|---|
| Tab bar | Navigation bar / rail / drawer |
| 邊緣右滑返回、返回箭頭 | Predictive Back 手勢 / 按鈕 |
| Switch、segmented control、系統 picker | Material switch、chips、Material picker |
| Action sheet | Bottom sheet / Material dialog |
| SF Symbols、SF Pro、Dynamic Type | Material Symbols、Roboto、sp 縮放 |
| 語義系統色、materials | Material 色彩角色、色調層級 |
| 系統 push/sheet 轉換 | Container transform、shared-axis、fade-through |

用目標平臺的語言重建導航和控制元件；透過目標平臺主題系統延續品牌表達層，包括色板意圖、字型強調和動效個性。

### Web → 原生（移植網站或 Web 應用）

重新遵循平臺，而不是隻重排。把 Web 導航換成平臺導航模型，把 HTML 形態控制元件換成平臺控制元件，把依賴 hover 的可供性換成觸控優先方案，並把 px 字型換成 Dynamic Type / sp。然後按完整平臺參考處理結果；其中的 slop test 就是驗收標準。

## 實作與驗證

- 讓結構由 **size classes / window size classes** 驅動，絕不要偵測裝置型號。
- 在每種新設定中尊重安全區域和視窗 inset，包括劉海、鉸鏈、狀態列和鍵盤。
- 先用模擬器覆蓋廣度，再用真機確認事實：每個釋出平臺至少一臺手機和一臺平板，覆蓋兩個方向，並在支援時測試分屏。

調整結果在每種情境下都像原生體驗後，交給 `{{command_prefix}}impeccable polish` 完成最終精修。

**絕對不要**：
- 在平板上釋出拉伸後的手機佈局
- 把一個平臺的控制元件或導航移植到另一個平臺
- 在小裝置上隱藏核心功能；重要功能必須可用
- 為逃避佈局問題而鎖定方向
- 只相信模擬器；姿態、手勢和效能需要真機驗證
