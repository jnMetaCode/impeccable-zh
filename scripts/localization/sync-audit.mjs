#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function resolveCommit(root, revision) {
  return git(root, ['rev-parse', '--verify', `${revision}^{commit}`]);
}

export function parseNameStatus(output) {
  if (!output) return [];
  const fields = output.split('\0');
  if (fields.at(-1) === '') fields.pop();
  const changes = [];
  for (let index = 0; index < fields.length;) {
    const statusField = fields[index++];
    const type = statusField[0];
    if (type === 'R' || type === 'C') {
      changes.push({
        type,
        similarity: Number(statusField.slice(1)) || null,
        oldPath: fields[index++],
        path: fields[index++],
      });
    } else {
      changes.push({ type, path: fields[index++], oldPath: null, similarity: null });
    }
  }
  return changes;
}

export function classifyChanges(changes, mappedSources) {
  const mapped = new Set(mappedSources);
  const impact = {
    translatedChanged: [],
    translatedRemoved: [],
    translatedRenamed: [],
    newUntranslated: [],
    other: [],
  };
  for (const change of changes) {
    if (change.type === 'A') {
      (mapped.has(change.path) ? impact.translatedChanged : impact.newUntranslated).push(change);
    } else if (change.type === 'D') {
      (mapped.has(change.path) ? impact.translatedRemoved : impact.other).push(change);
    } else if (change.type === 'R') {
      if (mapped.has(change.oldPath)) impact.translatedRenamed.push(change);
      else if (!mapped.has(change.path)) impact.newUntranslated.push(change);
      else impact.other.push(change);
    } else if (mapped.has(change.path)) {
      impact.translatedChanged.push(change);
    } else {
      impact.other.push(change);
    }
  }
  return impact;
}

export function auditUpstreamSync(root = defaultRoot, targetRevision = 'upstream/main') {
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'upstream-lock.json'), 'utf8'));
  const sourceMap = JSON.parse(fs.readFileSync(path.join(root, 'locales/zh-CN/source-map.json'), 'utf8'));
  const errors = [];
  let baseCommit;
  let targetCommit;
  try {
    baseCommit = resolveCommit(root, lock.commit);
  } catch {
    errors.push(`Frozen upstream commit is not available locally: ${lock.commit}`);
  }
  try {
    targetCommit = resolveCommit(root, targetRevision);
  } catch {
    errors.push(`Target revision is not available locally: ${targetRevision}`);
  }
  if (errors.length > 0) {
    return { targetRevision, baseCommit: baseCommit || lock.commit, targetCommit: targetCommit || null, relation: 'unknown', changes: [], impact: null, errors };
  }

  const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', baseCommit, targetCommit], { cwd: root });
  const relation = baseCommit === targetCommit ? 'same' : ancestor.status === 0 ? 'fast-forward' : 'diverged';
  if (relation === 'diverged') errors.push('Target revision does not descend from the frozen upstream commit; manual history review required');

  let changes = [];
  try {
    const output = execFileSync(
      'git',
      [
        'diff', '--name-status', '-z', '--find-renames', `${baseCommit}..${targetCommit}`, '--',
        'skill/SKILL.src.md', 'skill/reference', 'skill/agents',
      ],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    changes = parseNameStatus(output);
  } catch (error) {
    errors.push(`Could not compare upstream trees: ${error.message}`);
  }

  const impact = classifyChanges(changes, sourceMap.entries.map((entry) => entry.source));
  return {
    targetRevision,
    baseCommit,
    targetCommit,
    relation,
    changes,
    impact,
    summary: {
      changedFiles: changes.length,
      translatedChanged: impact.translatedChanged.length,
      translatedRemoved: impact.translatedRemoved.length,
      translatedRenamed: impact.translatedRenamed.length,
      newUntranslated: impact.newUntranslated.length,
      other: impact.other.length,
    },
    errors,
  };
}

function flagValue(name) {
  const prefix = `${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function printText(report) {
  console.log('# Upstream localization sync audit');
  console.log(`Base:   ${report.baseCommit}`);
  console.log(`Target: ${report.targetCommit || report.targetRevision}`);
  console.log(`Relation: ${report.relation}`);
  if (report.summary) {
    console.log(`Changed translation sources: ${report.summary.changedFiles}`);
    console.log(`Translated impact: ${report.summary.translatedChanged + report.summary.translatedRemoved + report.summary.translatedRenamed}`);
    console.log(`New untranslated sources: ${report.summary.newUntranslated}`);
    if (report.changes.length > 0) {
      console.log('\nChanges:');
      for (const change of report.changes) {
        const rename = change.oldPath ? `${change.oldPath} -> ` : '';
        console.log(`- ${change.type}${change.similarity || ''} ${rename}${change.path}`);
      }
    }
  }
  if (report.errors.length > 0) {
    console.log('\nErrors:');
    for (const error of report.errors) console.log(`- ${error}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = flagValue('--target') || 'upstream/main';
  const report = auditUpstreamSync(defaultRoot, target);
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else printText(report);
  if (report.errors.length > 0) process.exitCode = 1;
}
