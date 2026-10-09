import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { PROVIDERS } from '../scripts/lib/transformers/providers.js';

import { commandText, commands, installSteps, project, providers } from '../web/catalog.js';
import {
  commandText as traditionalCommandText,
  commands as traditionalCommands,
  installSteps as traditionalInstallSteps,
  project as traditionalProject,
  providers as traditionalProviders,
} from '../web/catalog.zh-TW.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('web catalog stays aligned with localization and command sources', () => {
  const metadata = JSON.parse(fs.readFileSync(path.join(root, 'skill/scripts/command-metadata.json'), 'utf8'));
  const sourceMap = JSON.parse(fs.readFileSync(path.join(root, 'locales/zh-CN/source-map.json'), 'utf8'));
  const rules = JSON.parse(fs.readFileSync(path.join(root, 'crates/live/assets/antipatterns.json'), 'utf8'));
  assert.equal(providers.length, 19);
  assert.equal(commands.length, 24);
  assert.equal(new Set(providers.map((provider) => provider.id)).size, providers.length);
  assert.equal(new Set(commands.map((command) => command.name)).size, commands.length);
  assert.deepEqual(commands.map((command) => command.name).sort(), Object.keys(metadata).sort());
  assert.equal(sourceMap.entries.length, project.total);
  assert.equal(sourceMap.entries.filter((entry) => entry.status === 'current').length, project.translated);
  assert.equal(new Set(rules.map((rule) => rule.id)).size, project.rules);
  assert.deepEqual(providers.map((provider) => provider.build).sort(), Object.keys(PROVIDERS).sort());
});

test('Traditional Chinese web catalog mirrors all supported capabilities', () => {
  const sourceMap = JSON.parse(fs.readFileSync(path.join(root, 'locales/zh-TW/source-map.json'), 'utf8'));
  assert.equal(traditionalProviders.length, providers.length);
  assert.equal(traditionalCommands.length, commands.length);
  assert.deepEqual(traditionalCommands.map((command) => command.name), commands.map((command) => command.name));
  assert.equal(traditionalProject.total, project.total);
  assert.equal(sourceMap.entries.length, traditionalProject.total);
  assert.equal(sourceMap.entries.filter((entry) => entry.status === 'current').length, traditionalProject.translated);
  assert.equal(traditionalProject.rules, project.rules);
  assert.match(traditionalInstallSteps('codex')[2], /localization:build:zh-TW/);
  assert.match(traditionalCommandText(traditionalCommands[0]), /^\/impeccable init/);
});

test('install planner emits auditable source-build steps for every provider', () => {
  for (const provider of providers) {
    const steps = installSteps(provider.id);
    assert.equal(steps.length, 4);
    assert.match(steps[0], /^git submodule add https:\/\/github\.com\/jnMetaCode\/impeccable-zh\.git /);
    assert.match(steps[2], /localization:build/);
    assert.match(steps[3], new RegExp(`--providers=${provider.id}$`));
  }
  assert.deepEqual(installSteps('unknown'), installSteps('claude'));
});

test('command examples use the single impeccable entrypoint', () => {
  for (const command of commands) {
    assert.match(commandText(command), new RegExp(`^/impeccable ${command.name}(?: |$)`));
    assert.ok(command.title.length >= 4);
    assert.ok(command.description.length >= 12);
  }
});

test('web page has the accessibility and responsive contracts', () => {
  const html = fs.readFileSync(path.join(root, 'web/index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'web/styles.css'), 'utf8');
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /data-provider-list/);
  assert.match(html, /data-command-search/);
  assert.match(html, /id="case"/);
  assert.match(html, /它不是客户案例/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /prefers-reduced-motion/);
});

test('Traditional Chinese page has language, navigation, and accessibility contracts', () => {
  const html = fs.readFileSync(path.join(root, 'web/zh-TW/index.html'), 'utf8');
  assert.match(html, /<html lang="zh-TW">/);
  assert.match(html, /hreflang="zh-CN"/);
  assert.match(html, /hreflang="zh-TW"/);
  assert.match(html, /href="\.\.\/" lang="zh-CN">简体<\/a>/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /繁體中文/);
  assert.match(html, /CASE-STUDY\.zh-TW\.md/);
});

test('local preview resolves locale directory URLs to their index pages', () => {
  const server = fs.readFileSync(path.join(root, 'scripts/web/serve.mjs'), 'utf8');
  assert.match(server, /pathname\.endsWith\('\/'\)/);
  assert.match(server, /index\.html/);
});
