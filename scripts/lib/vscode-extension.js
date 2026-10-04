import fs from 'node:fs';
import path from 'node:path';

import { rewritePluginMarkdownTree } from './plugin-paths.js';

const PROJECT_SCRIPTS = '.github/skills/impeccable/scripts';
const PROJECT_FALLBACK =
  `That base directory resolves every \`${PROJECT_SCRIPTS}/impeccable <verb>\` command in this skill and its references, ` +
  `and \`${PROJECT_SCRIPTS}\` is the fallback only when the runtime reports no base directory.`;
const PROJECT_FALLBACK_ZH =
  `该目录用于解析本 Skill 及引用文件里的所有 \`${PROJECT_SCRIPTS}/impeccable <verb>\` 命令，` +
  `只有运行时无法报告基目录时才使用 \`${PROJECT_SCRIPTS}\` 回退值。`;
const PROJECT_FALLBACK_ZH_TW =
  `該目錄用於解析本 Skill 及引用檔案裡的所有 \`${PROJECT_SCRIPTS}/impeccable <verb>\` 命令，` +
  `只有執行時無法報告基目錄時才使用 \`${PROJECT_SCRIPTS}\` 回退值。`;

// VS Code provides the loaded skill's URI, not Claude's substitution variables.
// Relative Markdown links resolve beside that file; shell commands still run
// from the user's project. Never fall back to another installed skill copy.
export function rewriteVSCodeMarkdown(content, { isSkillEntrypoint = false } = {}) {
  if (isSkillEntrypoint) {
    if (!content.includes(PROJECT_FALLBACK) && !content.includes(PROJECT_FALLBACK_ZH) && !content.includes(PROJECT_FALLBACK_ZH_TW)) {
      throw new Error('VS Code skill path rewrite drift: Setup fallback changed.');
    }
    content = content.replace(PROJECT_FALLBACK,
      'Resolve the installed directory from this skill’s [launcher](scripts/impeccable). ' +
      'Replace `<skill-base-dir>` with that absolute directory before running commands; it is not a shell variable.');
    content = content.replace(PROJECT_FALLBACK_ZH,
      '通过本 Skill 的[启动器](scripts/impeccable)确定安装目录。' +
      '运行命令前，把 `<skill-base-dir>` 替换为该绝对目录；它不是 shell 变量。');
    content = content.replace(PROJECT_FALLBACK_ZH_TW,
      '透過本 Skill 的[啟動器](scripts/impeccable)確定安裝目錄。' +
      '執行命令前，把 `<skill-base-dir>` 替換為該絕對目錄；它不是 shell 變數。');
  }
  return content.replaceAll(PROJECT_SCRIPTS, '<skill-base-dir>/scripts')
    .replace(/(?<!["\w/])<skill-base-dir>\/scripts\/impeccable(\.cmd)?(?=[\s`])/g,
      '"<skill-base-dir>/scripts/impeccable$1"');
}

/** Stage a declarative skill extension, independently of repo-install sidecars. */
export function stageVSCodeExtension(rootDir, distDir) {
  const source = path.join(distDir, 'github', '.github', 'skills', 'impeccable');
  const version = JSON.parse(fs.readFileSync(path.join(rootDir, '.claude-plugin/plugin.json'), 'utf8')).version;
  const extensionRoot = path.join(distDir, 'vscode');
  // Only this generated artifact is replaced. Never touch the user's editor.
  fs.rmSync(extensionRoot, { recursive: true, force: true });
  fs.mkdirSync(extensionRoot, { recursive: true });
  const skillDir = path.join(extensionRoot, 'skills', 'impeccable');
  fs.cpSync(source, skillDir, { recursive: true });
  rewritePluginMarkdownTree(skillDir, rewriteVSCodeMarkdown);

  const manifest = {
    name: 'impeccable',
    displayName: 'Impeccable',
    description: 'Design skills for GitHub Copilot: build, critique, audit, and refine interfaces.',
    version,
    publisher: 'renaissance-geek',
    license: 'Apache-2.0',
    homepage: 'https://impeccable.style',
    repository: { type: 'git', url: 'https://github.com/pbakaus/impeccable.git' },
    bugs: { url: 'https://github.com/pbakaus/impeccable/issues' },
    icon: 'icon.png',
    categories: ['AI'],
    keywords: ['copilot', 'design', 'skills', 'frontend', 'accessibility'],
    engines: { vscode: '^1.109.3' },
    extensionKind: ['workspace'],
    extensionDependencies: ['GitHub.copilot-chat'],
    capabilities: { untrustedWorkspaces: { supported: false }, virtualWorkspaces: false },
    contributes: { chatSkills: [{ path: './skills/impeccable/SKILL.md' }] },
  };
  fs.writeFileSync(path.join(extensionRoot, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.copyFileSync(path.join(rootDir, 'scripts/lib/assets/plugin-icon.png'), path.join(extensionRoot, 'icon.png'));
  fs.copyFileSync(path.join(rootDir, 'LICENSE'), path.join(extensionRoot, 'LICENSE'));
  fs.copyFileSync(path.join(rootDir, 'vscode/README.md'), path.join(extensionRoot, 'README.md'));
  fs.copyFileSync(path.join(rootDir, 'vscode/.vscodeignore'), path.join(extensionRoot, '.vscodeignore'));
  return extensionRoot;
}
