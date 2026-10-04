Live 模式的一次性專案設定。只有當 `impeccable live` 報告 `config_missing` / `config_invalid`、需要處理 `configDrift`，或設定缺少 `cspChecked` 時，才從 [live.md](live.md) 載入。它不屬於每次會話的高頻路徑。

## 編寫設定

在啟動報告的 `path` 建立檔案，預設為 `.impeccable/live/config.json`：

```json
{
  "files": ["<path-or-glob>", "<path-or-glob>", ...],
  "exclude": ["<optional-glob>", ...],
  "insertBefore": "</body>",
  "commentSyntax": "html",
  "cspChecked": true
}
```

`files` 是注入目標：**瀏覽器實際載入的 HTML 檔案**，不一定是原始碼；是否被 Git 跟蹤或由建置產生在這裡不重要，wrap 有自己的產生檔案保護。條目是字面路徑或 glob。可選的 `exclude` 跳過原本會被 `files` glob 匹配的檔案，如郵件模板和示範 fixture。`cspChecked` 表示已經執行下文 CSP 步驟；首次設定時不存在。

**硬排除路徑（不可覆蓋）：** `**/node_modules/**` 和 `**/.git/**`；向這些目錄注入會修改第三方程式碼。

**Glob 語法：** `**` 匹配任意數量的路徑段（包括零段），`*` 匹配單個路徑段內的內容，`?` 匹配一個字元。路徑相對於專案根目錄，使用正斜槓。

| 框架 | `files` | `insertBefore` | `commentSyntax` |
|-----------|---------|----------------|-----------------|
| 單殼 SPA（Vite / React / 純 HTML） | `["index.html"]` | `</body>` | `html` |
| Next.js（App Router） | `["app/layout.tsx"]` | `</body>` | `jsx` |
| Next.js（Pages） | `["pages/_document.tsx"]` | `</body>` | `jsx` |
| Nuxt | `["app.vue"]` | `</body>` | `html` |
| Svelte / SvelteKit | `["src/app.html"]` | `</body>` | `html` |
| TanStack Router（SPA、Vite） | `["index.html"]` | `</body>` | `html` |
| TanStack Start（SSR） | `["src/routes/__root.tsx"]` | `<Scripts` | `jsx` |
| Astro | `[" <root layout .astro>"]` | `</body>` | `html` |
| 多頁面（每個路由獨立 HTML） | 對提供服務的目錄使用 `["public/**/*.html"]` glob | `</body>` | `html` |

選擇每個檔案都存在的錨點，通常使用 `</body>`；`insertAfter` 在匹配行後插入。多頁面站點優先使用 glob，讓新頁面自動納入。頁面由產生器重建時，注入只保留到下次產生；每次建置後重新執行 `impeccable live`。accept 不受影響，它會透過回退流程寫入真實原始碼。

**框架介面卡（注入時自動偵測）。** 每次注入都會在 `.impeccable/live/inject-journal.json` 記錄寫入內容；下次注入或移除會修復崩潰或在錯誤目錄停止所遺留的產物。SvelteKit、Nuxt 和 TanStack Start 在服務端渲染文件殼，因此入口模板中的原始 `<script>` 無法可靠執行；`impeccable live-inject` 會偵測它們並使用專用介面卡：SvelteKit 使用 `+layout.svelte` 中僅開發環境啟用的根元件；Nuxt 使用僅開發環境啟用的 `.client.ts` 外掛；TanStack Start 在 `__root` 中使用產生的、僅開發環境啟用的 `ImpeccableLiveRoot` 元件。`files` 仍作為有效的偵測和 CSP 提示，但不是實際插入位置。普通 TanStack Router SPA 使用標準 Vite 路徑。

## 設定漂移

每次啟動都會掃描常見頁面根目錄（`public/`、`src/`、`app/`、`pages/`）下未被解析後 `files` 覆蓋的 HTML 檔案，並以帶提示的 `configDrift.orphans` 返回。每個會話只向使用者說明一次哪些檔案未覆蓋，並提議加入它們或把 `files` 改為 glob。絕不要自動更新設定；由使用者決定。沒有漂移時 `configDrift` 為 `null`。

## CSP 偵測（僅首次）

以下所有放行都必須僅限開發環境，包括手動 middleware 和 meta tag 修改。不要為了載入 localhost helper 而修改線上生產站點 CSP；生產環境檢查替代方案見 [live.md](live.md)。

如果 `config.cspChecked === true`，跳過整節；使用者已經被詢問過一次。

```bash
{{scripts_path}}/impeccable detect-csp
```

輸出 `{ shape, signals }`；shape 表示**補丁機制**，因此一套模板可以覆蓋多個框架：

- **`null`**：沒有 CSP；寫入 `cspChecked: true` 並結束。
- **`append-arrays`**：CSP 使用結構化 directive 陣列，可以自動修補，例如包含 `additionalScriptSrc`/`additionalConnectSrc` 的 monorepo helper、SvelteKit `kit.csp.directives`、Nuxt `nuxt-security`。
- **`append-string`**：CSP 是字面字串，可以自動修補，例如內聯的 Next.js `headers()`、Nuxt `routeRules`。
- **`middleware`** / **`meta-tag`**：可以偵測，但不自動修改。向使用者展示偵測到的檔案，請其手動把 `http://localhost:8400` 加入 `script-src` 和 `connect-src`，然後標記 `cspChecked: true` 並繼續。

### 同意提示（使用以下措辭）

> **需要 CSP 補丁。** 我偵測到專案中的 Content Security Policy 阻止了 `http://localhost:8400`；不放行時，Live 選擇器無法載入。我會進行以下修改：
>
> ```diff
> [file: <patchTarget>]
> [exact diff, 2-5 lines]
> ```
>
> 修改受 `NODE_ENV === "development"` 保護，因此額外條目只在開發環境出現，絕不會進入生產環境。隨時可以透過還原該檔案移除。是否應用？[y/n]

使用者回答“no”時：跳過補丁，說明手動加入放行前 Live 無法工作，但仍寫入 `cspChecked: true`，因為問題已經問過。回答“yes”時：按以下 shape 應用補丁，再寫入 `cspChecked: true`。

### append-arrays

在儲存 CSP 陣列的檔案頂部附近宣告變數，再把 `...__impeccableLiveDev` 追加到 script-src 和 connect-src 陣列：

```ts
// Dev-only allowance so impeccable live mode can load. Guarded by NODE_ENV.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? ["http://localhost:8400"] : [];
```

各框架位置：Next.js + monorepo helper 應編輯**應用自身**的 `next.config.*`，而不是共享 helper，並追加到 `additionalScriptSrc` / `additionalConnectSrc`。SvelteKit 編輯 `svelte.config.js` 中的 `kit.csp.directives['script-src']` 和 `['connect-src']`。Nuxt + nuxt-security 編輯 `nuxt.config.*` 中的 `security.headers.contentSecurityPolicy['script-src']` 和 `['connect-src']`。參考輸出：[nextjs-turborepo/expected-after-patch.ts](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nextjs-turborepo/expected-after-patch.ts)、[sveltekit-csp/expected-after-patch.js](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/sveltekit-csp/expected-after-patch.js)。冪等性：檔案中已有 `__impeccableLiveDev` 表示補丁已經應用，只需標記 `cspChecked: true`。

### append-string

分兩處修改：宣告一個僅開發環境使用的字串，再把它插入兩個 directive 的 CSP 值中；字串帶前導空格以便乾淨拼接，編輯時把字面值轉換為模板字串：

```ts
// Dev-only allowance so impeccable live mode can load.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";
```

- `script-src 'self' 'unsafe-inline'` 變為 `` `script-src 'self' 'unsafe-inline'${__impeccableLiveDev}` ``
- `connect-src 'self'` 變為 `` `connect-src 'self'${__impeccableLiveDev}` ``

各框架位置：Next.js 編輯 `next.config.*` 中的內聯 `headers()`；Nuxt 編輯 `nuxt.config.*` 中的 `routeRules['/**'].headers['Content-Security-Policy']`。參考輸出：[nextjs-inline-csp/expected-after-patch.js](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nextjs-inline-csp/expected-after-patch.js)、[nuxt-csp/expected-after-patch.ts](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nuxt-csp/expected-after-patch.ts)。

## 故障排查

如果使用者曾拒絕 CSP 補丁，之後又報告 Live 無法工作：其開發環境 CSP 正在阻止 `http://localhost:8400`。從 `.impeccable/live/config.json` 刪除 `cspChecked`，重新執行 `impeccable live`；設定流程會再次詢問。

設定完成後，重新執行 `impeccable live`。
