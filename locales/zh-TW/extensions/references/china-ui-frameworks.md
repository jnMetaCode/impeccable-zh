# 中國常用 UI 框架調整

> 來源型別：`jnMetaCode-original`。
> 適用命令：`craft`、`shape`、`adapt`、`audit`、`polish`。
> 官方資料核對日期：2026-09-30。

當專案已使用 Ant Design、Element Plus 或 TDesign 時，優先延續現有框架和版本，不要為了視覺調整替換技術棧。先從 lockfile、入口檔案、全域性 Provider 和主題檔案確認真實版本與設定；不得僅憑元件標籤猜測。

## 通用調整順序

1. **識別框架與宿主技術棧。** 確認 React、Vue、小程式或行動版實作；同名設計體系的不同技術棧不是可直接互換的包。
2. **讀取現有全域性設定。** 找到 locale、主題 token、元件尺寸、彈層容器、暗色模式和 CSS 名稱空間設定。
3. **複用 token。** 品牌色、圓角、字號、間距和狀態色優先進入框架公開 token 或 CSS variable，不大面積覆蓋內部 class。
4. **保留元件語義。** 使用框架已有的 Form、Table、Dialog、Empty、Result、Skeleton 等元件狀態，不用無語義 `div` 複製外觀。
5. **驗證中文壓力情況。** 檢查雙字按鈕、長標籤、中文校驗資訊、金額日期、分頁、表格密度和窄屏彈層。
6. **驗證升級邊界。** 不使用未公開內部變數、DOM 層級和 hash class 作為長期契約。

## Ant Design

適用於 React 專案中的 Ant Design。先確認主版本；不要把 v4 的 Less 變數方案機械搬到 v5/v6。

- 使用 `ConfigProvider` 的 `theme` 設定 Design Token；全域性品牌基線放在 token，單元件差異放在 component token。
- 需要暗色或緊湊模式時使用公開 algorithm 組合，不復制整套派生顏色。
- locale、表單驗證文案、元件尺寸、方向和彈層容器在 Provider 層統一處理。
- `message`、`notification`、`Modal` 等靜態呼叫可能不繼承普通 React context；使用目前版本官方推薦的 App、hook 或 holder 方案，必須在真實執行環境驗證主題與 locale。
- 不覆蓋執行時產生的 hash class；自定義樣式應使用 token、公開 className/style 介面或專案包裝元件。
- Table 在窄屏下不能只做橫向壓縮：按任務決定凍結關鍵列、允許受控橫滾、轉為詳情行或切換行動版資訊結構。

核對入口：

- [Ant Design 定製主題](https://ant.design/docs/react/customize-theme-cn/)
- [Ant Design ConfigProvider](https://ant.design/components/config-provider-cn/)

## Element Plus

適用於 Vue 3 專案。先檢查全量註冊、按需匯入、Nuxt 整合和主題編譯路徑，避免同時引入重複樣式。

- 使用 `ElConfigProvider` 統一 locale、size、z-index、namespace 及框架公開的元件級設定。
- 中文 locale 之外，日期元件所使用的日期庫 locale 也必須一致驗證；不能只翻譯元件按鈕。
- 小範圍動態主題優先使用公開 `--el-*` CSS variables；大規模 SCSS 主題按官方 Sass module 方式設定，不繼續新增舊式 `@import` 方案。
- 暗色模式同時引入官方暗色變數並在明確作用域切換 `.dark`；自定義暗色變數必須在官方變數之後覆蓋。
- Form 的 label 位置、校驗觸發、錯誤文字和 Enter 提交行為按真實業務測試；中文標籤變長時允許 top label，不能靠縮小字號硬塞。
- Row/Col 斷點只解決網格寬度，不自動解決資訊優先順序；行動版仍需決定哪些列、操作和輔助資訊保留。

核對入口：

- [Element Plus Config Provider](https://element-plus.org/zh-CN/component/config-provider.html)
- [Element Plus 主題](https://element-plus.org/zh-CN/guide/theming.html)
- [Element Plus 國際化](https://element-plus.org/zh-CN/guide/i18n.html)

## TDesign

TDesign 同時存在 Vue、Vue Next、React、行動版和小程式實作。必須從依賴包確認平臺，不根據視覺相似度混用 API。

- 使用對應技術棧的公開 ConfigProvider、全域性設定和 Design Token；不要把 Web token 直接複製到小程式或行動版。
- 優先複用 TDesign 的行業元件和狀態元件，同時檢查它們是否符合目前產品的資訊密度與權限模型。
- 主題切換必須覆蓋明亮、暗黑和跟隨系統三種真實狀態；驗證狀態色、圖表、遮罩和彈層，而不只檢查頁面背景。
- 表格、日期、上傳、樹選擇等重型元件使用目前技術棧文件中的 API；不能把 Vue 示例翻譯成 React 屬性名。
- 小程式端遵守元件註冊、包體積、rpx、安全區和原生導航約束；桌面 Web 的 hover 互動不能成為唯一入口。

核對入口：

- [TDesign 官網與技術棧入口](https://tdesign.tencent.com/)
- [TDesign Starter](https://tdesign.tencent.com/starter)

## 不允許的做法

- 同一頁面混入第二套元件庫，只為獲得一個元件；
- 複製官方示例後保留英文 placeholder、假資料或無意義操作；
- 透過 `!important` 和深層選擇器批次覆蓋框架內部結構；
- 用桌面端縮放代替行動版資訊架構；
- 假定框架預設中文、預設時區或預設無障礙行為已經滿足業務；
- 為追求“國產化”替換一個執行穩定且沒有遷移需求的現有元件庫。

## 驗收

- lockfile 中的實際版本與所用 API 匹配；
- 全域性 locale、主題、尺寸、彈層容器和暗色模式只有一個權威入口；
- 中文長文案、金額日期、表單錯誤、空狀態和高風險確認透過壓力測試；
- 鍵盤、焦點、螢幕閱讀器名稱和觸控目標經過真實互動驗證；
- 360px 窄屏、常用桌面寬度和 200% 縮放均沒有關鍵功能丟失；
- 自定義樣式不依賴內部 hash class、未公開 DOM 層級或過時主題介面；
- 建置產物沒有因重複全量匯入元件庫而出現不可解釋的體積增長。
