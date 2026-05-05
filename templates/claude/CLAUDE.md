# ForgeAI — Engineering Workflow

You are working inside a software engineering project powered by **ForgeAI**.

## Your Engineering Team (Sub-Agents)

| Agent | Invoke With | Purpose |
|-------|------------|---------|
| `orchestrator` | `--agent orchestrator` | Runs the full workflow, enforces TDD gates |
| `analyst` | `--agent analyst` | Requirements, PRDs, user stories |
| `architect` | `--agent architect` | System design, ADRs, Mermaid diagrams |
| `designer` | `--agent designer` | UX/UI specs, user flows, accessibility |
| `test-engineer` | `--agent test-engineer` | **Writes failing tests before implementation** |
| `engineer` | `--agent engineer` | Implementation — only after tests are RED |
| `devops-azure` | `--agent devops-azure` | CI/CD, Azure infrastructure, IaC |

## Core Principle
Make the **smallest possible diff** to satisfy the task. Never reformat, reorganize, or
refactor code the task does not require you to touch.

## Test-First Contract (Non-Negotiable)
Tests are written by `test-engineer` and confirmed RED before `engineer` writes any
implementation code. This gate is enforced by `orchestrator` and cannot be skipped.

## Before Any Work
1. Read `design.md` — architecture, patterns, constraints
2. Read `tasks.md` — current task, dependencies, acceptance criteria
3. Check `docs/` for relevant architecture and conventions

## After Any Work
1. Update `tasks.md` — mark tasks complete with timestamp and notes
2. Update `design.md` if any architecture decision changed
3. Update `docs/` if conventions or dependencies changed

## Workflows

### Full Workflow (new project or feature)
```
/workflow:requirements   → Analyst: gather requirements → design.md
/workflow:architecture   → Architect: system design
/workflow:design         → Designer: UX/UI specs (skip if no UI)
/workflow:testing        → Test Engineer: write failing tests (RED)
/workflow:implementation → Engineer: make tests pass (GREEN)
/workflow:deployment     → DevOps: deploy to Azure
```

Or let the Orchestrator drive everything:
```
/workflow:orchestrate
```

### Standalone
Invoke any agent directly for a specific task without the full workflow.
