# /impeccable hooks

管理目前專案的**設計偵測器 hook**。

Hook 會在直接編輯設計相關檔案（`.tsx`、`.jsx`、`.html`、`.vue`、`.svelte`、`.astro`、`.css`、`.scss`、`.sass`、`.less`、`.ts`、`.js`）時執行 Impeccable 設計偵測器。Claude Code、Codex 和 GitHub Copilot 使用 post-tool-use hook，在編輯後向 Agent 上下文加入簡短系統提醒：發現問題時要求修正，仍有待辦時再次提醒，UI 類檔案無問題時給出簡短確認；設定 `hook.quiet` 可關閉確認。普通 `.ts`、`.js` 仍會掃描，但只在發現問題時發聲。Cursor 使用 `preToolUse`，在錯誤寫入落盤前阻止它，允許乾淨寫入時保持安靜。Grok Build 使用相同 PostToolUse 掃描標記觸碰過的檔案，再在 Stop 的 `additionalContext` 中展示發現；不要期待逐次編輯提醒，因為 Grok 會丟棄該 stdout。

偵測規則分兩層。逐次編輯 hook 只展示即時層：值得打斷編輯的機械、明確問題，例如圖片損壞、內容溢位或裁切、對比度和可讀性失敗、漸變文字、發光陰影、設計系統漂移。其他內容，如文案節奏、色板和排版品味、佈局節奏，推遲到 `Stop` hook 的深度檢查；它會對本會話觸碰的所有 UI 檔案執行完整規則集，並去重逐次編輯已報告的問題後統一展示。沒有剩餘問題時靜默停止。在 `.impeccable/config.json` 設定 `hook.perEditRules: "all"` 可恢復每次編輯執行完整規則集。Claude Code、Codex 和 Grok Build 支援原生 `Stop` 事件。Cursor 的 stop hook 分發不穩定，使用寫入前門禁；GitHub Copilot 的 stop 類事件無法把上下文傳回模型，所以兩者每次編輯仍執行完整偵測器。Grok 在 `end_turn` 後還會發送僅觀察的 `reason: "shutdown"` Stop；跳過它，只掃描 `end_turn`。

每個 hook 都是機械檢查。掃描器無法捕捉的設計反射位於 [craft-floor.md](craft-floor.md)，Skill 在編輯 UI 前會載入它，因此無論 hook 是否接線都適用。沒有自動 hook 的會話會從 `impeccable context` 獲得一次 `MANUAL_DETECTOR_REQUIRED` 指令，要求結束時執行一次偵測器。

本命令透過編輯 `.impeccable/config.json` 按**專案**開關 hook；hook 執行設定位於 `hook`，共享偵測器忽略項位於 `detector`。每位開發者的覆蓋項，包括 CLI 記錄的安裝同意決定 `hook.consent`，位於被 Git 忽略的 `.impeccable/config.local.json`。`hook.enabled: false` 關閉 hook；`hook.quiet: true` 隱藏乾淨/待辦確認；`hook.auditLog` 可指定 NDJSON 日誌路徑。舊環境變數 `IMPECCABLE_HOOK_DISABLED`、`IMPECCABLE_HOOK_QUIET`、`IMPECCABLE_HOOK_LOG` 仍有效，設定時優先於設定。

專案使用 Blade、Twig、ERB 或 Handlebars 時，在 **`detector.extensions`** 宣告服務端模板副檔名，否則 hook 會因不在內建列表而跳過。每個擴充功能一項：`{ "ext": ".blade.php", "engine": "html" }`。`engine` 選擇分析器，markup 模板用 `html`，JS/TS/CSS 類檔案用 `text`，預設為 `html`。按檔名結尾匹配，因此 `.blade.php`、`.html.erb` 等雙副檔名有效。設定只能增加副檔名，內建列表始終生效。

手動 `npx impeccable detect` 預設使用同一專案過濾設定：`detector.ignoreRules`、`detector.ignoreFiles`、`detector.ignoreValues`、`detector.designSystem.enabled`。`hook.enabled` 只控制自動 hook，不影響手動 CLI 掃描。`npx impeccable detect --no-config ...` 可執行忽略專案設定和上下文的原始偵測；`npx impeccable ignores ...` 可直接對相同忽略項執行 CLI CRUD。

支援的宿主：Claude Code（專案內 `.claude/settings.local.json`，被 Git 忽略，保持機器本地；移到共享 `settings.json` 的 hook 也會原位使用）、Codex（`.codex/hooks.json`）、Cursor（`.cursor/hooks.json`）、Grok Build（`.grok/hooks/impeccable.json`，需要 `/hooks-trust` 或 `--trust`）、GitHub Copilot（`.github/hooks/impeccable.json`，由 Copilot CLI 和雲 Agent 讀取的團隊共享提交檔案）。Copilot CLI 只會在該檔案提交到預設分支後觸發儲存庫級 hook。

在 **Cursor** 中，`preToolUse` 檢查擬議的 Write/Edit/Shell 寫入內容，只有真實偵測器發現問題時才拒絕。拒絕資訊作為工具錯誤對 Agent 可見，使其能在錯誤寫入落盤前重新考慮。

Gemini 會把會話與完成 hook 合併安裝到現有 `.gemini/settings.json`。允許註釋；帶註釋檔案在重寫前備份為 `settings.json.bak`，無效 JSON 保持不動。Gemini 不安裝逐次編輯偵測器 hook。`BeforeTool` 只重寫執行 `build-phase` 的 shell 命令，且僅限 macOS/Linux；Windows 上 Gemini 透過 PowerShell 執行 hook，session id 無法進入 shell，因此設計稿建置不會繫結會話，完成提醒保持安靜。

## 路由

第一個參數是 action，預設為 `status`。

| Action | 作用 |
|---|---|
| `status` | 輸出目前狀態、共享/本地設定路徑、忽略的規則/檔案/值和環境變數覆蓋。 |
| `on` | 在 `.impeccable/config.json` 設定 `enabled: true`，記錄本地 hook 同意，並在 Skill 已安裝時安裝或修復各 Provider manifest。 |
| `off` | 在 `.impeccable/config.json` 設定 `enabled: false`。 |
| `ignore-rule <id>` | 把 `<id>` 加入 `detector.ignoreRules`；`overused-font` 必須帶 `--all-values`。在整個專案中忽略該規則。 |
| `ignore-file <glob>` | 把 `<glob>` 加入 `detector.ignoreFiles`，對匹配檔案忽略**所有**規則。 |
| `ignore-value <id> <value> [--shared] [--reason "..."]` | 把規則/值忽略項加入共享 `.impeccable/config.json`。 |
| `ignore-value <id> <value> --local [--reason "..."]` | 把私有規則/值忽略項加入 `.impeccable/config.local.json`。 |
| `ignore-value <id> "*" --file <glob> [--file <glob>...]` | 只在匹配檔案中關閉某一規則，其他位置仍啟用。可重複 `--file`，或使用 `--file=<glob>` / `--files=<glob>`。沒有 `--file` 的裸 `"*"` 會被拒絕；確實要全專案關閉時使用 `ignore-rule <id>`。 |
| `reset` | 刪除專案設定、去重快取和 Cursor 待辦佇列，並從 `on` 安裝過的所有 Provider manifest 中移除 hook 條目，包括已提交的 Copilot 檔案；`on` 從未寫入的團隊共享 `settings.json` 不會被觸碰。 |

## 流程

1. 從使用者參數解析 action；未提供時使用 `status`。
2. 呼叫管理指令碼，逐字傳遞使用者輸出：

   ```bash
   {{scripts_path}}/impeccable hooks <action> [args...]
   ```

3. `<action>` 為 `off` 時，補充一句：“完成。在本專案執行 `{{command_prefix}}impeccable hooks on` 前，新編輯不會觸發設計 hook。”
4. `<action>` 為 `on` 時，補充：“完成。下次對 UI 檔案執行 Edit/Write 後，設計 hook 會觸發。”
5. `<action>` 為 `ignore-value`、`ignore-file` 或 `ignore-rule` 時，只打印指令碼輸出。預設範圍為共享 `.impeccable/config.json`；只有使用者明確要求私有例外時才加 `--local`。
6. `<action>` 為 `status` 時，只打印指令碼輸出。除非使用者提出後續問題，否則不要附加說明。

## 分診發現

Hook 自身從不寫入忽略設定；所有例外都透過 `impeccable hooks`。把每項發現分為三種結果：

- **真實設計問題**：修復。絕不要透過忽略來逃避修復或強行透過被阻止的寫入。
- **確定的誤報或獲准例外**：自行持久化範圍最窄的忽略項，並在回覆中披露。必須能指出證據，例如有意的 demo/fixture、用於展示錯誤設計的文件、字面或領域適當的運動（真實彈跳的小球），或使用者已經確認的選擇。透過 `--reason` 記錄為 `"<誰決定：證據>"`；只有使用者確實確認時才能寫“使用者確認”。
- **不確定**：保留 finding，用一句話詢問使用者。只問一次；一個簡短問題比 hook 在後續每次編輯中重複觸發成本更低。

自行處理的上限是 `ignore-value`。`ignore-file` 和 `ignore-rule` 會遮蔽過多內容，不能憑自己判斷新增；必須先詢問使用者。

優先使用範圍最窄的例外：

- Finding 行展示 `ignore-value <rule> <value>` 時，連同 `--reason` 傳給 `impeccable hooks ignore-value`；預設寫入共享設定。
- `overused-font`、`bounce-easing` 等值相關 finding 使用具體值的 `ignore-value`。不要為了某一種字型使用 `ignore-rule overused-font`。
- 沒有具體 value 命令的 finding，如 `side-tab`，把該規則限定到檔案：`ignore-value <id> "*" --file <path>`。先執行 `npx impeccable detect <path>` 確認該檔案實際觸發什麼。
- 只有整個檔案都不屬於設計評審範圍時才使用 `ignore-file <path>`，例如 fixture、產生產物、刻意展示粗糙設計的 demo。它會永久遮蔽該檔案的所有規則，包括未來規則。真實 UI 只有一個嘈雜規則時，應使用上述檔案範圍的 value 忽略。
- 只有使用者要求在整個專案遮蔽某規則時才使用 `ignore-rule <id>`。廣泛忽略 overused font 時，只有使用者要求忽略所有常用字型才能使用 `ignore-rule overused-font --all-values`。
- 預設優先使用設定忽略項，把例外集中在可審查位置。只有 waiver 必須隨單個檔案離開儲存庫時才使用內聯 comment，例如產生/匯出的獨立文件或郵件 HTML。支援 `impeccable-disable <rule>`（全檔案）和 `impeccable-disable-line` / `impeccable-disable-next-line`（單行），任何註釋語法都可用，可在 `:` 或 `--` 後附原因。偵測器預設識別；`--no-inline-ignores` 或 `--no-config` 會繞過。

值相關例外示例：

```bash
{{scripts_path}}/impeccable hooks ignore-value overused-font Inter --shared --reason "User confirmed Inter is intentional"
```

帶證據的自行例外示例：

```bash
{{scripts_path}}/impeccable hooks ignore-value bounce-easing bounce-ball --shared --reason "Agent: literal ball-bounce animation, bounce easing is the subject"
```

整條字型規則例外示例：

```bash
{{scripts_path}}/impeccable hooks ignore-rule overused-font --all-values --reason "User asked to ignore overused fonts generally"
```

仍值得檢查其他規則的單檔案單規則例外：

```bash
{{scripts_path}}/impeccable hooks ignore-value design-system-font-size "*" --file "src/overlay/widget.js" --reason "Injected widget builds its own type scale; DESIGN.md's ramp describes the site"
```

完全不在範圍內的整檔案例外：

```bash
{{scripts_path}}/impeccable hooks ignore-file "src/legacy/Card.tsx"
```

## 約束

- 本命令絕不要手動修改 `.impeccable/config.json` 或 `.impeccable/config.local.json`。必須透過 `impeccable hooks`，確保寫入經過驗證且檔案結構一致。唯一例外是 `detector.extensions` 沒有管理 action；使用者要求覆蓋模板技術棧時，只直接編輯 `.impeccable/config.json` 的該欄位，其他內容保持不動。
- 不要在此流程中編輯 `impeccable hook`、`impeccable hook-before-edit` 背後的 launcher 或 binary，它們屬於 Skill 管道。
- Cursor 可在偵測到真實問題時阻止擬議寫入。Claude Code、Codex 和 GitHub Copilot 不阻止編輯，而是在編輯後提醒。停用 hook 會同時停止阻止與提醒。
- Hook 隨 Impeccable Skill 打包，透過專案本地 manifest 安裝：`.claude/settings.local.json`、`.codex/hooks.json`、`.cursor/hooks.json`、`.github/hooks/impeccable.json`、`.gemini/settings.json`。Codex 首次使用時需要使用者透過 `/hooks` 批准。Cursor 中確認 Settings -> Hooks 已啟用。GitHub Copilot CLI 在檔案提交到預設分支後才載入 `.github/hooks/impeccable.json`，雲 Agent 直接從儲存庫讀取。

## 失敗模式

- `.impeccable/config.json` 或 `.impeccable/config.local.json` 無法讀取或格式錯誤時，hook 忽略該檔案，繼續使用其他有效設定或預設值。`impeccable hooks status` 會把格式錯誤檔案顯示為 ignored。
- 使用者要求全域性“disable the hook”時，先給出 `{{command_prefix}}impeccable hooks off`；它對目前專案持久生效，並在設定中寫入 `hook.enabled: false`。舊環境變數 `IMPECCABLE_HOOK_DISABLED=1` 仍可作為隨 shell 生效的一次性覆蓋。
