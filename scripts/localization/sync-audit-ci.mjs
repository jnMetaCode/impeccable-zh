#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function formatAuditSummary(report) {
  const summary = report.summary || {};
  const translatedImpact =
    (summary.translatedChanged || 0) +
    (summary.translatedRemoved || 0) +
    (summary.translatedRenamed || 0);
  return [
    '## Upstream localization audit',
    '',
    `Base: \`${report.baseCommit}\``,
    `Target: \`${report.targetCommit || report.targetRevision}\``,
    `Relation: **${report.relation}**`,
    `Changed translation sources: **${summary.changedFiles || 0}**`,
    `Translated impact: **${translatedImpact}**`,
    `New untranslated sources: **${summary.newUntranslated || 0}**`,
    '',
  ].join('\n');
}

export function needsReview(report) {
  return report.errors.length > 0 || (report.summary?.changedFiles || 0) > 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const reportPath = process.argv.find((arg) => !arg.startsWith('--') && arg !== process.argv[0] && arg !== process.argv[1]);
  if (!reportPath) throw new Error('Usage: sync-audit-ci.mjs <report.json> [--check]');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  if (process.argv.includes('--set-output')) {
    if (!process.env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT is required with --set-output');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `required=${needsReview(report)}\n`);
  } else if (process.argv.includes('--check')) {
    if (needsReview(report)) {
      console.error('Upstream localization review required. See the uploaded report.');
      process.exitCode = 1;
    }
  } else {
    const output = formatAuditSummary(report);
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, output);
    else console.log(output);
  }
}
