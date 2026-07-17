#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cmd = process.argv[2];
const cwd = process.cwd();

const GIT_SPEC = "retronoodle/lightspec#semver:*";

const commands = { init, update, upgrade, list };

if (!cmd || !commands[cmd]) {
  console.log('Usage: lightspec <command>\n\nCommands:\n  init     Install LightSpec skills into the current project\n  update   Sync skill files from source into .claude/skills/\n  upgrade  Reinstall the global CLI from the latest GitHub release tag\n  list     List in-flight changes with task ratio and phase');
  process.exit(cmd ? 1 : 0);
}

commands[cmd]();

function init() {
  const skillsSource = path.join(__dirname, '..', 'skills');
  const skillsDest = path.join(cwd, '.claude', 'skills');
  const changesDest = path.join(cwd, 'lightspec', 'changes');
  const archiveDest = path.join(cwd, 'lightspec', 'archive');

  console.log('Installing LightSpec...\n');

  // Copy skill files
  for (const skill of fs.readdirSync(skillsSource)) {
    const src = path.join(skillsSource, skill, 'SKILL.md');
    const dest = path.join(skillsDest, skill);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(src, path.join(dest, 'SKILL.md'));
    console.log(`  ✓ .claude/skills/${skill}/`);
  }

  // Create lightspec directory structure
  fs.mkdirSync(changesDest, { recursive: true });
  fs.mkdirSync(archiveDest, { recursive: true });
  console.log('  ✓ lightspec/changes/');
  console.log('  ✓ lightspec/archive/');

  // Stamp the installed version
  const version = stampVersion(cwd);
  console.log(`  ✓ lightspec/.version (${version})`);

  // Wire up CLAUDE.md
  writeClaudeMd(cwd);

  console.log('\nDone. Start with /ls:propose <change-name> in Claude Code.');
}

function update() {
  const skillsSource = path.join(__dirname, '..', 'skills');
  const skillsDest = path.join(cwd, '.claude', 'skills');

  console.log('Updating LightSpec skills...\n');

  const previous = readVersion(cwd);

  for (const skill of fs.readdirSync(skillsSource)) {
    const src = path.join(skillsSource, skill, 'SKILL.md');
    const dest = path.join(skillsDest, skill);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(src, path.join(dest, 'SKILL.md'));
    console.log(`  ✓ .claude/skills/${skill}/`);
  }

  const version = stampVersion(cwd);
  if (previous && previous !== version) {
    console.log(`  ✓ lightspec/.version (${previous} → ${version})`);
  } else {
    console.log(`  ✓ lightspec/.version (${version})`);
  }

  console.log('\nDone.');
}

function upgrade() {
  const version = require('../package.json').version;

  // A linked dev checkout must not be clobbered by a global reinstall.
  if (isLinkedCheckout()) {
    console.log(`This lightspec is a dev checkout (v${version}, linked via npm link).`);
    console.log('To upgrade, pull the latest source instead:\n');
    console.log('  git -C ' + path.join(__dirname, '..') + ' pull');
    return;
  }

  console.log(`Upgrading LightSpec (installed v${version})...\n`);
  execSync(`npm install -g '${GIT_SPEC}'`, { stdio: 'inherit' });

  const after = installedGlobalVersion() || 'unknown';
  console.log(`\nDone. lightspec is now v${after}.`);
}

// True when the global `lightspec` bin resolves to a symlink (an `npm link`ed
// dev checkout). Falls back to a `.git` check if the global entry can't be
// resolved, so a git checkout is never clobbered.
function isLinkedCheckout() {
  try {
    const root = execSync('npm root -g').toString().trim();
    if (fs.lstatSync(path.join(root, 'lightspec')).isSymbolicLink()) return true;
  } catch {
    // npm not resolvable — fall through to the .git heuristic
  }
  return fs.existsSync(path.join(__dirname, '..', '.git'));
}

function installedGlobalVersion() {
  try {
    const root = execSync('npm root -g').toString().trim();
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'lightspec', 'package.json'), 'utf8'));
    return pkg.version;
  } catch {
    return null;
  }
}

function list() {
  const changesDir = path.join(cwd, 'lightspec', 'changes');

  let names = [];
  try {
    names = fs.readdirSync(changesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch {
    // changes/ empty or missing
  }

  if (names.length === 0) {
    console.log('No active changes.');
    return;
  }

  const rows = names.map(name => {
    const specPath = path.join(changesDir, name, 'spec.md');
    let done = 0, total = 0;
    try {
      const lines = fs.readFileSync(specPath, 'utf8').split('\n');
      for (const line of lines) {
        const m = line.match(/^\s*-\s*\[( |x|X)\]/);
        if (!m) continue;
        total++;
        if (m[1] !== ' ') done++;
      }
    } catch {
      // no readable spec.md — treat as no tasks
    }
    const phase = total === 0 || done === 0 ? 'propose'
      : done < total ? 'implement'
      : 'verify';
    return { name, ratio: `${done}/${total}`, phase };
  });

  const nameW = Math.max(...rows.map(r => r.name.length));
  const ratioW = Math.max(...rows.map(r => r.ratio.length));
  for (const r of rows) {
    console.log(`${r.name.padEnd(nameW)}  ${r.ratio.padEnd(ratioW)}  ${r.phase}`);
  }
}

function stampVersion(dir) {
  const version = require('../package.json').version;
  const versionPath = path.join(dir, 'lightspec', '.version');
  fs.mkdirSync(path.dirname(versionPath), { recursive: true });
  fs.writeFileSync(versionPath, version + '\n');
  return version;
}

function readVersion(dir) {
  const versionPath = path.join(dir, 'lightspec', '.version');
  return fs.existsSync(versionPath) ? fs.readFileSync(versionPath, 'utf8').trim() : null;
}

const CLAUDE_MD_BLOCK = `
## LightSpec

This project uses LightSpec for spec-driven development.

- Propose a change: \`/ls-propose <name>\`
- Implement it: \`/ls-implement\`
- Verify before archiving: \`/ls-verify\`
- Archive when done: \`/ls-done\`

Always run \`/ls-verify\` before \`/ls-done\`.
`.trimStart();

const CLAUDE_MD_MARKER = '## LightSpec';

function writeClaudeMd(dir) {
  const claudeMdPath = path.join(dir, 'CLAUDE.md');
  const existing = fs.existsSync(claudeMdPath) ? fs.readFileSync(claudeMdPath, 'utf8') : '';

  if (existing.includes(CLAUDE_MD_MARKER)) {
    console.log('  ✓ CLAUDE.md already configured');
    return;
  }

  const separator = existing.length > 0 && !existing.endsWith('\n\n') ? '\n' : '';
  fs.writeFileSync(claudeMdPath, existing + separator + CLAUDE_MD_BLOCK);
  console.log('  ✓ CLAUDE.md updated');
}
