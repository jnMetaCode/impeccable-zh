Live 模式的一次性项目设置。只有当 `impeccable live` 报告 `config_missing` / `config_invalid`、需要处理 `configDrift`，或配置缺少 `cspChecked` 时，才从 [live.md](live.md) 加载。它不属于每次会话的高频路径。

## 编写配置

在启动报告的 `path` 创建文件，默认为 `.impeccable/live/config.json`：

```json
{
  "files": ["<path-or-glob>", "<path-or-glob>", ...],
  "exclude": ["<optional-glob>", ...],
  "insertBefore": "</body>",
  "commentSyntax": "html",
  "cspChecked": true
}
```

`files` 是注入目标：**浏览器实际加载的 HTML 文件**，不一定是源码；是否被 Git 跟踪或由构建生成在这里不重要，wrap 有自己的生成文件保护。条目是字面路径或 glob。可选的 `exclude` 跳过原本会被 `files` glob 匹配的文件，如邮件模板和演示 fixture。`cspChecked` 表示已经执行下文 CSP 步骤；首次设置时不存在。

**硬排除路径（不可覆盖）：** `**/node_modules/**` 和 `**/.git/**`；向这些目录注入会修改第三方代码。

**Glob 语法：** `**` 匹配任意数量的路径段（包括零段），`*` 匹配单个路径段内的内容，`?` 匹配一个字符。路径相对于项目根目录，使用正斜杠。

| 框架 | `files` | `insertBefore` | `commentSyntax` |
|-----------|---------|----------------|-----------------|
| 单壳 SPA（Vite / React / 纯 HTML） | `["index.html"]` | `</body>` | `html` |
| Next.js（App Router） | `["app/layout.tsx"]` | `</body>` | `jsx` |
| Next.js（Pages） | `["pages/_document.tsx"]` | `</body>` | `jsx` |
| Nuxt | `["app.vue"]` | `</body>` | `html` |
| Svelte / SvelteKit | `["src/app.html"]` | `</body>` | `html` |
| TanStack Router（SPA、Vite） | `["index.html"]` | `</body>` | `html` |
| TanStack Start（SSR） | `["src/routes/__root.tsx"]` | `<Scripts` | `jsx` |
| Astro | `[" <root layout .astro>"]` | `</body>` | `html` |
| 多页面（每个路由独立 HTML） | 对提供服务的目录使用 `["public/**/*.html"]` glob | `</body>` | `html` |

选择每个文件都存在的锚点，通常使用 `</body>`；`insertAfter` 在匹配行后插入。多页面站点优先使用 glob，让新页面自动纳入。页面由生成器重建时，注入只保留到下次生成；每次构建后重新运行 `impeccable live`。accept 不受影响，它会通过回退流程写入真实源码。

**框架适配器（注入时自动检测）。** 每次注入都会在 `.impeccable/live/inject-journal.json` 记录写入内容；下次注入或移除会修复崩溃或在错误目录停止所遗留的产物。SvelteKit、Nuxt 和 TanStack Start 在服务端渲染文档壳，因此入口模板中的原始 `<script>` 无法可靠执行；`impeccable live-inject` 会检测它们并使用专用适配器：SvelteKit 使用 `+layout.svelte` 中仅开发环境启用的根组件；Nuxt 使用仅开发环境启用的 `.client.ts` 插件；TanStack Start 在 `__root` 中使用生成的、仅开发环境启用的 `ImpeccableLiveRoot` 组件。`files` 仍作为有效的检测和 CSP 提示，但不是实际插入位置。普通 TanStack Router SPA 使用标准 Vite 路径。

## 配置漂移

每次启动都会扫描常见页面根目录（`public/`、`src/`、`app/`、`pages/`）下未被解析后 `files` 覆盖的 HTML 文件，并以带提示的 `configDrift.orphans` 返回。每个会话只向用户说明一次哪些文件未覆盖，并提议加入它们或把 `files` 改为 glob。绝不要自动更新配置；由用户决定。没有漂移时 `configDrift` 为 `null`。

## CSP 检测（仅首次）

以下所有放行都必须仅限开发环境，包括手动 middleware 和 meta tag 修改。不要为了加载 localhost helper 而修改线上生产站点 CSP；生产环境检查替代方案见 [live.md](live.md)。

如果 `config.cspChecked === true`，跳过整节；用户已经被询问过一次。

```bash
{{scripts_path}}/impeccable detect-csp
```

输出 `{ shape, signals }`；shape 表示**补丁机制**，因此一套模板可以覆盖多个框架：

- **`null`**：没有 CSP；写入 `cspChecked: true` 并结束。
- **`append-arrays`**：CSP 使用结构化 directive 数组，可以自动修补，例如包含 `additionalScriptSrc`/`additionalConnectSrc` 的 monorepo helper、SvelteKit `kit.csp.directives`、Nuxt `nuxt-security`。
- **`append-string`**：CSP 是字面字符串，可以自动修补，例如内联的 Next.js `headers()`、Nuxt `routeRules`。
- **`middleware`** / **`meta-tag`**：可以检测，但不自动修改。向用户展示检测到的文件，请其手动把 `http://localhost:8400` 加入 `script-src` 和 `connect-src`，然后标记 `cspChecked: true` 并继续。

### 同意提示（使用以下措辞）

> **需要 CSP 补丁。** 我检测到项目中的 Content Security Policy 阻止了 `http://localhost:8400`；不放行时，Live 选择器无法加载。我会进行以下修改：
>
> ```diff
> [file: <patchTarget>]
> [exact diff, 2-5 lines]
> ```
>
> 修改受 `NODE_ENV === "development"` 保护，因此额外条目只在开发环境出现，绝不会进入生产环境。随时可以通过还原该文件移除。是否应用？[y/n]

用户回答“no”时：跳过补丁，说明手动加入放行前 Live 无法工作，但仍写入 `cspChecked: true`，因为问题已经问过。回答“yes”时：按以下 shape 应用补丁，再写入 `cspChecked: true`。

### append-arrays

在保存 CSP 数组的文件顶部附近声明变量，再把 `...__impeccableLiveDev` 追加到 script-src 和 connect-src 数组：

```ts
// Dev-only allowance so impeccable live mode can load. Guarded by NODE_ENV.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? ["http://localhost:8400"] : [];
```

各框架位置：Next.js + monorepo helper 应编辑**应用自身**的 `next.config.*`，而不是共享 helper，并追加到 `additionalScriptSrc` / `additionalConnectSrc`。SvelteKit 编辑 `svelte.config.js` 中的 `kit.csp.directives['script-src']` 和 `['connect-src']`。Nuxt + nuxt-security 编辑 `nuxt.config.*` 中的 `security.headers.contentSecurityPolicy['script-src']` 和 `['connect-src']`。参考输出：[nextjs-turborepo/expected-after-patch.ts](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nextjs-turborepo/expected-after-patch.ts)、[sveltekit-csp/expected-after-patch.js](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/sveltekit-csp/expected-after-patch.js)。幂等性：文件中已有 `__impeccableLiveDev` 表示补丁已经应用，只需标记 `cspChecked: true`。

### append-string

分两处修改：声明一个仅开发环境使用的字符串，再把它插入两个 directive 的 CSP 值中；字符串带前导空格以便干净拼接，编辑时把字面值转换为模板字符串：

```ts
// Dev-only allowance so impeccable live mode can load.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";
```

- `script-src 'self' 'unsafe-inline'` 变为 `` `script-src 'self' 'unsafe-inline'${__impeccableLiveDev}` ``
- `connect-src 'self'` 变为 `` `connect-src 'self'${__impeccableLiveDev}` ``

各框架位置：Next.js 编辑 `next.config.*` 中的内联 `headers()`；Nuxt 编辑 `nuxt.config.*` 中的 `routeRules['/**'].headers['Content-Security-Policy']`。参考输出：[nextjs-inline-csp/expected-after-patch.js](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nextjs-inline-csp/expected-after-patch.js)、[nuxt-csp/expected-after-patch.ts](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nuxt-csp/expected-after-patch.ts)。

## 故障排查

如果用户曾拒绝 CSP 补丁，之后又报告 Live 无法工作：其开发环境 CSP 正在阻止 `http://localhost:8400`。从 `.impeccable/live/config.json` 删除 `cspChecked`，重新运行 `impeccable live`；设置流程会再次询问。

设置完成后，重新运行 `impeccable live`。
