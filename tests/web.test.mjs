import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { commandText, commands, installSteps, project, providers } from '../web/catalog.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('web catalog stays aligned with localization and command sources', () => {
  const metadata = JSON.parse(fs.readFileSync(path.join(root, 'skill/scripts/command-metadata.json'), 'utf8'));
  const sourceMap = JSON.parse(fs.readFileSync(path.join(root, 'locales/zh-CN/source-map.json'), 'utf8'));
  assert.equal(providers.length, 19);
  assert.equal(commands.length, 24);
  assert.equal(new Set(providers.map((provider) => provider.id)).size, providers.length);
  assert.equal(new Set(commands.map((command) => command.name)).size, commands.length);
  assert.deepEqual(commands.map((command) => command.name).sort(), Object.keys(metadata).sort());
  assert.equal(sourceMap.entries.length, project.total);
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
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
