#!/usr/bin/env node

import { availableLocales, validateLocalization } from './localization.mjs';

const json = process.argv.includes('--json');
const localeIndex = process.argv.indexOf('--locale');
const locales = localeIndex >= 0 ? [process.argv[localeIndex + 1]] : availableLocales();
const results = locales.map((locale) => validateLocalization(undefined, locale));

if (json) {
  console.log(JSON.stringify(results.map((result) => ({
    locale: result.map.locale,
    upstreamCommit: result.lock.commit,
    coverage: result.coverage,
    extensions: result.extensions.entries,
    errors: result.errors,
  })), null, 2));
} else {
  for (const result of results) {
    console.log(`# Localization report: ${result.map.locale}`);
    console.log(`Upstream: ${result.lock.commit}`);
    console.log(`Coverage: ${result.coverage.mapped}/${result.coverage.total} (${result.coverage.percent}%)`);
    console.log(`Locale extensions: ${result.extensions.entries.length}`);
    console.log('\nUntranslated sources:');
    for (const source of result.coverage.untranslated) console.log(`- ${source}`);
    if (result.errors.length > 0) {
      console.log('\nErrors:');
      for (const error of result.errors) console.log(`- ${error}`);
    }
    console.log('');
  }
}

if (results.some((result) => result.errors.length > 0)) process.exitCode = 1;
