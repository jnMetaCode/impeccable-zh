import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = resolveCli();
const sourceBundle = path.join(projectRoot, 'dist', 'universal');

assert.ok(fs.existsSync(cli), `Impeccable CLI not found at ${cli}. Build it or set IMPECCABLE_BIN.`);
assert.ok(fs.existsSync(sourceBundle), 'Localized universal bundle is missing. Run npm run localization:build first.');

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'impeccable-zh-install-e2e-'));
const home = path.join(sandbox, 'home');
const project = path.join(sandbox, 'project');
const temp = path.join(sandbox, 'tmp');
const bundle = path.join(sandbox, 'bundle');

try {
  for (const dir of [home, project, temp]) fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(project, '.git'));
  fs.writeFileSync(path.join(project, 'keep-me.txt'), 'unrelated user file\n');
  fs.cpSync(sourceBundle, bundle, { recursive: true });
  stageFakeEngines(bundle);

  const env = {
    ...process.env,
    HOME: home,
    USERPROFILE: home,
    TMPDIR: temp,
    TEMP: temp,
    IMPECCABLE_BUNDLE_PATH: bundle,
  };

  run([
    'install', '--yes', '--project', '--providers=claude,codex,cursor', '--no-hooks',
  ], env);

  const installs = [
    path.join(project, '.claude', 'skills', 'impeccable'),
    path.join(project, '.agents', 'skills', 'impeccable'),
    path.join(project, '.cursor', 'skills', 'impeccable'),
  ];
  for (const install of installs) assertLocalizedInstall(install);

  const damaged = path.join(installs[0], 'reference', 'chinese-ux-copy-cn.md');
  fs.writeFileSync(damaged, 'damaged fixture\n');
  run(['update', '--yes', '--project', '--no-hooks'], env);
  assert.match(fs.readFileSync(damaged, 'utf8'), /中文 UX 文案增强/);
  assert.equal(fs.readFileSync(path.join(project, 'keep-me.txt'), 'utf8'), 'unrelated user file\n');

  console.log('Localized install/update E2E passed for Claude Code, Codex, and Cursor.');
} finally {
  fs.rmSync(sandbox, { recursive: true, force: true });
}

function resolveCli() {
  if (process.env.IMPECCABLE_BIN) return path.resolve(process.env.IMPECCABLE_BIN);
  const name = process.platform === 'win32' ? 'impeccable.exe' : 'impeccable';
  return path.join(projectRoot, 'target', 'debug', name);
}

function run(args, env) {
  const result = spawnSync(cli, args, {
    cwd: project,
    env,
    encoding: 'utf8',
    timeout: 120_000,
  });
  assert.equal(
    result.status,
    0,
    `${path.basename(cli)} ${args.join(' ')} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
}

function assertLocalizedInstall(install) {
  const skill = fs.readFileSync(path.join(install, 'SKILL.md'), 'utf8');
  assert.match(skill, /本 Skill 提供工具/);
  assert.ok(fs.existsSync(path.join(install, 'reference', 'chinese-typeset-cn.md')));
  assert.match(
    fs.readFileSync(path.join(install, 'reference', 'chinese-ux-copy-cn.md'), 'utf8'),
    /中文 UX 文案增强/,
  );
}

function stageFakeEngines(bundleRoot) {
  assert.notEqual(process.platform, 'win32', 'The isolated E2E currently targets Unix GitHub runners.');
  const osTag = process.platform === 'darwin' ? 'darwin' : 'linux';
  const archTag = process.arch === 'arm64' ? 'arm64' : 'x64';
  for (const provider of ['.claude', '.agents', '.cursor']) {
    const bin = path.join(
      bundleRoot,
      provider,
      'skills',
      'impeccable',
      'scripts',
      'bin',
      `${osTag}-${archTag}`,
      'impeccable',
    );
    fs.mkdirSync(path.dirname(bin), { recursive: true });
    fs.writeFileSync(bin, '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  }
}
