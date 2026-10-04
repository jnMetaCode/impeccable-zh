#!/usr/bin/env node

import { validateLocalization } from './localization.mjs';

const result = validateLocalization();
const releaseMode = process.argv.includes('--release');
if (result.coverage.mapped < result.policy.baselineMinimumMappedFiles) {
  result.errors.push(
    `coverage regression: ${result.coverage.mapped} mapped files is below baseline ` +
    `${result.policy.baselineMinimumMappedFiles}`,
  );
}
if (releaseMode && result.coverage.percent < result.policy.releaseMinimumPercent) {
  result.errors.push(
    `release coverage ${result.coverage.percent}% is below required ${result.policy.releaseMinimumPercent}%`,
  );
}
if (result.errors.length > 0) {
  for (const error of result.errors) console.error(`ERROR ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Localization is current at ${result.lock.commit.slice(0, 12)}.`);
  console.log(`Mapped ${result.rows.length} source files for ${result.map.locale}.`);
  console.log(`Validated ${result.extensions.entries.length} China extension source files.`);
  console.log(
    `Coverage: ${result.coverage.mapped}/${result.coverage.total} ` +
    `(${result.coverage.percent}%). Untranslated: ${result.coverage.untranslated.length}.`,
  );
}
