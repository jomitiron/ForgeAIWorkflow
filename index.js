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

// Walks src recursively and collects all file paths.
function collectFiles(src, files = []) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const full = path.join(src, entry.name);
    entry.isDirectory() ? collectFiles(full, files) : files.push(full);
  }
  return files;
}

// Removes previously installed ForgeAI files so re-init is always clean.
function cleanForgeAI(targetDir, setupClaude, setupCopilot) {
  if (setupClaude) {
    const agentsDir = path.join(targetDir, '.claude', 'agents');
    if (fs.existsSync(agentsDir)) fs.rmSync(agentsDir, { recursive: true });

    const commandsDir = path.join(targetDir, '.claude', 'commands');
    if (fs.existsSync(commandsDir)) {
      for (const f of fs.readdirSync(commandsDir)) {
        if (f.startsWith('forge-')) fs.rmSync(path.join(commandsDir, f));
      }
    }
  }

  if (setupCopilot) {
    const agentsDir = path.join(targetDir, '.github', 'agents');
    if (fs.existsSync(agentsDir)) fs.rmSync(agentsDir, { recursive: true });

    const promptsDir = path.join(targetDir, '.github', 'prompts');
    if (fs.existsSync(promptsDir)) {
      // Remove forge/ subdir (current convention)
      const forgeDir = path.join(promptsDir, 'forge');
      if (fs.existsSync(forgeDir)) fs.rmSync(forgeDir, { recursive: true });

      // Remove old flat forge-*.prompt.md files (previous convention)
      for (const f of fs.readdirSync(promptsDir)) {
        if (f.startsWith('forge-') && f.endsWith('.prompt.md')) {
          fs.rmSync(path.join(promptsDir, f));
        }
      }

      // Remove empty legacy subdirs left by early versions
      for (const subdir of ['standalone', 'workflow']) {
        const p = path.join(promptsDir, subdir);
        if (fs.existsSync(p) && fs.readdirSync(p).length === 0) {
          fs.rmdirSync(p);
        }
      }
    }
  }
}

// Copies prompts to .claude/commands/ as flat /forge-<name> slash commands:
//   workflow/01-requirements.prompt.md  →  forge-requirements.md  →  /forge-requirements
function copyPromptsForClaude(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of collectFiles(src)) {
    const base = path.basename(file)
      .replace(/^\d+-/, '')
      .replace(/\.prompt\.md$/, '.md');
    // Rewrite "name: forge/x" → "name: forge-x" — Copilot CLI rejects slashes in name fields
    const content = fs.readFileSync(file, 'utf8')
      .replace(/^(name:\s*)forge\/(.+)$/m, '$1forge-$2');
    fs.writeFileSync(path.join(dest, `forge-${base}`), content, 'utf8');
  }
}

// Copies prompts to .github/prompts/forge/ for namespaced Copilot slash commands:
//   workflow/01-requirements.prompt.md  →  forge/requirements.prompt.md  →  /forge/requirements
// Keeping .prompt.md extension as required by Copilot.
// Using forge/ subdir instead of forge- prefix — more compatible with Copilot's command parser.
function copyPromptsForCopilot(src, dest) {
  const forgeDir = path.join(dest, 'forge');
  fs.mkdirSync(forgeDir, { recursive: true });
  for (const file of collectFiles(src)) {
    const base = path.basename(file).replace(/^\d+-/, '');
    fs.copyFileSync(file, path.join(forgeDir, base));
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

// Appends a ForgeAI block to .gitignore if the project is a git repo.
// Skips silently if no .git directory or block already exists.
function updateGitignore(targetDir, setupClaude, setupCopilot) {
  if (!fs.existsSync(path.join(targetDir, '.git'))) return false;

  const gitignorePath = path.join(targetDir, '.gitignore');
  const existing = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf8')
    : '';

  if (existing.includes('# ForgeAI')) return false; // already added

  const entries = [];
  if (setupClaude) {
    entries.push('CLAUDE.md');
    entries.push('.claude/agents/');
    entries.push('.claude/commands/forge-*.md');
  }
  if (setupCopilot) {
    entries.push('.github/agents/');
    entries.push('.github/prompts/forge/');
  }

  fs.appendFileSync(gitignorePath, `\n# ForgeAI\n${entries.join('\n')}\n`, 'utf8');
  return true;
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

  cleanForgeAI(targetDir, setupClaude, setupCopilot);

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
    console.log('  ✓ Slash commands → .github/prompts/forge/ (/forge/orchestrate, /forge/requirements, ...)');
  }

  if (updateGitignore(targetDir, setupClaude, setupCopilot)) {
    console.log('  ✓ ForgeAI files added to .gitignore');
  }

  console.log('\n  ForgeAI initialized.\n');
  console.log('  Agents: Jabari · Amina · Imani · Zuberi · Zuri · Kofi · Rashidi · Neema · Faraji\n');
  console.log('  Claude:  /forge-orchestrate  /forge-requirements  ...');
  console.log('  Copilot: /forge/orchestrate  /forge/requirements  ...\n');
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
  console.log('    npx forgeai-workflow init             Initialize in current directory');
  console.log('    npx forgeai-workflow init <path>      Initialize in specific directory\n');
}
