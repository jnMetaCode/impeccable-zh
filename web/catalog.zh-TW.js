export const project = Object.freeze({
  repository: 'https://github.com/jnMetaCode/impeccable-zh',
  upstreamCommit: '0d6b47ea19b63afe15e3f93a44d5d9fbbc6fd275',
  translated: 43,
  total: 43,
  commands: 24,
  rules: 61,
  buildTargets: 19,
});

export const providers = Object.freeze([
  { id: 'claude', build: 'claude-code', name: 'Claude Code', config: '.claude', featured: true },
  { id: 'codex', build: 'codex', name: 'Codex CLI', config: '.codex', featured: true },
  { id: 'cursor', build: 'cursor', name: 'Cursor', config: '.cursor', featured: true },
  { id: 'trae-cn', build: 'trae-cn', name: 'Trae 中國版', config: '.trae-cn', featured: true },
  { id: 'github', build: 'github', name: 'GitHub Copilot', config: '.github', featured: true },
  { id: 'gemini', build: 'gemini', name: 'Gemini CLI', config: '.gemini', featured: true },
  { id: 'agents', build: 'agents', name: 'Codex Repo Skills', config: '.agents' },
  { id: 'dsh', build: 'dsh', name: 'DeepSeek Harness', config: '.dsh' },
  { id: 'grok', build: 'grok', name: 'Grok Build', config: '.grok' },
  { id: 'opencode', build: 'opencode', name: 'OpenCode', config: '.opencode' },
  { id: 'kiro', build: 'kiro', name: 'Kiro', config: '.kiro' },
  { id: 'pi', build: 'pi', name: 'Pi', config: '.pi' },
  { id: 'qoder', build: 'qoder', name: 'Qoder', config: '.qoder' },
  { id: 'trae', build: 'trae', name: 'Trae', config: '.trae' },
  { id: 'rovo-dev', build: 'rovo-dev', name: 'Rovo Dev', config: '.rovodev' },
  { id: 'vibe', build: 'vibe', name: 'Mistral Vibe', config: '.vibe' },
  { id: 'veto', build: 'veto', name: 'Veto', config: '.veto' },
  { id: 'antigravity', build: 'antigravity', name: 'Antigravity', config: '.agent' },
  { id: 'hermes', build: 'hermes', name: 'Hermes Agent', config: '.hermes' },
]);

export const commands = Object.freeze([
  { name: 'init', category: '開始', title: '建立專案上下文', description: '訪談並寫入 PRODUCT.md，為後續設計工作建立長期事實。', target: '' },
  { name: 'craft', category: '建置', title: '完整設計與建置', description: '從需求塑形到視覺迭代，完成一條端到端的新工作流。', target: '功能描述' },
  { name: 'shape', category: '建置', title: '先規劃，再編碼', description: '透過多輪探索形成經確認的 UX/UI 設計簡報。', target: '功能' },
  { name: 'document', category: '系統', title: '記錄設計系統', description: '從現有程式碼產生顏色、字型、元件與氛圍一致的 DESIGN.md。', target: '' },
  { name: 'extract', category: '系統', title: '提取複用模式', description: '將重複的元件與設計 token 收斂進設計系統。', target: '範圍' },
  { name: 'critique', category: '評審', title: '設計評審', description: '評估層級、資訊架構、情緒、認知負荷並給出量化建議。', target: '頁面或元件' },
  { name: 'audit', category: '評審', title: '技術品質稽核', description: '檢查無障礙、效能、主題、回應式與反模式。', target: '範圍' },
  { name: 'polish', category: '評審', title: '上線前精修', description: '修復對齊、間距、一致性與微觀細節問題。', target: '頁面或元件' },
  { name: 'harden', category: '品質', title: '生產級加固', description: '覆蓋錯誤、國際化、文字溢位、極端資料與異常狀態。', target: '功能' },
  { name: 'optimize', category: '品質', title: '效能最佳化', description: '改善載入、渲染、動效、圖片和包體積。', target: '頁面' },
  { name: 'adapt', category: '品質', title: '多端調整', description: '處理斷點、流式佈局、觸控目標和跨裝置體驗。', target: '頁面 行動版' },
  { name: 'clarify', category: '內容', title: '澄清 UX 文案', description: '改進標籤、說明、錯誤訊息與操作回饋。', target: '頁面' },
  { name: 'typeset', category: '視覺', title: '排版最佳化', description: '修正字型、層級、字號、字重與中文可讀性。', target: '頁面' },
  { name: 'layout', category: '視覺', title: '佈局與節奏', description: '改善構圖、間距、對齊和視覺層級。', target: '頁面' },
  { name: 'colorize', category: '視覺', title: '策略性用色', description: '為過於單調的介面引入有目的的色彩。', target: '頁面' },
  { name: 'animate', category: '視覺', title: '目的性動效', description: '加入幫助理解與操作回饋的動效和微互動。', target: '功能' },
  { name: 'bolder', category: '風格', title: '增強視覺個性', description: '讓過於保守、平淡的設計更有衝擊力。', target: '頁面' },
  { name: 'quieter', category: '風格', title: '降低視覺噪音', description: '收斂過強、過滿或令人疲勞的視覺表達。', target: '頁面' },
  { name: 'distill', category: '風格', title: '刪繁就簡', description: '去掉非必要複雜度，讓核心任務更集中。', target: '頁面' },
  { name: 'delight', category: '風格', title: '增加愉悅細節', description: '加入剋制而難忘的個性、回饋和驚喜。', target: '功能' },
  { name: 'overdrive', category: '風格', title: '突破常規', description: '使用著色器、彈簧物理和滾動敘事等高階效果。', target: '頁面' },
  { name: 'onboard', category: '體驗', title: '最佳化新手體驗', description: '設計首次使用、空狀態、啟用路徑和漸進引導。', target: '流程' },
  { name: 'live', category: '迭代', title: '瀏覽器即時變體', description: '在執行頁面中選擇元素並即時比較設計方案。', target: '' },
  { name: 'generate', category: '迭代', title: '自動產生變體', description: '按指定元素和方向產生多個可切換方案。', target: '3 個大膽版本的定價卡片' },
]);

export function commandText(command) {
  return `/impeccable ${command.name}${command.target ? ` ${command.target}` : ''}`;
}

export function installSteps(providerId) {
  const provider = providers.find((item) => item.id === providerId) ?? providers[0];
  return [
    `git submodule add ${project.repository}.git .impeccable-zh`,
    'npm --prefix .impeccable-zh install --ignore-scripts',
    'npm --prefix .impeccable-zh run localization:build:zh-TW',
    `npx impeccable link --source=.impeccable-zh --providers=${provider.id}`,
  ];
}
