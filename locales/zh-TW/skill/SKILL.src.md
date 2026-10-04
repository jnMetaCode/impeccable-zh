---
name: impeccable
description: "當使用者想要設計、重新設計、規劃、評審、稽核、潤色、澄清、精簡、加固、最佳化、調整、新增動效、著色、提取或以其他方式改進前端介面時使用。覆蓋網站、著陸頁、儀表盤、產品 UI、應用外殼、元件、表單、設定、引導流程和空狀態。處理 UX 評審、視覺層級、資訊架構、認知負荷、無障礙、效能、回應式、主題、反模式、排版、字型、間距、佈局、對齊、顏色、動效、微互動、UX 文案、錯誤狀態、邊界情況、國際化以及可複用設計系統或 token。也適用於需要更大膽或更有愉悅感的平淡設計、需要收斂的喧鬧設計、瀏覽器中的即時 UI 迭代，以及應當展現高技術完成度的視覺效果。不用於純後端或非 UI 任務。"
argument-hint: "[{{command_hint}}] [target]"
user-invocable: true
allowed-tools:
  - Bash(npx impeccable *)
  - Bash({{scripts_path}}/impeccable *)
license: Apache 2.0
---

本 Skill 提供工具和明確授權，幫助你完成足以被稱為突破常規模板的設計。不要停留在安全、膽怯和機械的方案；應像優秀設計總監一樣處理每個任務：交付生產級程式碼，展現明確觀點和創造力，理解客戶與使用者需求，並保證出色的細節完成度。

核心原則：

- 全力完成，不含糊、不走捷徑。除非缺少只能由使用者提供的素材，否則交付物必須完整。
- 構想要大膽、鮮明、美觀並具有啟發性。
- 驗證必須有明確輪次上限，不能無限迴圈。網頁應將桌面端與行動版截圖合併成一輪，原生應用應一次覆蓋計劃釋出的裝置型別；完整建置後統一檢查、批次修復，再最多確認一次，然後停止打磨。無限自檢既消耗使用者成本，也不如獨立收尾評審可靠。

## 設定

1. 每個會話只執行一次 `<skill-base-dir>/scripts/impeccable context`。`<skill-base-dir>` 是包含本 SKILL.md 的 Skill 目錄，不是上兩級外掛根目錄；cwd 保持在使用者專案中。該目錄用於解析本 Skill 及引用檔案裡的所有 `{{scripts_path}}/impeccable <verb>` 命令，只有執行時無法報告基目錄時才使用 `{{scripts_path}}` 回退值。Windows shell 沒有 `sh` 時呼叫 `{{scripts_path}}/impeccable.cmd`。啟動器會運行同目錄下或首次使用時下載的獨立二進位制，不需要 Node 等執行時。使用者指定原始碼檔案或路由時傳入 `--target <path>`。它會載入 PRODUCT.md、DESIGN.md、對應介面簡報，以及適用的原生平臺指南；遵循輸出指令，不要重複執行。 <!-- rule:skill-setup-context -->
2. 載入目前請求的執行手冊：若使用者明確或隱含指定子命令，讀取 Commands 表對應引用；若是新介面或替換整個視覺體系，讀取 [reference/new-work.md](reference/new-work.md)。編輯前檢查目標和現有視覺事實。應用無法執行時，先檢查已提交的視覺迴歸基準或截圖 fixture；根據目前 token、CSS、元件和素材驗證目標與新鮮度，處理衝突並比較主題/變體截圖。 <!-- rule:skill-setup-command-ref --> <!-- rule:skill-setup-read-project -->
3. 分析與方向確定後、任何 UI 編輯之前，立即讀取 [reference/craft-floor.md](reference/craft-floor.md)，小型微調也不例外。它定義品質底線、絕對禁區和偵測器無法捕捉的設計判斷。只做規劃時不要載入。 <!-- rule:skill-craft-floor-load -->
4. 如果依賴、入口程式碼或元件標籤表明專案使用 Ant Design、Element Plus 或 TDesign，讀取 [reference/china-ui-frameworks-cn.md](reference/china-ui-frameworks-cn.md)，先確認具體技術棧和版本，再按框架公開 token 與設定入口工作。

**啟動器不可用：** 如果啟動器拒絕或失敗，必須在下一次工具呼叫前單獨傳送：“上下文載入未執行；我將直接讀取專案已有上下文。”然後讀取現有 PRODUCT.md 和 DESIGN.md，不虛構缺失資訊，繼續執行適用的第 2～3 步和允許的工具。啟動器失敗本身不阻止規劃或編輯。

## 如何設計

- **設計簡報優先。** 使用者已經指定審美、時代、材質、字型或配色時，即使與飽和度反模式警告衝突也應遵守。把清晰要求改成你的個人偏好屬於失敗。 <!-- rule:skill-brief-wins -->
- **最佳化保留，重設計替換。** 最佳化必須保留現有身份、行為、文案和範圍外內容；替換事實性文案或增加產品承諾前必須詢問。重設計保留產品事實、內容、功能、原生互動習慣和約束，但把舊外觀當作證據與反例；在 new-work 中選擇新的視覺體系並替換 DESIGN.md。不要把已經捨棄的方向與新方向折中混合。 <!-- rule:skill-world-change-semantics -->
- **視覺權威來自證據，而不是檔名。** 缺少 DESIGN.md 不等於全新專案；new-work 應判斷是保留、擴充功能還是替換現有視覺體系。 <!-- rule:skill-new-work-gate -->

## 模式

模式描述訪客在目前介面上怎樣才算成功。

- **說服（Persuade）：** 訪客需要做決定並採取行動，設計本身就是產品。適用於著陸頁、營銷頁、活動頁和定價頁。設計應贏得注意和行動；簡報需要真實圖片時就交付真實圖片，遵循已確認的視覺體系，而不是套用行業模板。 <!-- rule:brand-register-core -->
- **操作（Operate）：** 訪客需要完成任務。適用於應用 UI、儀表盤、編輯器、後台、設定和工具。可掃描性、一致性、平臺習慣和真實使用場景高於視覺表達，品牌體現在精準細節中。 <!-- rule:product-register-core -->
- **閱讀（Read）：** 訪客需要理解資訊。適用於文件、文章、指南、幫助和更新日誌。先為理解建立結構，再讓閱讀體驗值得停留。 <!-- rule:skill-read-register -->
- **體驗（Experience）：** 訪客置身於作品本身。適用於作品集、畫廊和展示專案。首屏就讓作品成為主角，介面退居其後。 <!-- rule:skill-experience-register -->

根據目前介面而不是整個產品選擇模式，並只把模式儲存在該介面簡報中。工具的著陸頁仍是說服模式；時尚品牌的文件仍是閱讀模式；文件索引屬於閱讀而不是說服。新介面參見 [new-work.md](reference/new-work.md)，操作/閱讀模式的深入說明參見 [operate.md](reference/operate.md)。 <!-- rule:skill-visitor-mode -->

## 命令

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | 建置 | 普通 new-work 請求的棄用別名 | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | 建置 | 編寫程式碼前規劃 UX/UI | [reference/shape.md](reference/shape.md) |
| `init` | 建置 | 將穩定的產品上下文寫入 PRODUCT.md | [reference/init.md](reference/init.md) |
| `document` | 建置 | 根據現有專案程式碼產生 DESIGN.md | [reference/document.md](reference/document.md) |
| `extract [target]` | 建置 | 把可複用 token 和元件提取到設計系統 | [reference/extract.md](reference/extract.md) |
| `critique [target]` | 評估 | 使用啟發式評分進行 UX 設計評審 | [reference/critique.md](reference/critique.md) |
| `audit [target]` | 評估 | 檢查無障礙、效能和回應式等技術品質 | [reference/audit.md](reference/audit.md) · 原生：[reference/audit.native.md](reference/audit.native.md) |
| `polish [target]` | 最佳化 | 釋出前完成最終品質檢查 | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | 最佳化 | 增強安全、平淡的設計 | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | 最佳化 | 收斂過於強烈或刺激的設計 | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | 最佳化 | 去除複雜度，保留本質 | [reference/distill.md](reference/distill.md) |
| `harden [target]` | 最佳化 | 補齊錯誤、國際化和邊界情況，達到生產要求 | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | 最佳化 | 設計首次使用、空狀態和啟用流程 | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | 增強 | 加入有目的的動畫與動效 | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | 增強 | 為單色介面加入有策略的顏色 | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | 增強 | 改善字型與排版層級 | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | 增強 | 修復間距、節奏和視覺層級 | [reference/layout.md](reference/layout.md) |
| `delight [target]` | 增強 | 加入個性與讓人記住的細節 | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | 增強 | 突破常規限制 | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | 修復 | 改善 UX 文案、標籤和錯誤資訊 | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | 修復 | 調整不同裝置和螢幕尺寸 | [reference/adapt.md](reference/adapt.md) · 原生：[reference/adapt.native.md](reference/adapt.native.md) |
| `optimize [target]` | 修復 | 診斷並修復 UI 效能 | [reference/optimize.md](reference/optimize.md) |
| `live` | 迭代 | 在瀏覽器中選取元素並迭代視覺方案 | [reference/live.md](reference/live.md) |
| `generate [n] [action] [element]` | 迭代 | 為指定元素產生可選擇的變體、版本或替代方案，無需手工挑選 | [reference/generate.md](reference/generate.md) |

路由： <!-- rule:skill-routing -->

- **無參數：** 讀取 [routing.md](reference/routing.md)，展示結合上下文的選單；絕不自動執行命令。
- **明確或清晰隱含要求執行命令：** 載入對應引用檔案（原生平臺使用 native 版本）並執行；若兩個命令都適用，只詢問一次。
- **詢問工作流或命令選擇：** 讀取 [工作流問題](reference/routing.md#工作流問題)。
- **其他情況：** 作為一般設計工作處理。新介面或替換視覺體系時，如果缺少 PRODUCT.md，先執行 init，再進入 new-work；針對現有程式碼的窄範圍最佳化則按 `impeccable context` 指令繼續，完成後建議 init，而不是因此阻塞。
- `teach` 是 `init` 的別名。`craft` 是普通 new-work 的棄用別名，不增加任何行為。`shape` 負責需求發現，只在需要確定視覺體系和介面概念時進入 new-work。

init 寫入 PRODUCT.md 後繼續目前流程，不要重新執行 `impeccable context`；如果記錄的平臺是 `ios`、`android` 或 `adaptive`，init 會自行載入原生平臺引用。

**Pin / Unpin：** `{{scripts_path}}/impeccable pin <pin|unpin> <command>` 建立或移除獨立的 `{{command_prefix}}<command>` 快捷命令。簡潔報告指令碼結果；出錯時原樣轉述 stderr。

**Hooks：** `{{command_prefix}}impeccable hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>` 管理專案的設計偵測 hook。它會在 UI 檔案編輯後自動執行偵測器並展示結果。使用者帶任意參數呼叫時，載入 [reference/hooks.md](reference/hooks.md)。

**Doctor：** `{{command_prefix}}impeccable doctor` 檢查並修復專案 Impeccable 產物（PRODUCT.md、DESIGN.md 及 sidecar、設定、介面簡報和 hook）與目前版本之間的漂移。使用者主動呼叫，或詢問哪些內容過期、陳舊、需要重新整理時，載入 [reference/doctor.md](reference/doctor.md)。設定階段輸出的 `CONTEXT_STALE` 是同一報告的輕量子集；按其自身指令處理，不要擅自再執行 doctor。 <!-- rule:skill-doctor-route -->

**絕不能把修復漂移當成設計任務的副作用。** 除非使用者要求，否則只報告 `CONTEXT_STALE`，不直接處理。唯一例外是標為 `auto` 的發現，因為下一次寫入該檔案時本來就會自動處理。 <!-- rule:skill-drift-not-a-side-quest -->
