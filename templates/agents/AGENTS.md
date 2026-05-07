# AGENTS.md

> Cross-tool AI agent instructions — read by Claude Code, GitHub Copilot, Cursor, Codex, and Google Jules.
> Keep this file under 80 lines. Move detailed conventions to `docs/` and reference them here.

## Project Overview

[One or two sentences: what this project does, primary framework, target platform]

## Setup

```bash
__INSTALL_CMD__
```

## Commands

| Task       | Command              |
|------------|----------------------|
| Dev server | `__DEV_CMD__`        |
| Tests      | `__TEST_CMD__`       |
| Lint       | `__LINT_CMD__`       |
| Build      | `__BUILD_CMD__`      |

## Code Conventions

- [Add project-specific naming conventions here]
- [Add module organisation and where business logic lives]
- [Add any non-obvious patterns or gotchas]

## Security

- Never commit secrets, API keys, or credentials
- Use environment variables for all sensitive configuration
- Never disable security linting rules without documented justification

## Anti-Slop Contract (all agents)

- No comments that explain what the code obviously does
- No defensive checks not present in surrounding code patterns
- No type workarounds (`any`, unsafe casts) — resolve type errors properly
- No patterns not already used in the file being modified
- No over-engineering: simplest solution that makes tests pass

## ForgeAI Workflow

Invoke: `@orchestrator` in chat · `__ORCHESTRATE_CMD__` as a slash command

Full team and workflow: see `CLAUDE.md` (Claude Code) or `.github/copilot-instructions.md` (Copilot)
