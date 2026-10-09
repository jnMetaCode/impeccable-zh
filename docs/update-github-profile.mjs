#!/usr/bin/env node
// AI-assisted profile update. Reads the current remote README and preserves unrelated sections.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repository = 'jnMetaCode/jnMetaCode';
const badge = (name) => `[![Stars](https://img.shields.io/github/stars/jnMetaCode/${name}?style=flat&label=Stars)](https://github.com/jnMetaCode/${name}/stargazers)`;

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
  return source.slice(0, heading.index) + replacement + source.slice(next?.index ?? source.length);
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

  for (const name of ['ai-coding-guide', 'ai-coding-trilogy', 'ai-shortfilm-prompts']) {
    const indexes = rows.flatMap((line, index) => line.includes(`](https://github.com/jnMetaCode/${name})`) ? [index] : []);
    assert.equal(indexes.length, 1, `Expected one tutorial entry for ${name}; review manually.`);
    const index = indexes[0];
    if (!rows[index].includes(`img.shields.io/github/stars/jnMetaCode/${name}`)) {
      rows[index] = /\|\s*$/.test(rows[index])
        ? rows[index].replace(/\|\s*$/, ` ${badge(name)} |`)
        : `${rows[index]} ${badge(name)}`;
    }
  }
  result = rows.join('\n');
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
      message: 'Docs: focus profile projects and add Star badges (AI-assisted)',
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
