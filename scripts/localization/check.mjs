#!/usr/bin/env node

import { availableLocales, validateLocalization } from './localization.mjs';

const releaseMode = process.argv.includes('--release');
const localeIndex = process.argv.indexOf('--locale');
const locales = localeIndex >= 0 ? [process.argv[localeIndex + 1]] : availableLocales();

for (const locale of locales) {
  const result = validateLocalization(undefined, locale);
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
    for (const error of result.errors) console.error(`ERROR [${locale}] ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Localization ${locale} is current at ${result.lock.commit.slice(0, 12)}.`);
    console.log(`Mapped ${result.rows.length} source files; validated ${result.extensions.entries.length} locale extension files.`);
    console.log(
      `Coverage: ${result.coverage.mapped}/${result.coverage.total} ` +
      `(${result.coverage.percent}%). Untranslated: ${result.coverage.untranslated.length}.`,
    );
  }
}
