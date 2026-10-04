#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ISSUE_TITLE = '[automation] Upstream localization review required';

function changeLine(change) {
  const similarity = change.similarity ? `${change.similarity}% ` : '';
  const source = change.oldPath ? `${change.oldPath} → ` : '';
  return `- \`${change.type}${similarity}\` ${source}\`${change.path}\``;
}

function section(title, changes) {
  if (!changes?.length) return '';
  return [`### ${title}`, '', ...changes.map(changeLine)].join('\n');
}

export function formatIssueBody(report) {
  const impact = report.impact || {};
  const summary = report.summary || {};
  const translatedImpact =
    (summary.translatedChanged || 0) +
    (summary.translatedRemoved || 0) +
    (summary.translatedRenamed || 0);
  const overview = [
    'The scheduled upstream audit found changes that require localization review.',
    '',
    `- Frozen base: \`${report.baseCommit}\``,
    `- Audited target: \`${report.targetCommit || report.targetRevision}\``,
    `- History relation: \`${report.relation}\``,
    `- Changed translation sources: **${summary.changedFiles || 0}**`,
    `- Existing translations affected: **${translatedImpact}**`,
    `- New untranslated sources: **${summary.newUntranslated || 0}**`,
  ].join('\n');
  const requiredReview = [
    '### Required review',
    '',
    '1. Inspect the upstream diff and changed command contracts.',
    '2. Update affected Chinese files and their source blob hashes.',
    '3. Add newly introduced translatable files to the source map or document why they remain untranslated.',
    '4. Run localization tests, sync audit, full provider build, and behavior evaluation.',
    '5. Update `upstream-lock.json` only after human review.',
    '',
    '> This issue is maintained by automation. Close it after the reviewed upstream baseline lands.',
  ].join('\n');
  return [
    overview,
    section('Translated files changed', impact.translatedChanged),
    section('Translated files renamed', impact.translatedRenamed),
    section('Translated files removed', impact.translatedRemoved),
    section('New untranslated files', impact.newUntranslated),
    section('Other translation-scope changes', impact.other),
    report.errors?.length ? ['### Audit errors', '', ...report.errors.map((error) => `- ${error}`)].join('\n') : '',
    requiredReview,
  ].filter(Boolean).join('\n\n') + '\n';
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const reportPath = process.argv[2];
  if (!reportPath) throw new Error('Usage: sync-audit-issue.mjs <report.json> [--output=<path>]');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const body = formatIssueBody(report);
  const output = process.argv.find((arg) => arg.startsWith('--output='))?.slice('--output='.length);
  if (output) fs.writeFileSync(output, body);
  else console.log(body);
}
