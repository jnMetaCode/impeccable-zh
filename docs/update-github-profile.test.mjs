import assert from 'node:assert/strict';
import test from 'node:test';
import { updateProfile } from './update-github-profile.mjs';

const profile = `### AI不止语

#### 主线

| 项目 | 它能帮你干嘛 | |
|---|---|---|
| [superpowers-zh](https://github.com/jnMetaCode/superpowers-zh) | 工作方法 | ⭐ 100 |
| [impeccable-zh](https://github.com/jnMetaCode/impeccable-zh) | 用户更新后的安装说明 | ⭐ 20 |

#### 🛠️ 本地 Agent 工具箱

用户新增的工具箱使用经验。

#### 📖 教程 · 创作

| 项目 | 内容 |
|---|---|
| [ai-coding-guide](https://github.com/jnMetaCode/ai-coding-guide) | 更新为 80 个技巧和 12 款工具 |
| [ai-coding-trilogy](https://github.com/jnMetaCode/ai-coding-trilogy) | 更新后的三卷书介绍 |
| [ai-shortfilm-prompts](https://github.com/jnMetaCode/ai-shortfilm-prompts) | 新增的短片方法 |

#### 课程

课程与联系方式必须保持原样。
`;

test('preserves newer descriptions, toolkit content and unrelated sections', () => {
  const result = updateProfile(profile);
  for (const text of ['更新为 80 个技巧和 12 款工具', '更新后的三卷书介绍', '新增的短片方法', '用户新增的工具箱使用经验。']) {
    assert.ok(result.includes(text));
  }
  assert.ok(!result.includes('66 个 Claude Code 技巧'));
  assert.ok(!result.includes('github.com/jnMetaCode/impeccable-zh'));
  assert.equal(updateProfile(profile.replace(/.*\[impeccable-zh\].*\n/, '')), result);
  assert.equal(result.slice(result.indexOf('#### 课程')), profile.slice(profile.indexOf('#### 课程')) + '\n<!-- AI-assisted profile update -->\n');
  assert.ok(result.includes('| 项目 | 内容 | Stars |'));
  assert.equal(updateProfile(result), result);
});

test('migrates inline badges without duplication or loss of updated descriptions', () => {
  const inline = profile.replace('更新为 80 个技巧和 12 款工具', '更新为 80 个技巧和 12 款工具 [![Stars](https://img.shields.io/github/stars/jnMetaCode/ai-coding-guide?label=Stars)](https://github.com/jnMetaCode/ai-coding-guide/stargazers)');
  const result = updateProfile(inline);
  const section = result.split('#### 📖')[1].split('#### 课程')[0];
  assert.equal((section.match(/img.shields.io/g) ?? []).length, 3);
  assert.ok(!section.includes('label=Stars'));
  assert.ok(section.includes('更新为 80 个技巧和 12 款工具'));
});

test('rejects duplicate or missing tutorial entries before publishing', () => {
  const row = '| [ai-coding-guide](https://github.com/jnMetaCode/ai-coding-guide) | 重复 |';
  assert.throws(() => updateProfile(profile.replace('#### 课程', row + '\n#### 课程')), /Expected one tutorial entry/);
  assert.throws(() => updateProfile(profile.replace(/.*\[ai-coding-trilogy\].*\n/, '')), /Expected one tutorial entry/);
});
