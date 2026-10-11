#!/usr/bin/env node
// AI-assisted profile update. Reads the current remote README and preserves unrelated sections.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repository = 'jnMetaCode/jnMetaCode';
const badge = (name) => `[![Star 数量](https://img.shields.io/github/stars/jnMetaCode/${name}?style=flat&label=⭐)](https://github.com/jnMetaCode/${name}/stargazers)`;

export function tutorialTable() {
  const tutorials = [
    ['ai-coding-guide', 'AI 编程实战指南：66 个 Claude Code 技巧 + 10 款工具最佳实践'],
    ['ai-coding-trilogy', 'AI 编程三卷书（入门 / 工作流 / 架构，中英双语 PDF）'],
    ['ai-shortfilm-prompts', 'AI 短片《丧尸清道夫》方法论 + 提示词（Sora / 可灵 / 即梦通用）'],
  ];
  return [
    '| 项目 | 内容 | Stars |',
    '|---|---|---|',
    ...tutorials.map(([name, description]) => `| [${name}](https://github.com/jnMetaCode/${name}) | ${description} | ${badge(name)} |`),
  ].join('\n');
}

function replaceSection(source, title, replacement, required = true) {
  const headings = [...source.matchAll(/^#{1,6} .*$/gm)];
  const matches = headings.filter((heading) => title.test(heading[0]));
  assert.ok(matches.length <= 1, 'Ambiguous section; review the remote README manually.');
  if (!matches.length) {
    assert.ok(!required, 'Expected section missing; review the remote README manually.');
    return source;
  }
  const heading = matches[0];
  const next = headings.find((item) => item.index > heading.index);
  const end = next?.index ?? source.length;
  const updated = typeof replacement === 'function' ? replacement(source.slice(heading.index, end)) : replacement;
  return source.slice(0, heading.index) + updated + source.slice(end);
}

export function updateProfile(source) {
  let result = replaceSection(source, /评估驱动的.*应用工程/, '', false);
  result = replaceSection(result, /local-agent-toolkit.*本地三件套|本地 Agent 工具箱/, [
    '#### 🛠️ 本地 Agent 工具箱',
    '',
    '[**local-agent-toolkit**](https://github.com/jnMetaCode/local-agent-toolkit)：给 Agent 加上本地记忆 **engram**、技能管理 **skillet** 和运行追踪 **tracelet**。三个工具可独立使用，也提供组合演示；支持通过 `npx` 运行，无需手动全局安装。',
    '',
    'Claude Code 用户按[套件安装说明](https://github.com/jnMetaCode/local-agent-toolkit#install-as-a-claude-code-plugin-one-command)添加市场并安装插件。追踪面板需要另行启动 tracelet，并接入 tracing。',
    '',
    '',
  ].join('\n'));

  const rows = result.split('\n');
  for (let index = 0; index < rows.length; index++) {
    if (/^\|\s*项目\s*\|\s*它能帮你干嘛\s*\|\s*\|\s*$/.test(rows[index])) {
      rows[index] = '| 项目 | 它能帮你干嘛 | Stars |';
    }
  }
  const anchor = rows.findIndex((line) => /\]\(https:\/\/github\.com\/jnMetaCode\/superpowers-zh\)/.test(line) && line.includes('|'));
  assert.ok(anchor >= 0, 'Main project table not found; review the remote README manually.');
  const cellCount = rows[anchor].replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').length;
  const cells = [
    '[impeccable-zh](https://github.com/jnMetaCode/impeccable-zh)',
    '**Impeccable 中文增强版**：中文排版、UX 文案与国内 UI 框架指导，提供简繁体内容与设计工作流；当前 Alpha，从源码安装',
  ];
  for (let index = cells.length; index < cellCount; index++) cells.push(index === 2 ? badge('impeccable-zh') : '');
  const projectRow = `| ${cells.join(' | ')} |`;
  const existing = rows.findIndex((line) => /\]\(https:\/\/github\.com\/jnMetaCode\/impeccable-zh\)/.test(line) && line.includes('|'));
  if (existing >= 0) rows[existing] = projectRow;
  else rows.splice(anchor + 1, 0, projectRow);

  result = rows.join('\n');
  result = replaceSection(result, /教程.*创作/, (section) => {
    const lines = section.split('\n');
    const names = ['ai-coding-guide', 'ai-coding-trilogy', 'ai-shortfilm-prompts'];
    for (const name of names) {
      assert.equal(lines.filter((line) => line.includes(`](https://github.com/jnMetaCode/${name})`)).length, 1, `Expected one tutorial entry for ${name}; review manually.`);
    }
    const extra = lines.slice(1).filter((line) => {
      if (!line.trim() || names.some((name) => line.includes(`github.com/jnMetaCode/${name}`))) return false;
      if (/^[\s|:-]+$/.test(line)) return false;
      if (line.includes('|') && !line.includes('](')) {
        const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
        if (cells.every((cell) => ['项目', '内容', 'Stars', '⭐ Stars'].includes(cell))) return false;
      }
      return true;
    }).map((line) => {
      if (!line.includes('|')) return line;
      return '- ' + line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((cell) => cell.trim()).join(' — ');
    });
    return [lines[0], '', tutorialTable(), ...(extra.length ? ['', ...extra] : []), '', ''].join('\n');
  });
  for (const name of ['repo-rag', 'orchestrator-lg', 'llm-gateway']) {
    assert.ok(!result.includes(`github.com/jnMetaCode/${name}`), `Unexpected ${name} link remains; review manually.`);
  }
  if (!result.includes('<!-- AI-assisted profile update -->')) result += '\n<!-- AI-assisted profile update -->\n';
  return result;
}

function gh(args) {
  const result = spawnSync('gh', args, { encoding: 'utf8' });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr.trim());
  return result.stdout;
}

function main() {
  assert.ok(process.argv.slice(2).every((arg) => arg === '--apply'), 'Usage: node docs/update-github-profile.mjs [--apply]');
  const remote = JSON.parse(gh(['api', `repos/${repository}/readme`]));
  assert.equal(remote.encoding, 'base64');
  const source = Buffer.from(remote.content, 'base64').toString('utf8');
  const updated = updateProfile(source);
  if (updated === source) {
    console.log('Profile already matches the requested changes.');
    return;
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'jnmetacode-profile-'));
  const preview = path.join(temporary, 'README.md');
  fs.writeFileSync(preview, updated);
  console.log(`Updated README preview: ${preview}`);
  if (!process.argv.includes('--apply')) {
    console.log('Preview only. Use --apply to commit the update to GitHub.');
    return;
  }
  const payload = path.join(temporary, 'payload.json');
  try {
    fs.writeFileSync(payload, JSON.stringify({
      message: 'Docs: refine profile tables and gold Star counters (AI-assisted)',
      content: Buffer.from(updated).toString('base64'),
      sha: remote.sha,
    }));
    const response = JSON.parse(gh(['api', '--method', 'PUT', `repos/${repository}/contents/${remote.path}`, '--input', payload]));
    console.log(`Profile updated: ${response.commit.html_url}`);
  } finally {
    fs.rmSync(payload, { force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error(`Profile update failed: ${error.message}`);
    process.exitCode = 1;
  }
}
