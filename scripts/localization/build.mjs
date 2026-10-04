#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { composeLocalization, projectRoot } from './localization.mjs';

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'impeccable-zh-build-'));
const skillDir = path.join(tempRoot, 'skill');

try {
  composeLocalization(skillDir);
  const bunCommand = process.platform === 'win32' ? 'bun.exe' : 'bun';
  const bunProbe = spawnSync(bunCommand, ['--version'], { stdio: 'ignore' });
  const command = bunProbe.error ? process.execPath : bunCommand;
  const args = bunProbe.error
    ? ['scripts/build.js', '--skip-root-sync']
    : ['run', 'scripts/build.js', '--skip-root-sync'];
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: { ...process.env, IMPECCABLE_SKILL_SOURCE_DIR: skillDir },
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
