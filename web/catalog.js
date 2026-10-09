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
  { id: 'trae-cn', build: 'trae-cn', name: 'Trae 国内版', config: '.trae-cn', featured: true },
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
  { name: 'init', category: '开始', title: '建立项目上下文', description: '访谈并写入 PRODUCT.md，为后续设计工作建立长期事实。', target: '' },
  { name: 'craft', category: '构建', title: '兼容旧版命令', description: '已弃用的兼容别名；新任务直接描述需求即可，不增加独立行为。', target: '功能描述' },
  { name: 'shape', category: '构建', title: '先规划，再编码', description: '通过多轮探索形成经确认的 UX/UI 设计简报。', target: '功能' },
  { name: 'document', category: '系统', title: '记录设计系统', description: '从现有代码生成颜色、字体、组件与氛围一致的 DESIGN.md。', target: '' },
  { name: 'extract', category: '系统', title: '提取复用模式', description: '将重复的组件与设计令牌收敛进设计系统。', target: '范围' },
  { name: 'critique', category: '评审', title: '设计评审', description: '评估层级、信息架构、情绪、认知负荷并给出量化建议。', target: '页面或组件' },
  { name: 'audit', category: '评审', title: '技术质量审计', description: '检查无障碍、性能、主题、响应式与反模式。', target: '范围' },
  { name: 'polish', category: '评审', title: '上线前精修', description: '修复对齐、间距、一致性与微观细节问题。', target: '页面或组件' },
  { name: 'harden', category: '质量', title: '生产级加固', description: '覆盖错误、国际化、文本溢出、极端数据与异常状态。', target: '功能' },
  { name: 'optimize', category: '质量', title: '性能优化', description: '改善加载、渲染、动效、图片和包体积。', target: '页面' },
  { name: 'adapt', category: '质量', title: '多端适配', description: '处理断点、流式布局、触摸目标和跨设备体验。', target: '页面 手机端' },
  { name: 'clarify', category: '内容', title: '澄清 UX 文案', description: '改进标签、说明、错误消息与操作反馈。', target: '页面' },
  { name: 'typeset', category: '视觉', title: '排版优化', description: '修正字体、层级、字号、字重与中文可读性。', target: '页面' },
  { name: 'layout', category: '视觉', title: '布局与节奏', description: '改善构图、间距、对齐和视觉层级。', target: '页面' },
  { name: 'colorize', category: '视觉', title: '策略性用色', description: '为过于单调的界面引入有目的的色彩。', target: '页面' },
  { name: 'animate', category: '视觉', title: '目的性动效', description: '加入帮助理解与操作反馈的动效和微交互。', target: '功能' },
  { name: 'bolder', category: '风格', title: '增强视觉个性', description: '让过于保守、平淡的设计更有冲击力。', target: '页面' },
  { name: 'quieter', category: '风格', title: '降低视觉噪音', description: '收敛过强、过满或令人疲劳的视觉表达。', target: '页面' },
  { name: 'distill', category: '风格', title: '删繁就简', description: '去掉非必要复杂度，让核心任务更集中。', target: '页面' },
  { name: 'delight', category: '风格', title: '增加愉悦细节', description: '加入克制而难忘的个性、反馈和惊喜。', target: '功能' },
  { name: 'overdrive', category: '风格', title: '突破常规', description: '使用着色器、弹簧物理和滚动叙事等高阶效果。', target: '页面' },
  { name: 'onboard', category: '体验', title: '优化新手体验', description: '设计首次使用、空状态、激活路径和渐进引导。', target: '流程' },
  { name: 'live', category: '迭代', title: '浏览器实时变体', description: '在运行页面中选择元素并实时比较设计方案。', target: '' },
  { name: 'generate', category: '迭代', title: '自动生成变体', description: '按指定元素和方向生成多个可切换方案。', target: '3 个大胆版本的定价卡片' },
]);

export function commandText(command) {
  return `/impeccable ${command.name}${command.target ? ` ${command.target}` : ''}`;
}

export function installSteps(providerId) {
  const provider = providers.find((item) => item.id === providerId) ?? providers[0];
  return [
    `git submodule add ${project.repository}.git .impeccable-zh`,
    'npm --prefix .impeccable-zh install --ignore-scripts',
    'npm --prefix .impeccable-zh run localization:build',
    `npx impeccable link --source=.impeccable-zh --providers=${provider.id}`,
  ];
}
