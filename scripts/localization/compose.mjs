#!/usr/bin/env node

import path from 'node:path';
import { composeLocalization } from './localization.mjs';

const index = process.argv.indexOf('--out');
const value = index >= 0 ? process.argv[index + 1] : null;
const localeIndex = process.argv.indexOf('--locale');
const locale = localeIndex >= 0 ? process.argv[localeIndex + 1] : 'zh-CN';
if (!value) {
  console.error('Usage: node scripts/localization/compose.mjs --out <directory> [--locale zh-CN|zh-TW]');
  process.exit(1);
}

const outDir = path.resolve(value);
const result = composeLocalization(outDir, undefined, locale);
console.log(`Composed ${result.map.locale} Skill source at ${outDir}.`);
console.log(`Applied ${result.rows.length} localized source files.`);
console.log(`Applied ${result.extensions.entries.length} China extension source files.`);
