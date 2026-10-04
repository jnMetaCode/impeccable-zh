import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { composeLocalization, gitBlobHash, projectRoot, validateLocalization } from '../scripts/localization/localization.mjs';
import { readSourceFiles } from '../scripts/lib/utils.js';
import { rewritePluginMarkdown } from '../scripts/lib/plugin-paths.js';
import { rewriteVSCodeMarkdown } from '../scripts/lib/vscode-extension.js';
import { auditUpstreamSync, classifyChanges, parseNameStatus } from '../scripts/localization/sync-audit.mjs';
import { formatAuditSummary, needsReview } from '../scripts/localization/sync-audit-ci.mjs';
import { formatIssueBody, ISSUE_TITLE } from '../scripts/localization/sync-audit-issue.mjs';
import { scoreEvaluation } from '../scripts/localization/eval-score.mjs';

test('computes Git-compatible blob hashes', () => {
  assert.equal(gitBlobHash('test\n'), '9daeafb9864cf43055ae93beb0afd6c7d144bfa4');
});

test('localized files match their frozen upstream sources', () => {
  const result = validateLocalization();
  assert.deepEqual(result.errors, []);
  assert.equal(result.map.locale, 'zh-CN');
  assert.equal(result.rows.length, 43);
  assert.equal(result.coverage.total, 43);
  assert.equal(result.coverage.mapped, 43);
  assert.equal(result.coverage.percent, 100);
  assert.equal(result.coverage.untranslated.length, 0);
  assert.equal(result.extensions.entries.length, 3);
});

test('composes a source tree without modifying upstream skill files', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'impeccable-zh-'));
  const output = path.join(tempRoot, 'skill');
  try {
    composeLocalization(output);
    const localized = fs.readFileSync(path.join(output, 'SKILL.src.md'), 'utf8');
    const upstream = fs.readFileSync(path.join(projectRoot, 'skill/SKILL.src.md'), 'utf8');
    assert.match(localized, /本 Skill 提供工具/);
    assert.doesNotMatch(upstream, /本 Skill 提供工具/);
    assert.ok(fs.existsSync(path.join(output, 'reference/harden.md')));
    assert.match(fs.readFileSync(path.join(output, 'reference/craft.md'), 'utf8'), /已弃用的别名/);
    assert.match(fs.readFileSync(path.join(output, 'reference/operate.md'), 'utf8'), /产品界面的“俗套感”测试/);
    assert.match(fs.readFileSync(path.join(output, 'reference/polish.md'), 'utf8'), /精修完整路径/);
    assert.match(fs.readFileSync(path.join(output, 'reference/onboard.md'), 'utf8'), /首次价值时间/);
    assert.match(fs.readFileSync(path.join(output, 'reference/shape.md'), 'utf8'), /探索访谈/);
    assert.match(fs.readFileSync(path.join(output, 'reference/extract.md'), 'utf8'), /识别模式/);
    assert.match(fs.readFileSync(path.join(output, 'reference/delight.md'), 'utf8'), /愉悦主张/);
    assert.match(fs.readFileSync(path.join(output, 'reference/layout.md'), 'utf8'), /空间主张/);
    assert.match(fs.readFileSync(path.join(output, 'reference/colorize.md'), 'utf8'), /对比度与感知/);
    assert.match(fs.readFileSync(path.join(output, 'reference/animate.md'), 'utf8'), /动效主张/);
    assert.match(fs.readFileSync(path.join(output, 'reference/bolder.md'), 'utf8'), /范围拥有最高权力/);
    assert.match(fs.readFileSync(path.join(output, 'reference/quieter.md'), 'utf8'), /降低视觉重量/);
    assert.match(fs.readFileSync(path.join(output, 'reference/adapt.native.md'), 'utf8'), /平台 → 平台/);
    assert.match(fs.readFileSync(path.join(output, 'reference/ios.md'), 'utf8'), /iOS 粗糙感测试/);
    assert.match(fs.readFileSync(path.join(output, 'reference/android.md'), 'utf8'), /Android 粗糙感测试/);
    assert.match(fs.readFileSync(path.join(output, 'reference/audit.native.md'), 'utf8'), /审计健康分/);
    assert.match(fs.readFileSync(path.join(output, 'reference/region-map.md'), 'utf8'), /独立变化的内容/);
    assert.match(fs.readFileSync(path.join(output, 'reference/component-review.md'), 'utf8'), /计划与资源评审/);
    assert.match(fs.readFileSync(path.join(output, 'reference/doctor.md'), 'utf8'), /事实漂移/);
    assert.match(fs.readFileSync(path.join(output, 'reference/craft-floor.md'), 'utf8'), /创作质量底线/);
    assert.match(fs.readFileSync(path.join(output, 'reference/audit.md'), 'utf8'), /实现完整性结论/);
    assert.match(fs.readFileSync(path.join(output, 'reference/distill.md'), 'utf8'), /规划简化/);
    assert.match(fs.readFileSync(path.join(output, 'reference/overdrive.md'), 'utf8'), /渐进增强不可妥协/);
    assert.match(fs.readFileSync(path.join(output, 'reference/optimize.md'), 'utf8'), /Core Web Vitals 优化/);
    assert.match(fs.readFileSync(path.join(output, 'reference/live-setup.md'), 'utf8'), /CSP 检测/);
    assert.match(fs.readFileSync(path.join(output, 'reference/generate.md'), 'utf8'), /复用页面并启动/);
    assert.match(fs.readFileSync(path.join(output, 'reference/live.md'), 'utf8'), /Accept 后必须执行的操作/);
    assert.match(fs.readFileSync(path.join(output, 'reference/hooks.md'), 'utf8'), /分诊发现/);
    assert.match(fs.readFileSync(path.join(output, 'agents/impeccable-documenter.md'), 'utf8'), /设计系统记录 Agent/);
    assert.match(fs.readFileSync(path.join(output, 'agents/impeccable-asset-producer.md'), 'utf8'), /资源生产 Agent/);
    assert.match(fs.readFileSync(path.join(output, 'agents/impeccable-manual-edit-applier.md'), 'utf8'), /条目原子性/);
    assert.match(fs.readFileSync(path.join(output, 'agents/impeccable-finish-reviewer.md'), 'utf8'), /最终评审 Agent/);
    assert.match(fs.readFileSync(path.join(output, 'reference/adapt.md'), 'utf8'), /评估适配挑战/);
    assert.match(fs.readFileSync(path.join(output, 'reference/document.md'), 'utf8'), /Frontmatter 优先/);
    assert.match(fs.readFileSync(path.join(output, 'reference/visualize.md'), 'utf8'), /唯一批准点/);
    assert.match(fs.readFileSync(path.join(output, 'reference/critique.md'), 'utf8'), /认知负荷评估/);
    assert.match(fs.readFileSync(path.join(output, 'reference/new-work.md'), 'utf8'), /视觉稿是可测量契约/);
    assert.ok(fs.existsSync(path.join(output, 'reference/chinese-typeset-cn.md')));
    assert.ok(fs.existsSync(path.join(output, 'reference/chinese-ux-copy-cn.md')));
    assert.ok(fs.existsSync(path.join(output, 'reference/china-ui-frameworks-cn.md')));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('upstream build reader accepts a composed locale source tree', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'impeccable-zh-reader-'));
  const output = path.join(tempRoot, 'skill');
  try {
    composeLocalization(output);
    const { skills } = readSourceFiles(projectRoot, output);
    assert.equal(skills.length, 1);
    assert.equal(skills[0].name, 'impeccable');
    assert.match(skills[0].body, /本 Skill 提供工具/);
    assert.ok(skills[0].references.some((reference) => reference.name === 'harden'));
    assert.ok(skills[0].references.some((reference) => reference.name === 'chinese-typeset-cn'));
    assert.ok(skills[0].references.some((reference) => reference.name === 'chinese-ux-copy-cn'));
    assert.ok(skills[0].references.some((reference) => reference.name === 'china-ui-frameworks-cn'));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('localized builder passes skip-root-sync to the build entrypoint', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'scripts/localization/build.mjs'), 'utf8');
  assert.match(source, /\['run', 'scripts\/build\.js', '--skip-root-sync'\]/);
  assert.doesNotMatch(source, /\['run', 'build', '--', '--skip-root-sync'\]/);
});

test('Claude plugin rewrite preserves the localized Setup contract', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'locales/zh-CN/skill/SKILL.src.md'), 'utf8');
  const compiled = source
    .replaceAll('{{scripts_path}}', '.claude/skills/impeccable/scripts')
    .replaceAll('{{command_hint}}', 'command')
    .replaceAll('{{command_prefix}}', '/');
  const rewritten = rewritePluginMarkdown(compiled);
  assert.match(rewritten, /CLAUDE_SKILL_DIR/);
  assert.match(rewritten, /本 Skill 及引用文件中的每条/);
  assert.doesNotMatch(rewritten, /只有运行时无法报告基目录时才使用/);
});

test('VS Code rewrite preserves the localized Setup contract', () => {
  const source = fs.readFileSync(path.join(projectRoot, 'locales/zh-CN/skill/SKILL.src.md'), 'utf8');
  const compiled = source
    .replaceAll('{{scripts_path}}', '.github/skills/impeccable/scripts')
    .replaceAll('{{command_hint}}', 'command')
    .replaceAll('{{command_prefix}}', '/');
  const rewritten = rewriteVSCodeMarkdown(compiled, { isSkillEntrypoint: true });
  assert.match(rewritten, /通过本 Skill 的\[启动器\]/);
  assert.match(rewritten, /<skill-base-dir>/);
  assert.doesNotMatch(rewritten, /只有运行时无法报告基目录时才使用/);
});

test('Chinese behavior evaluation scenarios are frozen and routable', () => {
  const suitePath = path.join(projectRoot, 'tests/localization-evals/zh-CN/scenarios.json');
  const suite = JSON.parse(fs.readFileSync(suitePath, 'utf8'));
  const skill = fs.readFileSync(path.join(projectRoot, 'locales/zh-CN/skill/SKILL.src.md'), 'utf8');
  const commandRows = new Set(
    [...skill.matchAll(/^\| `([a-z][a-z-]*)(?: [^`]*)?` \|/gm)].map((match) => match[1]),
  );

  assert.equal(suite.schemaVersion, 1);
  assert.equal(suite.locale, 'zh-CN');
  assert.equal(suite.upstreamCommit, '0d6b47ea19b63afe15e3f93a44d5d9fbbc6fd275');
  assert.equal(suite.scenarios.length, 4);
  assert.equal(new Set(suite.scenarios.map((scenario) => scenario.id)).size, suite.scenarios.length);

  for (const scenario of suite.scenarios) {
    assert.match(scenario.id, /^zh-[a-z0-9-]+$/);
    assert.ok(commandRows.has(scenario.command), `${scenario.id}: unknown command ${scenario.command}`);
    assert.ok(scenario.prompt.length >= 20, `${scenario.id}: prompt is too short`);
    assert.ok(scenario.must.length >= 3, `${scenario.id}: needs at least three positive assertions`);
    assert.ok(scenario.mustNot.length >= 2, `${scenario.id}: needs at least two negative assertions`);
    assert.ok(scenario.requiredReferences.length >= 1, `${scenario.id}: needs an objective reference-loading gate`);
    for (const fixture of scenario.fixtures) {
      assert.ok(fs.existsSync(path.join(projectRoot, 'tests/localization-evals/zh-CN', fixture)), `${scenario.id}: missing ${fixture}`);
    }
  }
});

test('parses and classifies upstream translation changes', () => {
  const changes = parseNameStatus(
    'M\0skill/reference/init.md\0A\0skill/reference/new-command.md\0R095\0skill/reference/typeset.md\0skill/reference/typography.md\0',
  );
  assert.deepEqual(changes, [
    { type: 'M', path: 'skill/reference/init.md', oldPath: null, similarity: null },
    { type: 'A', path: 'skill/reference/new-command.md', oldPath: null, similarity: null },
    { type: 'R', similarity: 95, oldPath: 'skill/reference/typeset.md', path: 'skill/reference/typography.md' },
  ]);
  const impact = classifyChanges(changes, ['skill/reference/init.md', 'skill/reference/typeset.md']);
  assert.equal(impact.translatedChanged.length, 1);
  assert.equal(impact.translatedRenamed.length, 1);
  assert.equal(impact.newUntranslated.length, 1);
});

test('audits the locally available upstream ref without fetching', () => {
  const report = auditUpstreamSync(projectRoot);
  assert.deepEqual(report.errors, []);
  assert.equal(report.relation, 'same');
  assert.equal(report.baseCommit, '0d6b47ea19b63afe15e3f93a44d5d9fbbc6fd275');
  assert.equal(report.targetCommit, report.baseCommit);
  assert.equal(report.summary.changedFiles, 0);
  assert.match(formatAuditSummary(report), /Changed translation sources: \*\*0\*\*/);
  assert.equal(needsReview(report), false);
  assert.equal(ISSUE_TITLE, '[automation] Upstream localization review required');
});

test('formats one deduplicated review issue for changed upstream sources', () => {
  const change = { type: 'M', path: 'skill/reference/init.md', oldPath: null, similarity: null };
  const report = {
    baseCommit: 'a'.repeat(40),
    targetCommit: 'b'.repeat(40),
    targetRevision: 'upstream/main',
    relation: 'fast-forward',
    changes: [change],
    impact: { translatedChanged: [change], translatedRemoved: [], translatedRenamed: [], newUntranslated: [], other: [] },
    summary: { changedFiles: 1, translatedChanged: 1, translatedRemoved: 0, translatedRenamed: 0, newUntranslated: 0 },
    errors: [],
  };
  assert.equal(needsReview(report), true);
  const body = formatIssueBody(report);
  assert.match(body, /Translated files changed/);
  assert.match(body, /skill\/reference\/init\.md/);
  assert.match(body, /Update `upstream-lock\.json` only after human review/);
});

test('Chinese evaluation scorer refuses unscored claims and accepts evidenced results', () => {
  const suite = JSON.parse(fs.readFileSync(path.join(projectRoot, 'tests/localization-evals/zh-CN/scenarios.json'), 'utf8'));
  const makeRun = (verdict) => ({
    schemaVersion: 1,
    locale: suite.locale,
    upstreamCommit: suite.upstreamCommit,
    runId: 'unit-fixture',
    model: 'fixture-model',
    scenarios: suite.scenarios.map((scenario) => ({
      scenarioId: scenario.id,
      outcome: 'complete',
      trace: { toolCalls: scenario.requiredReferences.map((file) => ({ loadedFiles: [`.claude/skills/impeccable/reference/${file}`] })) },
      assessments: [
        ...scenario.must.map((text) => ({ kind: 'must', text, verdict, evidence: verdict === 'pass' ? ['fixture evidence'] : [] })),
        ...scenario.mustNot.map((text) => ({ kind: 'mustNot', text, verdict, evidence: verdict === 'pass' ? ['fixture evidence'] : [] })),
      ],
    })),
  });
  const incomplete = scoreEvaluation(suite, makeRun('unscored'));
  assert.equal(incomplete.passed, false);
  assert.equal(incomplete.summary.incomplete, 4);
  const passed = scoreEvaluation(suite, makeRun('pass'));
  assert.equal(passed.passed, true);
  assert.deepEqual(passed.summary, { total: 4, passed: 4, failed: 0, incomplete: 0 });
});
