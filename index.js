#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.join(__dirname);
const AGENTS_DIR = path.join(ROOT, 'agents');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const PROMPTS_DIR = path.join(ROOT, 'prompts');

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    entry.isDirectory()
      ? copyDirRecursive(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

// Walks src recursively and collects all file paths.
function collectFiles(src, files = []) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const full = path.join(src, entry.name);
    entry.isDirectory() ? collectFiles(full, files) : files.push(full);
  }
  return files;
}

// Copies prompts to .claude/commands/ as flat /forge-<name> slash commands:
//   workflow/01-requirements.prompt.md  →  forge-requirements.md  →  /forge-requirements
//   standalone/create-prd.prompt.md     →  forge-create-prd.md    →  /forge-create-prd
function copyPromptsForClaude(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of collectFiles(src)) {
    const base = path.basename(file)
      .replace(/^\d+-/, '')             // strip "01-", "00-" etc.
      .replace(/\.prompt\.md$/, '.md'); // .prompt.md → .md
    fs.copyFileSync(file, path.join(dest, `forge-${base}`));
  }
}

// Copies prompts to .github/prompts/ as flat /forge-<name> slash commands:
//   workflow/01-requirements.prompt.md  →  forge-requirements.prompt.md  →  /forge-requirements
//   standalone/create-prd.prompt.md     →  forge-create-prd.prompt.md    →  /forge-create-prd
// Copilot requires .prompt.md extension — only the numeric prefix is stripped.
function copyPromptsForCopilot(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of collectFiles(src)) {
    const base = path.basename(file)
      .replace(/^\d+-/, '');            // strip "01-", "00-" etc. only
    fs.copyFileSync(file, path.join(dest, `forge-${base}`));
  }
}

function copyAgentsForClaude(targetDir) {
  const dest = path.join(targetDir, '.claude', 'agents');
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(AGENTS_DIR)) {
    fs.copyFileSync(path.join(AGENTS_DIR, file), path.join(dest, file));
  }
  return fs.readdirSync(AGENTS_DIR).length;
}

function copyAgentsForCopilot(targetDir) {
  const dest = path.join(targetDir, '.github', 'agents');
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(AGENTS_DIR)) {
    const destName = file.replace(/\.md$/, '.agent.md');
    fs.copyFileSync(path.join(AGENTS_DIR, file), path.join(dest, destName));
  }
  return fs.readdirSync(AGENTS_DIR).length;
}

function copyTemplate(src, dest) {
  if (fs.existsSync(dest)) {
    console.log(`  ⚠  ${path.basename(dest)} already exists — skipped`);
    return false;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

async function init(targetDir) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n  ForgeAI — AI-First Engineering Workflow\n');

  const raw = await ask(rl, '  Which AI tool? (claude / copilot / both) [both]: ');
  const tool = raw.trim().toLowerCase() || 'both';
  rl.close();

  if (!['claude', 'copilot', 'both'].includes(tool)) {
    console.error(`\n  Unknown tool "${tool}". Choose claude, copilot, or both.\n`);
    process.exit(1);
  }

  const setupClaude = tool === 'claude' || tool === 'both';
  const setupCopilot = tool === 'copilot' || tool === 'both';

  console.log('');

  if (setupClaude) {
    const count = copyAgentsForClaude(targetDir);
    console.log(`  ✓ Claude agents → .claude/agents/ (${count} agents)`);

    const claudeMd = path.join(targetDir, 'CLAUDE.md');
    const ok = copyTemplate(path.join(TEMPLATES_DIR, 'claude', 'CLAUDE.md'), claudeMd);
    if (ok) console.log('  ✓ CLAUDE.md created');

    copyPromptsForClaude(PROMPTS_DIR, path.join(targetDir, '.claude', 'commands'));
    console.log('  ✓ Slash commands → .claude/commands/ (/forge-orchestrate, /forge-requirements, ...)');
  }

  if (setupCopilot) {
    const count = copyAgentsForCopilot(targetDir);
    console.log(`  ✓ Copilot agents → .github/agents/ (${count} agents)`);

    const copilotInst = path.join(targetDir, '.github', 'copilot-instructions.md');
    const ok = copyTemplate(
      path.join(TEMPLATES_DIR, 'copilot', 'copilot-instructions.md'),
      copilotInst
    );
    if (ok) console.log('  ✓ .github/copilot-instructions.md created');

    copyPromptsForCopilot(PROMPTS_DIR, path.join(targetDir, '.github', 'prompts'));
    console.log('  ✓ Slash commands → .github/prompts/ (/forge-orchestrate, /forge-requirements, ...)');
  }

  console.log('\n  ForgeAI initialized.\n');
  console.log('  Agents available:');
  console.log('    orchestrator  · analyst    · architect');
  console.log('    engineer      · test-engineer · designer · devops-azure\n');
  console.log('  Workflow:  start with /forge-orchestrate  (or /forge-requirements)');
  console.log('  Standalone: invoke any agent directly for a specific task\n');
}

const [,, command, targetDir = process.cwd()] = process.argv;

if (command === 'init') {
  init(targetDir).catch(err => {
    console.error('  Error:', err.message);
    process.exit(1);
  });
} else {
  console.log('\n  ForgeAI — AI-First Engineering Workflow');
  console.log('\n  Usage:');
  console.log('    npx forgeai init             Initialize in current directory');
  console.log('    npx forgeai init <path>      Initialize in specific directory\n');
}
