import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const projectRoot = path.resolve(import.meta.dirname, '../..');

export function availableLocales(root = projectRoot) {
  const localesDir = path.join(root, 'locales');
  return fs.readdirSync(localesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(localesDir, entry.name, 'source-map.json')))
    .map((entry) => entry.name)
    .sort();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function gitBlobHash(content) {
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
  const header = Buffer.from(`blob ${bytes.length}\0`);
  return crypto.createHash('sha1').update(header).update(bytes).digest('hex');
}

function tokens(content, pattern) {
  return [...content.matchAll(pattern)].map((match) => match[1]).sort();
}

function commands(content) {
  return tokens(content, /^\| `([^`]+)` \|/gm);
}

function relativeLinks(content) {
  return tokens(content, /\]\(([^)]+)\)/g)
    .filter((target) => !/^(?:https?:|mailto:|#)/.test(target))
    .map((target) => target.split('#')[0]);
}

function frontmatterKeys(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return [];
  return [...match[1].matchAll(/^([a-z][a-z0-9-]*):/gm)].map((item) => item[1]).sort();
}

function sameItems(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function translatableSources(root) {
  const files = ['skill/SKILL.src.md'];
  for (const directory of ['skill/reference', 'skill/agents']) {
    const absolute = path.join(root, directory);
    for (const file of fs.readdirSync(absolute).filter((name) => name.endsWith('.md')).sort()) {
      files.push(`${directory}/${file}`);
    }
  }
  return files.sort();
}

export function validateLocalization(root = projectRoot, locale = 'zh-CN') {
  const localeRoot = path.join(root, 'locales', locale);
  const lock = readJson(path.join(root, 'upstream-lock.json'));
  const map = readJson(path.join(localeRoot, 'source-map.json'));
  const extensionManifest = map.extensionsManifest || 'extensions-cn/manifest.json';
  const extensions = readJson(path.join(root, extensionManifest));
  const policy = readJson(path.join(localeRoot, 'coverage-policy.json'));
  const terminologyPolicyPath = path.join(localeRoot, 'terminology-policy.json');
  const terminologyPolicy = fs.existsSync(terminologyPolicyPath) ? readJson(terminologyPolicyPath) : null;
  const errors = [];
  const rows = [];
  const mappedSources = new Set();
  const extensionSources = new Set();
  const extensionOutputs = new Set();

  if (!/^[0-9a-f]{40}$/.test(lock.commit)) errors.push('upstream-lock.json: commit must be a 40-character SHA');
  if (map.locale !== locale) errors.push(`source-map.json: expected locale ${locale}, found ${map.locale}`);

  for (const entry of map.entries) {
    if (mappedSources.has(entry.source)) errors.push(`${entry.source}: duplicate source-map entry`);
    mappedSources.add(entry.source);
    const sourcePath = path.join(root, entry.source);
    const localizedPath = path.join(root, entry.localized);
    const outputPath = path.join(root, entry.output);
    for (const [label, file] of [['source', sourcePath], ['localized', localizedPath]]) {
      if (!fs.existsSync(file)) errors.push(`${entry.source}: missing ${label} file ${path.relative(root, file)}`);
    }
    if (!fs.existsSync(sourcePath) || !fs.existsSync(localizedPath)) continue;

    const source = fs.readFileSync(sourcePath);
    const localized = fs.readFileSync(localizedPath);
    const actualBlob = gitBlobHash(source);
    if (actualBlob !== entry.sourceBlob) {
      errors.push(`${entry.source}: upstream changed (${entry.sourceBlob} -> ${actualBlob}); review translation`);
    }
    if (entry.status !== 'current') errors.push(`${entry.source}: status is ${entry.status}, expected current`);

    const sourceText = source.toString('utf8');
    const localizedText = localized.toString('utf8');
    const sourceRules = tokens(sourceText, /<!--\s*rule:([^\s>]+)\s*-->/g);
    const localizedRules = tokens(localizedText, /<!--\s*rule:([^\s>]+)\s*-->/g);
    if (!sameItems(sourceRules, localizedRules)) errors.push(`${entry.localized}: rule markers differ from source`);

    const sourcePlaceholders = tokens(sourceText, /({{[^}]+}})/g);
    const localizedPlaceholders = tokens(localizedText, /({{[^}]+}})/g);
    if (!sameItems(sourcePlaceholders, localizedPlaceholders)) errors.push(`${entry.localized}: placeholders differ from source`);

    const sourceFences = (sourceText.match(/^```/gm) || []).length;
    const localizedFences = (localizedText.match(/^```/gm) || []).length;
    if (sourceFences !== localizedFences) {
      errors.push(`${entry.localized}: code fence count differs from source (${sourceFences} -> ${localizedFences})`);
    }

    const localizedLinks = new Set(relativeLinks(localizedText));
    for (const link of relativeLinks(sourceText)) {
      if (!localizedLinks.has(link)) errors.push(`${entry.localized}: missing source link ${link}`);
    }

    if (entry.source.endsWith('SKILL.src.md')) {
      const sourceCommands = commands(sourceText);
      const localizedCommands = commands(localizedText);
      if (!sameItems(sourceCommands, localizedCommands)) errors.push(`${entry.localized}: command table differs from source`);
      const sourceKeys = frontmatterKeys(sourceText);
      const localizedKeys = frontmatterKeys(localizedText);
      if (!sameItems(sourceKeys, localizedKeys)) errors.push(`${entry.localized}: frontmatter keys differ from source`);
    }

    rows.push({ source: entry.source, output: path.relative(root, outputPath), blob: actualBlob });
  }

  if (extensions.schemaVersion !== 1) errors.push(`extensions-cn/manifest.json: unsupported schemaVersion ${extensions.schemaVersion}`);
  const localizedReferences = new Set();
  for (const entry of map.entries) {
    const localizedPath = path.join(root, entry.localized);
    if (!fs.existsSync(localizedPath)) continue;
    for (const link of relativeLinks(fs.readFileSync(localizedPath, 'utf8'))) localizedReferences.add(link);
  }
  const knownCommands = new Set(
    commands(fs.readFileSync(path.join(root, 'skill/SKILL.src.md'), 'utf8'))
      .map((command) => command.split(' ')[0]),
  );

  for (const entry of extensions.entries) {
    const sourcePath = path.join(root, entry.source);
    if (!fs.existsSync(sourcePath)) errors.push(`${entry.source}: extension source is missing`);
    if (extensionSources.has(entry.source)) errors.push(`${entry.source}: duplicate extension source`);
    if (extensionOutputs.has(entry.output)) errors.push(`${entry.output}: duplicate extension output`);
    extensionSources.add(entry.source);
    extensionOutputs.add(entry.output);
    const localeExtensionRoot = `locales/${locale}/extensions/`;
    if ((!entry.source.startsWith('extensions-cn/') && !entry.source.startsWith(localeExtensionRoot)) || path.extname(entry.source) !== '.md') {
      errors.push(`${entry.source}: extension source must be a Markdown file under extensions-cn/ or ${localeExtensionRoot}`);
    }
    if (path.isAbsolute(entry.output) || entry.output.split('/').includes('..')) {
      errors.push(`${entry.source}: extension output must stay inside the composed Skill`);
    }
    if (!entry.output.startsWith('reference/') || path.extname(entry.output) !== '.md') {
      errors.push(`${entry.source}: extension output must be a Markdown file under reference/`);
    }
    if (!Array.isArray(entry.commands) || entry.commands.length === 0) {
      errors.push(`${entry.source}: extension must declare at least one command`);
    } else {
      if (new Set(entry.commands).size !== entry.commands.length) {
        errors.push(`${entry.source}: extension commands must be unique`);
      }
      for (const command of entry.commands) {
        if (!knownCommands.has(command)) errors.push(`${entry.source}: unknown command ${command}`);
      }
    }
    const basename = path.basename(entry.output);
    if (![...localizedReferences].some((target) => target === entry.output || target.endsWith(`/${basename}`) || target === basename)) {
      errors.push(`${entry.source}: extension is not referenced by localized Skill content`);
    }
  }

  if (terminologyPolicy) {
    if (terminologyPolicy.schemaVersion !== 1) errors.push(`terminology-policy.json: unsupported schemaVersion ${terminologyPolicy.schemaVersion}`);
    const localizedFiles = [
      ...map.entries.map((entry) => entry.localized),
      ...extensions.entries.map((entry) => entry.source),
    ];
    for (const file of localizedFiles) {
      if (!fs.existsSync(path.join(root, file))) continue;
      const content = fs.readFileSync(path.join(root, file), 'utf8');
      for (const term of terminologyPolicy.forbiddenTerms || []) {
        if (content.includes(term)) errors.push(`${file}: forbidden ${terminologyPolicy.variant} term ${term}`);
      }
    }
  }

  const tracked = translatableSources(root);
  const untranslated = tracked.filter((source) => !mappedSources.has(source));
  const unexpected = [...mappedSources].filter((source) => !tracked.includes(source));
  for (const source of unexpected) errors.push(`${source}: source-map entry is outside tracked translation sources`);
  const mapped = tracked.length - untranslated.length;
  const coverage = {
    total: tracked.length,
    mapped,
    percent: tracked.length === 0 ? 100 : Number(((mapped / tracked.length) * 100).toFixed(2)),
    untranslated,
    unexpected,
  };

  return { lock, map, extensions, policy, terminologyPolicy, coverage, rows, errors };
}

export function composeLocalization(outDir, root = projectRoot, locale = 'zh-CN') {
  const result = validateLocalization(root, locale);
  if (result.errors.length > 0) throw new Error(result.errors.join('\n'));

  const skillDir = path.join(root, 'skill');
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(skillDir, outDir, { recursive: true });

  for (const entry of result.map.entries) {
    const relativeOutput = path.relative('skill', entry.output);
    if (relativeOutput.startsWith('..')) throw new Error(`${entry.output}: output must stay under skill/`);
    const destination = path.join(outDir, relativeOutput);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, entry.localized), destination);
  }

  for (const entry of result.extensions.entries) {
    const destination = path.join(outDir, entry.output);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, entry.source), destination);
  }

  return result;
}
