# Android 平臺

適用於釋出到 Android 硬體的原生應用：Jetpack Compose、Android Views、React Native、Expo、Flutter。

在原生平臺上，訪客模式會限制表達可以覆蓋的範圍。所有模式的結構、導航和互動均由 Material Design 3 約束；品牌透過 Material 主題系統表達，包括色彩角色、字階、形狀和動效。一個同時釋出到 iPhone、處處使用 Material 的跨平臺應用，仍必須在 Apple 硬體上滿足 iOS 保證：安全區域 inset、Reduce Motion 和邊緣右滑返回。

## Android 粗糙感測試

熟練 Android 使用者會信任這個應用，還是會被不合規範的元件絆住？最常見跡象是披著 Android 外皮的 iOS 應用：從 iPhone 照搬的底部導航、忽略系統 Back 手勢的返回箭頭、Cupertino 形態的 switch 和 dialog。Material 3 是規則手冊；遵循其元件，並透過主題表達品牌。

## 佈局與結構

- **按尺寸匹配 Material 導航。** 緊湊寬度使用 navigation bar（底部，3～5 個目的地）；擴充功能寬度使用 navigation rail 或 drawer。絕不要把手機底欄原樣放到平板上。 <!-- rule:android-layout-adaptive-nav -->
- **系統 Back 始終有效。** 遵循 predictive Back 手勢和 Back 按鈕；絕不能困住使用者或劫持手勢。 <!-- rule:android-layout-system-back -->
- **全邊到邊並處理 window inset。** 應用狀態列、導航欄、螢幕開孔和 IME inset，避免內容被系統欄或鍵盤遮擋。 <!-- rule:android-layout-window-insets -->
- 用 **top app bar** 提供頁面上下文；頁面只有一個主要操作時搭配 FAB。 <!-- rule:android-layout-top-app-bar -->

## 觸控目標

- 每個觸控目標至少 **48×48 dp**，相鄰目標至少間隔 8 dp。 <!-- rule:android-touch-target-48dp -->

## 排版

- 使用 **Material 字階**：Display、Headline、Title、Body、Label，每種均有 large/medium/small。把文字對映到角色，絕不要逐頁挑選字號。 <!-- rule:android-typo-type-scale -->
- **Roboto 是系統字型**；透過字階引入品牌字型，同時保持正文、標籤和控制元件清晰一致。 <!-- rule:android-typo-system-font -->
- 使用 **sp 單位，絕不用固定 px**，讓文字跟隨系統字號設定。 <!-- rule:android-typo-scalable-sp -->

## 色彩與主題

- 使用 **Material 色彩角色**（primary、on-primary、surface、surface-variant、secondary-container、outline、error）。角色 token 會自動解析淺色、深色和對比度變體；原始 hex 會破壞它們。 <!-- rule:android-color-role-tokens -->
- 合適時使用 **Dynamic Color（Material You）**：Android 12+ 從使用者桌布產生方案，並提供靜態回退。 <!-- rule:android-color-dynamic-color -->
- **深色主題是一等方案。** 獨立設計和測試，絕不能快速反色。 <!-- rule:android-color-dark-theme -->
- 使用**色調層級**。透過標準表面色調層級表達高度，必要時配合陰影；不要隨意使用投影。 <!-- rule:android-color-tonal-elevation -->

## 元件與動效

- 使用 **Material 元件**：filled/tonal/outlined/text button、FAB、switch、chip、snackbar、bottom sheet、Material dialog、navigation bar/rail/drawer。絕不要移植 iOS 控制元件或自行發明替代品。 <!-- rule:android-components-material -->
- **一個 FAB 對應一個主要操作。** 不要堆疊 FAB，也不要把它用於次要任務。 <!-- rule:android-components-single-fab -->
- 臨時回饋使用 **snackbar**，有用時提供操作；不要用 toast 代替。dialog 只用於必須打斷的決策。 <!-- rule:android-components-snackbar -->
- 使用 **Material 動效模式**：container transform、shared-axis、fade-through，以及標準緩動和時長；系統開啟 Remove animations 時改用交叉淡化或立即切換。 <!-- rule:android-motion-material-and-reduce -->

## 驗證建置

- **截圖必須來自模擬器或連線裝置，絕不能來自瀏覽器。** 建置安裝後使用 `adb exec-out screencap -p > <path>`；連線多個裝置時使用 `adb -s <serial>` 選擇目標。覆蓋應用釋出的每類裝置，至少一臺手機；若支援平板，再覆蓋一臺平板，並把檔案寫到評審流程指定位置。 <!-- rule:android-verify-emulator-capture -->
- **深色主題和字型縮放必須納入驗證。** `adb shell cmd uimode night yes` 切換主題；`adb shell settings put system font_scale 1.3` 可發現固定佈局隱藏的標籤裁切，完成後恢復 `1.0`。連線多個目標時，這些命令也要加截圖裝置的 `-s <serial>`。 <!-- rule:android-verify-theme-and-scale -->
- **模擬器提供廣度；手勢、重新整理率和效能需要真機。** 明確說明證據來自哪一種裝置。 <!-- rule:android-verify-hardware-honesty -->
