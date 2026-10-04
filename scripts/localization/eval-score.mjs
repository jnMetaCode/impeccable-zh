#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function criterionKey(kind, text) {
  return `${kind}\0${text}`;
}

function loadedFiles(trace) {
  return new Set((trace?.toolCalls || []).flatMap((call) => call.loadedFiles || []));
}

export function scoreEvaluation(suite, run) {
  const errors = [];
  const rows = [];
  if (run.schemaVersion !== 1) errors.push(`unsupported result schemaVersion ${run.schemaVersion}`);
  if (run.locale !== suite.locale) errors.push(`result locale ${run.locale} does not match ${suite.locale}`);
  if (run.upstreamCommit !== suite.upstreamCommit) errors.push('result upstream commit does not match the frozen evaluation suite');
  const resultsById = new Map();
  for (const result of run.scenarios || []) {
    if (resultsById.has(result.scenarioId)) errors.push(`duplicate result for ${result.scenarioId}`);
    resultsById.set(result.scenarioId, result);
  }

  for (const scenario of suite.scenarios) {
    const result = resultsById.get(scenario.id);
    if (!result) {
      rows.push({ scenarioId: scenario.id, status: 'incomplete', objective: false, semantic: false, failures: ['missing result'] });
      continue;
    }
    const failures = [];
    if (result.outcome !== 'complete') failures.push(`model outcome is ${result.outcome || 'missing'}, expected complete`);
    const loaded = loadedFiles(result.trace);
    for (const reference of scenario.requiredReferences || []) {
      if (![...loaded].some((file) => file === reference || file.endsWith(`/${reference}`))) {
        failures.push(`required reference was not loaded: ${reference}`);
      }
    }

    const expected = new Map([
      ...scenario.must.map((text) => [criterionKey('must', text), { kind: 'must', text }]),
      ...scenario.mustNot.map((text) => [criterionKey('mustNot', text), { kind: 'mustNot', text }]),
    ]);
    const assessments = new Map();
    for (const assessment of result.assessments || []) {
      const key = criterionKey(assessment.kind, assessment.text);
      if (assessments.has(key)) failures.push(`duplicate assessment: ${assessment.kind} ${assessment.text}`);
      assessments.set(key, assessment);
      if (!expected.has(key)) failures.push(`unexpected assessment: ${assessment.kind} ${assessment.text}`);
    }
    let hasUnscored = false;
    for (const [key, criterion] of expected) {
      const assessment = assessments.get(key);
      if (!assessment) {
        hasUnscored = true;
        failures.push(`missing assessment: ${criterion.kind} ${criterion.text}`);
        continue;
      }
      if (!['pass', 'fail', 'unscored'].includes(assessment.verdict)) {
        failures.push(`invalid verdict for ${criterion.text}: ${assessment.verdict}`);
      } else if (assessment.verdict === 'unscored') {
        hasUnscored = true;
      } else {
        if (!Array.isArray(assessment.evidence) || assessment.evidence.length === 0 || assessment.evidence.some((item) => typeof item !== 'string' || !item.trim())) {
          failures.push(`assessment lacks concrete evidence: ${criterion.text}`);
        }
        if (assessment.verdict === 'fail') failures.push(`criterion failed: ${criterion.text}`);
      }
    }
    const objective = !failures.some((failure) => failure.startsWith('model outcome') || failure.startsWith('required reference'));
    const semantic = !hasUnscored && !failures.some((failure) => /assessment|criterion failed|verdict/.test(failure));
    const status = objective && semantic && failures.length === 0 ? 'passed' : hasUnscored ? 'incomplete' : 'failed';
    rows.push({ scenarioId: scenario.id, status, objective, semantic, failures });
  }

  for (const id of resultsById.keys()) {
    if (!suite.scenarios.some((scenario) => scenario.id === id)) errors.push(`result contains unknown scenario ${id}`);
  }
  const summary = {
    total: suite.scenarios.length,
    passed: rows.filter((row) => row.status === 'passed').length,
    failed: rows.filter((row) => row.status === 'failed').length,
    incomplete: rows.filter((row) => row.status === 'incomplete').length,
  };
  return { model: run.model, runId: run.runId, summary, scenarios: rows, errors, passed: errors.length === 0 && summary.passed === summary.total };
}

function flagValue(name) {
  const prefix = `${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const resultsPath = flagValue('--results');
  if (!resultsPath) throw new Error('Usage: eval-score.mjs --results=<run.json> [--json]');
  const run = JSON.parse(fs.readFileSync(path.resolve(resultsPath), 'utf8'));
  if (!['zh-CN', 'zh-TW'].includes(run.locale)) throw new Error(`Unsupported result locale: ${run.locale}`);
  const suite = JSON.parse(fs.readFileSync(path.join(projectRoot, 'tests/localization-evals', run.locale, 'scenarios.json'), 'utf8'));
  const report = scoreEvaluation(suite, run);
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`# Chinese behavior evaluation: ${report.model || 'unknown model'}`);
    console.log(`Passed: ${report.summary.passed}/${report.summary.total}; failed: ${report.summary.failed}; incomplete: ${report.summary.incomplete}`);
    for (const row of report.scenarios) {
      console.log(`- ${row.status.toUpperCase()} ${row.scenarioId}`);
      for (const failure of row.failures) console.log(`  - ${failure}`);
    }
    for (const error of report.errors) console.log(`ERROR ${error}`);
  }
  if (!report.passed) process.exitCode = 1;
}
