# 新視覺工作

此流程用於新介面或替換視覺身份。PRODUCT.md 負責產品事實，DESIGN.md 負責長期視覺決策，介面簡報儲存僅屬於某一路由或產物的策略。缺少 PRODUCT.md 時先完成 [init.md](init.md)；缺少 DESIGN.md 不應返回 init。

獲選視覺稿的區域對映命令與 schema 見 [region-map.md](region-map.md)。

## 1. 確認哪些事實已經成立

閱讀 DESIGN.md、代表性程式碼、token、元件和資源。

- **重新設計：** 保留產品事實、內容、功能、約束和明確品牌承諾；替換舊視覺世界，而非精修舊外觀。舊外觀只證明主題是什麼，不決定它應變成什麼。
- **既有世界：** 繼承它。沒有 DESIGN.md 並不會抹掉程式碼中已有的統一身份；應記錄該身份，而非發明替代品。
- **不完整品牌：** 保留已確認資產和可識別特徵，再與使用者一起為目前介面擴充功能系統。
- **無視覺權威：** 與使用者共同建立新世界。

既有介面內的章節、元件、功能或狀態必須繼承該介面。不要把區域性新增變成新的身份探索。

## 2. 詢問真正會改變工作的內容

實作前透過可用的結構化提問工具獲得使用者回答。詢問兩三個相關問題；請求足夠精確時只需簡短確認。可以跳過已確定事實，但不能跳過確認：DESIGN.md 確定視覺世界，卻不確定目前介面的目的或概念。

- **Persuade：** 誰必須行動、應相信什麼、哪些真實證據/內容/資產足以建立這種相信。
- **Operate：** 任務、資訊、重要狀態、使用頻率和約束。
- **Read：** 讀者的問題、素材、結構和尋路方式。
- **Experience：** 什麼主導體驗、探索如何展開、哪個互動或過渡最重要。

所有模式都要詢問成功的樣子、不可觸碰的內容，以及什麼會讓一個精緻結果仍顯得錯誤。不要詢問 CSS 數值或套裝式審美路線。

## 3. 選擇適當的創意幅度

### 擴充功能既有介面

繼承其世界與構圖，只解決新增目的、內容、層級、狀態、互動，以及新增部分如何連線周邊體驗。不舉辦概念競賽；除非使用者批准長期系統變更，否則不修改 DESIGN.md。

### 在既有世界中建立完整介面

固定視覺系統。根據內容、任務和使用者行為推導 5–7 個實質不同的結構，按共鳴度排序。面對真正開放的整頁、整屏或流程，執行：

`{{scripts_path}}/impeccable concept-seed --scope surface --mode <mode>`

指令碼從候選結構中隨機發三張牌；骰子決定使用者看到哪三張，打破排序慣性，同時保留真實選擇。決策頁面以等權完整卡片展示，發牌首選使用 THE ROLL kicker，並提供 steer 與 re-roll，由使用者鎖定其一。介面範圍不提供 canon 或 pick 卡：世界已經確定，每張卡展示的是構圖，而非身份。

有影像產生且預設 comp-led 時（讀取 `.impeccable/config.json`，詳見下文建置路徑），每張卡宣告 `.impeccable/mocks/decision/` 下的 `comp`，在頁面啟動後按閱讀順序產生，並遵守 [visualize.md](visualize.md) 的視覺稿紀律。用代表性現有頁面截圖作為參考圖，將每張稿錨定在既有身份；prompt 先說明新介面結構，並點名 DESIGN.md 的配色、字型和元件性格。文字轉述會漂移，畫素參考不會。無影像產生或預設 code-led 時，每張卡攜帶由頁面繪製的 `wireframe` 示意（schema 見 `impeccable serve-question --schema`）。鎖定卡片即構成批准並確定建置路徑：鎖定 comp 就以它作為獲批稿進入 comp-led，且已完成 [visualize.md](visualize.md) 的三選一輪次，無需第二個批准點；鎖定 wireframe 就進入 code-led，其野心由方向契約承載。區域性擴充功能或精確狹窄請求不得執行此指令碼，直接塑形即可。

### 建立或替換視覺世界

1. 用一句話描述產品獨特機制、受眾真實場景、文化歸屬，以及首個介面必須證明什麼。記錄本類別總會交付的頁面及其可預測反面；二者都是慣性，不得進入七個候選。若簡報、產品名、具名產物或主導隱喻已經畫出一幅圖，其字面解讀也屬於慣性：最多給一個候選，其餘從受眾世界的其他位置推導。
2. 從該文化世界列出受眾熟知的七個具體視覺系統、產物、場所或儀式；每項用一行解釋為何共鳴、為何能承載產品機制，並按共鳴排序。受眾世界不僅包括物件，也包括每天閱讀的圖形與螢幕傳統：記譜法、出版物、身份系統、資料圖形和介面。可命名的抽象系統（海報流派、文件標準）與實物同樣具體。追問“它若是實體會長什麼樣”“Web 出現前其世界是什麼樣”。近似項只算一個；若七項中超過三項屬於同一材質家族，說明推導停在主題最明顯的物件上，應繼續挖掘直到覆蓋至少三個家族。
3. 把材質發展成完整方向：每項都把可複用視覺世界連線到具體首屏體驗。
4. 執行 `{{scripts_path}}/impeccable concept-seed --scope direction --mode <mode>` 並遵循輸出。沒有替代，也不能跳過：新建或替換世界時，在指令碼執行並確認分配前寫產物程式碼，均違反契約；roll 防止每次執行收斂到類別預設。

指令碼分配要建置的方向併發出 catalog 挑戰者。判斷前先融合：挑戰者提供形態及系統語法，產品提供全部事實，衝突時以清晰度為準。只按“受眾認同”和“產品清晰度”兩軸比較融合後的挑戰者與分配方向。輸給紮實素材是合理結果；目的在於擊敗單薄或工具單一文化的列表。借鑑前先裁決每個挑戰者：`wins` 表示兩軸都勝出併成為建置候選；`competitive` 表示守住一軸並作為完整備選；`declined` 表示兩軸都輸。

被拒挑戰者並未浪費：指出其系統具備而分配方向缺少的一項紀律，並在展示前把分配方向提升到同等水平。捐贈轉移的是野心與系統紀律，如配色的徹底投入、網格的密度勇氣、形態的結構誠實；絕不移植挑戰者的外衣。搬用圖案只是裝扮，不是提升，一個頁面只能屬於一個世界。把每項提升作為獨立行寫入展示方向，並標註捐贈者；使用者讀不到的提升就沒有發生。<!-- rule:skill-concept-procedure --> <!-- rule:skill-verdict-and-donation -->

5. 展示一個徹底投入、已被所擊敗牌組提升過的方向，提升項以具名行可見。內容包括：視覺世界、首屏、訪客路徑、標誌互動、跨介面延展和誠實風險。按裁決路由挑戰者：勝出與有競爭力者作為完整備選，附 QUALITY BAR 卡和一句理由；被拒者降級為緊湊、安靜的一行，帶裁決和保留的貢獻，不能全尺寸展示，也不能靜默丟棄，使用者要求時仍可採用。裁決幫助選擇，不能替使用者決定；降級行是判斷過程的證據。

一手牌最多容納三個完整挑戰者；roll 發出更多時，選最強三個，其餘用一行記入 re-roll 池。要從牌組徹底丟棄挑戰者，必須指出與產品事實衝突的原因並披露。如果自己排名最高的紮實候選不是分配方向，增加一張 kicker 為 IMPECCABLE’S PICK 的卡片；結構與其他卡一致，真實風險行在確實熟悉時說明其熟悉度。熟悉而有效是正當終點，不是膽怯；pick 卡與常駐出口提供兩種深度。只能有一張 pick，不能兩張，也不能展示排序列表；若骰子恰好分配首選，就不加 pick，並在分配卡說明它原本排名第一。

加入 re-roll 和可選單行 steer，提供三檔：plain（同樣跨度的全新一手）、safer（剩餘傳統紮實候選，加上對照指定競品的 canon）、bolder（只用外來形態且徹底投入）。檔位由使用者在熟悉—大膽軸上選擇，不能預選。回答帶檔位時，以 `--register <value>` 和下一次 `--reroll` 重跑 seed 並遵循輸出。方向輪開啟時使用者說“bolder”或“safer”指這些檔位，不是 bolder/harden 命令。決策頁面用卡片和 board；結構化工具只展示名稱與一句話，其選項依次為分配方向、pick、勝出/有競爭力挑戰者和最後的常駐出口。被拒挑戰者的保留項折入分配選項描述，使提升在文字通道也不丟失。<!-- rule:skill-pick-card-one-only -->

每輪方向選擇都提供一個安靜、永久的替代項：不加諷刺地忠實執行類別標準。它是使用者的門，不是你的：不得推薦、不得拿它與 roll 比較，也不得讓它削弱發出的方向；反預設約束只約束未選擇的預設。當使用者選擇 canon、safer steer，或用自然語言要求熟悉/類似競品的路徑時，慣例成為承諾：只詢問一次應與哪 2–3 個產品並列，把其工藝水平當作底線，然後完整忠實執行，不偷塞怪癖。長期偏好記錄為 PRODUCT.md 中的品牌承諾。<!-- rule:skill-canon-standing-exit -->

Re-roll 淘汰此前展示過的所有方向，包括紮實候選和挑戰者。連續兩次後詢問缺少什麼特質。只有分配方向確實無法承載產品事實或任務，且能指出事實理由時才可主動 re-roll；個人品味不是理由。使用者可自由 re-roll，使用者或簡報固定的方向始終優先。逐欄位解決衝突，保留每項使用者/簡報固定約束；簡報開放的維度仍由分配方向的拓撲、控制元件、狀態詞彙和儀式約束。只有材質與固定視覺方向或 PRODUCT.md 品牌承諾衝突時，轉換材質表達並在展示中明確說明。外觀不匹配不是 re-roll 理由。<!-- rule:skill-assigned-plus-reroll -->

以視覺方式呈現決策：options payload 以包含具名提升行的分配方向為首，隨後是存在時的 pick、帶 QUALITY BAR/裁決/保留項的挑戰者、帶 safer/bolder 檔位的 re-roll、steer、啟用的 canon，以及在影像產生可用時攜帶記錄預設值且 `toggle: true` 的 `buildPath`。沒有挑戰者的降級 roll 仍使用頁面，展示一張帶 re-roll 的純文字卡。

每張卡結構相同：thesis、palette、materials、first viewport、honest risk 和挑戰者 case 行（精確結構見 `--schema`）。頁面根據欄位渲染身份並自動降級 declined 挑戰者；catalog 圖只作為明確標註的靈感，不承諾建置。還要編寫同結構的 `canonCard`；頁面會將其置於次要位置，反預設約束仍生效。執行 `{{scripts_path}}/impeccable serve-question --start --payload <file>`（先用 `--schema` 檢視結構）。命令守護化後列印頁面 URL 和 key 並退出；優先應用內瀏覽器，其次系統 opener，最後直接展示 URL。以 `--wait --key <key>` 收集選擇，退出碼為 3 時重複等待；ANSWER 輸出 JSON。

ANSWER 為 `{"optionId":"reroll"}` 時服務保持存活，頁面顯示載入中的新牌。用相同 `--scope`、`--mode` 加 `--from <seed-key> --reroll <n>` 重跑 concept-seed（首次 n=1，依次遞增），建置新 payload，透過 `--update --key <same key> --payload <file>` 傳送，再回到同一 key 的 `--wait`。不得啟動第二個服務，也不得在此回退聊天，否則已開啟頁面會永遠等不到新牌。退出碼 4 表示頁面未回答就關閉：僅用結構化提問工具重現一次；仍無回答則無監督採用分配方向並說明假設。能夠後台阻塞 shell 的環境可不加 `--start`，讓指令碼自動開啟並阻塞。不要預判回退；真正執行指令碼，只有啟動退出碼 2 才路由到結構化工具，這是一條回退路徑而不是需重試的錯誤。<!-- rule:skill-visual-decision-page -->

影像產生可用時，每張卡（含 canon）都宣告 `.impeccable/mocks/decision/` 下的 `comp` 路徑。執行環境對 shell 有沙箱時，以限制最少的命令路徑啟動頁面；沙箱 shell 無法繫結 board 埠，首次失敗會令每個會話多一次重試。先提供頁面，再產生視覺稿；各卡槽顯示 shimmer 等待，使用者可以在圖片到達前作答。

寫第一張決策稿 prompt 前就載入 [visualize.md](visualize.md)，不能等到正式 comp 輪。每張卡影像都是按該檔案紀律製作的高保真北極星稿：把請求介面當成真實頁面，展示首屏及下一節開頭；模板骨架無論套什麼世界仍是模板（自己的 pick 也一樣）；prompt 以結構開頭，使用真實產品名與內容，不杜撰商業主張，並徹底採用卡片自身的配色、字型性格和材質世界。某輪宣告尚未產生的 comps 後，`impeccable serve-question --start`、`--update` 或切換到 comp 會列印 `NEXT read <path>/visualize.md`，第一條 prompt 前必須讀取。`--wait` 對缺 prompt sidecar 的已落盤圖片列印 `COMP SIDECAR MISSING`，補齊後才能繼續；`COMP STALE` 表示槽位殘留舊輪檔案，應原位重產生。

各檔保真度產生耗時相同，因此草率草稿只會以完整成本換取草稿品質。卡片公平意味著各自在自己的語法中等保真、同一介面、同一寬高比，而不是一起未完成。畫幅遵從介面：原生或移動優先用裝置縱向視口，桌面 Web 用橫向；手機橫向稿是壞畫幅，不是中性預設。按閱讀順序產生：分配卡、pick、完整挑戰卡、canon；每張完成立即寫圖片及 prompt sidecar，讓 re-roll 成本優先花在先閱讀的卡。Declined 挑戰者不產生 comp，以 catalog 縮圖作為形象。

可並行使用 sub-agent 時，每張卡分配一個 agent，最多四個並行；每次產生都呼叫隨附資源生產 Agent，並提供單稿任務包、該卡欄位、PRODUCT.md、共享畫幅、visualize.md 路徑和宣告輸出路徑。Agent 返回後仍為空的槽位在目前執行緒重產生；使用者已作答時仍為空的槽位直接放棄，無需額外監督。無並行能力時，頁面啟動後在主執行緒按同順序產生，由環境自身顯示進度，最後一張完成後再等待回答。

選擇不會消耗獲選 comp：comp-led 時它作為正式構圖輪第一個選項；code-led 時在最終評審中作為“影像敢於表達而建置沒有做到”的批評參照。未選稿保留在 `.impeccable/mocks/decision/` 作為已發牌組，不帶批准也不暗示批准。無影像產生時，卡片透過配色晶片和事實表達身份，該頁面仍是完整體驗；頁面自動把 catalog 圖降級為標註縮圖，因為顯著度應編碼裁決，不能由是否有圖偶然決定。<!-- rule:skill-decision-comps-full-fidelity --> <!-- rule:skill-salience-parity -->

執行契約（comp-led 或 code-led）是工作流偏好，不是逐介面決策，任何輪次都不直接詢問。記錄的預設值隨每輪傳遞，頁面 toggle 只處理例外。讀取 `.impeccable/config.json` 的 `buildPath`，單機差異由 gitignore 的 `.impeccable/config.local.json` 覆蓋；二者都沒有且影像產生可用時，預設 comp-led。每個方向/介面 payload 都寫 `buildPath: { "value": <default>, "toggle": true }`；頁面頁尾解釋取捨，ANSWER 返回 `buildPath` 與 `buildPathFlipped`。

切換值僅約束目前會話，不寫回，但有一個例外，也是輪次內唯一值得詢問偏好的情況（有機會的專案已由 init 預先記錄）：若 `buildPathFlipped` 為 true 且專案完全沒有記錄 `buildPath`，輪次結束後只問一次是否將其設為長期預設。無論回答什麼都寫 `.impeccable/config.json`：回答 yes 寫切換後的值；“no, just this once”寫被切走的值，即使用者透過拒絕確認的長期預設。只有發生切換才問，未動 toggle 不表達偏好。拒絕後什麼都不記錄會導致下次繼續問。使用者用文字要求改變長期預設時，直接更新檔案，不再詢問。

**Comp-led：** 獲選 comp 是法律；若尚不存在，建置前必須產生；最終評稽核對實作與 comp。它提供最大膽構圖，預期會有修復輪，不能靜默跳過。**Code-led：** 不製作目前頁面 comp，也無需道歉；QUALITY BAR board 繼續校準工藝，野心轉入書面契約的 FIRST VIEWPORT、具名標誌互動和動效語法，由最終評稽核查實際行為；code-led 不等於降低投入。

Code-led 輪仍為每張卡宣告 comp 路徑作為切換儲備。使用者在輪中切到 comp 時，`--wait` 返回一次 BUILD PATH FLIPPED，頁面槽位 shimmer；此時逐一產生所有開放卡的 comp（lead 優先），再等待。切回不產產生本；已經渲染的 comp 在最終評審中作為批評參照。沒有影像產生就不顯示 toggle：code-led 是唯一選擇，只用一行說明而不詢問。舊的雙卡執行契約輪已廢棄；`followup: true` 仍用於透過 `--update` 在同一桌面提供後續輪次。<!-- rule:skill-build-path-round -->

Catalog 世界是可工作的系統，不是情緒參考。一個世界保留下來後，把其配色與材質、字型與構圖、拓撲、控制元件與狀態、回應式規則帶入產品。來源本身是介面語言時，應在導航、內容、控制元件和狀態中全面採用其原生語法。選擇落定後立即開啟所選世界的 QUALITY BAR board 與 hero，即便此前看過其他卡。ANSWER 行會給出所選卡圖片；只能讀檔案或執行沙箱時，將其下載到工作區並用相對路徑開啟，沙箱檢視器拒絕工作區外絕對路徑。圖片決定建置必須達到的工藝、保真與藝術指導水平，但不決定構圖；目前介面服務的是本產品。

Roll 可能落到的每個方向都必須預先可行：所有關係和視覺化主張真實；具備真正的配色與元件家族；有一種獨特構圖和一個產品專屬體驗；能在現有資產、工具和效能預算內擴充功能到整個介面。不符合事實的候選應在 roll 前替換，不能指望 roll 拯救。事實約束主張，而非示範：綠地專案可用完整保真度製作概念所需的示意材料；只要訪客可能誤認其為真實，就標為合成，並向使用者列出需要替換的真實素材。絕不能虛構商業或事實主張：價格、客戶、基準、端點和產品並不具備的能力。以“示範資料尚不存在”為由拒絕大膽方向，是披著誠實外衣的膽怯。<!-- rule:skill-truth-binds-claims -->

對 **Persuade**，開場必須讓產品價值可理解且有吸引力，展示清晰操作，並證明只有本產品能證明的內容。轉化必須存在於形式自身的語言中：一句擊中的 hook、可見主操作、清晰閱讀順序。隱藏產品價值或操作的投入形式仍未完成轉換。<!-- rule:skill-persuade-conversion-in-form --> 對 **Operate**，表達不得遮蔽任務、狀態或熟悉 affordance。對 **Read**，保持理解和尋路。對 **Experience**，作品從首屏就應主導體驗。

## 4. 提交視覺世界

先選擇色彩策略，再選擇具體顏色：Restrained（中性色加一個強調色，是 Operate/Read 的預設）；Committed（一個飽和色覆蓋介面 30–60%）；Full palette（3–4 個具名角色）；Drenched（介面本身就是顏色）。Persuade 與 Experience 可採用更大膽策略，簡報允許時就使用。顏色要在頁面尺度上投入，以整塊區域為色域，而非在中性底上散落強調色。深色或淺色從來不是預設：用一句話寫清誰在何地、何種光線下使用，讓物理場景強迫答案。<!-- rule:skill-color-strategy -->

像從主題世界挑選物件一樣選字型，並符合介面模式。Operate/Read 適合系統字型棧和可靠 UI 字型；Persuade/Experience 需要有觀點的字型。以下訓練資料預設字型意味著停止尋找：Fraunces、Playfair Display、Cormorant、Lora、Crimson、Newsreader、Syne、Space Grotesk、Space Mono、IBM Plex、Inter-as-display、DM Sans、DM Serif、Outfit、Plus Jakarta Sans、Instrument Sans。仍選其中之一時，必須有其他字型無法滿足的理由；“書籍需要襯線”“書店需要手寫”“科技需要等寬”等主題聯想絕不是理由，這份清單正為打破它們而存在。<!-- rule:skill-typo-reflex-faces -->

校準：無論主題為何，AI 介面常聚集到少數外觀——暖奶油底、高對比襯線標題、陶土或訊號紅強調；近黑底、單一霓虹強調與發光邊緣；報刊式細線、斜體襯線標題和小號寬字距等寬標籤。簡報要求時它們都合理；審美開放時落入其中表示自檢失敗。如果只憑類別，或“類別 + 避開什麼”，就能猜中審美，應返工到二者都不明顯。<!-- rule:skill-calibration-saturated-looks --> 活力不等於不可信：簡報中的“不要遊戲化、不要炒作”等負約束只排除這些手法，不排除充沛表達；描述產品行為的“安靜支援、平靜輔導”也不決定介面能量。<!-- rule:skill-constraints-rule-out-devices-not-energy -->

書卷氣、溫暖或面向兒童的主題也不豁免校準：書布、線、封套、環襯與書架雜物覆蓋完整飽和光譜，奶油紙只是極小一角。書籍主題落在“奶油 + 襯線”只是穿著主題外衣的預設。<!-- rule:skill-book-subject-not-cream-license --> 簡報固定的是整個世界，不是其最柔和版本；該世界完整材質範圍仍可使用。若任何模型都會為此世界產出同一表現，失敗發生在執行自檢，而非方向選擇。<!-- rule:skill-pinned-world-not-default-rendition -->

<claude>
你的已測預設傾向：溫暖、書卷、家庭和兒童主題會變成奶油底、帶斜體強調的襯線標題和燈光，即使分配方向沒有要求。把第一套配色視為已經用過。寫程式碼前重讀 OWN-WORLD：若 Persuade 介面在簡報未固定時出現 cream、paper、parchment、ivory 或 lamplight，表現已經失敗，應先從該世界的飽和材質重新設計。其他模型會把同一主題表現為書布、線、封套和環襯顏色；主題本身不要求你的預設。
</claude>

## 5. 記錄決策

編碼前，在相關介面簡報的 `## Direction contract` 下記錄選定方向，作為僅供開發使用的契約。方向契約是長期路由/產物策略；即使沒有其他介面策略要持久化，也要新建或更新簡報。使用六個短塊，總計約 150 詞，無需呼叫工具計數：

- THESIS：目前介面唯一擁有的理念，以及拒絕的類別預設佈局。
- OWN-WORLD：配色與元件語言；即使刪除所有內容也足以辨認。
- STORY：訪客理解什麼、相信什麼、做什麼。
- FIRST VIEWPORT：精確構圖、各元素位置與尺度，以及主操作位置。
- FORM：選定形式、它在有序列表中的位置和指令碼輸出的 seed key。
- FINISH：逐字寫入 `unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance`。

介面簡報是後續 agent 跨編輯、跨會話過載的提醒。FINISH 尚未完成時，外觀再完整也不是完成，只是倒在終點線。任何塊若讀起來只是情緒，說明方向尚未決定；最終評審會對照此契約檢查渲染。<!-- rule:skill-decide-then-build -->

絕不能把方向契約複製進實作原始碼或任何瀏覽器交付產物，包括 HTML/框架註釋、隱藏 DOM、`<template>`、`data-*` 屬性、渲染後的 JSX/TSX、序列化 props/state、React Server Component payload、客戶端 bundle、metadata/JSON-LD、僅無障礙文字，或與產物一起提供的檔案。不能把編譯器或最佳化器刪除開發元資料當作安全邊界。評審 Agent 和文件 Agent 從介面簡報讀取契約。

新建或替換視覺世界時，DESIGN.md 在結束階段由隨附文件 Agent 根據實際建置結果編寫（第 7 節）。先寫規則書會導致實作為規則辯護而不描述現實，還會給設計系統偵測器一個不穩定目標。新世界缺少 DESIGN.md 仍是未完成執行。普通擴充功能不重寫 DESIGN.md。<!-- rule:skill-design-md-from-the-build -->

更新前讀取現有介面簡報：

`{{scripts_path}}/impeccable surface-brief read <primary-target>`

`{{scripts_path}}/impeccable surface-brief write <primary-target> <body-file> [related-target ...]`

寫入後再讀一次，確認六個契約塊與 seed key 齊全，再開始建置。保持簡報精簡：範圍與訪客模式；受眾、任務、操作/目標、證據/內容、約束；選定方向與記憶點；未決事項。不要複製全域性產品事實或 DESIGN.md token。

Comp-led 建置中，只要任何影像產生方式可用（環境原生工具或 `impeccable context` 報告的 API 回退），鎖定方向就必須在建置前視覺化，不得跳過：載入 [visualize.md](visualize.md)，把三個構圖選項交給使用者批准，即獲選卡的決策稿加兩個變體。此步驟被證明能產出最具構圖感與野心的工作。Code-led 按契約跳過該輪，不是流程漂移；原本由視覺稿承載的野心寫在方向契約 FIRST VIEWPORT 塊和具名標誌互動中，並由最終評稽核查行為。<!-- rule:skill-visualize-before-build -->

若命令為 `shape`，把選定方向返回 [shape.md](shape.md)，在持久化或實作前停止。

## 6. 徹底投入地建置

建置分配方向，不要實作一個更安全的解釋。形式提供結構、閱讀順序、元件慣例和原生動效；產品提供全部事實。每個原子都要投入：導航、按鈕、輸入框、連結都用該形式的詞彙重建，在投入形式中使用通用元件就是失誤。第一版就要徹底投入；後續輪次用於讓它更清晰有效，絕不用於稀釋。無人值守工作中，安全表現本身就是已知風險。<!-- rule:skill-commit-every-atom -->

### Comp-led：視覺稿是可測量契約

獲批視覺稿存在時，它是空間契約，不是 mood board；只有使用者能以明確文字降低其權威。模型常誤以為 HTML/CSS/SVG 已成功復刻影像，因此建置以磁碟狀態機執行，由門禁測量螢幕與視覺稿，而非依賴記憶。只啟動一次，讓狀態機告訴你下一步：

選擇方向後立即執行 `{{scripts_path}}/impeccable build-phase start --direction <seed key> --kind <assigned|pick|challenger|canon> --artifact <entry file>`（這也是選擇 ping，roll 會輸出精確命令）；若介面輪已鎖定視覺稿，執行 `start --comp <approved comp> --artifact <entry file>`。

然後依次執行以下階段，每階段由 `{{scripts_path}}/impeccable build-phase advance` 關閉（下列動詞都以 `{{scripts_path}}/impeccable <verb>` 執行；退出碼 2 表示門禁失敗並說明原因，修復後再次 advance；前一門禁開放時，不得寫後一階段內容）：

0. **comps。** 執行 [visualize.md](visualize.md) 的構圖輪：在目標真實視口產生三張 `.impeccable/mocks/` 下、各有 prompt sidecar 的視覺稿，一併交給使用者；獲選稿 sidecar 寫 `"approved": true`。門禁計數並讀取批准。`start --comp` 表示這一步已發生，因而跳過。Comp-led 屬於前沿模型任務：建置者要維持測量佈局、按 box 放 plate，並在多輪嘗試中響應數值讀數。較小或更快模型往往只能做出可辨頁面，卻卡在 hero 門禁；若目前模型屬於此類，在方向輪前說明並採用 code-led，否則預期流程會以未滿足讀數停在 hero。

1. **spec。** 用 `impeccable comp-spec --comp <comp> --grid` 在視覺稿上產生座標網格並開啟。用 regions 檔案按網格跨度命名每個顯著區域；text/control 只有在保留該跨度至少 95% 對比畫素時才可縮到墨跡簇，尤其檢查複合控制元件與多行文字裁剪。`snap: false` 保留跨度，顯式 `box` 按原樣採用。

所有繪製內容——插畫、照片、人物、產品物件與材質紋理——標為 `plate` / `image` / `texture`；程式碼繪製內容標為 `text` / `control` / `chrome`。每個區域攜帶描述視覺稿內容的 `note`，plate prompt 與門禁訊息會讀取它。執行 `impeccable comp-spec --comp <comp> --regions <file>`；spec 儲存各區域 box、取樣配色與媒介，後續以 `impeccable comp-spec --print` 為建置參考。

字型必須測量，不能猜。`impeccable font-match --measure <text region>` 從畫素讀取大寫高度、寬度類別和字重；`impeccable font-match --rank <region> --text "..."` 從 Google Fonts 指紋索引中選取最接近裁剪形態的字型，加上 `--candidates` 指定名稱，以同一大寫高度和區域文字渲染，再按指紋距離排序，其 `USE` 行就是 CSS。瀏覽器不可解析時，記錄 catalog 最近字型並註明字號估算，仍以此為建置選擇。不得為了排序安裝瀏覽器，不得手工向 spec 寫 `chosen` 字型；門禁只接受 font-match 寫入結果。主文字區域未完成測量和排序時，spec 門禁拒絕關閉。

若 code kind 區域的 note 描述圖表、繪畫、照片、紋理等繪製材質，spec 會拒絕；應改為 plate，或在確由程式碼繪製時改寫 note。Regions 檔案若留下未命名墨跡也會被拒絕，因為沒被命名的內容永遠無法判定缺失。超過視覺稿四分之一大小的 `text` / `control` / `chrome` 也會被拒絕：那是列，不是元素。應分別命名內部元素；`container: true` 只用於真正不可分割的單一元素。

所有需要繪畫技巧的內容都是 plate：超過圖示預算的內聯 SVG（圖解、記譜、帶箭頭引線、藝術品“快速近似”）會在 hero 階段被拒絕；64px 以下、路徑很少的圖示 SVG 可以；頁面按即時資料繪製的 chart 是圖表，不是插畫。註釋繪畫的引線與箭頭屬於該繪畫 plate，只有標籤作為 text。按 [region-map.md](region-map.md) 的獨立變化原則拆分割槽域；帶框檢視由 frame plate 覆蓋獨立 image 區域。

視覺稿裁剪永遠不是 plate；它只是產生 plate 的參考，plates 門禁會拒絕對原區域重取樣。Plate box 必須留邊並完整容納藝術品；spec 會測量藝術品與邊緣接觸，拒絕切穿作品的 box。只有頁面確實在那裡裁切時才用 `bleed: true`，否則 `object-fit: cover` 會丟掉 box 已切失的一側。Spec 沒有的內容就不能出現在頁面：不得增加視覺稿未展示的邊框、分隔線、容器或 chrome。只有三類讓步：最接近且可獲得的字型；足夠接近的圖示 glyph（使用者指定圖示庫則精確匹配，但只覆蓋 pictogram，不覆蓋控制元件 chrome，chevron、arrow、dropdown 邊框/填充、button 形狀仍服從視覺稿）；以及拼寫錯誤等真實視覺稿缺陷。<!-- rule:skill-comp-spec -->

製作資源前檢查擬定 map：`impeccable comp-spec --comp <comp> --regions <file> --inspect-map` 會產生編號 overlay、精確裁剪、前景 mask 預覽和彙總報告，但不修改 spec 或建置狀態。同時檢查邊界和被排除畫素；空參考意味著幾何需修正。`parentId` 只命名包圍它的 `container`，不會刪除區域或批准資源。報告診斷幾何，不證明語義完整。

2. **plates。** 每個柵格區域都以 plate 交付：插畫、照片或人物根據視覺稿裁剪，以資源解析度重新產生，刪除 UI 文字並寫入其 `plate` 路徑；孤立墨跡、人物、物件使用原生透明 PNG，置於頁面自身底色上；照片和紋理保持不透明。紙、布、顆粒等紋理優先從區域乾淨補丁映象平鋪，只有不存在乾淨補丁時才產生。

`impeccable comp-spec --crop <id>` 寫參考裁剪；摳圖時把 `impeccable comp-spec --plate-prompt <id> --background transparent` 儲存為 prompt 檔案，其他情況使用 `--background opaque`。優先把裁剪與 prompt 交給原生影像工具，再執行 `impeccable embed-prompt <plate> --prompt-file <prompt.txt>`。API 回退為 `impeccable generate-image --ref <crop.png> --prompt-file <prompt.txt> --out <plate.png> --size <WxH> --quality high --background transparent`，全幅資源改用 opaque；先建立輸出目錄。在明暗背景上檢查真實 alpha、白色前景、細邊和透明孔洞，不要對原生輸出做色鍵摳圖。Plate 門禁會與視覺稿評分，也應目視檢查位置與尺度。

可並行時，產生隨附資源生產 Agent（`impeccable-asset-producer`；Codex 為 `impeccable_asset_producer`；Cursor 為 `/impeccable-asset-producer`；GitHub Copilot 指令為“Use the impeccable-asset-producer agent”），傳入 spec 路徑並讓其產出全部資源；無 sub-agent 時在目前執行緒產生。裁剪只是參考，絕不能成為交付畫素。門禁檢查每個 plate 存在、至少為區域尺寸 1.5 倍且看起來就是該區域。

頁面程式碼等待此門禁：plate 未存在前寫頁面，結果必然會用 CSS 繪製其材質。單檔案交付也不例外：同樣生產 plate，再內聯為 data URI。`--force` 只允許一種情況：使用者用明確文字降低 comp 權威，並把原話寫入 `--reason`；其他理由一律拒絕。<!-- rule:skill-plates-before-page --> 在評審開啟前先給 plate 評分。`build-phase advance` 只剩待評審時，執行 [component-review.md](component-review.md) 的計劃與資源評審，讓使用者檢查 plate 及哪些區域由程式碼繪製。批准後替換任何 plate 都要重開一輪。使用者接受前不得寫頁面程式碼，`build-phase advance` 會拒絕。<!-- rule:skill-human-component-review -->

3. **hero。** 先執行 `impeccable build-phase scaffold`，產生測量佈局 CSS 自定義屬性（`.impeccable/build/scaffold/layout.css` 中的 `--r-<id>-x/y/w/h`，值為視覺稿百分比，並在已測量時包含大寫高度、字號、字型、字重）和參考頁 `hero-reference.html`，其中每個區域位於其 box、每個 plate 已放置。把數值繫結到自己的語義結構，每個區域一個元素；參考頁只用於核對位置，不是最終頁面，重疊 box 就應重疊。

隨後只建置視覺稿尺寸的首屏，逐字複製獲批稿文案；使用者批准的是這張帶這些文字的圖，改寫只能在 hero 通過後明確決定，不能在階段中靜默發生。每個文字區域以測得大寫高度定字號並使用排序字型。Plate 優先：在任何文字或控制元件前，把每個 plate 放到 spec box，可使用 `object-fit: cover`、`<img>`、背景圖或以資源名標識的 data URI。捕獲到 `.impeccable/review/hero-repro.png`，先執行一次 `impeccable build-phase record hero`，確認沒有文字時 plate 區域已經匹配，再按 spec 配色和 box 疊加語義層並 advance。

門禁先拒絕原始碼未引用的任何 plate，再執行 `impeccable comp-diff`，向 `.impeccable/review/diff/hero/` 寫入並排圖、熱圖、逐區域成對裁剪和 `report.json`；`raw-report.json` 保留未解釋測量。報告和裁剪標籤使用門禁 verdict；即使區域標為 drift，`gate.reasons` 仍列剩餘阻斷。若 plate 檔案、測量區域或 comp 改變，已接受 plate 也會重驗。

總體達到 72% 且無硬否決才透過。硬否決包括缺失區域、與稿件矛盾的 plate/text block、SVG 插畫、被裁 plate，以及任何分數下的杜撰墨跡塊。過線後數值讀數變成隨透過一起列印的建議，應在 responsive 前的 polish 階段修復：門禁對照視覺稿讀取每個文字區域的大寫高度、行數、字重、墨色、位置，chrome 條的高度，以及視覺稿安靜位置裡出現的墨跡（kicker、多餘導航項、分隔線），並以數值說明偏差，如“實作大寫高度 78px，視覺稿 103px”；這些數字就是修改依據。

失敗時先按順序開啟列出的區域裁剪再編輯：`missing` 需補材質；`contradicted` 需從 spec box 重新推導結構；`drift` 才是尺寸與間距調整。重複嘗試不會消除未解決阻斷。三次失敗後，不再盲目迭代，而是展示 [component-review.md](component-review.md) 的首屏評審。使用者接受首屏後，只要捕獲仍匹配，總體閾值、配色檢查和數值讀數均降為建議；缺失/未引用 plate、SVG 插畫、有機裁剪、被裁 plate、杜撰墨跡和渲染存在性失敗仍會阻斷。捕獲偏離使用者接受版本時應恢復；該評審已經關閉，永不再次請求。這一步決定本輪野心成敗：在這裡重試花幾分鐘，結束時收到 rebuild 則損失整輪。<!-- rule:skill-hero-gate -->

4. **sections。** 在 spec 系統內建置其餘介面：保持同一圓角語言、線寬和配色，不加入視覺稿未展示的內容。視覺稿未覆蓋的區域繼承已記錄系統。
5. **motion。** 統一編排一次標誌性互動、揭示與動效，而非散落各處。
6. **responsive。** 完成其他視口，並檢查常見桌面寬度 1280–1600 下的首屏，而不只檢查 comp 精確尺寸：使用流式列，不能讓固定畫素網格窄一百畫素就換行。將 1440 寬全頁 `desktop.png` 和 390 寬 `mobile.png` 寫入 `.impeccable/review/`；門禁將桌面捕獲與 comp 比較，拒絕只能在 comp 原寬度成立的首屏。移動優先介面應以縱向 comp 開始，其 plate 也是為該畫幅產生。

### Code-led

沒有 comp，也無需道歉：野心存在於方向契約的 FIRST VIEWPORT 塊和具名標誌互動中，最終評審會在實際行為中核查這些承諾。獲選決策稿作為批評參照送入最終評審。

### 兩條路徑都適用

- **首屏是論點，不是頁頭。** 立即以該形式在真實生活中的尺度示範機制，不要把概念困在標準 hero 或 card 外殼。記憶測試：訪客看完一個視口就離開，一小時後會描述什麼？誠實答案若只是一種情緒，概念還未真正投入。
- **證明，不要宣稱。** 展示主題如何工作：執行中的介面、被戲劇化的機制、競品無法複製貼上的細節。示範資料是設計材料，可以完整保真地創作並標為合成；事實主張仍不可杜撰。
- **創作資源，絕不拿 chrome 頂替。** 優秀介面建立在精心製作的名稱、條目、文案、封面、縮圖和紋理之上。綠地專案中，詢問輪留下的每個空白都由你以生產級保真度補全：內容可創作，主張可標註，沒有章節可以省略。該放原創資源卻使用漸變、玻璃、通用圖示塊或多頂點 `clip-path` 多邊形，只是給缺口穿上 chrome；偵測器會標記後兩類。<!-- rule:skill-author-assets-not-chrome -->
- **發揮形式的 Web 優勢。** 選定世界若點名 canvas、WebGL、view transitions 或產生式動效，就實作技術本身，而非靜態模仿。
- **像工作室一樣安排滾動節奏。** 在同一語法中變化密度、尺度、影像、動效與留白；密集段落要換來安靜段落，頁面以真正收束結尾。全頁使用同一間距節奏，標題上方空間大於下方。
- **簡報暗示真實影像時，使用真實且已驗證的圖片。** 搜尋主題實體而非類別；一張決定性照片勝過五張平庸照片。驗證素材 URL 可訪問。
- **把動效當作材質創作。** 只集中編排一次該形式原生的動效，而非散落 hover 效果。限制高成本效果，預設保持內容可見。

保留語義、無障礙、效能、回應式、專案慣例和有效行為。

## 7. 檢查並完成

用一輪批次截圖檢查目標尺寸：Web 包含桌面和行動版；原生平臺（`ios` / `android` / `adaptive`）按對應平臺參考中“Verifying the build”的方式，從模擬器/模擬器捕獲各 OS 要求的裝置類別。若執行環境報告使用者實際視口（應用內瀏覽器尺寸或指定解析度），將該寬度加入集合；最先破壞的寬度就是使用者最先看到的寬度。

對照使用者請求和方向契約評審渲染，成批修復材質缺口，再用最後一輪確認。兩輪是上限，不能為每個微調獎勵一次截圖。Comp-led 建置執行 `{{scripts_path}}/impeccable comp-diff --comp <approved comp> --build .impeccable/review/desktop.png --spec .impeccable/build/spec.json --out-dir .impeccable/review/diff/final`，把區域行與成對裁剪作為評審依據。並排圖提供建置執行緒自己永遠不會擁有的視角；任何 `missing` 或 `contradicted` 區域都必須修復，無論憑記憶看起來多好。不能用單張全頁縮圖判斷保真度，它恰好隱藏最重要的失敗。Persuade 介面還要驗證模式是否達成任務：首次訪客應能在數秒內用該形式自身詞彙明白這是什麼、為何重要、下一步做什麼。

截圖只有有效時才是證據，傳送前必須驗證。先讓入場動效結束或關閉；因動畫時序隱藏的元素會被誤判為缺失，修復反而造成迴歸。全頁截圖從文件頂部開始；comp 對比按 comp 原始畫素尺寸捕獲。每個檔案都開啟一次，確認內容與檔名一致：不能黑屏、空白、檔名正確但展示錯誤章節，也不能半載入。畸形截圖會浪費整輪；評審器只返回 `disposition: recapture`，此前審查不產生約束。<!-- rule:skill-capture-validity -->

第二輪檢查後，建置執行緒的精修結束：不要繼續搜缺陷、寫微調指令碼或在這裡重建；剩餘問題交給新上下文，發現更準確且成本更低。Web 環境若沒有 design hook，在變更目標上執行一次 `{{scripts_path}}/impeccable detect --json`，修復機械性問題，將剩餘發現交給評審器；無 hook 又跳過偵測會把所有 hook 本應用於捕獲的痕跡一起釋出。原生平臺完全跳過偵測器，因為它只讀 HTML/CSS，無法判斷原生程式碼；評審器的品質底線檢查是唯一粗糙度門禁，輸入包必須說明。

截圖寫入 `.impeccable/review/`，每個視口一個檔案。Web 為 `desktop.png`、`mobile.png`，使用者視口參與檢查時另加 `user-<width>.png`；原生每種裝置類別一個，如 `phone.png`、`tablet.png`，adaptive 時按 OS 加字尾。環境未建立目錄時自行建立。傳給評審器的路徑就是其規範；輸入包明確列出每個已檢查視口為 required，路徑缺失時評審器也會在此目錄查詢。

隨後產生隨附最終評審 Agent：`impeccable-finish-reviewer`（Codex 為 `impeccable_finish_reviewer`；Cursor 為 `/impeccable-finish-reviewer`；GitHub Copilot 指令為“Use the impeccable-finish-reviewer agent”）。輸入包括原始請求、已確認回答、產物路徑、截圖路徑、方向契約、已有 hook 發現、QUALITY BAR 卡和獲批 comp 路徑。Code-led 沒有獲批 comp，應在該槽位傳入獲選決策稿，並明確標為批評參照。

Comp-led 還要傳建置狀態 `.impeccable/build/state.json`、spec，以及 `.impeccable/review/diff/hero/` 和 `.impeccable/review/diff/final/`；其並排圖、熱圖、區域對和 `report.json` 是保真證據。另傳 craft-floor 參考路徑。原生平臺傳平臺參考 [ios.md](ios.md) / [android.md](android.md)，adaptive 兩者都傳，並用一行說明未執行偵測器，使評審器按平臺慣例而非 Web 規則判斷。

評審器沒有瀏覽器；未傳的截圖就是它無法執行的檢查。產生前不要讀取隨附 Agent 定義，執行環境會在 spawn 時載入，只需負責完整輸入包。等待 Agent 時使用一次長超時，而非迴圈短輪詢；等待期間推進獨立步驟。驗證返回包含五個契約章節；recapture 返回只含一節，即重捕列表。空返回或明顯失控時，用同樣輸入重產生一次。

此評審絕不能在建置執行緒內執行，也不能繼承其上下文：以全新 reviewer、無 fork 對話歷史產生（Codex 使用 `fork_turns: 0`）。繼承轉錄會繼承建置者的框架、樂觀和抽象；評審所需一切都應隨輸入包傳入。只有完全不具備 sub-agent 能力的環境，才能完全退出建置上下文後，從 [degraded/finish-reviewer.md](degraded/finish-reviewer.md) 執行新的執行緒內替代評審。無論是替代還是失敗後替換，都要在結束時用一行披露，不能靜默。<!-- rule:skill-finish-separate-reviewer -->

嚴格按 disposition 單詞行動，只有四種：

- **recapture：** 失敗的是證據，不是建置。按 capture-validity 規則重捕返回指定內容，再用新證據執行完整評審。無效證據上的評審沒有約束力，其後不能直接執行 verdict pass。
- **rebuild：** 保真度整體失敗，無法靠補丁解決。跳過修復批次，立即重建：重新推導指定區域、產生指定資源，把結果送回新的完整評審，不做 verdict pass。重建會整體替換區域，因此整個矩陣要在重捕結果上重跑。告知使用者正在發生什麼，而不是請求修復失敗的許可。只有第二次收到 rebuild、需要並列展示兩個 verdict，或重建會刪除使用者已批准內容時才諮詢使用者。
- **ship：** 無欠項；按真實範圍報告結論，繼續文件 Agent。
- **fix：** 把實質修復一次性應用，建置一次，並以相同檔案重捕相同視口。重捕只能測位置、載入與溢位，不能判斷修復是否達到發現所要求的品質；因此把新截圖送回同一 reviewer，透過 Agent continuation 對每項實質修復評分 resolved、partial 或 unresolved。沒有 continuation 時，從 [degraded/finish-reviewer.md](degraded/finish-reviewer.md) 的 Verdict Pass 新鮮執行評分。

Partial/unresolved 項進入下一批修復、重捕和 verdict。無人值守執行最多兩輪；有人參與時由使用者決定上限，因此第二輪仍有未決項時，把表格交給使用者，讓其選擇按現狀釋出或投入下一輪。無論誰決定，只要某輪一個問題都未解決就立即停止。唯一工作清單是 reviewer 發現，不能重新開啟自己的缺陷搜尋。不得執行第二次偵測器。<!-- rule:skill-verdict-bounds-the-finish -->

Rebuild 與 fix 共享同一資源規則：兩者新建或替換的柵格圖仍屬於 [visualize.md](visualize.md)“Produce”部分規定的資源工作，必須像所有建置柵格圖一樣保留**來源證據**；本輪放棄的圖在同一批次刪除。送回評審或 verdict 前，對產物柵格圖所在目錄執行 `{{scripts_path}}/impeccable embed-prompt --scan <asset-dir...>`，處理報告的每個檔案：自產圖嵌入精確產生 prompt，來源圖、素材圖或已有圖嵌入 origin。Scan 只讀；刪除僅適用於本輪放棄的柵格圖，絕不能刪除 scan 標記的檔案。<!-- rule:skill-late-raster-provenance -->

以 reviewer 自己的 disposition 單詞、按其真實範圍報告最終 verdict。Verdict pass 只評價列出的修復：“reviewer 認為三項修復均 resolved”有證據支援；“不存在實質問題”沒有。仍有開放實質發現的表格絕不能宣佈透過、淡化，或偽裝成只評分修復清單以外的全介面批准。使用者若用自己的截圖或明確指出與 comp 的不匹配來反駁 ship，其證據優先於你製作的所有捕獲：把使用者材料加入輸入包，產生新 reviewer 執行新的完整評審。內聯打補丁再自我認證，只會讓被拒頁面釋出第二次。<!-- rule:skill-user-evidence-reopens-review -->

最後一次修正後，產生隨附文件 Agent `impeccable-documenter`（Codex 為 `impeccable_documenter`），輸入專案根目錄、產物路徑、方向契約、PRODUCT.md、[document.md](document.md) 和寫入邊界。沒有 sub-agent 時，寫入前載入 [degraded/documenter.md](degraded/documenter.md) 與 [document.md](document.md)。驗證結果：新世界與獲批系統變更必須同時產生帶 token 的 DESIGN.md 和 `.impeccable/design.json`，不能只有正文。普通擴充功能應把完成的建置與既有系統對比，保留其檔案並報告檢查證據；報告預先存在的漂移，不得未經請求修復。後續編輯後重新檢查。評審和文件都完成後才能結束。<!-- rule:skill-documenter-records-the-world -->

Comp-led 建置在最終回覆前執行 `{{scripts_path}}/impeccable build-phase finish --disposition <ship|fix|rebuild|recapture>`，記錄最終評審 disposition。若 `ship` 被拒絕，建置尚未完成；結合 verdict 報告仍開放的階段。
