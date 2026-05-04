#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cmd = process.argv[2];
const cwd = process.cwd();

const commands = { init, update };

if (!cmd || !commands[cmd]) {
  console.log('Usage: lightspec <command>\n\nCommands:\n  init    Install LightSpec skills into the current project\n  update  Sync skill files from source into .claude/skills/');
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

  // Wire up CLAUDE.md
  writeClaudeMd(cwd);

  console.log('\nDone. Start with /ls:propose <change-name> in Claude Code.');
}

function update() {
  const skillsSource = path.join(__dirname, '..', 'skills');
  const skillsDest = path.join(cwd, '.claude', 'skills');

  console.log('Updating LightSpec skills...\n');

  for (const skill of fs.readdirSync(skillsSource)) {
    const src = path.join(skillsSource, skill, 'SKILL.md');
    const dest = path.join(skillsDest, skill);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(src, path.join(dest, 'SKILL.md'));
    console.log(`  ✓ .claude/skills/${skill}/`);
  }

  console.log('\nDone.');
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
