# 創作品質底線

方向確定後加載本文，並在不宣讀檢查清單的情況下進行建置。已經固定的簡報或已經提交的視覺世界優先於本文；你自己的習慣沒有優先權。設計 hook 啟用時，它會在編輯過程中執行下述機械檢查：直接處理其發現，不要重新稽核每條規則。 <!-- rule:skill-craft-floor -->

## 驗證

以下每一項都檢查實際建置結果，而不是設計意圖。應在批次檢查輪次中一起執行，而不是分別截圖；這些檢查共享同一次渲染。

- **對比度：** 正文和 placeholder 文字不低於 4.5:1，大號文字不低於 3:1。彩色表面上的次要文字應從該色相或前景色推導，絕不要使用灰色。 <!-- rule:skill-color-verify-contrast -->
- **縱深：** 陰影應包含偏移和柔和模糊。無偏移的彩色光暈只是裝飾。 <!-- rule:skill-color-no-glow-halo -->
- **間距：** 相關內容緊密成組，不同內容充分分隔；標題上方空間大於下方。讀取實際計算值。 <!-- rule:skill-layout-spacing-rhythm -->
- **排版：** 正文行長 65～75ch，展示文字最大 6rem，字距下限 -0.04em；標題平衡，字號和字重層級清楚。在每個斷點使用真實文案，修復所有溢位。 <!-- rule:skill-typo-floor --> <!-- rule:skill-ban-text-overflow -->
- **動效：** 設定一個經過創作的時刻，而不是散落效果，也不是讓每個區塊使用同一種入場。預設狀態中的內容應已經可見，再使用指數型 ease-out。不要只依賴 transform 和 opacity；只要效能流暢，blur、backdrop-filter、clip-path、mask 和 shadow 都屬於可用材料。 <!-- rule:skill-motion-floor --> <!-- rule:skill-motion-materials-palette --> <!-- rule:skill-motion-no-section-fade -->
- **狀態：** hover、disabled、loading、error、empty；還應包含真實內容、可用控制元件、回應式構圖和鍵盤焦點。 <!-- rule:skill-floor-shipping -->
- **瀏覽器表面：** 即使不是你直接繪製的部分，也必須承載設計。文字選擇、游標、自定義捲軸、焦點環、下劃線偏移和表格數字預設值都不屬於任何設計系統。使用色板為它們設定主題。這是頁面經過真正建置而不是簡單拼裝的最低成本訊號，也是模型最容易遺漏的部分。 <!-- rule:skill-craft-browser-surfaces -->
- **文案：** 使用產品自己的語言。控制元件說明操作；錯誤資訊說明問題和恢復方式。 <!-- rule:skill-copy-design-material -->
- **覆蓋：** 簡報中的每項要求都存在，並能在幾秒內找到。 <!-- rule:skill-floor-brief-coverage -->

## 拒絕預設套路

以下是各類別的預設套路，而不是絕對禁令：簡報明確要求時可以使用。決策軸仍然開放時直接選擇其中一種，說明你並未真正做出設計決策；發現這一點後應重寫元素，而不是稍微弱化它。

頁面腳手架：

- 用相同尺寸的“圖示 + 標題 + 文字”卡片作為頁面結構。卡片是偷懶的容器；巢狀卡片永遠錯誤。 <!-- rule:skill-ban-identical-card-grids --> <!-- rule:skill-layout-cards-lazy -->
- Hero 指標模板：大數字、小標籤、輔助統計和強調色。 <!-- rule:skill-ban-hero-metric -->
- 標題上方的 kicker 或 eyebrow。這是一項禁令，而非預設套路：任何簡報都不能重新允許。標題應獨立承擔權重；刪除標籤，讓標題自己表達。 <!-- rule:skill-ban-eyebrow-on-every-section -->
- 區塊編號（01 / 02 / 03），除非順序本身承載讀者需要的資訊。 <!-- rule:skill-ban-numbered-section-markers -->
- 對不需要打斷流程或保護焦點的任務使用模態框。 <!-- rule:skill-reflex-modal-by-reflex -->

表面習慣：

- 漸變文字。應透過字重或字號建立強調。 <!-- rule:skill-ban-gradient-text -->
- 把玻璃和模糊當作裝飾，而不是服務某個明確效果。 <!-- rule:skill-ban-glassmorphism-default -->
- 在卡片、列表項、提示框或警告上使用寬度超過 1px 的彩色 `border-left` 或 `border-right`。 <!-- rule:skill-ban-side-stripe-borders -->
- 在並非真正新粗野主義的視覺世界中使用硬偏移陰影（`box-shadow: 4px 4px 0`）。無模糊塊狀陰影是一套服裝，不是縱深系統；沒有選擇它的視覺世界不應預設使用。 <!-- rule:skill-ban-hard-offset-shadow -->
- 用迷你趨勢線、進度環和帶柔和陰影的圓角矩形代替真實內容。 <!-- rule:skill-reflex-decorative-chrome -->
- 把等寬字型當作“技術感”裝飾，而不是用於程式碼、資料或測量。 <!-- rule:skill-reflex-mono-as-technical -->
- 在自有視覺世界的頁面中使用系統展示字型（Impact、Arial Black、平臺無襯線體）作為展示聲音。應尋找並自託管性格符合已批准字形的字型；最接近的已安裝字型是失敗，而不是回退。 <!-- rule:skill-ban-system-display-face -->
- 用 Unicode 字元或 emoji 代替圖示系統。圖示應來自真實圖示庫或原創 SVG，並保持統一描邊和字重。 <!-- rule:skill-ban-glyph-icons -->
- 用幾何遮罩代替有機輪廓。使用圓形、多邊形或徑向漸變裁切近似照片主體邊緣，是這種效果的廉價版本，甚至不如不用。應從真實圖片產生 alpha matte，或製作摳圖資源。 <!-- rule:skill-ban-geometric-occlusion-mask -->
- 按產品類別習慣選擇淺色或深色。應根據使用場景決定：誰在什麼地方、什麼環境光下使用。 <!-- rule:skill-reflex-theme-by-habit -->

<codex>
- 字距不能小於 -0.04em；-0.02～-0.03em 通常可讀性更好。 <!-- rule:skill-typo-codex-tracking-repeat -->
- 高度表達只宣告一次：使用邊框或陰影。寬大柔和陰影下再加 1px 邊框會形成幽靈卡片。卡片圓角保持 12～16px；膠囊形只用於小控制元件。 <!-- rule:skill-codex-elevation-radius --> <!-- rule:skill-ban-codex-ghost-card --> <!-- rule:skill-ban-codex-over-round -->
- 使用真實插圖，否則不用。素描風 SVG 場景、`loose-sketch` / `doodle` 類名和 `feTurbulence` 顆粒會顯得業餘。本規則禁止 SVG 模仿圖片，不禁止 SVG 表達幾何：清晰向量形狀、圖表、動畫線條和著色器驅動效果仍是一等媒介。帶陰影、透視或人物的插圖，即使是線稿，也屬於圖片；幾何意味著會話可以精確描述的形狀。 <!-- rule:skill-ban-codex-sketchy-svg -->
- 背景是表面，只能使用來自主題世界的紋理。`repeating-linear-gradient` 條紋和雙軸網格疊層必須有真實畫布、地圖、藍圖或測量工具作為依據。 <!-- rule:skill-ban-codex-stripes --> <!-- rule:skill-ban-codex-grid-backgrounds -->
- 宣告和設定必須來自已提供事實；示意值應如實標註。先命名一個概念再反諷它，並不構成事實宣告。 <!-- rule:skill-codex-material-honesty --> <!-- rule:skill-ban-codex-x-theater -->
</codex>

<gemini>
絕不要直接或透過父元素為圖片新增 hover 動畫。圖片不是操作目標；應讓容器提供回饋。 <!-- rule:skill-interaction-gemini-no-image-hover -->
</gemini>

這套底線負責機械品質，但絕不選擇方向。所有檢查通過後，把頁面資源投入已經確定的視覺世界；當“精緻”和“堅定執行”發生衝突時，選擇堅定執行。 <!-- rule:skill-floor-not-ceiling -->
