#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cmd = process.argv[2];
const cwd = process.cwd();

const commands = { init };

if (!cmd || !commands[cmd]) {
  console.log('Usage: lightspec <command>\n\nCommands:\n  init    Install LightSpec skills into the current project');
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

  console.log('\nDone. Start with /ls:propose <change-name> in Claude Code.');
}
