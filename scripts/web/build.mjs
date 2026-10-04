#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { commands, project, providers } from '../../web/catalog.js';
import { commands as traditionalCommands, project as traditionalProject, providers as traditionalProviders } from '../../web/catalog.zh-TW.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const source = path.join(root, 'web');
const output = path.join(root, 'build', 'web');
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'skill/scripts/command-metadata.json'), 'utf8'));
const sourceMap = JSON.parse(fs.readFileSync(path.join(root, 'locales/zh-CN/source-map.json'), 'utf8'));
const traditionalSourceMap = JSON.parse(fs.readFileSync(path.join(root, 'locales/zh-TW/source-map.json'), 'utf8'));

const errors = [];
if (commands.length !== project.commands) errors.push(`Web command count is ${commands.length}; expected ${project.commands}.`);
if (providers.length !== project.buildTargets) errors.push(`Web provider count is ${providers.length}; expected ${project.buildTargets}.`);
if (sourceMap.entries.length !== project.total) errors.push(`Localization source map has ${sourceMap.entries.length} entries; expected ${project.total}.`);
if (traditionalCommands.length !== traditionalProject.commands) errors.push(`Traditional Chinese command count is ${traditionalCommands.length}; expected ${traditionalProject.commands}.`);
if (traditionalProviders.length !== traditionalProject.buildTargets) errors.push(`Traditional Chinese provider count is ${traditionalProviders.length}; expected ${traditionalProject.buildTargets}.`);
if (traditionalSourceMap.entries.length !== traditionalProject.total) errors.push(`Traditional Chinese source map has ${traditionalSourceMap.entries.length} entries; expected ${traditionalProject.total}.`);
for (const command of commands) {
  if (!metadata[command.name]) errors.push(`Unknown web command: ${command.name}.`);
}
for (const file of ['index.html', 'styles.css', 'app.js', 'catalog.js', 'catalog.zh-TW.js', 'zh-TW/index.html']) {
  if (!fs.existsSync(path.join(source, file))) errors.push(`Missing web source: ${file}.`);
}
if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exitCode = 1;
} else {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  fs.cpSync(source, output, { recursive: true });
  console.log(`✓ Web app built at ${path.relative(root, output)} (${providers.length} providers, ${commands.length} commands).`);
}
