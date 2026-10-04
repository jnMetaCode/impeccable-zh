#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { composeLocalization, projectRoot } from './localization.mjs';

function flagValue(name) {
  const prefix = `${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

const modelId = flagValue('--model') || process.env.IMPECCABLE_ZH_EVAL_MODEL;
if (!modelId) throw new Error('Set --model=<model-id> or IMPECCABLE_ZH_EVAL_MODEL. No paid model is selected by default.');

const locale = flagValue('--locale') || 'zh-CN';
if (!['zh-CN', 'zh-TW'].includes(locale)) throw new Error(`Unsupported locale: ${locale}`);
const suiteRoot = path.join(projectRoot, 'tests/localization-evals', locale);
const suite = JSON.parse(fs.readFileSync(path.join(suiteRoot, 'scenarios.json'), 'utf8'));
const selectedId = flagValue('--scenario');
const scenarios = selectedId ? suite.scenarios.filter((scenario) => scenario.id === selectedId) : suite.scenarios;
if (scenarios.length === 0) throw new Error(`Unknown scenario: ${selectedId}`);

const { detectProvider, getModel, hasKey, PROVIDERS } = await import('../../tests/skill-behavior/providers.mjs');
const provider = detectProvider(modelId);
if (!hasKey(provider)) throw new Error(`${PROVIDERS[provider].envKey} is required to run ${modelId}`);

const composedRoot = fs.mkdtempSync(path.join(os.tmpdir(), `impeccable-${locale}-eval-skill-`));
const composedSkill = path.join(composedRoot, 'skill');
composeLocalization(composedSkill, projectRoot, locale);
process.env.IMPECCABLE_SKILL_SOURCE_DIR = composedSkill;

let run;
try {
  const { prepareWorkspace, cleanupWorkspace, runTurn, ENGINE_BIN, ENGINE_MISSING_MESSAGE } = await import('../../tests/skill-behavior/harness.mjs');
  if (!ENGINE_BIN) throw new Error(ENGINE_MISSING_MESSAGE);
  run = {
    schemaVersion: 1,
    locale: suite.locale,
    upstreamCommit: suite.upstreamCommit,
    runId: `${new Date().toISOString()}-${modelId}`,
    model: modelId,
    provider,
    harness: 'tests/skill-behavior/harness.mjs',
    scenarios: [],
  };
  for (const scenario of scenarios) {
    const files = {};
    for (const fixture of scenario.fixtures) {
      const parts = fixture.split('/');
      const target = parts.slice(2).join('/');
      files[target] = fs.readFileSync(path.join(suiteRoot, fixture), 'utf8');
    }
    const workspace = prepareWorkspace({ files });
    try {
      const result = await runTurn({
        workspace,
        model: getModel(modelId),
        userPrompt: `/impeccable ${scenario.command}\n\n${scenario.prompt}`,
        maxSteps: 24,
        timeoutMs: 300_000,
        environment: `${locale} Chinese locale evaluation in a disposable synthetic workspace.`,
      });
      run.scenarios.push({
        scenarioId: scenario.id,
        outcome: result.outcome,
        finishReason: result.finishReason,
        steps: result.steps,
        usage: result.usage,
        text: result.text,
        trace: result.trace,
        assessments: [
          ...scenario.must.map((text) => ({ kind: 'must', text, verdict: 'unscored', evidence: [] })),
          ...scenario.mustNot.map((text) => ({ kind: 'mustNot', text, verdict: 'unscored', evidence: [] })),
        ],
      });
    } catch (error) {
      run.scenarios.push({ scenarioId: scenario.id, outcome: 'failed', error: String(error), trace: { toolCalls: [] }, assessments: [] });
    } finally {
      cleanupWorkspace(workspace);
    }
  }
} finally {
  fs.rmSync(composedRoot, { recursive: true, force: true });
}

const outputDir = path.resolve(flagValue('--output-dir') || path.join(projectRoot, 'evals', locale, 'runs'));
fs.mkdirSync(outputDir, { recursive: true });
const safeModel = modelId.replace(/[^a-zA-Z0-9._-]/g, '-');
const outputPath = path.join(outputDir, `${new Date().toISOString().replace(/[:.]/g, '-')}-${safeModel}.json`);
fs.writeFileSync(outputPath, JSON.stringify(run, null, 2) + '\n');
console.log(`Saved unscored Chinese evaluation run: ${outputPath}`);
console.log('Review every criterion, add concrete evidence, then run localization:eval:score.');
