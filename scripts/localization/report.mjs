#!/usr/bin/env node

import { validateLocalization } from './localization.mjs';

const result = validateLocalization();
const json = process.argv.includes('--json');

if (json) {
  console.log(JSON.stringify({
    locale: result.map.locale,
    upstreamCommit: result.lock.commit,
    coverage: result.coverage,
    extensions: result.extensions.entries,
    errors: result.errors,
  }, null, 2));
} else {
  console.log(`# Localization report: ${result.map.locale}`);
  console.log(`Upstream: ${result.lock.commit}`);
  console.log(`Coverage: ${result.coverage.mapped}/${result.coverage.total} (${result.coverage.percent}%)`);
  console.log(`China extensions: ${result.extensions.entries.length}`);
  console.log('\nUntranslated sources:');
  for (const source of result.coverage.untranslated) console.log(`- ${source}`);
  if (result.errors.length > 0) {
    console.log('\nErrors:');
    for (const error of result.errors) console.log(`- ${error}`);
  }
}

if (result.errors.length > 0) process.exitCode = 1;
